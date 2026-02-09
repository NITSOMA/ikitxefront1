
let personalName = document.querySelector('.personal-name')
let personalEmail = document.querySelector('.personal-email')
let personalAge= document.querySelector('.personal-age')
let personalImageContainer = document.querySelector('.personal-image')
const API_PROFILE_UPDATE = 'https://nitsoma.pythonanywhere.com/books/profile/update/';
const API_PROFILE_DELETE = 'https://nitsoma.pythonanywhere.com/books/profile/delete/';
const BOOK_TO_READ = 'https://nitsoma.pythonanywhere.com/books/profile/books-to-read/'
const BOOK_READ = 'https://nitsoma.pythonanywhere.com/books/profile/books-read/'
let cameraImg = document.querySelector('.camera-img')
let inputImage = document.querySelector('.input-image')
let booksRead = document.querySelector('.books-read')
let booksToRead = document.querySelector('.books-to-read')
let seeInfo = document.querySelector('.see-info-button')
let editInfo = document.querySelector('.edit-info')
let saveInfo =document.querySelector('.save-info')
let infoDetailed = document.querySelector('.info-detailed')
let deleteProfile = document.querySelector('.delete-profile')

let closeImage = document.querySelector('.close-image-img');

let inputAge = document.querySelector('#age')
let inputEmail = document.querySelector('#email')
let inputUsername = document.querySelector('#username')

let userSpan = document.querySelector('.username-span');
let emailSpan = document.querySelector('.email-span');
let ageSpan = document.querySelector('.age-span');



async function deleteProfilefunc() {
    try {
        const response = await fetch(API_PROFILE_DELETE, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.accessToken}`,
            },
            
        });

        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }

       
      

        window.location.href = 'index.html'
        return result;

    } catch (error) {
        console.log('Something went wrong:', error);
        return null; 
    }
}



async function deletebook(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.accessToken}`,
            },
            // credentials: "include"
        });

        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }

       
        let result = null;
        if (response.status !== 204) {
            result = await response.json();
        }

        return result;

    } catch (error) {
        console.log('Something went wrong:', error);
        return null; 
    }
}



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
       
        let bookinfo = document.createElement('div')
        bookinfo.classList.add('read-book-info')
        bookinfo.innerHTML = `<p>${element.author}</p>
        <p>${element.title}</p><p>კითხვის დრო: ${element.reading_hours} საათი</p>`
        let button = document.createElement('button')
        button.classList.add('remove-book')
        button.innerText = 'თაროდან წაშლა'
        button.setAttribute('data-pk', element.id)
        bookinfo.appendChild(button) 
        
        
        let cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        cardImage.src = element.image;
        
        card.appendChild(cardImage);
        card.appendChild(bookinfo)
        container.appendChild(card);

   
    });


}

document.addEventListener('click', function(e) {
   
    const targetButton = e.target.closest('.see-info-button');


    if (targetButton) {
        console.log('Button clicked!'); 
        
       
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
        let username = document.createElement('h3');
        username.innerHTML = data.username
        personalName.prepend(username)
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
            
        });


        if (response.status === 401) {
            console.log("Token expired, refreshing...");
            await refreshAccessToken();
            if (window.accessToken) {
               
                response = await fetch(API_PROFILE_UPDATE, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${window.accessToken}` },
                    body: data,
                });
            } else {
                return false; 
            }
        }

        if (!promise.ok) {
            console.log(window.accesToken)
            console.log('შეცვლა არ შედგა')
            return false
        }
        const response = await promise.json();
        return true
       

    } catch(error) {
        console.log(error)
        return false
    }
 
}


async function updateProfileInfo(data) {
    try {

        const promise = await fetch(API_PROFILE_UPDATE, {
            method: "PATCH",
            headers: {
               
                 "Authorization": `Bearer ${window.accessToken}`,
                "Content-Type": "application/json"
                
            },
            body: data,
           
        })

        if (response.status === 401) {
            await refreshAccessToken();
            if (window.accessToken) {
                response = await fetch(API_PROFILE_UPDATE, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${window.accessToken}` },
                    body: data,
                });
            } else {
                return false;
            }
        }

        if (!promise.ok) {
            console.log(window.accesToken)
            console.log('შეცვლა არ შედგა')
            return false
        }
        const response = await promise.json();
        console.log('new')
        return true;
       

    } catch(error) {
        console.log(error)
        return false
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

inputImage.addEventListener('change',   async ()=> {
    console.log('inside addeventlistener', dataUser)
    const file = inputImage.files[0];
    console.log(file)
    if (!file)  return;
    const formData = new FormData();
    
    formData.append('profile_image', file)
    const success = await updateProfileImage(formData)
    if (success) {
        window.location.reload(); 
    } else {
        console.log("update failed")
    }
   
  
    
})
personalshow(dataUser)

editInfo.addEventListener('click', (e)=> {
    e.preventDefault()
    
    redactInfo(dataUser)
})

saveInfo.addEventListener('click', async (e)=> {
    e.preventDefault()
   const formData1 = new FormData();

    if (inputAge.value) formData1.append('age', inputAge.value);
    if (inputUsername.value) formData1.append('username', inputUsername.value);
    if (inputEmail.value) formData1.append('email', inputEmail.value);
    
    
    const success = await updateProfileInfo(formData1);
    if (success) {
        window.location.reload(); 
    } else {
        console.log("update failed")
    }
})


deleteProfile.addEventListener('click', ()=> {
    deleteProfilefunc()
})


let removeBook = document.querySelector('.remove-book') 
removeBook.addEventListener('click', ()=> {
    let id = removeBook.getAttribute('data-pk')
    let found = dataUser.books_read.find(obj => obj.id ==id);
    console.log(dataUser.books_read)
    console.log(found)
    
    if (found) {
        deletebook(`${BOOK_READ}${id}/`)
        window.location.href = 'profile.html'

    } else {
        found = dataUser.books_to_read.find(obj => obj.id ==id);
         if (found) {
        deletebook(`${BOOK_TO_READ}${id}/`)
         window.location.href = 'profile.html'
    }
    }
    
    

})

    } else {
        window.location.href = 'authorization.html';
    }








    
}


main()



