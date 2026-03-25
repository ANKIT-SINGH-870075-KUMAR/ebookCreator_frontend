import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Users, Award, Zap, Shield, Globe, Heart } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";

const AboutUsPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: BookOpen, value: "50,000+", label: "eBooks Created" },
    { icon: Users, value: "25,000+", label: "Active Users" },
    { icon: Award, value: "4.9/5", label: "User Rating" },
    { icon: Globe, value: "150+", label: "Countries" },
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former publishing executive with 15 years in the digital content industry.",
      image: null,
    },
    {
      name: "Sarah Chen",
      role: "Head of AI",
      bio: "AI researcher specializing in natural language processing and content generation.",
      image: null,
    },
    {
      name: "Michael Roberts",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in modern web technologies.",
      image: null,
    },
    {
      name: "Emily Davis",
      role: "UX Director",
      bio: "Award-winning designer focused on creating intuitive user experiences.",
      image: null,
    },
  ];

  const values = [
    {
      icon: Sparkles,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible with AI-powered tools.",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Your data security and privacy are our top priorities.",
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Every feature is designed with our users' needs at the forefront.",
    },
    {
      icon: Zap,
      title: "Efficiency",
      description: "We help you create more in less time with powerful automation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <Navbar />
      {/* Hero Section */}
      <section className={`relative pt-24 pb-16 lg:pt-32 lg:py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-violet-100 px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">About Our Company</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Empowering Writers with
              <span className="block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Innovation
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              We're on a mission to democratize publishing by making eBook creation accessible, 
              efficient, and enjoyable for everyone—from aspiring authors to seasoned professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-100 rounded-xl mb-4">
                  <stat.icon className="w-7 h-7 text-violet-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  eBook Creator was founded in 2024 with a simple vision: to remove the barriers 
                  that prevent talented writers from sharing their stories with the world.
                </p>
                <p>
                  We recognized that traditional eBook creation required expensive software, 
                  technical expertise, and countless hours of formatting and design work. Our 
                  team set out to change that.
                </p>
                <p>
                  By leveraging cutting-edge artificial intelligence, we've created a platform 
                  that generates professional-quality content in minutes, not months. Our AI 
                  doesn't just write—it understands context, maintains consistency, and adapts 
                  to your unique voice and style.
                </p>
                <p>
                  Today, we're proud to serve over 25,000 active users across 150+ countries, 
                  helping them bring their literary visions to life.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl opacity-10 blur-2xl"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  "To empower every person with the tools and technology to become a published 
                  author, regardless of their technical background or writing experience."
                </p>
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    "To be the world's most accessible and user-friendly eBook creation platform, 
                    where creativity meets technology to unlock infinite possibilities."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A passionate group of writers, developers, and innovators dedicated to transforming the publishing industry.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-32 bg-gradient-to-br from-violet-500 to-purple-600"></div>
                <div className="p-6 -mt-12 relative">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-bold text-violet-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center">{member.name}</h3>
                  <p className="text-violet-600 text-sm text-center mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm text-center">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Publishing Journey?
          </h2>
          <p className="text-xl text-violet-100 mb-10">
            Join thousands of writers who have already discovered the future of eBook creation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-violet-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-violet-700 text-white rounded-xl font-semibold border-2 border-violet-400 hover:bg-violet-800 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUsPage;
