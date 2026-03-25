import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, Bug, Briefcase, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPaths";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.CONTACT.SUBMIT, formData);
      toast.success(response.data.message || "Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      value: "support@ebookcreator.com",
      available: "24/7",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm PST",
      value: "+1 (555) 123-4567",
      available: "Mon-Fri, 9AM-6PM PST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters",
      value: "123 Innovation Drive, San Francisco, CA 94102",
      available: "By appointment only",
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "Average response time",
      value: "Within 24 hours",
      available: "",
    },
  ];

  const topics = [
    {
      icon: MessageCircle,
      title: "General Inquiries",
      description: "Questions about our service",
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Help with using the platform",
    },
    {
      icon: Bug,
      title: "Bug Reports",
      description: "Report issues or errors",
    },
    {
      icon: Briefcase,
      title: "Business Inquiries",
      description: "Partnerships and collaborations",
    },
  ];

  const faqs = [
    {
      question: "What are your support hours?",
      answer: "Our support team is available Monday through Friday, 9 AM to 6 PM PST. We typically respond within 24 hours.",
    },
    {
      question: "How can I get a refund?",
      answer: "We offer a 7-day money-back guarantee for first-time subscribers. Contact our support team to request a refund.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.",
    },
    {
      question: "How do I report a bug?",
      answer: "Use the contact form above and select 'Bug Reports' as the subject. Please include steps to reproduce the issue.",
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-28 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-8">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-4">
            Have questions? We'd love to hear from you. Our team is here to help!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-4">
                  <info.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{info.description}</p>
                <p className="text-violet-600 font-medium text-sm">{info.value}</p>
                {info.available && (
                  <p className="text-xs text-gray-400 mt-2">{info.available}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                {/* Topic Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What can we help you with?
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {topics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => setFormData({ ...formData, subject: topic.title })}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          formData.subject === topic.title
                            ? "border-violet-500 bg-violet-50"
                            : "border-gray-200 hover:border-violet-300"
                        }`}
                      >
                        <topic.icon className={`w-5 h-5 ${
                          formData.subject === topic.title ? "text-violet-600" : "text-gray-500"
                        }`} />
                        <div>
                          <p className={`text-sm font-medium ${
                            formData.subject === topic.title ? "text-violet-900" : "text-gray-900"
                          }`}>{topic.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief description of your inquiry"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="How can we help you today?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Topics */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link to="/faq" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-violet-600">FAQ</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                  </Link>
                  <Link to="/privacy" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-violet-600">Privacy Policy</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                  </Link>
                  <Link to="/terms" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-violet-600">Terms of Service</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                  </Link>
                  <Link to="/refund" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-violet-600">Refund Policy</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                  </Link>
                  <Link to="/about" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-violet-600">About Us</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600" />
                  </Link>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            expandedFaq === index ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      {expandedFaq === index && (
                        <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
                <Link
                  to="/faq"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700 font-medium"
                >
                  View all FAQs
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <p className="text-violet-100 text-sm mb-4">
                  Stay updated with our latest news and features.
                </p>
                <div className="flex gap-3">
                  <a href="https://twitter.com" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://github.com" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUsPage;
