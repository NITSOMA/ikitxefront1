const API_AUTHORS = 'http://127.0.0.1:8000/books/authors/';



let authorsContainer = document.querySelector('.authors-container');
let searchauthors = document.querySelector('.search-book')

function filterBooks(input, authors, authorsContainer) {
  const value = input.value.toLowerCase();

  const filteredAuthors = authors.filter(author =>
    author.first_name.toLowerCase().includes(value) ||
    author.last_name.toLowerCase().includes(value)
  );

  authorsContainer.innerHTML = '';
  createCards(filteredAuthors);
}

function createCards(authors){
    authors.forEach(element => {
        let card = document.createElement('a');
        card.classList.add('card');
        let authorname = document.createElement('h3');
        authorname.classList.add('author-name')
        authorname.innerHTML = `${element.first_name} ${element.last_name}`
        card.href = `author.html?id=${element.id}`
        let cardImageContainer = document.createElement('div');
        cardImageContainer.classList.add('card-image-container')
        let cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        
        cardImage.src = element.image;
        cardImageContainer.appendChild(cardImage)
        card.appendChild(cardImageContainer);
        card.appendChild(authorname)
        authorsContainer.appendChild(card);

   
    });

}






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

     searchauthors.addEventListener('keydown', ()=> {
        filterBooks(searchauthors, authors,authorsContainer )
    })
    

   
    
}

main1()
