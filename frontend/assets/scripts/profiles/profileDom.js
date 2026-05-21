const searchUsers = document.getElementById('searchUsers');
const searchContainer = document.querySelector('.searched-items-cont');

document.getElementById('postBtn').addEventListener('click', () => {
    document.getElementById('post').style.display = 'flex';
    document.getElementById('about').style.display = 'none';
})
document.getElementById('aboutBtn').addEventListener('click', () => {
    document.getElementById('post').style.display = 'none';
    document.getElementById('about').style.display = 'flex';
})

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        })
        link.classList.add('active');
    })
})

document.querySelector('.profile-dropdown').addEventListener('click', () => {
    document.querySelector('.profile-modal').classList.toggle('active');
})

document.getElementById('logout_btn').addEventListener('click', () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('profile');
    window.location.assign('login-page.html');
})


const closeCommentModal = document.getElementById('closeCommentModal');
const commentSection = document.querySelector('.comment-section');
const card = document.querySelector('.card');

closeCommentModal.addEventListener('click', () => {
    commentSection.style.visibility = 'hidden';
    card.style.opacity = 0;
    card.style.transform = 'scale(1.2)';
    localStorage.removeItem("postId");
});

searchUsers.addEventListener('input', () => {
    searchContainer.classList.add('active');
})

document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target) && !searchUsers.contains(event.target)) {
        searchContainer.classList.remove('active');
    }
})