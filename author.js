const params = new URLSearchParams(window.location.search);
let authorName = document.querySelector('.author-name')
let authorCountry = document.querySelector('.author-country');
let authorBooks = document.querySelector('.author-books')
let authorImage = document.querySelector('.author-image')
let authorAbout = document.querySelector('.author-about')


const authorId = params.get("id");



async function getAuthor(id) {
    try {
        const promise = await fetch(`http://127.0.0.1:8000/books/author/${id}`);
        if (!promise.ok) {
            console.log(`პრობლემაა, სტატუსი: ${promise.status}`)
        }
        const data = await promise.json();
        return data;

    } catch(error) {
        console.log('error')
    }
    

}


function createCards(books){
    books.forEach(element => {
        let card = document.createElement('a');
        card.classList.add('card');
        card.href = `book.html?id=${element.id}`
        let cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        cardImage.src = element.image;
        card.appendChild(cardImage);
        authorBooks.appendChild(card);

   
    });


}



function createAuthor(author){
    authorName.innerHTML = `<h1> ${author.first_name} ${author.last_name}`;
    authorCountry.innerHTML = author.country;
    authorImage.innerHTML = `<img src=${author.image}>`
    authorAbout.innerHTML = author.about
    createCards(author.books)


}

async function main1() {
    const authors = await getAuthor(authorId);
    createAuthor(authors)
   
    
}

main1()