import { loadFromLocalStorage } from "../cryptoUtils.js";
import { getComments } from "./comment.js";
import { timeConversion } from "../timeConverter.js";

let page = 1;
let allPostsFetched = false;
const feedContainer = document.getElementById("feeds");
let isLoading = false;

const localhost = "http://127.0.0.1:8000";
const url = "https://z954zfbz-5500.asse.devtunnels.ms"


// HOMEPAGE POSTS
async function fetchPosts() {
    if (isLoading || allPostsFetched) return;
    isLoading = true;
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");
    try {
        const response = await fetch(`${localhost}/api/fetch-post/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user_data.userId, page: page })
        });

        if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);

        const jsonData = await response.json();
        
        if (jsonData.posts.length > 0) {
            const commentPromises = jsonData.posts.map(post => getComments(post.post_id, user_data.userId));
            const allComments = await Promise.all(commentPromises);

            const fragment = document.createDocumentFragment();
            jsonData.posts.forEach((post, index) => {
                const comments = allComments[index];
                const node = document.createElement("div");
                node.className = "feed";
                node.innerHTML = `
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
                fragment.appendChild(node);
                addEventListeners(node);
                // console.log(post)
            });
            if (feedContainer) {
                feedContainer.appendChild(fragment);
                page++;

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

                
            }
                    
            
        } else if (page === 1) {
            if (!document.querySelector(".noFriends")) {
                const node = document.createElement("div");
                node.className = "feed";
                node.innerHTML = `
                    <div class="noFriends">
                        <div class="text-header">
                            <h1>Your <span class="change">feed</span> is waiting!</h1>
                            <p>Experience a vibrant feed filled with exciting updates.</p>
                        </div>
                        <a href="/find-friends">Find Friends</a>
                    </div>
                `;
                if (feedContainer) {
                    feedContainer.appendChild(node);
                }
                
            }
        } else {
            allPostsFetched = true;
        }
    } catch (error) {
        console.error("Error fetching posts:", error.message);
    } finally {
        isLoading = false;
    }
}

export async function addEventListeners(node) {
    const modal = document.querySelector(".comment-section");
    const card = document.querySelector(".card");
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");
    node.querySelectorAll(".profile-link").forEach(link => {
        link.addEventListener("click", async () => {
            const profileId = link.dataset.profileId;
            window.location.href = `profile.html?p=${profileId}`;
        })
    })

    node.querySelectorAll(".comment").forEach(com => {
        com.addEventListener("click", async () => {
            let postId = com.dataset.commentId;
            localStorage.setItem("postId", postId);
            modal.style.visibility = "visible";
            card.style.opacity = 1;
            card.style.transform = "scale(1)";
            
            const comments = await getComments(postId, user_data.userId);
            const commentContainer = document.getElementById("commentContainer");
            commentContainer.innerHTML = "";

            if (comments.length > 0) {
                comments.forEach(comment => {
                    const commentNode = document.createElement("div");
                    commentNode.className = "main-comment";
                    commentNode.innerHTML = `
                        <div class="comment-details">
                            <div class="profile-picture">
                                <img src="http://127.0.0.1:8000${comment.user.dp}" alt="">
                            </div>
                            <div class="comment-body">
                                <div><a href=""><h5>${comment.user.full_name}</h5></a><p class="text-muted" style="font-size: 0.7rem;">${timeConversion(comment.commentAt)}</p></div>            
                                <p>${comment.content}</p>
                                <p class="text-muted">Reply</p>
                            </div>
                        </div>
                        <div class="reaction">
                            <i style="cursor: pointer;" class="fa-regular fa-heart"></i>
                            <p class="text-muted">1293</p>
                        </div>
                    `;
                    commentContainer.appendChild(commentNode);
                });
            } else {
                const commentNode = document.createElement("div");
                    commentNode.className = "main-comment";
                    commentNode.style.display = "block"
                    commentNode.style.borderBottom = "none";
                    commentNode.style.marginTop = "1rem";
                    commentNode.innerHTML = `
                        <h2 style="color: var(--light-gray);">Be the first one to comment!</h2>
                        <p style="color: var(--light-gray); font-size:0.6rem;">Keep the comment section respectful and kind to everyone. Let's spread positivity!</p>
                    `;
                    commentContainer.appendChild(commentNode);
            }            
        }); 
    });
}


