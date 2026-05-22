import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage } from '../utils/cryptoUtils';

type Step = 'name' | 'gender' | 'private-info' | 'dp' | 'create-acc';

class Particle {
  x: number;
  y: number;
  col: string;
  vel: { x: number; y: number };
  lifetime: number;

  constructor(x: number, y: number, col: string) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.vel = randomVec(2);
    this.lifetime = 0;
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.vel.y += 0.02;
    this.vel.x *= 0.99;
    this.vel.y *= 0.99;
    this.lifetime++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = Math.max(1 - this.lifetime / 80, 0);
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

class Firework {
  x: number;
  y: number;
  isBlown: boolean;
  col: string;

  constructor(x: number, height: number) {
    this.x = x;
    this.y = height;
    this.isBlown = false;
    this.col = randomCol();
  }

  update(particles: Particle[]) {
    this.y -= 3;
    if (this.y < 350 - Math.sqrt(Math.random() * 500) * 40) {
      this.isBlown = true;
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(this.x, this.y, this.col));
      }
    }
    return this.isBlown;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.col;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}

function randomCol(): string {
  const letters = '0123456789ABCDEF';
  const nums: number[] = [];
  for (let i = 0; i < 3; i++) {
    nums[i] = Math.floor(Math.random() * 256);
  }
  let brightest = 0;
  for (let i = 0; i < 3; i++) {
    if (brightest < nums[i]) brightest = nums[i];
  }
  brightest /= 255;
  for (let i = 0; i < 3; i++) {
    nums[i] /= brightest;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(nums[i] / 16)];
    color += letters[Math.floor(nums[i] % 16)];
  }
  return color;
}

