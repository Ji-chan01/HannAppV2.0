import { loadFromLocalStorage } from "../cryptoUtils.js";
import { timeConversion } from "../timeConverter.js";
import { getComments } from "./comment.js";
import { addEventListeners } from "./fetchData.js";


const input = document.getElementById('createPost');
const pic_upload = document.getElementById('pic-upload');

const localhost = "http://127.0.0.1:8000";
const url = "https://z954zfbz-5500.asse.devtunnels.ms"

const picUpload = document.getElementById('pic-upload');
const postImagesCont = document.getElementById('postImagesCont');
const error = document.querySelector('.error');
const imgContainers = document.querySelectorAll('.post-image-cont');
let FILES = [];
let timeoutId;

let page = 1;

if (picUpload && postImagesCont && error) {
    picUpload.addEventListener("change", (event) => {
        postImagesCont.classList.add('active');
        error.classList.add('active');
    
        const files = Array.from(event.target.files);
        let availableContainers = Array.from(imgContainers).filter(cont => !cont.classList.contains("active"));

        files.forEach((file, index) => {
            if (index < availableContainers.length) {
                const reader = new FileReader();
                reader.onload = () => {
                    let newIndex = FILES.length;
                    FILES.push(file);
    
                    let container = availableContainers[index]; 
                    container.classList.add('active');
                    container.dataset.postImgItem = newIndex;
                    container.querySelector('img').src = reader.result;
    
                    let deleteIcon = container.querySelector("i");
                    deleteIcon.dataset.deleteImg = newIndex;
    
                    updateImageCounter();
                };
                reader.readAsDataURL(file);
            } else {
                error.innerText = "You've reached the maximum number of images allowed.";
                error.classList.add("show");
        
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    error.classList.remove("show");
                    updateImageCounter();
                }, 7000);
            }
        });
    });
    
    postImagesCont.addEventListener("click", (event) => {
        if (event.target.matches("i[data-delete-img]")) {
            const container = event.target.closest(".post-image-cont");
            const indexToRemove = Number(container.dataset.postImgItem);
            
            if (indexToRemove >= 0 && indexToRemove < FILES.length) {
                FILES.splice(indexToRemove, 1);
                console.log(`Deleted index ${indexToRemove}. Updated FILES:`, FILES);
    
                container.querySelector("img").src = "";
                container.classList.remove("active");
    
                const deleteIcon = container.querySelector("i");
                deleteIcon.removeAttribute("data-delete-img");
    
                const remainingContainers = document.querySelectorAll(".post-image-cont");
                remainingContainers.forEach((cont, newIndex) => {
                    if (FILES[newIndex]) {
                        cont.dataset.postImgItem = newIndex;
                        cont.querySelector("i").dataset.deleteImg = newIndex;
                        cont.querySelector("img").src = URL.createObjectURL(FILES[newIndex]);
                        cont.classList.add("active");
                    } else {
                        cont.dataset.postImgItem = newIndex;
                        cont.querySelector("i").removeAttribute("data-delete-img");
                        cont.querySelector("img").src = "";
                        cont.classList.remove("active");
                    }
                });
                
                updateImageCounter();
            }
        }
    });
    
    

    function updateImageCounter() {
        let activeCount = postImagesCont.querySelectorAll('.post-image-cont.active').length;
        error.innerText = `${activeCount} / 4`;
    
        if (activeCount === 0) {
            postImagesCont.classList.remove("active");
            error.classList.remove('active');
            error.classList.remove("show");
        } else {
            error.classList.add("active");
        }
    }
}

async function post() {
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");
    
    if (input.value.length > 0 || pic_upload.files[0] !== undefined) {
        const formData = new FormData();
        formData.append('userId', user_data.userId);
        formData.append('caption_content', input.value);
        formData.append('page', page);
        
        FILES.forEach((file, index) => {
            formData.append(`image${index+1}`, file);
        })

        try {
            const res = await fetch(`${localhost}/api/create-post/`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log(data);

            if (data.success && data.post) {
                displayLatestPost(data.post);  // ✅ Append the new post dynamically
            }

            input.value = "";
            pic_upload.value = ""; 

        } catch (error) {
            console.error("Error posting data:", error);
        }
    } else {
        const warning = document.querySelector('.lower-part .warning');
        warning.classList.add('active');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            warning.classList.remove('active');
        }, 3000)
    }
}

