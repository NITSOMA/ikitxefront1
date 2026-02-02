
let mediaQuery = window.matchMedia(("(max-width: 768px)"));
let headerContainer = document.querySelector('.header-container');
const API_PROFILE = 'http://127.0.0.1:8000/books/me/';
const API_REFRESH = 'http://127.0.0.1:8000/books/refresh/'
const API_LOGOUT = 'http://127.0.0.1:8000/books/logout/'



async function getHeader() {
    const response = await fetch('header.html');
    const headerText = await response.text();
    return headerText
  
}



window.accessToken = null;

async function bootstrapAuth() {
    await refreshAccessToken();

    if (window.accessToken) {
        await getProfile();
    } else {
       console.log('eror')
    }
}




async function getProfile() {
    if (!window.accessToken) return;

    try {
        const response = await fetch(API_PROFILE, {
            headers: { "Authorization": `Bearer ${window.accessToken}` },
            credentials: "include",
        });

        if (response.status === 401) {
        
            await refreshAccessToken();
            if (!window.accessToken) return 0;
            return await getProfile();  
        }

        const data = await response.json();
       
        return data 
        

    } catch (error) {
        console.log(error)
        return 0
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

    } else  {
       
        if (profileContainer.classList.contains('hidden')) {
            authorization.classList.remove('hidden');

        }
        nav1.classList.remove('hidden');
        menuIcon.classList.add('hidden');

    }
}


async function logout() {
    try {
        await fetch(API_LOGOUT, { method: "POST", credentials: "include" });
        window.accessToken = null;
        return true;
    } catch (err) {
        console.error(err);
    }
}




async function main(params) {
    const headerText = await getHeader();
    await bootstrapAuth();
    const userData = await getProfile();
    headerContainer.innerHTML = headerText
    let authorization = document.querySelector('.authorization')
    let nav1 = document.querySelector('.nav1');
    let nav2 = document.querySelector('.nav2');
    let menuIcon = document.querySelector('.menu-icon')
    let profileContainer = document.querySelector('.profile-container')
    let profile = document.querySelector('.profile')
    let userEmail = document.querySelector('.useremail')
    let profileMore = document.querySelector('.profile-more');
    let nav2Image = document.querySelector('.nav2-img')
    let logoutBtn = document.querySelector('.logout');

    resize(mediaQuery, authorization, nav1, menuIcon, profileContainer)

    mediaQuery.addEventListener('change', ()=> {
        resize(mediaQuery, authorization, nav1, menuIcon, profileContainer)
    });
    menuIcon.addEventListener('click', ()=> {
    
    if (nav1.classList.contains('hidden')){
        nav2.classList.remove('hidden');
        console.log(nav2)

    }
    
    
    nav2Image.addEventListener('click', ()=> {
        nav2.classList.add('hidden')
    })
})


profileContainer.addEventListener('click', ()=> {
    if (!profileContainer.classList.contains('hidden')) {
        profileMore.classList.toggle('hidden');

    } 

})
if (userData) {
    
    const image = document.createElement('img')
    image.src = userData.profile_image_url
    image.classList.add('profile-image-main')
    profile.appendChild(image) 
    userEmail.innerHTML = userData.email
    authorization.classList.add('hidden');
    profileContainer.classList.remove('hidden')
}



logoutBtn.addEventListener('click', ()=> {
    if (logout()) {
        profileContainer.classList.add('hidden');
        authorization.classList.remove('hidden');
        window.location.href = 'index.html'
        
}
})

    


}




main()






