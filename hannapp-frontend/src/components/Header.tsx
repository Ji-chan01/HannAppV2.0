import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isDayMode: boolean;
  setIsDayMode: (val: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isDayMode, setIsDayMode }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="left-section">
        <a id="logo" href="/home" onClick={(e) => {
          e.preventDefault();
          localStorage.removeItem('profile');
          navigate('/home');
        }}>
          <h1>HannApp
            <div className="aurora">
              <div className="aurora__item"> </div>
              <div className="aurora__item"> </div>
              <div className="aurora__item"> </div>
              <div className="aurora__item"> </div>
            </div>
          </h1>
        </a>

        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input id="searchUsers" type="search" placeholder="Search..." />
          <div className="searched-items-cont"></div>
        </div>
      </div>
      <div className="right-section">
        <div className="menu-items">
          <a href="/home" className="menu-item" onClick={(e) => {
            e.preventDefault();
            navigate('/home');
          }}>
            <span><i className="fa-solid fa-house"></i></span>
            <h6>Home</h6>
          </a>
          <a href="#" className="menu-item" onClick={(e) => e.preventDefault()}>
            <label className="dayNight">
              <input
                type="checkbox"
                checked={isDayMode}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsDayMode(checked);
                  if (checked) {
                    document.body.classList.add('day');
                  } else {
                    document.body.classList.remove('day');
                  }
                }}
              />
              <div></div>
            </label>
          </a>
          <a href="#" className="menu-item" onClick={(e) => e.preventDefault()}>
            <span><i className="fa-regular fa-bookmark"></i></span>
          </a>
          <a href="#" className="menu-item" onClick={(e) => e.preventDefault()}>
            <span><i className="fa-solid fa-bell"></i></span>
          </a>
        </div>

        {/* 
          Add both class names for the image and name text to maintain script compatibility:
          - myProfilePic & profile_name (used by HomePage's fetchData.js)
          - user-dp & user_name (used by ProfilePage's fetchProfile.js)
        */}
        <div className="profile-dropdown">
          <div className="profile-picture">
            <img className="myProfilePic user-dp" src="/assets/gifs/loading.gif" alt="" />
          </div>
          <p className="profile_name user_name">Loading please wait...</p>
          <i className="fa-solid fa-sort-down"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
