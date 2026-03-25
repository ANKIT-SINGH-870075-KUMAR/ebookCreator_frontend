import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, CreditCard, Clock, Shield, Mail, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";

const RefundPolicyPage = () => {
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
      title: "1. Overview",
      content: `This Refund Policy outlines the terms and conditions for refunds on eBook Creator subscriptions and services. By using our Service, you agree to this Refund Policy.

We strive to provide high-quality services, and we want you to be completely satisfied with your purchase. This policy is designed to be fair and transparent.`,
    },
    {
      title: "2. Free Trial",
      content: `**Free Tier:**
- eBook Creator offers a free tier with limited features
- No payment is required to start using the free tier
- The free tier allows you to explore the platform before subscribing

**Premium Trial:**
- We may offer a limited-time premium trial for new users
- Trial periods are specified at the time of signup
- You will be charged after the trial period ends unless you cancel
- Canceling during the trial period incurs no charges`,
    },
    {
      title: "3. Paid Subscriptions - 7-Day Money-Back Guarantee",
      content: `**7-Day Money-Back Guarantee:**
- We offer a 7-day money-back guarantee for first-time subscribers
- If you're not satisfied with our Service, you can request a full refund within 7 days of your first payment
- This guarantee applies only to your first subscription purchase
- To request a refund, contact our support team within 7 days

**How to Request:**
1. Contact us at support@ebookcreator.com
2. Provide your registered email address and order details
3. Explain the reason for your refund request
4. We will process your refund within 5-7 business days`,
    },
    {
      title: "4. Annual Subscription Refunds",
      content: `**Annual Plans:**
- Annual subscriptions are charged at a discounted rate
- Refunds for annual plans are calculated on a pro-rated monthly basis
- The first 7 days qualify for a full refund
- After 7 days, refunds are calculated based on unused months

**Pro-Rated Refund Calculation:**
- Refund = (Total Paid - (Months Used × Monthly Rate)) - Processing Fee
- Minimum months used: 1 month
- Processing fee: $10 USD

**Example:**
If you purchased an annual plan ($120) and cancel after 3 months:
Refund = $120 - (3 × $15) - $10 = $65`,
    },
    {
      title: "5. Monthly Subscription Refunds",
      content: `**Monthly Plans:**
- Monthly subscriptions are billed in advance
- The 7-day money-back guarantee applies to first-time monthly subscribers

**After 7 Days:**
- Monthly subscriptions are non-refundable after the initial 7-day period
- You may cancel at any time to stop future billing
- No partial refunds for unused days in a billing cycle

**Cancellation:**
- You can cancel your subscription at any time from your account settings
- Your access will continue until the end of your current billing period
- No charges will occur after cancellation`,
    },
    {
      title: "6. Non-Refundable Items",
      content: `The following are non-refundable:

**AI Generation Credits:**
- Once used, AI generation credits cannot be refunded
- Unused credits expire at the end of your billing cycle

**One-Time Purchases:**
- Any one-time purchases (if available) are final
- This includes premium templates and add-ons

**Third-Party Fees:**
- Payment processing fees are non-refundable
- Currency conversion fees are non-refundable

**Promotional/Discounted Purchases:**
- Purchases made with promotional discounts may have limited refund eligibility
- Special promotional pricing is final unless otherwise stated`,
    },
    {
      title: "7. Refund Process",
      content: `**Requesting a Refund:**
1. Email support@ebookcreator.com with your request
2. Include your account email and order number (if available)
3. Specify the reason for the refund request

**Processing Time:**
- Refunds are processed within 5-7 business days
- After processing, it may take 5-10 business days for the refund to appear in your account

**Refund Method:**
- Refunds are issued to the original payment method
- If the original payment method is unavailable, we will contact you for alternative arrangements

**Confirmation:**
- You will receive an email confirmation once your refund is processed`,
    },
    {
      title: "8. Account Termination and Refunds",
      content: `**Voluntary Account Deletion:**
- If you delete your account, no refunds will be provided
- Deletion does not automatically trigger a refund

**Account Suspension/Termination:**
- Accounts suspended for Terms of Service violations are not eligible for refunds
- No refunds will be provided for terminated accounts due to policy violations

**Inactive Accounts:**
- Accounts inactive for 12+ months may be terminated
- Terminated inactive accounts are not eligible for refunds`,
    },
    {
      title: "9. Disputes and Chargebacks",
      content: `**Dispute Resolution:**
- We encourage you to contact us before initiating a dispute
- Most issues can be resolved through our support team

**Chargebacks:**
- Initiating a chargeback may result in account suspension
- We will contest all unwarranted chargebacks
- Successful chargebacks may result in account termination

**Documentation:**
- We maintain detailed transaction records
- We may provide documentation to support our case in disputes`,
    },
    {
      title: "10. Changes to Refund Policy",
      content: `We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated "Last Modified" date.

If we make material changes, we will provide notice through:
- Email notification to registered users
- In-app notification

Your continued use of the Service after changes constitutes acceptance of the new Refund Policy.`,
    },
    {
      title: "11. Contact Information",
      content: `For refund requests or questions about this policy, please contact us:

**Email:** support@ebookcreator.com

**Billing Inquiries:** billing@ebookcreator.com

**Mailing Address:**
eBook Creator Inc.
123 Innovation Drive
San Francisco, CA 94102
United States

We typically respond within 24-48 business hours.`,
    },
  ];

  const eligibility = [
    { eligible: true, description: "First-time subscribers requesting within 7 days" },
    { eligible: true, description: "Technical issues preventing Service use" },
    { eligible: false, description: "Used AI credits after purchase" },
    { eligible: false, description: "Monthly subscription after 7-day period" },
    { eligible: false, description: "Account termination due to violations" },
    { eligible: false, description: "Promotional/discounted purchases" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <Navbar />
      {/* Hero Section */}
      <section className={`relative pt-24 pb-16 lg:pt-28 lg:py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-8">
            <RefreshCw className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Refund Policy
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-4">
            We want you to be completely satisfied with eBook Creator.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: March {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <Clock className="w-8 h-8 text-violet-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">7-Day Guarantee</h3>
              <p className="text-sm text-gray-500">Money-back for first-time subscribers</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <CreditCard className="w-8 h-8 text-violet-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Easy Process</h3>
              <p className="text-sm text-gray-500">Refund within 5-7 business days</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <Shield className="w-8 h-8 text-violet-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Secure</h3>
              <p className="text-sm text-gray-500">Original payment method refund</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-8 pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Link to="/privacy" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CreditCard className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Privacy Policy</span>
            </Link>
            <Link to="/terms" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CreditCard className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Terms of Service</span>
            </Link>
            <Link to="/contact" className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Mail className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-gray-900">Contact Us</span>
            </Link>
          </div>

          {/* Eligibility Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Refund Eligibility</h2>
            <div className="space-y-3">
              {eligibility.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-700">{item.description}</span>
                  {item.eligible ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> Eligible
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <XCircle className="w-4 h-4" /> Not Eligible
                    </span>
                  )}
                </div>
              ))}
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

export default RefundPolicyPage;