function randomVec(max: number) {
  const dir = Math.random() * Math.PI * 2;
  const spd = Math.random() * max;
  return { x: Math.cos(dir) * spd, y: Math.sin(dir) * spd };
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [dpFile, setDpFile] = useState<File | null>(null);
  const [dpPreview, setDpPreview] = useState('/assets/gifs/loading.gif');
  const [username, setUsername] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [numUser, setNumUser] = useState(0);

  // Document Title
  useEffect(() => {
    document.title = "HannApp";
  }, []);

  // 10,000+ Count Animation (counts from 0 to 5000 to match registerDom.js logic)
  useEffect(() => {
    const end = 5000;
    const duration = 5000; // 5 seconds
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * end);
      setNumUser(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Canvas Fireworks Background Animation (exact match to fire.js / LoginPage.tsx)
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    setSize();

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, width, height);
    fireworks.push(new Firework(Math.random() * (width - 200) + 100, height));

    const onClick = (e: MouseEvent) => {
      fireworks.push(new Firework(e.clientX, height));
    };

    const onResize = () => {
      setSize();
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("click", onClick);

    let animationFrameId: number;
    const loop = () => {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const done = fireworks[i].update(particles);
        fireworks[i].draw(ctx);
        if (done) {
          fireworks.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].lifetime > 80) {
          particles.splice(i, 1);
        }
      }

      if (Math.random() < 1 / 60) {
        fireworks.push(new Firework(Math.random() * (width - 200) + 100, height));
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const handleNextName = () => {
    if (firstName.trim() && lastName.trim()) {
      setStep('gender');
    } else {
      alert('All fields are required!');
    }
  };

  const handleNextGender = () => {
    if (gender) {
      setStep('private-info');
    } else {
      alert('Please select your appropriate gender first!');
    }
  };

  const handleNextPrivateInfo = () => {
    if (birthday && email.trim()) {
      setStep('dp');
    } else {
      alert('All fields are required!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDpFile(file);
      setDpPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async () => {
    let allFilled = true;
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !gender ||
      !birthday ||
      !email.trim() ||
      !username.trim() ||
      !pass1 ||
      !pass2
    ) {
      allFilled = false;
    }

    if (!allFilled) {
      alert("All fields are required!");
      return;
    }

    if (pass1 !== pass2) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const form = new FormData();
      form.append('first_name', firstName);
      form.append('last_name', lastName);
      form.append('gender', gender);
      form.append('birthday', birthday);
      form.append('email', email);
      if (dpFile) {
        form.append('dp', dpFile);
      }
      form.append('username', `@${username}`);
      form.append('password', pass1);

      const response = await fetch("http://127.0.0.1:8000/api/registration-authentication/", {
        method: 'POST',
        body: form
      });

      const res = await response.json();

      if (res.status) {
        await saveToLocalStorage('Hannah143', 'user_data', res.data);
        window.location.assign('home-page.html');
      } else {
        alert(`${res.Message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="relative w-screen h-screen bg-smoky-black overflow-hidden select-none">
      <canvas id="canvas" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />

      {/* Left Section */}
      <article className="left-section absolute flex left-[3%] top-1/2 -translate-y-1/2 h-[70%] w-[55%] z-10 font-poppins">
        <div className="main h-[80%] flex flex-col justify-around w-full pl-12 relative z-10">
          <div className="headers">
            <p className="up text-light-gray text-2xl font-semibold">
              <span className="h1 text-[3.5rem] font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff0844] to-[#ffb199]">
                HannApp
              </span>{' '}
              is reliable, secured, and
            </p>
            <p className="down text-light-gray text-2xl font-semibold">user-friendly!</p>
          </div>

          <div className="kaemehan flex flex-col items-center text-white max-w-max">
            <h1 className="text-[2rem]">Trusted by over</h1>
            <p className="font-bold text-[3rem] text-gradient-yellow">
              <span className="numUser">{numUser}</span>+
            </p>
            <h5 className="text-[1.3rem]">Active Users</h5>
          </div>
        </div>
        <img
          src="/assets/images/logo/undraw_appreciate-it_aans.svg"
          alt=""
          className="absolute right-0 bottom-0 z-0 w-[300px]"
        />
      </article>

      {/* Registration Form */}
      <form
        id="registrationForm"
        onSubmit={(e) => e.preventDefault()}
        className="absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col h-[75%] font-sans p-8 w-[30%] gap-4 justify-center shadow-white-shadow rounded-[10px] border-2 border-white backdrop-blur-[10px] z-10"
      >
        {/* Step: Name */}
        {step === 'name' && (
          <div className="modals name flex flex-col active">
            <h1 className="text-white mb-4 text-[1.5rem] font-bold">What's your name?</h1>
            <div className="inputs relative w-full my-2">
              <input
                id="first_name"
                type="text"
                placeholder=" "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="peer w-full px-2 py-[15px] bg-[#F3F3F3] border-none outline-none text-[13px] rounded-[3px] text-black"
              />
              <label className="absolute left-[10px] top-[13px] pointer-events-none transition-all duration-150 text-[rgb(129,129,129)] text-[13px] peer-focus:left-[7px] peer-focus:top-[3px] peer-focus:text-[11px] peer-not-placeholder-shown:left-[7px] peer-not-placeholder-shown:top-[3px] peer-not-placeholder-shown:text-[11px]">
                First Name
              </label>
            </div>
            <div className="inputs relative w-full my-2">
              <input
                id="last_name"
                type="text"
                placeholder=" "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="peer w-full px-2 py-[15px] bg-[#F3F3F3] border-none outline-none text-[13px] rounded-[3px] text-black"
              />
              <label className="absolute left-[10px] top-[13px] pointer-events-none transition-all duration-150 text-[rgb(129,129,129)] text-[13px] peer-focus:left-[7px] peer-focus:top-[3px] peer-focus:text-[11px] peer-not-placeholder-shown:left-[7px] peer-not-placeholder-shown:top-[3px] peer-not-placeholder-shown:text-[11px]">
                Lastname
              </label>
            </div>
            <div className="next-btn next-btn-name justify-center mt-4 flex">
              <button
                id="nextBtnName"
                type="button"
                onClick={handleNextName}
                className="border-2 border-gradient-yellow text-gradient-yellow shadow-[0_0_0.2rem_var(--color-gradient-yellow)] hover:bg-gradient-yellow hover:text-smoky-black hover:shadow-[0_0_0.2rem_var(--color-eerie-black)] transition-all duration-150 tracking-[1px] uppercase font-semibold py-[0.7rem] px-[3.5rem] bg-transparent rounded-[25px]"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: Gender */}
        {step === 'gender' && (
          <div className="modals gender flex flex-col active">
            <h1 className="text-white mb-4 text-[1.5rem] font-bold">I am . . .</h1>
            <div className="choice-cont flex justify-evenly">
              <div
                data-gender="male"
                onClick={() => setGender('male')}
                className="img-cont flex flex-col items-center cursor-pointer group"
              >
                <img
                  className={`male w-[70px] h-[70px] rounded-[50%] border-3 transition-all duration-150 object-cover ${
                    gender === 'male'
                      ? 'border-[#1D9BF0] bg-white'
                      : 'border-white-shadow group-hover:bg-white group-hover:border-[#1D9BF0]'
                  }`}
                  src="/assets/images/dp/avatar-men.png"
                  alt=""
                />
                <p
                  className={`male text-[0.8rem] transition-all duration-150 border-none! bg-transparent! mt-2 ${
                    gender === 'male'
                      ? 'text-[#1D9BF0] font-semibold'
                      : 'text-white-shadow group-hover:text-[#1D9BF0] group-hover:font-semibold'
                  }`}
                >
                  Male <i className="fa-solid fa-mars"></i>
                </p>
              </div>
              <div
                data-gender="female"
                onClick={() => setGender('female')}
                className="img-cont flex flex-col items-center cursor-pointer group"
              >
                <img
                  className={`female w-[70px] h-[70px] rounded-[50%] border-3 transition-all duration-150 object-cover ${
                    gender === 'female'
                      ? 'border-[#ffb7ce] bg-white'
                      : 'border-white-shadow group-hover:bg-white group-hover:border-[#ffb7ce]'
                  }`}
                  src="/assets/images/dp/avatar-3.png"
                  alt=""
                />
                <p
                  className={`female text-[0.8rem] transition-all duration-150 border-none! bg-transparent! mt-2 ${
                    gender === 'female'
                      ? 'text-[#ffb7ce] font-semibold'
                      : 'text-white-shadow group-hover:text-[#ffb7ce] group-hover:font-semibold'
                  }`}
                >
                  Female <i className="fa-solid fa-venus"></i>
                </p>
              </div>
            </div>
            <div className="next-btn mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setStep('name')}
                className="backBtn backGender bg-jet text-white border-none shadow-none py-[0.7rem] px-[3.3rem] rounded-[25px] transition-all duration-150 hover:bg-white hover:text-jet uppercase font-semibold tracking-[1px]"
              >
                Back
              </button>
              <button
                id="nextBtnGender"
                type="button"
                onClick={handleNextGender}
                className="border-2 border-gradient-yellow text-gradient-yellow shadow-[0_0_0.2rem_var(--color-gradient-yellow)] hover:bg-gradient-yellow hover:text-smoky-black hover:shadow-[0_0_0.2rem_var(--color-eerie-black)] transition-all duration-150 tracking-[1px] uppercase font-semibold py-[0.7rem] px-[3.5rem] bg-transparent rounded-[25px]"
              >
                Next
              </button>
            </div>
            <input id="gender" type="hidden" value={gender} placeholder="Gender" />
          </div>
        )}

        {/* Step: Private Info */}
        {step === 'private-info' && (
          <div className="modals private-info flex flex-col active">
            <h1 className="text-white mb-4 text-[1.5rem] font-bold">Additional information</h1>
            <div className="inputs flex flex-col gap-[0.3rem] my-2 relative w-full">
              <p className="text-white text-[0.7rem]">Birthday:</p>
              <input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="bg-[#F3F3F3] border-none p-[5px] text-[0.8rem] rounded-[5px] w-1/2 text-black"
              />
            </div>
            <div className="inputs flex flex-col gap-[0.3rem] my-2 relative w-full">
              <p className="text-white text-[0.7rem]">Email:</p>
              <input
                id="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-[0.8rem] bg-[#F3F3F3] border-none outline-none text-[13px] rounded-[3px] text-black"
              />
            </div>
            <div className="next-btn mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep('gender')}
                className="backBtn backInfos bg-jet text-white border-none shadow-none py-[0.7rem] px-[3.3rem] rounded-[25px] transition-all duration-150 hover:bg-white hover:text-jet uppercase font-semibold tracking-[1px]"
              >
                Back
              </button>
              <button
                id="nextBtnAddInfo"
                type="button"
                onClick={handleNextPrivateInfo}
                className="border-2 border-gradient-yellow text-gradient-yellow shadow-[0_0_0.2rem_var(--color-gradient-yellow)] hover:bg-gradient-yellow hover:text-smoky-black hover:shadow-[0_0_0.2rem_var(--color-eerie-black)] transition-all duration-150 tracking-[1px] uppercase font-semibold py-[0.7rem] px-[3.5rem] bg-transparent rounded-[25px]"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: DP */}
        {step === 'dp' && (
          <div className="modals dp-cont flex flex-col gap-6 active">
            <h1 className="text-white mb-4 text-[1.5rem] font-bold text-center">What you look like?</h1>
            <div className="dp-container flex flex-col items-center gap-4 relative">
              <img
                src={dpPreview}
                alt="dp"
                className="border-3 border-white rounded-[50%] bg-jet w-[100px] h-[100px] object-cover"
              />

              <label
                htmlFor="dp"
                className="label-change-dp cursor-pointer text-white text-[0.8rem] absolute bottom-[0.5rem] right-[6.8rem] bg-jet rounded-[50%] px-[4.5px] py-[1px] pt-[3px] border-2 border-white"
              >
                <i className="fa-solid fa-camera"></i>
              </label>
              <input
                id="dp"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <span
              id="fullname"
              className="full_name text-white text-[1.5rem] font-semibold text-center w-[19rem] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {firstName} {lastName}
            </span>
            <div className="next-btn flex justify-between">
              <button
                type="button"
                onClick={() => setStep('private-info')}
                className="backBtn backDp bg-jet text-white border-none shadow-none py-[0.7rem] px-[3.3rem] rounded-[25px] transition-all duration-150 hover:bg-white hover:text-jet uppercase font-semibold tracking-[1px]"
              >
                Back
              </button>
              <button
                id="nextBtnDp"
                type="button"
                onClick={() => setStep('create-acc')}
                className="border-2 border-gradient-yellow text-gradient-yellow shadow-[0_0_0.2rem_var(--color-gradient-yellow)] hover:bg-gradient-yellow hover:text-smoky-black hover:shadow-[0_0_0.2rem_var(--color-eerie-black)] transition-all duration-150 tracking-[1px] uppercase font-semibold py-[0.7rem] px-[3.5rem] bg-transparent rounded-[25px]"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: Create Account */}
        {step === 'create-acc' && (
          <div className="modals create-acc flex flex-col active">
            <div className="back">
              <i
                className="backCreate fa-solid fa-circle-arrow-left bg-transparent rounded-[50%] text-white text-[1.9rem] border-2 border-white cursor-pointer mb-2 transition-all duration-150 hover:text-smoky-black hover:bg-white"
                onClick={() => setStep('dp')}
              ></i>
            </div>
            <h1 className="text-white mb-4 text-[1.5rem] font-bold">Create your account</h1>
            <div className="inputs">
              <div className="input relative">
                <input
                  id="username"
                  type="text"
                  placeholder=" "
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer w-full my-[0.2rem] p-[0.75rem] pl-8 bg-[#F3F3F3] border-none outline-none text-[13px] rounded-[3px] text-black"
                />
                <i className="fa-regular fa-user absolute left-[0.8rem] top-[1.2rem] text-white-shadow text-[0.7rem]"></i>
                <label className="absolute left-8 top-4 text-white-shadow text-[0.8rem] transition-all duration-150 pointer-events-none peer-focus:left-[1.8rem] peer-focus:top-[3px] peer-focus:text-[10px] peer-not-placeholder-shown:left-[1.8rem] peer-not-placeholder-shown:top-[3px] peer-not-placeholder-shown:text-[10px]">
                  Username
                </label>
              </div>
              <div className="input relative">
                <input
                  id="pass1"
                  type="password"
                  placeholder=" "
                  required
                  value={pass1}
                  onChange={(e) => setPass1(e.target.value)}
                  className="peer w-full my-[0.2rem] p-[0.75rem] pl-8 bg-[#F3F3F3] border-none outline-none text-[13px] rounded-[3px] text-black"
                />
                <i className="fa-solid fa-lock absolute left-[0.8rem] top-[1.2rem] text-white-shadow text-[0.7rem]"></i>
                <label className="absolute left-8 top-4 text-white-shadow text-[0.8rem] transition-all duration-150 pointer-events-none peer-focus:left-[1.8rem] peer-focus:top-[3px] peer-focus:text-[10px] peer-not-placeholder-shown:left-[1.8rem] peer-not-placeholder-shown:top-[3px] peer-not-placeholder-shown:text-[10px]">
                  Password
                </label>
              </div>
              <div className="input relative">
                <input
                  id="pass2"
                  type="password"
                  placeholder=" "
                  required
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  className="peer w-full my-[0.2rem] p-[0.75rem] pl-8 bg-[#F3F3F3] border-none outline-none text-[13px] rounded-[3px] text-black"
                />
                <i className="fa-solid fa-lock absolute left-[0.8rem] top-[1.2rem] text-white-shadow text-[0.7rem]"></i>
                <label className="absolute left-8 top-4 text-white-shadow text-[0.8rem] transition-all duration-150 pointer-events-none peer-focus:left-[1.8rem] peer-focus:top-[3px] peer-focus:text-[10px] peer-not-placeholder-shown:left-[1.8rem] peer-not-placeholder-shown:top-[3px] peer-not-placeholder-shown:text-[10px]">
                  Confirm Password
                </label>
              </div>
            </div>
            <div className="next-btn mt-[0.8rem]">
              <button
                id="signupBtn"
                type="button"
                disabled={!agreedToTerms}
                onClick={handleSignup}
                className="w-full text-smoky-black bg-gradient-yellow border-2 border-gradient-yellow shadow-[0_0_0.2rem_var(--color-gradient-yellow)] hover:text-gradient-yellow hover:bg-smoky-black active:bg-gradient-yellow active:text-smoky-black transition-all duration-150 tracking-[1px] uppercase font-semibold py-[0.7rem] px-[3.5rem] rounded-[25px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign up
              </button>
            </div>
            <div className="terms mt-[0.8rem]">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mr-2"
              />
              <label className="check text-[0.8rem] text-white-shadow" htmlFor="terms">
                I agree to the{' '}
                <span className="text-white font-semibold">
                  <a className="t underline" href="/terms" target="_blank" rel="noreferrer">
                    Terms and conditions
                  </a>
                </span>{' '}
                of HannApp
              </label>
            </div>
          </div>
        )}

        {/* Separator and Login Redirect link */}
        <div className="separator flex items-center justify-center gap-4 mt-4 w-full">
          <div className="line w-[40%] bg-jet h-[1px] rounded-[50%]"></div>
          <p className="text-[0.8rem] text-white-shadow">OR</p>
          <div className="line w-[40%] bg-jet h-[1px] rounded-[50%]"></div>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
          className="text-white-shadow text-[0.7rem] transition-all duration-100 max-w-max hover:text-light-gray cursor-pointer mt-2 self-center"
        >
          Go back to login page
        </a>
      </form>
    </div>
  );
};

export default RegisterPage;
