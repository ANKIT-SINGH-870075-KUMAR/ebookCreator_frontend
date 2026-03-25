import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, Mail, ChevronDown } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";

const PrivacyPolicyPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sections = [
    {
      title: "1. Introduction",
      content: `At eBook Creator, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and application.

Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our service.`,
    },
    {
      title: "2. Information We Collect",
      content: `We collect information to provide better services to all our users. This includes:

**Personal Information:**
- Name and email address when you register for an account
- Profile information you provide
- Payment information for premium services
- Communications you have with us

**Automatically Collected Information:**
- Device information (device type, operating system, browser)
- Usage data (features used, time spent on platform)
- IP address and location data
- Cookies and similar tracking technologies`,
    },
    {
      title: "3. How We Use Your Information",
      content: `We use the information we collect to:

**Provide and Maintain Services:**
- Create and manage your account
- Process your transactions
- Provide customer support
- Send you service-related notifications

**Improve and Develop Services:**
- Analyze usage patterns to improve user experience
- Develop new features and functionality
- Conduct research and analytics

**Communicate With You:**
- Respond to your comments and questions
- Send you technical notices and updates
- Send you marketing communications (with your consent)

**For Security and Legal Purposes:**
- Detect, prevent, and address fraud and abuse
- Comply with legal obligations
- Enforce our terms and policies`,
    },
    {
      title: "4. Information Sharing and Disclosure",
      content: `We may share your information in the following circumstances:

**Service Providers:**
We share information with third-party vendors who help us operate our business and provide services, including:
- Cloud hosting services (data storage)
- Payment processors
- Email and communication services
- Analytics providers

**Business Transfers:**
If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.

**Legal Requirements:**
We may disclose your information when required by law or in response to valid requests by public authorities.

**With Your Consent:**
We may share your information with third parties when you have given us your consent to do so.`,
    },
    {
      title: "5. Data Security",
      content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

**Security Measures Include:**
- SSL/TLS encryption for data in transit
- Encryption of sensitive data at rest
- Regular security audits and assessments
- Access controls and authentication requirements
- Employee training on data protection

While we strive to protect your personal information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`,
    },
    {
      title: "6. Data Retention",
      content: `We will retain your personal information only for as long as is necessary for the purposes set out in this privacy policy.

**Account Information:**
We retain your account information for as long as your account is active and for up to 2 years after you close your account, unless otherwise required by law.

**Usage Data:**
We retain aggregated and anonymized usage data for analytics purposes indefinitely.

**Legal Obligations:**
We may retain certain information when required by law or for legitimate business purposes.`,
    },
    {
      title: "7. Your Rights and Choices",
      content: `You have certain rights regarding your personal information:

**Access and Portability:**
You can request a copy of the personal information we hold about you.

**Correction:**
You can request correction of inaccurate personal information.

**Deletion:**
You can request deletion of your personal information, subject to certain exceptions.

**Opt-Out:**
You can opt out of receiving marketing communications from us by following the unsubscribe instructions in those communications.

**Cookie Preferences:**
You can control cookies through your browser settings.

To exercise these rights, please contact us at privacy@ebookcreator.com.`,
    },
    {
      title: "8. Children's Privacy",
      content: `Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover that we have collected personal information from a child under 13 without parental consent, we will delete that information promptly.`,
    },
    {
      title: "9. Third-Party Links",
      content: `Our service may contain links to third-party websites, services, or applications that are not owned or controlled by eBook Creator.

We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites or services you visit.

When you click on third-party links, you may be directed to their websites. We recommend reading the privacy policies of those websites.`,
    },
    {
      title: "10. Changes to This Policy",
      content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "last modified" date at the top.

We encourage you to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.

If we make material changes to this privacy policy, we will provide you with notice through the Service or by email.`,
    },
    {
      title: "11. Contact Us",
      content: `If you have any questions about this Privacy Policy, please contact us:

**Email:** privacy@ebookcreator.com
**Mailing Address:**
eBook Creator Inc.
123 Innovation Drive
San Francisco, CA 94102
United States

We will respond to your inquiry within 30 days.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <Navbar />
      {/* Hero Section */}
      <section className={`relative pt-24 pb-16 lg:pt-28 lg:pb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: March {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Link to="/terms" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Lock className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Terms of Service</span>
            </Link>
            <Link to="/refund" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Database className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Refund Policy</span>
            </Link>
            <Link to="/contact" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Mail className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Contact Us</span>
            </Link>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{section.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openSections[index] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSections[index] && (
                  <div className="px-5 pb-5">
                    <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
