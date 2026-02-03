let randomPk = Math.round(Math.random() * 9) + 1;
const API_URL = 'https://nitsoma.pythonanywhere.com/books/book/';
const API_URLS = 'https://nitsoma.pythonanywhere.com/books/books/';
let searchBook = document.querySelector('.search-book')
let bookCover = document.querySelector('.book-cover');
let bookTitle = document.querySelector('.book-title');
const checkBoxesCategory = document.querySelectorAll('input[name="category"]');
let viewMore = document.querySelector('.view-more')
let filterX = document.querySelector('.filterx');
let filter = document.querySelector('.filter-index');
let categories = document.querySelector('.categories')
let filterbut = document.querySelector('.filter-buttons');
let filterMobClose = document.querySelector('.filter-mobile-close')


const checkBoxesGenres = document.querySelectorAll('input[name="genre"]');



let checkBoxeAll = [...checkBoxesCategory, ...checkBoxesGenres]

function resizeFilter(e) {
    if (e.matches) {
        filter.classList.add('hidden')
        categories.classList.add('hidden');
        console.log(filter)
        filterMobClose.classList.remove('hidden');
        filterX.classList.remove('hidden')

    } else {
        filter.classList.remove('filter-mobile-open')
        filter.classList.remove('hidden')
        categories.classList.remove('hidden')
        filterMobClose.classList.add('hidden')
        filterX.classList.add('hidden')

    }
    
}

resizeFilter(mediaQuery)

mediaQuery.addEventListener('change', resizeFilter)
    

filterMobClose.addEventListener('click', ()=> {
    if (!filterMobClose.classList.contains('hidden')) {
        console.log('laa')
        filter.classList.remove('hidden')
        filter.classList.add('filter-mobile-open')
        filterX.classList.remove('hidden')
    }
})

filterX.addEventListener('click', ()=> {
    filter.classList.remove('filter-mobile-open')
    filter.classList.add('hidden')
})




function filterBooksByCategory( books, booksContainer) {
    checkBoxeAll.forEach(element => {
    element.addEventListener('change', () => {
    const checkedBoxesCategory = document.querySelectorAll('input[name="category"]:checked');
   
    
    const checkedBoxesGenres = document.querySelectorAll('input[name="genre"]:checked');
  
    const valuesCategory = Array.from(checkedBoxesCategory).map(cb => cb.value);
    console.log(valuesCategory)
    const valuesGenres = Array.from(checkedBoxesGenres).map(cb => cb.value);
    console.log(valuesGenres)
        
    const filteredBooks = books.filter(book =>
    valuesCategory.includes(book.category) || book.genres.some(g => valuesGenres.includes(g))

  );
  if (valuesCategory.length > 0 || valuesGenres.length > 0) {
     booksContainer.innerHTML = '';
  createCards(filteredBooks);

  } else {
    createCards(books);
  }

 
    

            })
    })

 
  

  
}





function filterBooks(input, books, booksContainer) {
  const value = input.value.toLowerCase();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(value) ||
    book.author.toLowerCase().includes(value)
  );

  booksContainer.innerHTML = '';
  createCards(filteredBooks);
}




async function getBook() {
    try {
        const promise = await fetch(`${API_URL}${randomPk}/`);
        const resp = await promise.json();
        return resp


    } catch(error) {
        console.log(error)

    }
    
}



async function getAllBooks() {
    try {
        const promise = await fetch(API_URLS);
        const resp = await promise.json();
        return resp


    } catch(error) {
        console.log(error)

    }
    
}





function addBookOFDy(book) {
    bookCover.style.backgroundImage = `url(${book.image})`
    let author = document.createElement('h2');
    author.innerText = book.author
    let title = document.createElement('h1');
    title.innerText = book.title;
    author.innerText = book.author;
    bookTitle.appendChild(author);
    bookTitle.appendChild(title)

}

const booksContainer = document.querySelector('.booksall');

function createCards(books){
    books.forEach(element => {
        let card = document.createElement('a');
        card.classList.add('card');
        
        card.href = `book.html?id=${element.id}`
        let cardImage = document.createElement('img');
        cardImage.classList.add('card-image');
        
        cardImage.src = element.image;
      
        card.appendChild(cardImage);
        booksContainer.appendChild(card);
        if (element.id > 12) {
            
            card.classList.add('hidden')
            viewMore.classList.remove('hidden')
        }

   
    });


}


async function main1() {
    const book = await getBook();
    const books = await getAllBooks();
    addBookOFDy(book)
    createCards(books)
    searchBook.addEventListener('keydown', ()=> {
        filterBooks(searchBook, books,booksContainer )
    })
    filterBooksByCategory(books,booksContainer )

   
    viewMore.addEventListener('click', ()=> {
        let cards = document.querySelectorAll('.card');
        cards.forEach(element => {
            if (element.classList.contains('hidden')) {
                element.classList.remove('hidden')
                
            }
        })
        viewMore.classList.add('hidden')
    })


    filterbut.addEventListener('click', ()=> {
        filter.classList.remove('filter-mobile-open')

    })
}

main1()