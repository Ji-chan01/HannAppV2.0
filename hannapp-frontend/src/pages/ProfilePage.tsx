import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDayMode, setIsDayMode] = useState(false);

  useEffect(() => {
    document.title = 'HannApp';
  }, []);

  // ── Dynamic script loader with event-listener tracking and cleanup ──
  useEffect(() => {
    const originalWindowAdd = window.addEventListener;
    const originalDocumentAdd = document.addEventListener;

    const windowListeners: { type: string; listener: any; options?: any }[] = [];
    const documentListeners: { type: string; listener: any; options?: any }[] = [];

    (window as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('profileDom.js') || stack.includes('fetchProfile.js')) {
        windowListeners.push({ type, listener, options });
      }
      return originalWindowAdd.call(window, type, listener, options);
    };

    (document as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('profileDom.js') || stack.includes('fetchProfile.js')) {
        documentListeners.push({ type, listener, options });
      }
      return originalDocumentAdd.call(document, type, listener, options);
    };

    const scripts = [
      '/assets/scripts/profiles/profileDom.js',
      '/assets/scripts/profiles/fetchProfile.js',
    ];

    const scriptElements: HTMLScriptElement[] = [];
    const timestamp = Date.now();

    scripts.forEach((src, index) => {
      const script = document.createElement('script');
      script.src = `${src}?t=${timestamp}`;
      // profileDom.js is NOT a module; fetchProfile.js IS a module
      script.type = index === 1 ? 'module' : 'text/javascript';
      script.async = true;
      document.body.appendChild(script);
      scriptElements.push(script);
    });

    return () => {
      // Restore originals
      window.addEventListener = originalWindowAdd;
      document.addEventListener = originalDocumentAdd;

      windowListeners.forEach(({ type, listener, options }) =>
        window.removeEventListener(type, listener, options)
      );
      documentListeners.forEach(({ type, listener, options }) =>
        document.removeEventListener(type, listener, options)
      );

      scriptElements.forEach((script) => {
        if (script.parentNode) script.parentNode.removeChild(script);
      });
    };
  }, [navigate]);

  return (
    <div className={`profile-page-wrapper${isDayMode ? ' day' : ''}`}>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="left-section">
          <a id="logo" href="/home" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>
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
            <a href="/home" className="menu-item" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>
              <span><i className="fa-solid fa-house"></i></span><h6>Home</h6>
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

          <div className="profile-dropdown">
            <div className="profile-picture">
              <img className="user-dp" src="/assets/gifs/loading.gif" alt="" />
            </div>
            <p className="user_name">Loading please wait...</p>
            <i className="fa-solid fa-sort-down"></i>
          </div>
        </div>
      </header>

      {/* ── PROFILE MODAL (dropdown) ── */}
      <div className="profile-modal">
        <a href="/profile" className="profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
          <div className="profile-picture">
            <img className="user-dp" src="/assets/gifs/loading.gif" alt="" />
          </div>
          <div className="handle">
            <h4 className="user_name">Loading...</h4>
            <p className="user_username text-muted">Loading...</p>
          </div>
        </a>
        <div>
          <a
            href="/settings?entry_point=account_settings"
            className="menu-item"
            onClick={(e) => { e.preventDefault(); navigate('/settings?entry_point=account_settings'); }}
          >
            <span><i className="fa-solid fa-wrench"></i></span><h3>Account Settings</h3>
          </a>
          <div id="logout_btn" className="menu-item">
            <span><i className="fa-solid fa-right-from-bracket"></i></span><h3>Log Out</h3>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="main-container">

        {/* ── TOP INFO: Cover + DP ── */}
        <section className="top-info">
          <div className="top-sec">
            <div className="cover-cont">
              <img src="/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg" alt="" />
            </div>
            <div className="dp-cont">
              <img className="profile-dp" src="/assets/gifs/loading.gif" alt="" />
              <h1 className="profile_name">Loading name...</h1>
              <div className="top-buttons">
                <button id="addFriend">Friends <span className="badge">&#x2713;</span></button>
                <button id="sendMessage">Message</button>
              </div>
              <p>
                Lorem ipsum dolor sit amet. Consectetur adipiscing
                elit. Proin at gravida velit.
              </p>
            </div>
          </div>
        </section>

        {/* ── POSTS SECTION with Tabs ── */}
        <section className="posts-cont">

          {/* Tab navigation bar */}
          <header className="bot-sec">
            <div className="control-bot-style">
              <div className="left-sec">
                <ul className="left-nav">
                  <li><button id="postBtn" className="nav-link active"><h3>Post</h3></button></li>
                  <li><button id="aboutBtn" className="nav-link"><h3>About</h3></button></li>
                  <li><button id="friendsBtn" className="nav-link"><h3>Friends</h3></button></li>
                </ul>
              </div>
              <div className="right-sec">
                <ul className="right-nav">
                  <li><button className="nav-link"><h3>Photos</h3></button></li>
                  <li><button className="nav-link"><h3>Videos</h3></button></li>
                  <li><button className="nav-link"><h3>More</h3></button></li>
                </ul>
              </div>
            </div>
          </header>

          {/* Tab content — both divs always in the DOM; JS controls visibility */}
          <section className="nav-cont">

            {/* POST */}
            <div id="post" className="post"></div>

            {/* ABOUT */}
            <section id="about" className="about">
              <aside className="left-profile-info">
                <div className="profile-container">
                  <div className="top-nav">
                    <div className="cover-cont">
                      <img src="/assets/testImages/IMG_20240515_004422.jpg" alt="" />
                    </div>
                    <div className="dp-cont">
                      <img className="profile-dp" src="/assets/gifs/loading.gif" alt="" />
                      <label htmlFor="pic-upload" className="change-pic label-change-dp">
                        <i className="fa-solid fa-camera"></i>
                      </label>
                      <input id="pic-upload" className="change-dp" type="file" accept="image/*" />
                      <div>
                        <label htmlFor="pic-upload" className="change-pic label-change-cover">
                          Change cover photo
                        </label>
                        <input id="cover-upload" type="file" accept="image/*" />
                      </div>
                      <h2 className="profile_username">Loading username...</h2>
                    </div>
                  </div>

                  <div className="bot-nav">
                    <div className="friendxfollowers-cont">
                      <section>
                        <h1>1500</h1>
                        <p>Friends</p>
                      </section>
                      <section>
                        <h1>789</h1>
                        <p>Followers</p>
                      </section>
                    </div>
                    <div className="bot-nav-body">
                      <h4 className="sub-header">TAGS</h4>
                      <section className="tag-container">
                        <input className="myTags" placeholder="Loving" type="text" disabled />
                        <input className="myTags" placeholder="Caring" type="text" disabled />
                        <input className="myTags" placeholder="Cat-lover" type="text" disabled />
                      </section>
                    </div>

                    <div className="line-separator"></div>

                    <div className="bot-nav-links">
                      <h4 className="sub-header">Contact info</h4>
                      <ul className="nav-links">
                        <li><a href="" className="ul-link"><i className="fa-brands fa-facebook"></i>Facebook</a></li>
                        <li><a href="" className="ul-link"><i className="fa-brands fa-instagram"></i>Instagram</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>

              <section className="main-info-cont">
                <div className="infos-cont">
                  <div className="informations">
                    <div className="info-cont">
                      <h1><span style={{ color: 'crimson' }}>Public</span> Information</h1>
                      <div className="details">
                        <div className="icons">
                          <i className="fa-solid fa-location-dot"></i>
                          <i className="fa-solid fa-house-user"></i>
                        </div>
                        <div className="det">
                          <p>From <b>Kinamaligan,</b> Masbate City</p>
                          <p>Lives In <b>Kinamaligan,</b> Masbate City</p>
                        </div>
                      </div>
                    </div>
                    <div className="info-cont">
                      <div className="details">
                        <div className="icons">
                          <i className="fa-solid fa-cake-candles"></i>
                          <i className="fa-solid fa-venus-mars"></i>
                        </div>
                        <div className="det">
                          <p>Birthday: <span id="birthday">July 20, 2004</span></p>
                          <p>Gender: <span id="gender">Female</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <img src="/assets/testImages/1735362964968-removebg-preview.png" alt="" />
              </section>
            </section>

            {/* COMMENT SECTION MODAL */}
            <div className="comment-section">
              <div className="card">
                <div className="comment-header">
                  <h3>Comments</h3>
                  <button id="closeCommentModal" className="btn">X</button>
                </div>

                <div id="commentContainer" className="comment-container"></div>

                <div className="comment-field">
                  <img className="user-dp" src="/assets/gifs/loading.gif" alt="" />
                  <input id="setComment" type="text" placeholder="Add a comment..." />
                  <button className="send-message"><i className="fa-regular fa-paper-plane"></i></button>
                </div>
              </div>
            </div>

          </section>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
