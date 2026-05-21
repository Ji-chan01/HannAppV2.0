import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Step = 'name' | 'gender' | 'private-info' | 'dp' | 'create-acc';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('name');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const goTo = (s: Step) => setStep(s);

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#0f0f1a]">
      <canvas id="canvas" className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Left Section */}
      <article className="left-section hidden lg:flex flex-col justify-between items-start w-1/2 p-12 z-10 relative">
        <div className="main flex flex-col gap-6">
          <div className="headers flex flex-col gap-1">
            <p className="up text-xl text-gray-200">
              <span className="h1 text-3xl font-extrabold text-white">HannApp</span>{' '}
              is reliable, secured, and
            </p>
            <p className="down text-2xl font-bold text-purple-400">user-friendly!</p>
          </div>
          <div className="kaemehan flex flex-col gap-1 mt-4">
            <h1 className="text-3xl font-bold text-white">Trusted by over</h1>
            <p className="text-5xl font-extrabold">
              <span className="numUser text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                10,000
              </span>
              <span className="text-white">+</span>
            </p>
            <h5 className="text-lg text-gray-300 font-medium">Active Users</h5>
          </div>
        </div>
        <img
          src="/assets/images/logo/undraw_appreciate-it_aans.svg"
          alt="Appreciate Illustration"
          className="max-w-sm w-full mt-8 drop-shadow-2xl"
        />
      </article>

      {/* Registration Form */}
      <form
        id="registrationForm"
        onSubmit={(e) => e.preventDefault()}
        className="relative z-10 flex flex-col items-center justify-center
          w-full lg:w-1/2 min-h-screen px-8 py-12
          bg-white/5 backdrop-blur-xl border-l border-white/10"
      >

        {/* Step: Name */}
        {step === 'name' && (
          <div className="modals name active flex flex-col gap-5 w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">What's your name?</h1>
            <div className="inputs relative">
              <input
                id="first_name"
                type="text"
                placeholder=" "
                className="peer w-full bg-white/10 border border-white/20 rounded-xl px-4 pt-5 pb-2
                  text-white outline-none focus:border-purple-400 transition-colors"
              />
              <label className="absolute left-4 top-3 text-xs text-gray-400 peer-placeholder-shown:top-4
                peer-placeholder-shown:text-sm transition-all">
                First Name
              </label>
            </div>
            <div className="inputs relative">
              <input
                id="last_name"
                type="text"
                placeholder=" "
                className="peer w-full bg-white/10 border border-white/20 rounded-xl px-4 pt-5 pb-2
                  text-white outline-none focus:border-purple-400 transition-colors"
              />
              <label className="absolute left-4 top-3 text-xs text-gray-400 peer-placeholder-shown:top-4
                peer-placeholder-shown:text-sm transition-all">
                Last Name
              </label>
            </div>
            <div className="next-btn next-btn-name">
              <button
                id="nextBtnName"
                type="button"
                onClick={() => goTo('gender')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white font-semibold hover:from-purple-500 hover:to-indigo-500
                  transition-all duration-200 shadow-lg shadow-purple-900/40 active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: Gender */}
        {step === 'gender' && (
          <div className="modals gender flex flex-col gap-5 w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">I am . . .</h1>
            <div className="choice-cont flex gap-4 justify-center">
              <div
                data-gender="male"
                onClick={() => setGender('male')}
                className={`img-cont flex flex-col items-center gap-2 cursor-pointer p-4 rounded-2xl border-2 transition-all
                  ${gender === 'male' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:border-purple-400'}`}
              >
                <img className="male w-24 h-24 object-cover rounded-full" src="/assets/images/dp/avatar-men.png" alt="Male" />
                <p className="male text-white font-medium">
                  Male <i className="fa-solid fa-mars text-blue-400" />
                </p>
              </div>
              <div
                data-gender="female"
                onClick={() => setGender('female')}
                className={`img-cont flex flex-col items-center gap-2 cursor-pointer p-4 rounded-2xl border-2 transition-all
                  ${gender === 'female' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5 hover:border-pink-400'}`}
              >
                <img className="female w-24 h-24 object-cover rounded-full" src="/assets/images/dp/avatar-3.png" alt="Female" />
                <p className="female text-white font-medium">
                  Female <i className="fa-solid fa-venus text-pink-400" />
                </p>
              </div>
            </div>
            <input id="gender" type="hidden" value={gender} />
            <div className="next-btn flex gap-3">
              <button type="button" onClick={() => goTo('name')}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white
                  hover:bg-white/20 transition-all duration-200 active:scale-95">
                Back
              </button>
              <button id="nextBtnGender" type="button" onClick={() => goTo('private-info')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white font-semibold hover:from-purple-500 hover:to-indigo-500
                  transition-all duration-200 active:scale-95">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: Private Info */}
        {step === 'private-info' && (
          <div className="modals private-info flex flex-col gap-5 w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">Additional information</h1>
            <div className="inputs flex flex-col gap-1">
              <p className="text-sm text-gray-300">Birthday:</p>
              <input
                id="birthday"
                type="date"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                  text-white outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div className="inputs flex flex-col gap-1">
              <p className="text-sm text-gray-300">Email:</p>
              <input
                id="email"
                type="email"
                placeholder="example@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                  text-white placeholder-gray-400 outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div className="next-btn flex gap-3">
              <button type="button" onClick={() => goTo('gender')}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white
                  hover:bg-white/20 transition-all duration-200 active:scale-95">
                Back
              </button>
              <button id="nextBtnAddInfo" type="button" onClick={() => goTo('dp')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white font-semibold hover:from-purple-500 hover:to-indigo-500
                  transition-all duration-200 active:scale-95">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: DP */}
        {step === 'dp' && (
          <div className="modals dp-cont flex flex-col gap-5 items-center w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">What you look like?</h1>
            <div className="dp-container relative w-28 h-28">
              <img
                src="/assets/gifs/loading.gif"
                alt="dp"
                className="w-28 h-28 rounded-full object-cover border-4 border-purple-500/40"
              />
              <label
                htmlFor="dp"
                className="label-change-dp absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center
                  bg-purple-600 rounded-full cursor-pointer hover:bg-purple-500 transition-colors"
              >
                <i className="fa-solid fa-camera text-white text-xs" />
              </label>
              <input id="dp" type="file" accept="image/*" className="hidden" />
            </div>
            <span id="fullname" className="full_name text-white font-semibold text-lg">Please Wait..</span>
            <div className="next-btn flex gap-3 w-full">
              <button type="button" onClick={() => goTo('private-info')}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white
                  hover:bg-white/20 transition-all duration-200 active:scale-95">
                Back
              </button>
              <button id="nextBtnDp" type="button" onClick={() => goTo('create-acc')}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white font-semibold hover:from-purple-500 hover:to-indigo-500
                  transition-all duration-200 active:scale-95">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step: Create Account */}
        {step === 'create-acc' && (
          <div className="modals create-acc flex flex-col gap-5 w-full max-w-sm">
            <div className="back">
              <i
                className="backCreate fa-solid fa-circle-arrow-left text-2xl text-purple-400 cursor-pointer hover:text-purple-300"
                onClick={() => goTo('dp')}
              />
            </div>
            <h1 className="text-3xl font-bold text-white">Create your account</h1>
            <div className="inputs flex flex-col gap-4">
              <div className="input relative">
                <input
                  id="username"
                  type="text"
                  placeholder=" "
                  required
                  className="peer w-full bg-white/10 border border-white/20 rounded-xl px-4 pt-5 pb-2
                    text-white outline-none focus:border-purple-400 transition-colors pr-10"
                />
                <i className="fa-regular fa-user absolute right-4 top-4 text-gray-400" />
                <label className="absolute left-4 top-3 text-xs text-gray-400">Username</label>
              </div>
              <div className="input relative">
                <input
                  id="pass1"
                  type="password"
                  placeholder=" "
                  required
                  className="peer w-full bg-white/10 border border-white/20 rounded-xl px-4 pt-5 pb-2
                    text-white outline-none focus:border-purple-400 transition-colors pr-10"
                />
                <i className="fa-solid fa-lock absolute right-4 top-4 text-gray-400" />
                <label className="absolute left-4 top-3 text-xs text-gray-400">Password</label>
              </div>
              <div className="input relative">
                <input
                  id="pass2"
                  type="password"
                  placeholder=" "
                  required
                  className="peer w-full bg-white/10 border border-white/20 rounded-xl px-4 pt-5 pb-2
                    text-white outline-none focus:border-purple-400 transition-colors pr-10"
                />
                <i className="fa-solid fa-lock absolute right-4 top-4 text-gray-400" />
                <label className="absolute left-4 top-3 text-xs text-gray-400">Confirm Password</label>
              </div>
            </div>
            <div className="next-btn">
              <button
                id="signupBtn"
                type="button"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white font-semibold hover:from-purple-500 hover:to-indigo-500
                  transition-all duration-200 shadow-lg shadow-purple-900/40 active:scale-95"
              >
                Sign up
              </button>
            </div>
            <div className="terms flex items-center gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
              <label className="check text-sm text-gray-300" htmlFor="terms">
                I agree to the{' '}
                <span>
                  <a
                    className="t text-purple-400 hover:text-purple-300 underline underline-offset-2"
                    href="/terms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Terms and conditions
                  </a>
                </span>{' '}
                of HannApp
              </label>
            </div>
          </div>
        )}

        {/* Separator & Back to Login */}
        <div className="separator flex items-center gap-3 w-full max-w-sm mt-6">
          <div className="line flex-1 h-px bg-white/10" />
          <p className="text-gray-400 text-xs">OR</p>
          <div className="line flex-1 h-px bg-white/10" />
        </div>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-3 text-sm text-purple-300 hover:text-purple-100 transition-colors underline underline-offset-2"
        >
          Go back to login page
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
