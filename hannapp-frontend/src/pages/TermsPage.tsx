import { useNavigate } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: (
        <>
          By accessing or using <b>HannApp</b>, you agree to be bound by these Terms and any future updates or
          amendments. If you do not agree to these Terms, do not use our Service. You must also comply with all
          applicable laws and regulations governing the use of the Service.
        </>
      ),
    },
    {
      title: '2. Eligibility',
      content: (
        <>
          To use <b>HannApp</b>, you must be at least 13 years old. If you are under 18 years old, you must have
          the permission of a parent or legal guardian to use the Service. By agreeing to these Terms, you
          represent and warrant that you meet the eligibility requirements.
        </>
      ),
    },
    {
      title: '3. Account Registration',
      content: (
        <>
          In order to use <b>HannApp</b>, you must create an account by providing accurate and complete information.
          You are responsible for maintaining the confidentiality of your account information, including your username
          and password. You agree to notify us immediately if you suspect any unauthorized access to your account.
        </>
      ),
    },
    {
      title: '4. User Content',
      content: (
        <>
          <b>HannApp</b> allows users to post, share, and interact with content. You retain ownership of the content
          you upload, but by submitting content to <b>HannApp</b>, you grant us a non-exclusive, worldwide,
          royalty-free license to use, display, modify, and distribute your content on the platform. You are solely
          responsible for the content you post and for ensuring that it complies with these Terms.
        </>
      ),
    },
    {
      title: '5. Content Guidelines',
      content: (
        <>
          <p className="text-gray-300 mb-3">Users are expected to respect others and follow our content guidelines:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 mb-3">
            <li>Do not post content that is illegal, offensive, defamatory, or harmful.</li>
            <li>No hate speech, harassment, or threats of violence.</li>
            <li>No spam, phishing, or deceptive activities.</li>
            <li>No infringement of intellectual property rights, including copyrighted content, trademarks, or patents.</li>
          </ul>
          <p className="text-gray-300">
            We reserve the right to remove any content that violates these guidelines and suspend or terminate user accounts.
          </p>
        </>
      ),
    },
    {
      title: '6. Privacy and Data Protection',
      content: (
        <>
          We value your privacy. For information about how we collect, use, and protect your personal data, please
          refer to our{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
            Privacy Policy
          </a>
          . By using <b>HannApp</b>, you consent to our data collection and processing practices.
        </>
      ),
    },
    {
      title: '7. Acceptable Use',
      content: (
        <>
          <p className="text-gray-300 mb-3">You agree not to use <b>HannApp</b> for:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Engaging in activities that are illegal or harmful to others.</li>
            <li>Attempting to gain unauthorized access to the platform or other users' accounts.</li>
            <li>Using the platform for unauthorized commercial purposes, including selling or advertising products without our consent.</li>
            <li>Interfering with the functionality or security of <b>HannApp</b>.</li>
          </ul>
        </>
      ),
    },
    {
      title: '8. Third-Party Services',
      content: (
        <>
          <b>HannApp</b> may contain links to third-party websites or services. These links are provided for your
          convenience, and we do not endorse or have control over the content, privacy practices, or terms of those
          third-party services. Use of third-party services is at your own risk.
        </>
      ),
    },
    {
      title: '9. Termination and Suspension',
      content: (
        <>
          We reserve the right to suspend or terminate your account at any time if you violate these Terms or engage
          in activities that harm the platform or other users. Upon termination, you will lose access to your account
          and any content associated with it.
        </>
      ),
    },
    {
      title: '10. Disclaimers',
      content: (
        <>
          <b>HannApp</b> is provided "as is" and "as available" without warranties of any kind, either express or
          implied. We do not guarantee that the platform will always be available, secure, or error-free. We disclaim
          all liability for any damages or losses resulting from your use of the Service.
        </>
      ),
    },
    {
      title: '11. Limitation of Liability',
      content: (
        <>
          To the fullest extent permitted by law, <b>HannApp</b> and its affiliates are not responsible for any
          indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
          Our total liability will not exceed the amount you paid, if any, to access <b>HannApp</b>.
        </>
      ),
    },
    {
      title: '12. Indemnity',
      content: (
        <>
          You agree to indemnify and hold harmless <b>HannApp</b>, its affiliates, officers, employees, and agents
          from any claims, losses, damages, or expenses arising from your violation of these Terms or your use of
          the platform.
        </>
      ),
    },
    {
      title: '13. Changes to the Terms',
      content: (
        <>
          We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon
          posting the updated Terms on the platform. Continued use of the platform after any changes indicates your
          acceptance of the updated Terms.
        </>
      ),
    },
    {
      title: '14. Governing Law',
      content: (
        <>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which you
          are located. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the
          courts in that jurisdiction.
        </>
      ),
    },
    {
      title: '15. Contact Information',
      content: <>If you have any questions or concerns about these Terms, please contact us at [contact email address].</>,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] py-12 px-4">
      <div className="container max-w-3xl mx-auto">

        {/* Header */}
        <div className="header text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text
            bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 mb-2">
            HannApp
          </h1>
          <p className="text-xl text-gray-300 font-medium">Terms and Conditions</p>
        </div>

        <div className="separator h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-8" />

        {/* Terms Content */}
        <div className="terms-content bg-[#16172a] rounded-2xl border border-white/10 p-8 shadow-2xl">

          <h1 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">
            Last Updated: January 1, 2025
          </h1>

          <h2 className="text-base text-gray-300 font-normal leading-relaxed mb-8 pb-6 border-b border-white/10">
            Welcome to HannApp, a social media platform designed to connect and engage individuals across the world.
            By accessing or using our services, you agree to comply with and be bound by the following terms and
            conditions. Please read these Terms carefully before using our services.
          </h2>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h1 className="text-lg font-bold text-white">{section.title}</h1>
                <div className="text-gray-300 leading-relaxed text-sm">{section.content}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 space-y-4">
            <p className="text-gray-300 text-sm">
              By using <b>HannApp</b>, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
            </p>
            <a href="mailto:support@hannapp.com" className="text-purple-400 hover:text-purple-300 text-sm underline underline-offset-2">
              support@hannapp.com
            </a>
            <p className="text-gray-400 text-sm">
              By clicking "I Accept" or using <b>HannApp</b>, you agree to these Terms and Conditions. If you do not
              agree to these Terms, do not use the platform.
            </p>
          </div>
        </div>

        {/* Accept Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/register')}
            className="accept-btn inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600
              text-white font-bold text-base hover:from-purple-500 hover:to-indigo-500
              transition-all duration-200 shadow-lg shadow-purple-900/40 active:scale-95"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
