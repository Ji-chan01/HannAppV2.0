import { useState } from 'react';

type SettingSection = 'name' | 'username' | 'password';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('name');

  const navLinks: { key: SettingSection; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'password', label: 'Password' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white py-8 px-4">
      <main className="main-container max-w-4xl mx-auto">

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text
            bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 m-0">
            Account Settings
          </h1>
        </header>

        {/* Options Section */}
        <section className="option-section">
          <h1 className="text-lg font-semibold text-gray-300 mb-6">Select your options</h1>

          <section className="sub-container flex gap-6">

            {/* Left Navigation */}
            <div className="option-container w-52 shrink-0">
              <ul className="ul-links list-none p-0 m-0 flex flex-col gap-1">
                {navLinks.map(({ key, label }) => (
                  <li key={key}>
                    <button
                      onClick={() => setActiveSection(key)}
                      className={`ul-link w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${activeSection === key
                          ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Form Panel */}
            <section className="option flex-1">

              {/* Name Section */}
              {activeSection === 'name' && (
                <div className="name rounded-2xl border border-white/10 bg-[#16172a] p-6 space-y-4 shadow-xl">
                  <h2 className="text-base font-bold text-white mb-4">Change Name</h2>
                  <input
                    id="f_name"
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <input
                    id="l_name"
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <input
                    id="pword"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                      text-white font-semibold text-sm hover:from-purple-500 hover:to-indigo-500
                      transition-all duration-200 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* Username Section */}
              {activeSection === 'username' && (
                <div className="username rounded-2xl border border-white/10 bg-[#16172a] p-6 space-y-4 shadow-xl">
                  <h2 className="text-base font-bold text-white mb-4">Change Username</h2>
                  <input
                    id="u_name"
                    type="text"
                    placeholder="Username"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <input
                    id="pword2"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                      text-white font-semibold text-sm hover:from-purple-500 hover:to-indigo-500
                      transition-all duration-200 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* Password Section */}
              {activeSection === 'password' && (
                <div className="password rounded-2xl border border-white/10 bg-[#16172a] p-6 space-y-4 shadow-xl">
                  <h2 className="text-base font-bold text-white mb-4">Change Password</h2>
                  <input
                    type="text"
                    placeholder="Current Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <input
                    type="text"
                    placeholder="New Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <input
                    id="pword2"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-gray-500 outline-none focus:border-purple-400 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                      text-white font-semibold text-sm hover:from-purple-500 hover:to-indigo-500
                      transition-all duration-200 active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </section>
          </section>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
