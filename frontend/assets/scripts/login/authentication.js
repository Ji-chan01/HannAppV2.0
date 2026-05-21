import { saveToLocalStorage } from '../cryptoUtils.js';

const username = document.getElementById('username');
const pass = document.getElementById('pass');
const loginBtn = document.getElementById('loginBtn');

const localhost = "http://127.0.0.1:8000";
const url = "https://z954zfbz-5500.asse.devtunnels.ms"

async function login() {
    if (username.value.trim() && pass.value.trim()) {
        const json = {
            username: `@${username.value.trim()}`,
            pass: pass.value.trim()
        };

        try {
            const res = await fetch(`${localhost}/api/login-authentication/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            });

            const data = await res.json();

            if (data.status) {
                if (data.response) {
                    const secretKey = "Hannah143";
                    await saveToLocalStorage(secretKey, 'user_data', data.response);
                }
                window.location.assign('home-page.html');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Server is offline. Please contact the system administrator and try again.');
        }
    } else {
        alert("Invalid user credentials");
    }
}

loginBtn.addEventListener('click', () => {
    login();
});
