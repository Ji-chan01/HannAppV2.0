import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDayMode, setIsDayMode] = useState(false);

  useEffect(() => {
    document.title = "HannApp";
  }, []);

  useEffect(() => {
    const originalWindowAdd = window.addEventListener;
    const originalDocumentAdd = document.addEventListener;

    const windowListeners: { type: string; listener: any; options?: any }[] = [];
    const documentListeners: { type: string; listener: any; options?: any }[] = [];

    (window as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('functionDom.js') || stack.includes('fetchData.js') || stack.includes('post.js')) {
        windowListeners.push({ type, listener, options });
      }
      return originalWindowAdd.call(window, type, listener, options);
    };

    (document as any).addEventListener = function (type: string, listener: any, options?: any) {
      const stack = new Error().stack || '';
      if (stack.includes('functionDom.js') || stack.includes('fetchData.js') || stack.includes('post.js')) {
        documentListeners.push({ type, listener, options });
      }
      return originalDocumentAdd.call(document, type, listener, options);
    };

    const scripts = [
      '/assets/scripts/homepage/functionDom.js',
      '/assets/scripts/homepage/fetchData.js',
      '/assets/scripts/homepage/post.js'
    ];

    const scriptElements: HTMLScriptElement[] = [];
    const timestamp = Date.now();

    scripts.forEach((src) => {
      const script = document.createElement('script');
      script.src = `${src}?t=${timestamp}`;
      script.type = 'module';
      script.async = true;
      document.body.appendChild(script);
      scriptElements.push(script);
    });

    return () => {
      window.addEventListener = originalWindowAdd;
      document.addEventListener = originalDocumentAdd;

      windowListeners.forEach(({ type, listener, options }) => {
        window.removeEventListener(type, listener, options);
      });
      documentListeners.forEach(({ type, listener, options }) => {
        document.removeEventListener(type, listener, options);
      });

      scriptElements.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <div className={`home-page-wrapper${isDayMode ? ' day' : ''}`}>
      <header className="header">
        <div className="left-section">
          <a id="logo" href="/home" onClick={() => {
            localStorage.removeItem('profile');
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
            <a href="/home" className="menu-item">
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

          <div className="profile-dropdown">
            <div className="profile-picture">
              <img className="myProfilePic" src="/assets/gifs/loading.gif" alt="" />
            </div>
            <p className="profile_name">Loading please wait...</p>
            <i className="fa-solid fa-sort-down"></i>
          </div>
        </div>
      </header>

      <main className="main-container">
        <aside className="left-sidebar">
          <div className="profile-container">
            <div className="top-nav">
              <figure id="userProfile">
                <img className="myProfilePic" src="/assets/gifs/loading.gif" alt="" />
                <div className="active"></div>
                <h3 className="user_name"></h3>
              </figure>
            </div>

            <div className="line-separator"></div>

            <div className="mid-nav">
              <h4 className="sub-header">BIO</h4>
              <p>
                Lorem ipsum dolor sit amet. Consectetur adipiscing
                elit. Proin at gravida velit.
              </p>
            </div>

            <div className="line-separator"></div>

            <div className="mid-nav">
              <h4 className="sub-header">TAGS</h4>
              <input className="myTags" placeholder="Loving" type="text" disabled />
              <input className="myTags" placeholder="Caring" type="text" disabled />
              <input className="myTags" placeholder="Cat-lover" type="text" disabled />
            </div>

            <div className="bot-nav">
              <a className="profile" href="#" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>My Profile</a>
            </div>
          </div>
        </aside>

        <section className="middle">
          <form id="postForm" className="create-post" encType="multipart/form-data">
            <div className="dp-container">
              <div className="profile-picture">
                <img className="myProfilePic" src="/assets/gifs/loading.gif" alt="" />
              </div>
            </div>

            <div className="inputs">
              <div className="upper-part">
                <input id="createPost" type="text" placeholder="Loading webpage..." />
              </div>
              <div id="postImagesCont" className="post-images">
                <div data-post-img-item="0" className="post-image-cont">
                  <img className="post-img" style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="0" className="fa-regular fa-trash-can"></i>
                </div>
                <div data-post-img-item="1" className="post-image-cont">
                  <img style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="1" className="fa-regular fa-trash-can"></i>
                </div>
                <div data-post-img-item="2" className="post-image-cont">
                  <img style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="2" className="fa-regular fa-trash-can"></i>
                </div>
                <div data-post-img-item="3" className="post-image-cont">
                  <img style={{ background: 'white' }} src="" alt="" />
                  <i data-delete-img="3" className="fa-regular fa-trash-can"></i>
                </div>
              </div>
              <p className="error"></p>
              <div className="lower-part">
                <div className="file-uploads">
                  <label htmlFor="pic-upload" className="label-upload-pic">
                    <i className="fa-solid fa-image"></i>
                  </label>
                  <input id="pic-upload" type="file" accept="image/*" />
                  <label htmlFor="vid-upload" className="label-upload-pic">
                    <i className="fa-solid fa-video"></i>
                  </label>
                  <input id="pic-upload" type="file" accept="image/*" />
                  <label htmlFor="emoji-upload" className="label-upload-pic">
                    <i className="fa-regular fa-face-smile"></i>
                  </label>
                  <input id="emoji-upload" type="file" accept="image/*" />
                </div>
                <button type="submit" id="postNow" className="btn btn-primary">Post</button>
                <p className="warning">You need to enter input first!</p>
              </div>
            </div>
          </form>

          <div className="feeds" id="feeds"></div>
        </section>

        <aside className="right-sidebar">
          <div className="following-container">
            <h4>Following</h4>
            <div className="line-separator"></div>
            <div id="followingProfiles" className="following-profiles-cont"></div>
          </div>

          <footer className="footer">
            <ul className="additional-settings">
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>About Us</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Terms and Services</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Hannah AI</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Services</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Privacy Center</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Developers</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Terms</a></li>
              <li><a href="#" className="ul-link" onClick={(e) => e.preventDefault()}>Help</a></li>
            </ul>
            <div className="copyright">© 2024 HannApp</div>
          </footer>
        </aside>

        <div className="comment-section">
          <div className="card">
            <div className="comment-header">
              <h3>Comments</h3>
              <button id="closeCommentModal" className="btn">X</button>
            </div>

            <div id="commentContainer" className="comment-container"></div>

            <div className="comment-field search-bar">
              <img className="myProfilePic" src="/assets/gifs/loading.gif" alt="" />
              <input id="setComment" type="text" placeholder="Add a comment..." />
              <button className="send-message"><i className="fa-regular fa-paper-plane"></i></button>
            </div>
          </div>
        </div>

        <div className="profile-modal">
          <a className="profile" href="#" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
            <div className="profile-picture">
              <img className="myProfilePic" src="/assets/gifs/loading.gif" alt="" />
            </div>
            <div className="handle">
              <h4 className="profile_name">Loading...</h4>
              <p className="user_name text-muted">Loading...</p>
            </div>
          </a>
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings?entry_point=account_settings'); }} className="menu-item">
              <span><i className="fa-solid fa-wrench"></i></span>
              <h3>Account Settings</h3>
            </a>
            <div id="logout_btn" className="menu-item">
              <span><i className="fa-solid fa-right-from-bracket"></i></span>
              <h3>Log Out</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
