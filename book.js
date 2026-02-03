

const params = new URLSearchParams(window.location.search);
const commentsUrl = `https://nitsoma.pythonanywhere.com/books/comments/`
const ratingURL = `https://nitsoma.pythonanywhere.com/books/ratings/add/`
let readed = document.querySelector('.readed');
let willRead = document.querySelector('.will-read');
const BOOK_TO_READ = 'https://nitsoma.pythonanywhere.com/books/profile/books-to-read/'
const BOOK_READ = 'https://nitsoma.pythonanywhere.com/books/profile/books-read/'
let notadd = document.querySelector('.notification-add')
let notnotadd = document.querySelector('.notification-not-add')

const bookId = params.get("id");





async function getBook(id) {
    try {
        const promise = await fetch(`https://nitsoma.pythonanywhere.com/books/book/${id}`);
        if (!promise.ok) {
            console.log(`პრობლემაა, სტატუსი: ${promise.status}`)
        }
        const data = await promise.json();
        return data;

    } catch(error) {
        console.log('error')
    }
    

}







async function savebook(data, url) {
  
    try {
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                 "Authorization": `Bearer ${window.accessToken}`,
                 
                },
          
            body: data
        })
        const result = await response.json();


        if (response.status === 409) {
            console.log('Book already exists');
            
            notnotadd.innerText = "უკვე დამატებულია!";
            
            notnotadd.classList.remove('hidden');
            setTimeout(() => {
                notnotadd.classList.add('hidden');
            }, 2000);
            return; 
        }

        if (!response.ok) {
            console.error('Server Validation Errors:', result); 
            notnotadd.classList.remove('hidden')
            setTimeout(()=> {
                notnotadd.classList.add('hidden')
            }, 2000)

           
            throw new Error('Server responded with an error');
            
        }

        notadd.classList.remove('hidden')
         setTimeout(()=> {
                notadd.classList.add('hidden')
            }, 1000)

           
        return result

    } catch(error) {
        console.log('seomthing went wrong', error)
        notnotadd.classList.remove('hidden')
        setTimeout(()=> {
                notnotadd.classList.add('hidden')
            }, 2000)

            
    }
    

}



async function deletebook(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.accessToken}`,
            },
           
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







async function postComment(bookId, userId, CommentText) {
    const CommentData = {
        book_id: bookId,
        user_id: userId,
        text: CommentText,

    };
    try {
        const response = await fetch(commentsUrl, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                 "Authorization": `Bearer ${window.accessToken}`,
                 
                },
            credentials: "include",
            body: JSON.stringify(CommentData)
        })

        if (!response.ok) {
            throw new Error('Failed to post comment');
        }

        const result = await response.json();
        return result

    } catch(error) {
        console.log('seomthing went wrong', error)
    }
    

}



async function deleteCommentfunc(commentId) {
    try {
        const response = await fetch(`https://nitsoma.pythonanywhere.com/books/comments/${commentId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${window.accessToken}`,
            },
            credentials: "include"
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



let imageArea = document.querySelector('.image-area');
let author = document.querySelector('.author');
let title = document.querySelector('.title');
let description= document.querySelector('.description');



function createBook(data) {
    let image = document.createElement('img')
    image.src = data.image
    imageArea.prepend(image)
    let existingRating = document.querySelector('.existing-rating');

    if (data.average_rating == null) {
        existingRating.innerHTML += 0
    } else {
        existingRating.innerHTML += data.average_rating

    }
    let readingHour = document.querySelector('.reading-hour');
    readingHour.innerHTML += `${data.reading_hours} საათი`
    
  
    author.innerHTML = data.author;
    author.href = `author.html?id=${data.author_id}`
    title.innerHTML = data.title;
    description.innerHTML  = data.description


}







function createComment(commentsAll, userinfo) {
    commentsAll.forEach(element => {
        console.log(element)
        let comment = document.createElement('div');
        comment.classList.add('comment')
        let profileImageCom = document.createElement('div');
        profileImageCom.classList.add('profile-image');
        
        profileImageCom.innerHTML = `<img src=${element.user.profile_image_url}>`
        console.log(element.user.profile_image_url)
        let commentCont = document.createElement('div');
        commentCont.setAttribute('data-id', element.id)
        commentCont.classList.add('profile-comment');
  
        if (userinfo) {
            console.log('user', userinfo)
            if (element.user.id == userinfo.id) {
                console.log('yes')
             let deletecomment = document.createElement('div');
            deletecomment.classList.add('delete-comment');
            deletecomment.innerHTML = 'წაშლა'
            commentCont.appendChild(deletecomment)

        }

        }
        
       
        let commentownerp = document.createElement('p');
        commentownerp.classList.add('comment-owner');
        commentownerp.innerHTML = element.user.username
        let commentitself = document.createElement('p');
        commentitself.classList.add('comment-itself');
        commentitself.innerHTML = element.text
        commentCont.appendChild(commentownerp);
        commentCont.appendChild(commentitself);
        
        comment.appendChild(profileImageCom);
        comment.appendChild(commentCont)
        comments.prepend(comment)
        inputComment.value = ''
        
    });
   

  
}

const comments = document.querySelector('.comments')
const inputComment = document.querySelector('#input-comment');
const sendComment = document.querySelector('.send-comment')

window.accessToken = null


async function main() {
    await bootstrapAuth();
    let data = await getBook(bookId);
   
    const dataOfUser = await getProfile()

                if (data.comments.length > 0) {
                    console.log('user', dataOfUser)
                    createComment(data.comments, dataOfUser)


}
    if (dataOfUser) {
        console.log('datauser yeaa', dataOfUser)
       let imageofUSer =  document.querySelector('.profile-image-active')
       imageofUSer.innerHTML = `<img src=${dataOfUser.profile_image_url}>`
        console.log(imageofUSer)

       
 

            sendComment.addEventListener('click', ()=> {
                const bookId = data.id;
                    const userId = dataOfUser.id;
                const comment = inputComment.value.trim();
                location.reload();

                if (comment.length > 0) {
                
                postComment(bookId, userId, comment)
                    .then(() => {
                        
                        data = getBook(bookId);
                        
                    }).catch(err => console.error(err));
            }
            })

            


         let deletecomment = document.querySelectorAll('.delete-comment');
         
         
        
        deletecomment.forEach(element => {
            element.addEventListener('click', async (e)=> {
            console.log('lala', e.currentTarget.parentElement)
            let commentID = e.currentTarget.parentElement.getAttribute("data-id")

            try {
                e.currentTarget.parentElement.parentElement.remove()
                await deleteCommentfunc(commentID);
                
                
               
            } catch (err) {
                console.log("Failed to delete comment", err);
            }
          


        })

        })
        
       
        
    }


   
  
    
    createBook(data)

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', e => {
    let value = e.target.value;
    savebook(JSON.stringify({"book": parseInt(bookId), "score": Number(value)}), ratingURL)
    location.reload()
  })
})



    readed.addEventListener('click', ()=> {
        savebook(JSON.stringify({"book_id": bookId}), BOOK_READ)
        console.log('yeahh')
    })

    willRead.addEventListener('click', ()=> {
        savebook(JSON.stringify({"book_id": bookId}), BOOK_TO_READ);
    })


 
}


main()




