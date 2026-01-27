



const auth = document.querySelector('.auth');
const register = document.querySelector('.register');
const authorization = document.querySelector('.authorization2');
const registration = document.querySelector('.registration');
const greetengA = document.querySelector('.greeting-a');
const registrationHidden = document.querySelector('.registration-hidden');
const username = document.querySelector('#username');
const age = document.querySelector('#age');
const email= document.querySelector('#email');
const password = document.querySelector('#password');
const profileImage = document.querySelector('#profile_image')



function registrationChoosed() {
    if (auth.classList.contains('border-active')) {
        auth.classList.remove('border-active');


    }
    register.classList.add('border-active');
    registrationHidden.classList.remove('hidden')
    authorization.classList.add('hidden')
    registration.classList.remove('hidden');
    email.required = true;
    age.required = true


}


function authorizationChoosed() {
    if (register.classList.contains('border-active')) {
        register.classList.remove('border-active');

    }
    auth.classList.add('border-active');
    registrationHidden.classList.add('hidden')
    authorization.classList.remove('hidden');
    registration.classList.add('hidden')
    email.required = false;
    age.required = false;

}



auth.addEventListener('click', authorizationChoosed )


register.addEventListener('click',  registrationChoosed);
greetengA.addEventListener('click', (event) => {
    event.preventDefault();
    registrationChoosed()
});



//  ავტორიზცია რეგისტრაცია 
const API_URL_REGISTRATION = 'http://127.0.0.1:8000/books/register/';
const API_URL_AUTHORIZATION = 'http://127.0.0.1:8000/books/login/';
let userData = {}

async function registrationData(data) {
    try {
        const promise = await fetch(API_URL_REGISTRATION, {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/json"
        // },
        body: data
    })
    const resp = await promise.json();
    if (promise.ok) {
        console.log('თქვენ დარეგისტრირდით წარმატებით')
        //  გადავამისამაღტო ავტორიზაციაზე
        authorizationChoosed()

    } else {
        console.log('დარეგისტრირება ვერ შედგა')
        
    }

    

    } catch(error) {
        console.log('დარეგისტრირება ვერ შედგა')
    }
    
    
}



async function authorizationData(data) {
    try {

        const promise = await fetch(API_URL_AUTHORIZATION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });

        if (!promise.ok) {
            console.log('ავტორიზაცია არ შედგა')
            
        }

        const response = await promise.json();
        window.accesToken = response.access;
        console.log('ავტორიზაცია წარმატებით დასრულდა')
        window.location.href = 'authorization.html'

    } catch(error) {
        
        console.log(error)
    }
    
    
}





registration.addEventListener('click', (event)=> {

    event.preventDefault()
    const formData = new FormData();
        formData.append('username', username.value);
        formData.append('email', email.value);
        formData.append('age', age.value);
        formData.append('password', password.value);
         if (profileImage.files.length > 0) {
        formData.append('profile_image', profileImage.files[0]);
    }
    registrationData(formData)



})




authorization.addEventListener('click', (event)=> {

    event.preventDefault()
    const userData = {
        username: username.value,
        password: password.value
    }

    authorizationData(userData)



})