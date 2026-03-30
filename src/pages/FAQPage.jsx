import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/landing/Footer';

const faqData = [
    {
        question: "How does the AI-powered writing assistant work?",
        answer: "Our AI assistant helps you generate ideas, outlines, and content for your ebook. You can provide prompts or topics, and the AI will help you develop your chapters. It's designed to overcome writer's block and speed up your writing process."
    },
    {
        question: "What file formats can I export my ebook to?",
        answer: "You can export your ebook to PDF and DOCX formats. These are the most popular formats for publishing and sharing your content."
    },
    {
        question: "Is my content secure and private?",
        answer: "Yes, absolutely. We take data security seriously. Your content is stored securely and only accessible to you. We never share your work with third parties without your explicit consent."
    },
    {
        question: "Can I edit my ebook after creating it?",
        answer: "Yes, you can edit your ebook at any time. Your drafts are saved automatically, and you can return to the editor to make changes whenever you need to."
    },
    {
        question: "Do I need to install any software to use this platform?",
        answer: "No, our platform is completely web-based. You can access it from any modern web browser without installing any software. Just log in and start creating!"
    },
    {
        question: "Can I collaborate with others on my ebook?",
        answer: "Currently, our platform is designed for individual creators. However, you can export your work and share it with collaborators who can then import it into their own tools."
    },
    {
        question: "What kind of support is available?",
        answer: "We offer email support through our Contact Us page. Our team is happy to help with any questions or issues you might encounter while using our platform."
    },
    {
        question: "Is there a limit on how many ebooks I can create?",
        answer: "There's no limit on the number of ebooks you can create. You can create as many as you like and manage them all from your personal dashboard."
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-white">
                {/* Header Section */}
                <div className="relative py-20 px-6 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl"></div>
                        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-violet-200/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-100 shadow-sm mb-6">
                            <HelpCircle className="w-5 h-5 text-violet-600" />
                            <span className="text-sm font-semibold text-violet-900">FAQ</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6">
                            Frequently Asked
                            <span className="block mt-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                Questions
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Find answers to common questions about our ebook creation platform.
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto px-6 pb-20">
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div 
                                key={index}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="text-lg font-semibold text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-6 h-6 text-violet-600 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ${
                                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-16 text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100">
                            <MessageCircle className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Still have questions?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Can't find what you're looking for? Our support team is here to help.
                            </p>
                            <a 
                                href="/contact"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FAQPage;