// PROFILE PAGE
let newPage = 1;
let isLoading2 = false;

export async function fetchUserPost(profileId) {
    if (isLoading2) return;
    isLoading2 = true;

    const res = await fetch(`${localhost}/api/fetch-post-profile/`, {
        method: 'POST',
        body: JSON.stringify({ userId: profileId, page: newPage }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await res.json();

    if (data.posts && data.posts.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const p = urlParams.get('p');
        const postContainer = document.getElementById('post');
        const commentPromises = data.posts.map(post => getComments(post.post_id, p));
        const allComments = await Promise.all(commentPromises);
        data.posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('posts');
            const comments = allComments[index];
            postElement.innerHTML = `
                <div class="feed-header">
                    <div class="feed-header-container">
                        <div class="poster-infos">
                            <div class="dp-container">
                                <div class="profile-picture">
                                    <img src="http://127.0.0.1:8000/media/${post.profile_picture}" alt="" loading="lazy">
                                </div>
                                <div class="name">
                                    <a href="#"><h1>${post.full_name}</h1></a>
                                </div>
                                <p>&bull;</p>
                                <div class="time">
                                    <p class="text-muted">${timeConversion(post.postAt)}</p>
                                </div>
                            </div>
                        </div>
                        <p href="#">
                            <span class="edit" data-edit-id="1">
                                <span class="options"></span>
                            </span>
                        </p>
                    </div>
                </div>
                <div class="poster-container-info">
                    <div class="photo">
                        <div style="padding: 0;">
                            <p>${post.caption}</p>
                            <h1>${post.content}</h1>
                        </div>
                        <div class="post-photo">
                            <img class="photo-post" src="http://127.0.0.1:8000/media/${post.image}" loading="lazy" alt="">
                        </div>
                    </div>
                    <div class="reactions">
                        <div>
                            <i data-like-id="${post.post_id}" class="like fa-regular fa-heart"></i>
                            <h2>0</h2>
                        </div>
                        <div>
                            <i data-comment-id="${post.post_id}" class="comment fa-regular fa-comment-dots"></i>
                            <h2>${comments.length || 0}</h2>
                        </div>
                        <div>
                            <i data-bookmark-id="${post.post_id}" class="bookmark fa-regular fa-bookmark"></i>
                            <h2>0</h2>
                        </div>
                    </div>
                </div>
            `;
            if (postContainer) {
                postContainer.appendChild(postElement);
                addEventListenersProfile(postElement);
            }
            
        });
        newPage++;  
    }

    isLoading2 = false;
}

async function addEventListenersProfile(node) {
    const modal = document.querySelector(".comment-section");
    const card = document.querySelector(".card");
    const urlParams = new URLSearchParams(window.location.search);
    const p = urlParams.get('p');

    node.querySelectorAll(".comment").forEach(com => {
        com.addEventListener("click", async () => {
            let postId = com.dataset.commentId;
            localStorage.setItem("postId", postId);
            modal.style.visibility = "visible";
            card.style.opacity = 1;
            card.style.transform = "scale(1)";
            
            const comments = await getComments(postId, p);
            const commentContainer = document.getElementById("commentContainer");
            commentContainer.innerHTML = "";

            if (comments.length > 0) {
                comments.forEach(comment => {
                    const commentNode = document.createElement("div");
                    commentNode.className = "main-comment";
                    commentNode.innerHTML = `
                        <div class="comment-details">
                            <div class="profile-picture">
                                <img src="http://127.0.0.1:8000${comment.user.dp}" alt="">
                            </div>
                            <div class="comment-body">
                                <div><a href=""><h5>${comment.user.full_name}</h5></a><p class="text-muted" style="font-size: 0.7rem;">${timeConversion(comment.commentAt)}</p></div>            
                                <p>${comment.content}</p>
                                <p class="text-muted">Reply</p>
                            </div>
                        </div>
                        <div class="reaction">
                            <i style="cursor: pointer;" class="fa-regular fa-heart"></i>
                            <p class="text-muted">1293</p>
                        </div>
                    `;
                    commentContainer.appendChild(commentNode);
                });
            } else {
                const commentNode = document.createElement("div");
                    commentNode.className = "main-comment";
                    commentNode.style.display = "block"
                    commentNode.style.borderBottom = "none";
                    commentNode.style.marginTop = "1rem";
                    commentNode.innerHTML = `
                        <h2 style="color: var(--light-gray);">Be the first one to comment!</h2>
                        <p style="color: var(--light-gray); font-size:0.6rem;">Keep the comment section respectful and kind to everyone. Let's spread positivity!</p>
                    `;
                    commentContainer.appendChild(commentNode);
            }            
        }); 
    });
}



document.querySelectorAll('.profile').forEach(profile => {
        profile.addEventListener('click', async () => {
            const user_data = await loadFromLocalStorage("Hannah143", "user_data");
            window.location.href = `profile.html?p=${user_data.userId}`;
    });
});


// HOMEPAGE FRIENDS
async function getFriends() {
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");
    const res = await fetch(`${localhost}/api/friends/?userId=${user_data.userId}`, {
        method: "GET",
    })
    const data = await res.json();
    data.friends.forEach(friend => {
        const friendContainer = document.getElementById("followingProfiles");
        const friendElement = document.createElement("div");
        friendElement.className = "following-profile";
        friendElement.innerHTML = `
            <div class="left">
                <div class="profile-picture">
                    <img src="http://127.0.0.1:8000/media/${friend.dp}" alt="">
                </div>
                <h6>${friend.username}</h6>
            </div>
            <div class="active"></div>
        `
        if (friendContainer) {
            friendContainer.appendChild(friendElement);
        }
    })
}

// SEARCH USERS

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchUsers');
    
    if (searchInput) {
        searchInput.addEventListener('input', searchUsers);
    }
});

