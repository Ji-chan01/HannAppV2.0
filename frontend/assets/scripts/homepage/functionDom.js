import { loadFromLocalStorage } from '../cryptoUtils.js';

const closeCommentModal = document.getElementById('closeCommentModal');
const commentSection = document.querySelector('.comment-section');
const card = document.querySelector('.card');

const profileDropdown = document.querySelector('.profile-dropdown');
const profileModal = document.querySelector('.profile-modal');

const searchUsers = document.getElementById('searchUsers');
const searchContainer = document.querySelector('.searched-items-cont');

closeCommentModal.addEventListener('click', () => {
    commentSection.style.visibility = 'hidden';
    card.style.opacity = 0;
    card.style.transform = 'scale(1.2)';
});

profileDropdown.addEventListener('click', () => {
    profileModal.classList.toggle('active');
    console.log("nyo")
})

async function getUserData() {
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");


    if (user_data && Object.keys(user_data).length > 0) {
        console.log(user_data.dp)
        document.querySelectorAll('.myProfilePic').forEach(image => {
            image.src = `http://127.0.0.1:8000${user_data.dp}`;
        })

        document.querySelectorAll('.user_name').forEach(u_name => {
            u_name.innerText = user_data.username;
        })

        document.querySelectorAll('.profile_name').forEach(name => {
            name.innerText = `${user_data.first_name} ${user_data.last_name}`;
        })

        document.getElementById('createPost').placeholder = `What's on your mind, ${user_data.first_name}?`
    } else {
        // window.location.assign('login-page.html');
    }
}

searchUsers.addEventListener('input', () => {
    searchContainer.classList.add('active');
})

document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target) && !searchUsers.contains(event.target)) {
        searchContainer.classList.remove('active');
    }
    if (!profileDropdown.contains(event.target)) profileModal.classList.remove('active');
})

document.getElementById('closeCommentModal').addEventListener('click', () => {
    localStorage.removeItem("postId");
})


document.getElementById('logout_btn').addEventListener('click', () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('profile');
    window.location.assign('login-page.html');
})

getUserData();