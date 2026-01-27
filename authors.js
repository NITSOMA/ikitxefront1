const API_AUTHORS = 'http://127.0.0.1:8000/books/authors/';



let authorsContainer = document.querySelector('.authors-container');


// async function getAllauthors() {
//     try {
//         const promise = await fetch(API_AUTHORS);
//         const resp = await promise.json();
//         return resp


//     } catch(error) {
//         console.log(error)

//     }
    
// }


// const booksContainer = document.querySelector('.booksall');

function createCards(authors){
    authors.forEach(element => {
        let card = document.createElement('a');
        card.classList.add('card');
        let authorname = document.createElement('h3');
        authorname.innerHTML = `${element.first_name} ${element.last_name}`
        card.href = `author.html?id=${element.id}`
        let cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        
        cardImage.src = element.image;
        // card.innerHTML = `<a href="book.html?id=${element.id}"></a>`
        card.appendChild(cardImage);
        card.appendChild(authorname)
        authorsContainer.appendChild(card);

   
    });

}


// function createCard(authors) {
//     authors.forEach(element => {
//         let card = document.createElement('a')
//         card.href = `author.html?id=${element.id}`
//         card.classList.add('card');
//         card.innerHTML = `<h3> ${element.first_name} ${element.last_name}</h3> <p>${element.country}</p>`
//         authorsContainer.appendChild(card);
        
//     });

// }



//  ეს ნაწილი უნდა შევცვალო მაგრამ მანამდე სანამ შევცვი იყოს ასე



// 



async function getAllAuthors() {
    try {
        const promise = await fetch(API_AUTHORS);
        const resp = await promise.json();
        return resp


    } catch(error) {
        console.log(error)

    }
    
}



async function main1() {
    const authors = await getAllAuthors();
   
    
    createCards(authors)
   
    
}

main1()