export async function searchUsers() {
    const query = document.getElementById('searchUsers').value;
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");

    if (query) {
            const res = await fetch(`${localhost}/api/search-users/?q=${query}&userId=${user_data.userId}`);
            const data =await res.json()
            if (data.friends) {
                const user_cont = document.querySelector('.searched-items-cont');
                user_cont.innerHTML = '';

                data.friends.forEach(user => {
                    const users = document.createElement('div');
                    users.setAttribute('data-id', user.id);
                    users.classList.add('searched-item');
                    users.innerHTML = `
                        <div class="profile-picture">
                            <img class="myProfilePic" src="http://127.0.0.1:8000${user.dp}" alt="">
                        </div>
                        <div class="search_names">
                            <h4 class="name_username">${user.name}</h4>
                            <p class="text-muted">${user.username}</p>
                        </div>
                    `;
                    user_cont.appendChild(users);
            });
            user_cont.addEventListener('click', function(event) {
                const clickedUser = event.target.closest('.searched-item');
                if (clickedUser) {
                    const userId = clickedUser.dataset.id;
                    window.location.href = `profile.html?p=${userId}`;
                }
            });
            } else {
                console.log("no friends")
            }
        
    } else {
        document.querySelector('.searched-items-cont').innerHTML = '';
    }
}

window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200) {
        fetchPosts();
    }
});

document.getElementById('logo').addEventListener('click', () => {
    localStorage.removeItem('profile');
})


fetchPosts();
getFriends();