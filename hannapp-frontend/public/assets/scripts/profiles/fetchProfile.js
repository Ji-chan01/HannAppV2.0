import { loadFromLocalStorage } from "../cryptoUtils.js";
import { fetchUserPost, searchUsers } from "../homepage/fetchData.js";

const localhost = "http://127.0.0.1:8000";
const url = "https://z954zfbz-5500.asse.devtunnels.ms"

async function getUserData() {
    const user_data = await loadFromLocalStorage("Hannah143", "user_data");

    const urlParams = new URLSearchParams(window.location.search);
    const p = urlParams.get('p');

    const res = await fetch(`${localhost}/api/fetch-post-profile/?userId=${p}&user=${user_data.userId}`, {
        method: "GET",
    });

    let profile = await res.json();
    const user_profile = profile.profile[p];

    const dateStr = user_data.birthday;
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (profile.isFriend) {
        
    } else {
        document.getElementById('addFriend').innerText = 'Add Friend';
    }

    if (user_data.userId != p) {
        document.querySelectorAll('.change-pic').forEach(image => {
            image.style.display = 'none';
        });
        document.querySelector('.top-buttons').style.display = 'flex';
    }

    if (user_profile && Object.keys(user_profile).length > 0) {
        document.querySelectorAll('.profile-dp').forEach(image => {
            image.src = `http://127.0.0.1:8000/media/${user_profile.dp}`;
        });

        document.getElementById('gender').innerHTML = user_profile.gender;
        document.getElementById('birthday').innerHTML = formattedDate;

        document.querySelectorAll('.user_name').forEach(name => {
            name.innerText = `${user_data.first_name} ${user_data.last_name}`;
        })

        document.querySelector('.user_username').innerText = user_data.username;

        document.querySelectorAll('.user-dp').forEach(image => {
            image.src = `http://127.0.0.1:8000${user_data.dp}`;
        });
    
        document.querySelectorAll('.profile_username').forEach(username => {
            username.innerText = user_profile.username;
        });
        
        document.querySelectorAll('.profile_name').forEach(name => {
            name.innerText = `${user_profile.first_name} ${user_profile.last_name}`;
        });

        document.title = `${user_profile.first_name} ${user_profile.last_name}`;
    } else {
        alert("Action too fast! Please try again later");
    }
}

window.addEventListener('scroll', async () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('p');

    if (scrollPosition >= documentHeight - 200) {
        fetchUserPost(profileId);
    }
});

document.getElementById('logo').addEventListener('click', () => {
    localStorage.removeItem('profile');
});

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchUsers');
    
    if (searchInput) {
        searchInput.addEventListener('input', searchUsers);
    }
});

async function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('p');
    getUserData();
    fetchUserPost(profileId);
}


loadData()