async function displayLatestPost(post) {
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");
    const postsContainer = document.getElementById('feeds');
    const comments = await getComments(post.post_id, user_data.userId);
    console.log(comments)
    const postElement = document.createElement('div');
    postElement.classList.add('feed');
    postElement.innerHTML = `
        <div class="feed-header">
                                <div class="dp-container">
                                    <div class="profile-picture">
                                        <img src="http://127.0.0.1:8000/media/${post.profile_picture}" alt="" loading="lazy">
                                    </div>
                                </div>
                                <div class="poster-container-info">
                                    <div class="feed-header-container">
                                        <div class="poster-infos">
                                            
                                            <div class="name">
                                                <a href="#" data-profile-id="${post.id}" class=profile-link><h4>${post.full_name}</h4></a>
                                                <p class="text-muted">&bull;</p>
                                                <p class="text-muted">${timeConversion(post.postAt)}</p>
                                            </div>
                                            <div class="time">
                                                <p class="text-muted">${post.username}</p>
                                            </div>
                                        </div>
                                        <p href="#">
                                            <span class="edit" data-edit-id="{}">
                                                <span class="options"></span>
                                            </span>
                                        </p>
                                    </div>
                                    <div class="photo">
                                        <div style="padding: 0;">
                                            <p>${post.caption || ""}</p>
                                            <h1>${post.content || ""}</h1>
                                        </div>
                                        <div class="facebook-post">
                                            <div class=see-more>
                                                <i class="fa-regular fa-eye"></i>
                                                <p>See more</p>
                                            </div>
                                            <div class="image-grid">
                                                <img class="photo-post" src="${post.image ? 'http://127.0.0.1:8000/media/'+ post.image: ''}" loading="lazy" alt="">
                                                <img class="photo-post" src="${post.image2 ? 'http://127.0.0.1:8000/media/'+ post.image2: ''}" loading="lazy" alt="">
                                                <img class="photo-post" src="${post.image3 ? 'http://127.0.0.1:8000/media/' + post.image3: ''}" loading="lazy" alt="">
                                                <img class="photo-post" src="${post.image4 ? 'http://127.0.0.1:8000/media/' + post.image4: ''}" loading="lazy" alt="">
                                            </div>
                                        </div>
                                        <div class="reactions">
                                            <div>
                                                <i data-like-id="${post.post_id}" class="like fa-regular fa-heart"></i>
                                                <h1>0</h1>
                                            </div>
                                            <div>
                                                <i data-comment-id="${post.post_id}" class="comment fa-regular fa-comment-dots"></i>
                                                <h1>${comments.length || 0}</h1>
                                            </div>
                                            <div>
                                                <i data-bookmark-id="${post.post_id}" class="bookmark fa-regular fa-bookmark"></i>
                                                <h1>0</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
    `;

    postsContainer.prepend(postElement); // ✅ Add new post at the top
    const postPhotos = document.querySelectorAll(".image-grid");

                postPhotos.forEach(postPhoto => {
                    let images = Array.from(postPhoto.querySelectorAll("img"));

                    // Filter out images that do not point to actual media files
                    let validImages = images.filter(img => img.src && img.src !== window.location.href && !img.src.endsWith("/"));

                    // If only one valid image exists, remove others
                    if (validImages.length === 1) {
                        images.forEach(img => {
                            if (!validImages.includes(img)) {
                                img.remove();
                            }
                        });
                    }

                    // If there are no valid images, hide the parent `.facebook-post`
                    if (validImages.length === 0) {
                        const parentPost = postPhoto.closest(".facebook-post"); // Get the closest .facebook-post
                        if (parentPost) {
                            parentPost.style.display = "none";
                        }
                    }

                    // Get the updated count of images after removal
                    const numImages = validImages.length;

                    // Remove existing layout classes
                    const layoutClasses = ['single-image', 'two-images', 'three-images', 'four-images'];
                    postPhoto.classList.remove(...layoutClasses);

                    // Apply correct class based on the valid image count
                    if (numImages === 1) {
                        postPhoto.classList.add('single-image');
                    } else if (numImages === 2) {
                        postPhoto.classList.add('two-images');
                    } else if (numImages === 3) {
                        postPhoto.classList.add('three-images');
                    } else if (numImages >= 4) {
                        postPhoto.classList.add('four-images');
                    }
                });
                addEventListeners(postElement);
}


document.getElementById('postForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    await post();
});
