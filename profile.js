let personalName = document.querySelector('.personal-name')
let personalEmail = document.querySelector('.personal-email')
let personalAge = document.querySelector('.personal-age')
let personalImageContainer = document.querySelector('.personal-image')

const API_PROFILE_UPDATE = 'https://nitsoma.pythonanywhere.com/books/profile/update/';
const API_PROFILE_DELETE = 'https://nitsoma.pythonanywhere.com/books/profile/delete/';
const BOOK_TO_READ = 'https://nitsoma.pythonanywhere.com/books/profile/books-to-read/'
const BOOK_READ = 'https://nitsoma.pythonanywhere.com/books/profile/books-read/'

let cameraImg = document.querySelector('.camera-img')
let inputImage = document.querySelector('.input-image')
let booksRead = document.querySelector('.books-read')
let booksToRead = document.querySelector('.books-to-read')
let editInfo = document.querySelector('.edit-info')
let saveInfo = document.querySelector('.save-info')
let infoDetailed = document.querySelector('.info-detailed')
let deleteProfile = document.querySelector('.delete-profile')
let closeImage = document.querySelector('.close-image-img');

let inputAge = document.querySelector('#age')
let inputEmail = document.querySelector('#email')
let inputUsername = document.querySelector('#username')

let userSpan = document.querySelector('.username-span');
let emailSpan = document.querySelector('.email-span');
let ageSpan = document.querySelector('.age-span');

// --- HELPER FUNCTIONS ---

async function deleteProfilefunc() {
    try {
        const response = await fetch(API_PROFILE_DELETE, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${window.accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to delete profile');
        window.location.href = 'index.html';
    } catch (error) {
        console.log('Something went wrong:', error);
    }
}

async function deletebook(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${window.accessToken}` },
        });
        return response.ok; 
    } catch (error) {
        console.log('Delete error:', error);
        return false;
    }
}

function personalshow(data) {
    userSpan.innerHTML = data.username;
    emailSpan.innerHTML = data.email;
    ageSpan.innerHTML = data.age;
}

function redactInfo(data) {
    userSpan.classList.add('hidden');
    emailSpan.classList.add('hidden');
    ageSpan.classList.add('hidden');
    inputAge.classList.remove('hidden');
    inputAge.setAttribute('placeholder', data.age);
    inputEmail.classList.remove('hidden');
    inputEmail.setAttribute('placeholder', data.email);
    inputUsername.classList.remove('hidden');
    inputUsername.setAttribute('placeholder', data.username);
    editInfo.classList.add('hidden');
    saveInfo.classList.remove('hidden');
}

function addData(data) {
    personalImageContainer.innerHTML = ''; // Clear old image
    let personalImage = document.createElement('img');
    personalImage.src = data.profile_image_url;
    personalImage.classList.add('profile-image');
    personalImageContainer.appendChild(personalImage);
    
    personalName.innerHTML = ''; // Clear old name
    let username = document.createElement('h3');
    username.innerHTML = data.username;
    personalName.appendChild(username);
    personalEmail.innerHTML = data.email;
}



function createCards(books, container, isReadList) {
    books.forEach(element => {
        let card = document.createElement('div');
        card.classList.add('card');
        
        let bookinfo = document.createElement('div');
        bookinfo.classList.add('read-book-info');
        bookinfo.innerHTML = `<p>${element.author}</p><p>${element.title}</p><p>კითხვის დრო: ${element.reading_hours} საათი</p>`;
        
        let button = document.createElement('button');
        button.classList.add('remove-book');
        button.innerText = 'თაროდან წაშლა';
        
        // Fix: Attach listener to EACH button during creation
        button.addEventListener('click', async () => {
            const url = isReadList ? `${BOOK_READ}${element.id}/` : `${BOOK_TO_READ}${element.id}/`;
            const success = await deletebook(url);
            if (success) window.location.reload();
        });

        bookinfo.appendChild(button);
        let cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        cardImage.src = element.image;
        
        card.appendChild(cardImage);
        card.appendChild(bookinfo);
        container.appendChild(card);
    });
}

async function updateProfileImage(formData) {
    try {
        const response = await fetch(API_PROFILE_UPDATE, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${window.accessToken}` },
            body: formData, // No Content-Type header!
        });

        if (response.status === 401) {
            await bootstrapAuth();
            return await updateProfileImage(formData);
        }
        return response.ok;
    } catch(error) {
        console.log(error);
        return false;
    }
}

async function updateProfileInfo(data) {
    try {
        const response = await fetch(API_PROFILE_UPDATE, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${window.accessToken}` },
            body: data,
        });

        if (response.status === 401) {
            await bootstrapAuth();
            return await updateProfileInfo(data);
        }
        return response.ok;
    } catch(error) {
        console.log(error);
        return false;
    }
}

async function main() {
    await bootstrapAuth();
    const dataUser = await getProfile();
    
    if (dataUser) {
        addData(dataUser);
        personalshow(dataUser);

        if (dataUser.books_to_read.length > 0) {
            createCards(dataUser.books_to_read, booksToRead, false);
        }
        if (dataUser.books_read.length > 0) {
            createCards(dataUser.books_read, booksRead, true);
        }

        cameraImg.addEventListener('click', () => inputImage.click());

        inputImage.addEventListener('change', async () => {
            const file = inputImage.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('profile_image', file);
            const success = await updateProfileImage(formData);
            if (success) window.location.reload();
        });

        editInfo.addEventListener('click', (e) => {
            e.preventDefault();
            redactInfo(dataUser);
        });

        saveInfo.addEventListener('click', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            if (inputAge.value) formData.append('age', inputAge.value);
            if (inputUsername.value) formData.append('username', inputUsername.value);
            if (inputEmail.value) formData.append('email', inputEmail.value);

            const success = await updateProfileInfo(formData);
            if (success) window.location.reload();
        });

        deleteProfile.addEventListener('click', deleteProfilefunc);
        
        closeImage.addEventListener('click', () => infoDetailed.classList.add('hidden'));

        document.addEventListener('click', (e) => {
            if (e.target.closest('.see-info-button')) {
                infoDetailed.classList.toggle('hidden');
            }
        });

    } else {
        window.location.href = 'authorization.html';
    }
}

main();



