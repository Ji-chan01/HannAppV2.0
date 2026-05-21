import { loadFromLocalStorage, saveToLocalStorage } from "../cryptoUtils.js";

const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');
const gender = document.getElementById('gender');
const birthday = document.getElementById('birthday');
const email = document.getElementById('email');
const dp = document.getElementById('dp');
const username = document.getElementById('username');
const pass1 = document.getElementById('pass1');
const pass2 = document.getElementById('pass2');

const localhost = "http://127.0.0.1:8000";
const url = "https://z954zfbz-5500.asse.devtunnels.ms"

async function post() {
    const form = new FormData();
    form.append('first_name', first_name.value);
    form.append('last_name', last_name.value);
    form.append('gender', gender.value);
    form.append('birthday', birthday.value);
    form.append('email', email.value);
    dp.files[0] && form.append('dp', dp.files[0]);
    form.append('username', `@${username.value}`);
    form.append('password', pass1.value);
    

    const data = await fetch(`${localhost}/api/registration-authentication/`, {
        method: 'POST',
        body: form
    })

    const res = await data.json();
    
    if (res.status) {
        await saveToLocalStorage('Hannah143', 'user_data', res.data);
        window.location.assign('home-page.html');
    } else {
        alert(`${res.Message}`);
    }
}


document.getElementById("signupBtn").addEventListener('click', (e) => {
    e.preventDefault()
    let allFilled = true;
    document.querySelectorAll("#registrationForm input").forEach(input => {
        if (input.id === "dp") {
            return;
        }
        if (input.value.trim().length === 0) {
            allFilled = false;
        }
    });

    !allFilled ? alert("All fields are required!") : console.log("field requirement successfully met.");

    if (pass1.value !== pass2.value && allFilled) {
        alert("Passwords do not match!"); 
        return;
    } else if (allFilled && pass1.value === pass2.value){
        post();
    }
});
