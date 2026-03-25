import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";

const TermsAndConditionsPage = () => {
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
      title: "1. Acceptance of Terms",
      content: `By accessing and using eBook Creator ("Service"), you accept and agree to be bound by the terms and provision of this agreement.

Additionally, when using eBook Creator's services, you shall be subject to any posted guidelines or rules applicable to such services.

The Service is owned and operated by eBook Creator Inc. ("Company," "we," or "us"). Your use of the Service constitutes your agreement to these Terms of Service ("Terms").

If you do not agree to these Terms, you should not use our Service.`,
    },
    {
      title: "2. Description of Service",
      content: `eBook Creator is an AI-powered web application that enables users to create, manage, and export eBooks. The Service includes:

**Core Features:**
- AI-powered book outline generation
- AI-powered chapter content creation
- Book cover image generation
- Markdown-based content editing
- PDF and DOCX export functionality
- User account management

You are responsible for obtaining access to the Service, and that access may involve third-party fees (such as internet service provider or airtime charges). You are also responsible for all equipment necessary to access the Service.`,
    },
    {
      title: "3. User Eligibility and Registration",
      content: `**Eligibility:**
- You must be at least 13 years of age to use our Service
- If you are under 18, you must have parental or guardian consent
- You must provide accurate and complete registration information

**Account Responsibilities:**
- You are responsible for maintaining the confidentiality of your account and password
- You agree to accept responsibility for all activities that occur under your account
- You must notify us immediately of any unauthorized use of your account
- You may not share your account credentials with others

**Account Types:**
- Free Tier: Basic features with limited AI generations
- Premium Tier: Full access to all features (subject to fair use)`,
    },
    {
      title: "4. User Conduct and Content",
      content: `**Acceptable Use:**
You agree not to use the Service to:
- Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, or discriminatory
- Harass, defame, or intimidate others
- Publish false or misleading information
- Infringe upon intellectual property rights
- Distribute viruses or malicious code
- Attempt to gain unauthorized access to the Service

**User-Generated Content:**
- You retain ownership of content you create using our Service
- You grant us a license to use your content for providing and improving our Service
- You represent and warrant that you have all rights to the content you create
- You are responsible for backing up your content`,
    },
    {
      title: "5. AI-Generated Content",
      content: `**Content Ownership:**
- AI-generated content is provided to assist your creative process
- You retain full ownership of AI-generated content you edit and finalize
- You may use AI-generated content for personal and commercial purposes

**Limitations:**
- AI-generated content may not be unique and may resemble other works
- We do not guarantee the accuracy, completeness, or usefulness of AI content
- You are responsible for reviewing and editing AI-generated content
- AI content should not be presented as wholly original work without human contribution

**Fair Use:**
- AI features are subject to fair use limitations
- Excessive use of AI features may result in rate limiting
- We reserve the right to modify AI service availability`,
    },
    {
      title: "6. Payment and Subscription",
      content: `**Pricing:**
- Subscription plans are billed in advance on a monthly or annual basis
- Prices are subject to change with 30 days' notice
- All fees are non-refundable except as specifically stated in our Refund Policy

**Premium Features:**
- Some features require a premium subscription
- Premium features are identified within the application
- We reserve the right to modify feature availability

**Payment Processing:**
- Payments are processed through secure third-party providers
- You authorize us to charge your payment method for all fees
- Failed payments may result in service suspension`,
    },
    {
      title: "7. Intellectual Property Rights",
      content: `**Our Rights:**
- The Service, including all content, software, and materials, is owned by us and protected by copyright, trademark, and other laws
- Our name, logo, and all related trademarks are our exclusive property
- You may not copy, modify, distribute, sell, or lease any part of our Service

**Your Rights:**
- You retain ownership of original content you create
- You grant us a limited license to use your content for Service operation
- AI-generated content can be used freely after human editing

**Third-Party Materials:**
- Some content may be provided by third parties
- Third-party content is subject to their respective licenses`,
    },
    {
      title: "8. Disclaimer of Warranties",
      content: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

- The accuracy, completeness, or reliability of content
- The uninterrupted or error-free operation of the Service
- The quality or merchantability of any products or services
- The fitness for a particular purpose

YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.`,
    },
    {
      title: "9. Limitation of Liability",
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:

- Indirect, incidental, consequential, or punitive damages
- Loss of profits, data, or business opportunities
- Damages resulting from your use or inability to use the Service
- Damages resulting from any content posted by users
- Costs of procurement of substitute services

OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

This limitation applies regardless of the theory of liability.`,
    },
    {
      title: "10. Indemnification",
      content: `You agree to indemnify, defend, and hold harmless eBook Creator Inc., its officers, directors, employees, and agents from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:

- Your use of the Service
- Your violation of these Terms
- Your violation of any third-party rights
- Your content or user-generated content
- Your interaction with other users`,
    },
    {
      title: "11. Termination",
      content: `**Termination by You:**
- You may cancel your subscription at any time
- You may delete your account through your account settings
- Upon deletion, your right to use the Service ceases immediately

**Termination by Us:**
- We may terminate your account for violation of these Terms
- We may suspend access to the Service for investigation
- We may terminate accounts that are inactive for more than 12 months

**Effect of Termination:**
- Upon termination, your right to use the Service ends
- We may delete your content within 30 days of termination
- Provisions that should survive termination will remain in effect`,
    },
    {
      title: "12. Governing Law and Disputes",
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.

**Dispute Resolution:**
- Any dispute arising from these Terms will be resolved through binding arbitration
- Arbitration will be conducted in San Francisco, California
- You waive any right to participate in class actions

**Exceptions:**
- We may seek injunctive relief in any court of competent jurisdiction
- Claims under $1,000 may be resolved in small claims court

If you have any concerns, please contact us first to try to resolve the issue informally.`,
    },
    {
      title: "13. Changes to Terms",
      content: `We reserve the right to modify these Terms at any time. We will provide notice of material changes by:

- Posting the updated Terms on our website
- Sending an email to your registered address
- Providing in-app notification

Your continued use of the Service after such changes constitutes acceptance of the new Terms. If you do not agree to the new Terms, you should stop using the Service.

The most current version of these Terms will be posted on this page.`,
    },
    {
      title: "14. Contact Information",
      content: `If you have any questions about these Terms, please contact us:

**Email:** legal@ebookcreator.com

**Mailing Address:**
eBook Creator Inc.
123 Innovation Drive
San Francisco, CA 94102
United States

We will respond to your inquiry within 30 business days.`,
    },
  ];

  const dos = [
    "Keep your account credentials confidential",
    "Review AI-generated content before publishing",
    "Back up your important work regularly",
    "Report any security vulnerabilities you discover",
    "Comply with all applicable laws when using the Service",
  ];

  const donts = [
    "Share your account with others",
    "Use the Service for unlawful purposes",
    "Attempt to hack or disrupt the Service",
    "Submit false or misleading content",
    "Resell or redistribute AI-generated content without modification",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <Navbar />
      {/* Hero Section */}
      <section className={`relative pt-24 pb-16 lg:pt-28 lg:py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-8">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Please read these terms carefully before using our Service.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: March {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Link to="/privacy" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <FileText className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Privacy Policy</span>
            </Link>
            <Link to="/refund" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <FileText className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Refund Policy</span>
            </Link>
            <Link to="/contact" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <FileText className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-8 pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Do's */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                You Should
              </h3>
              <ul className="space-y-3">
                {dos.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                You Should Not
              </h3>
              <ul className="space-y-3">
                {donts.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-700">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
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

export default TermsAndConditionsPage;
