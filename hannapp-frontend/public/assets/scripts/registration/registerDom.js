const modals = document.querySelectorAll('.modals');
const nextBtns = document.querySelectorAll('.next-btn');

const imgCont = document.querySelectorAll('.img-cont');
const male = document.querySelectorAll('.male');
const female = document.querySelectorAll('.female');

// INPUTS
const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');
const genderInput = document.getElementById('gender');
const birthday = document.getElementById('birthday');
const email = document.getElementById('email');
const fullname = document.getElementById('fullname');

const terms = document.getElementById('terms');

terms.addEventListener('change', () => {
    !terms.checked ? document.getElementById('signupBtn').disabled = true : document.getElementById('signupBtn').disabled = false;
});

// DIV MODALS
const first_page = document.querySelector('.name');
const gender = document.querySelector('.gender');
const private_info = document.querySelector('.private-info');
const dp = document.querySelector('.dp-cont');
const create_acc = document.querySelector('.create-acc');

// NEXT BUTTONS
const nextBtnName = document.getElementById('nextBtnName');
const nextBtnGender = document.getElementById('nextBtnGender');
const nextBtnAddInfo = document.getElementById('nextBtnAddInfo');
const nextBtnDp = document.getElementById('nextBtnDp');

nextBtnName.addEventListener('click', () => {
    if (first_name.value && last_name.value) {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        gender.classList.add('active');
    } else {
        alert('All fields are required!');
    }
});

nextBtnGender.addEventListener('click', () => {
    if (genderInput.value) {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        private_info.classList.add('active');
    } else {
        alert('Please select your appropriate gender first!');
    }
});

nextBtnAddInfo.addEventListener('click', () => {
    if (birthday.value && email.value) {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        dp.classList.add('active');
        fullname.innerText = `${first_name.value} ${last_name.value}`;
    } else {
        alert('All fields are required!');
    }
});

nextBtnDp.addEventListener('click', () => {
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    create_acc.classList.add('active');
});

// BACK BUTTONS
const backGender = document.querySelector('.backGender');
const backInfos = document.querySelector('.backInfos');
const backDp = document.querySelector('.backDp');
const backCreate = document.querySelector('.backCreate');

backGender.addEventListener('click', () => {
    gender.classList.remove('active');
    first_page.classList.add('active');
});

backInfos.addEventListener('click', () => {
    private_info.classList.remove('active');
    gender.classList.add('active');
});

backDp.addEventListener('click', () => {
    dp.classList.remove('active');
    private_info.classList.add('active');
});

backCreate.addEventListener('click', () => {
    create_acc.classList.remove('active');
    dp.classList.add('active');
});

const toggleClassListGender = () => {
    imgCont.forEach(img => {
        img.addEventListener('click', () => {
            const gender = img.dataset.gender;
            genderInput.value = gender;
            male.forEach(m => {
                m.classList.remove('active');
            });
            female.forEach(f => {
                f.classList.remove('active');
            });

            const nestedMale = img.querySelector('.male');
            const nestedFemale = img.querySelector('.female');

            if (nestedMale) {
                male.forEach(m => {
                    m.classList.toggle('active');
                });
            }
            if (nestedFemale) {
                female.forEach(f => {
                    f.classList.toggle('active');
                });
            }
        });
    });
};

for (let i = 0; i <= 5000; i++) {
    setTimeout(() => {
        document.querySelector('.numUser').innerText = i;
    }, i * 1);
}


toggleClassListGender();