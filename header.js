let mediaQuery = window.matchMedia(("(max-width: 768px)"));
let headerContainer = document.querySelector('.header-container');
const API_PROFILE = 'https://nitsoma.pythonanywhere.com/books/me/';
const API_REFRESH = 'https://nitsoma.pythonanywhere.com/books/refresh/'
const API_LOGOUT = 'https://nitsoma.pythonanywhere.com/books/logout/'

async function getHeader() {
    const response = await fetch('header.html');
    const headerText = await response.text();
    return headerText;
}


window.accessToken = null;

window.refreshingPromise = null;

async function bootstrapAuth() {
  
    if (window.accessToken) return;

   
    if (window.refreshingPromise) {
        await window.refreshingPromise;
        return;
    }


    window.refreshingPromise = refreshAccessToken();
   
    await window.refreshingPromise;

    window.refreshingPromise = null;
}

async function getProfile() {
    if (!window.accessToken) return null; 

    try {
        const response = await fetch(API_PROFILE, {
            headers: { "Authorization": `Bearer ${window.accessToken}` },
            credentials: "include",
        });

        if (response.status === 401) {
            await bootstrapAuth(); 
            if (!window.accessToken) return null;
            
           
            const retryResponse = await fetch(API_PROFILE, {
                headers: { "Authorization": `Bearer ${window.accessToken}` },
                credentials: "include",
            });
            if (retryResponse.ok) return await retryResponse.json();
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
        return null;
    }
}

async function refreshAccessToken() {
    try {
        const response = await fetch(API_REFRESH, { method: "POST", credentials: "include" });
        if (!response.ok) {
            window.accessToken = null;
            return;
        }
        const data = await response.json();
        window.accessToken = data.access;
    } catch (err) {
        window.accessToken = null;
    }
}

function resize(e, authorization, nav1, menuIcon, profileContainer) {
    if(e.matches) {
        authorization.classList.add('hidden');
        nav1.classList.add('hidden');
        menuIcon.classList.remove('hidden');
    } else {
        if (profileContainer.classList.contains('hidden')) {
            authorization.classList.remove('hidden');
        }
        nav1.classList.remove('hidden');
        menuIcon.classList.add('hidden');
    }
}

async function logout() {
    try {
        await fetch(API_LOGOUT, {
            method: "POST", 
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        window.accessToken = null;
        sessionStorage.clear();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function main() {
   
    const headerText = await getHeader();
    headerContainer.innerHTML = headerText;

   
    let authorization = document.querySelector('.authorization');
    let profileContainer = document.querySelector('.profile-container');
    let profile = document.querySelector('.profile'); 
    let userName = document.querySelector('.user_name'); 
    let profileMore = document.querySelector('.profile-more'); 
    
    let nav1 = document.querySelector('.nav1');
    let nav2 = document.querySelector('.nav2');
    let menuIcon = document.querySelector('.menu-icon');
    let nav2Image = document.querySelector('.nav2-img');
    let logoutBtn = document.querySelector('.logout');

   
    await bootstrapAuth();
    const userData = await getProfile();

   
    if (userData) {
       
        
       
        if (userData.profile_image_url) {
            profile.innerHTML = ''; 
            const image = document.createElement('img');
            image.src = userData.profile_image_url;
            
            image.classList.add('profile-image-main'); 
           
            image.style.width = "40px";
            image.style.height = "40px";
            image.style.borderRadius = "50%";
            image.style.objectFit = "cover";
            profile.appendChild(image);
        }

        
        userName.innerHTML = userData.username;

      
        authorization.classList.add('hidden');      
        profileContainer.classList.remove('hidden'); 

    } else {
        
        
        
        authorization.classList.remove('hidden');
        
      
        profileContainer.classList.add('hidden');
    }

   
    profileContainer.addEventListener('click', (e) => {
       
        e.stopPropagation(); 
        
      
        profileMore.classList.toggle('hidden');
    });

  
    document.addEventListener('click', () => {
        if (!profileMore.classList.contains('hidden')) {
            profileMore.classList.add('hidden');
        }
    });

   
    logoutBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent bubbling
        const success = await logout();
        if (success) {
            window.location.href = 'index.html';
        }
    });

    resize(mediaQuery, authorization, nav1, menuIcon, profileContainer);
    mediaQuery.addEventListener('change', () => {
        resize(mediaQuery, authorization, nav1, menuIcon, profileContainer);
    });

    menuIcon.addEventListener('click', () => {
        if (nav1.classList.contains('hidden')){
            nav2.classList.remove('hidden');
        }
    });
    
    nav2Image.addEventListener('click', () => {
        nav2.classList.add('hidden');
    });
}

main();
