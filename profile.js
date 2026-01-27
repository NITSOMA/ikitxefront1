
let personalName = document.querySelector('.personal-name')
let personalEmail = document.querySelector('.personal-email')
let personalAge= document.querySelector('.personal-age')
let personalImageContainer = document.querySelector('.personal-image')
const API_PROFILE_UPDATE = 'http://127.0.0.1:8000/books/profile/update/';
let cameraImg = document.querySelector('.camera-img')
let inputImage = document.querySelector('.input-image')
let booksRead = document.querySelector('.books-read')
let booksToRead = document.querySelector('.books-to-read')
let seeInfo = document.querySelector('.see-info-button')
let editInfo = document.querySelector('.edit-info')
let saveInfo =document.querySelector('.save-info')
let infoDetailed = document.querySelector('.info-detailed')

let closeImage = document.querySelector('.close-image-img');

let inputAge = document.querySelector('#age')
let inputEmail = document.querySelector('#email')
let inputUsername = document.querySelector('#username')

let userSpan = document.querySelector('.username-span');
let emailSpan = document.querySelector('.email-span');
let ageSpan = document.querySelector('.age-span');



closeImage.addEventListener('click', ()=> {
    infoDetailed.classList.add('hidden')
})

function personalshow(data) {
    userSpan.innerHTML = data.username;
    emailSpan.innerHTML = data.email;
    ageSpan.innerHTML = data.age


}

function redactInfo(data) {
    userSpan.classList.add('hidden');
    emailSpan.classList.add('hidden');
    ageSpan.classList.add('hidden')
    inputAge.classList.remove('hidden');
    inputAge.setAttribute('placeholder', data.age)
    inputEmail.classList.remove('hidden');
    inputEmail.setAttribute('placeholder', data.email)
    inputUsername.classList.remove('hidden')
    inputUsername.setAttribute('placeholder', data.username)
    editInfo.classList.add('hidden')
    saveInfo.classList.remove('hidden')

}




window.accesToken = null


function createCards(books, container){
    books.forEach(element => {
        let card = document.createElement('a');
        card.classList.add('card');
        card.href = `book.html?id=${element.id}`
        let cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        cardImage.src = element.image;
        // card.innerHTML = `<a href="book.html?id=${element.id}"></a>`
        card.appendChild(cardImage);
        container.appendChild(card);

   
    });


}

document.addEventListener('click', function(e) {
    // 1. Check if the clicked element (or its parent) is the button
    const targetButton = e.target.closest('.see-info-button');

    // 2. If it is the button, run your logic
    if (targetButton) {
        console.log('Button clicked!'); // This should now work
        
        // Ensure infoDetailed is defined or selected here
        // If infoDetailed is specific to this book, you might need to find it relative to the button
        // Example: const infoDetailed = targetButton.parentElement.querySelector('.info-detailed');
        
        if (infoDetailed) {
             infoDetailed.classList.toggle('hidden');
        }
    }
});


function addData(data) {
     let personalImage = document.createElement('img');
        personalImage.src =data.profile_image_url;
        personalImage.classList.add('profile-image')
        personalImageContainer.appendChild(personalImage)
        personalName.innerHTML += data.username;
        personalEmail.innerHTML = data.email
        


} 


async function updateProfileImage(data) {
    try {

        const promise = await fetch(API_PROFILE_UPDATE, {
            method: "PATCH",
            headers: {
                 "Authorization": `Bearer ${window.accessToken}`,
                
            },
            body: data,
            // credentials: "include"
        });

        if (!promise.ok) {
            console.log(window.accesToken)
            console.log('შეცვლა არ შედგა')
        }
        const response = await promise.json();
       

    } catch(error) {
        console.log(error)
    }
 
}


async function updateProfileInfo(data) {
    try {

        const promise = await fetch(API_PROFILE_UPDATE, {
            method: "PATCH",
            headers: {
                // "Content-Type": "application/json",
                 "Authorization": `Bearer ${window.accessToken}`,
                
            },
            body: data,
            // credentials: "include"
        })

        if (!promise.ok) {
            console.log(window.accesToken)
            console.log('შეცვლა არ შედგა')
            return
        }
        const response = await promise.json();
        console.log('new')
       

    } catch(error) {
        console.log(error)
    }
 
}





async function main() {
    await bootstrapAuth()
    const dataUser = await getProfile();
    if (dataUser) {
        console.log('axali', dataUser.books_read)
        addData(dataUser)
       

        if (dataUser.books_to_read.length > 0) {
    console.log(dataUser.books_to_read)
    createCards(dataUser.books_to_read, booksToRead)
}
if (dataUser.books_read.length > 0) {
     console.log(dataUser.books_read)
    createCards(dataUser.books_read, booksRead)
}

            cameraImg.addEventListener('click', ()=> {
     inputImage.click()
    

    
            })

inputImage.addEventListener('change',   ()=> {
    console.log('inside addeventlistener', dataUser)
    const file = inputImage.files[0];
    console.log(file)
    if (!file)  return;
    const formData = new FormData();
    
    formData.append('profile_image', file)
    updateProfileImage(formData)
    window.location.href = "profile.html"
  
    
})
personalshow(dataUser)

editInfo.addEventListener('click', (e)=> {
    e.preventDefault()
    
    redactInfo(dataUser)
})

saveInfo.addEventListener('click', (e)=> {
    e.preventDefault()
   const formData1 = new FormData();

    if (inputAge.value) formData1.append('age', inputAge.value);
    if (inputUsername.value) formData1.append('username', inputUsername.value);
    if (inputEmail.value) formData1.append('email', inputEmail.value);
    
    // 2. Call your update function
    updateProfileInfo(formData1);
    window.location.href = "profile.html"
})



    } else {
        window.location.href = 'authorization.html';
    }








    
}


main()



