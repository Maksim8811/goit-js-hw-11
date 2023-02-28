const { AxiosError } = require('axios')

import Notiflix from 'notiflix'
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
const axios = require('axios').default

const form = document.querySelector("#search-form")
const input = document.querySelector("input")
const gallery = document.querySelector(".gallery")
const buttomLoad = document.querySelector(".load-more")

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1
buttomLoad.classList.remove("load-more")

form.addEventListener("submit", myFooSearchImg)
const MY_KEY = "31290162-40f32dd3366e200868c1207df"
        

        async function myFooSearchImg (ev) {
          ev.preventDefault()
          
          const searchInput = input.value
          console.log(searchInput)

          const result = await axios.get(`https://pixabay.com/api/?key=${MY_KEY}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
        .then(result => {
          
          buttomLoad.classList.remove("load-more")

          if(result.data.totalHits > 0) {
            Notiflix.Notify.success(`"Hooray! We found ${result.data.totalHits} images.`)
            
          }

          if (searchInput === '') {
            return
          }

          if (result.data.hits.length === 0) {
            gallery.innerHTML = ''
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
          } else {
            gallery.innerHTML = ''
          renderGallery(result.data.hits)
          }

          if(result.data.total > 40) {
            buttomLoad.classList.add("load-more")
          }
          lightbox.refresh()
          buttomLoad.addEventListener("click", onNextImageAdd)
        }
        )
        
        .catch(error => console.log(error.message))
        return result
}

function renderGallery(resultPromise) {
  
  const murkup = resultPromise.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
         return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320px"/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
         <p class="info-item">
           <b>Comments ${comments}</b>
         </p>
         <p class="info-item">
            <b>Downloads ${downloads}</b>
         </p>
       </div>
      </div>`
  }).join(" ")
                      
       gallery.insertAdjacentHTML("beforeend", murkup)
}

  
async function onNextImageAdd () {
  const MY_KEY = "31290162-40f32dd3366e200868c1207df"
  const searchInput = input.value
  let per_page = 40
  try {
  const result = await axios.get(`https://pixabay.com/api/?key=${MY_KEY}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page+=1}&per_page=${per_page}`)
  const totalPages = per_page * page
  console.log(`totalpage: ${totalPages}`)
  console.log(`resultDataHits: ${result.data.totalHits}`)
  if(totalPages >= result.data.totalHits) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    buttomLoad.classList.remove("load-more")
  }
  
  renderGallery(result.data.hits)
  lightbox.refresh()
  
} catch {error => console.log(error.message)
}
  

}
    
  
  
                    
                                  
                              