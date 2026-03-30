import {Lightbulb, BookOpen, Download, Library } from "lucide-react";

export const FEATURES = [
    {
        title: "AI-Powered Writing",
        description: "Overcome writer's block with our smart assistant that helps you generate ideas, outlines, and content.",
        icon: Lightbulb,
        gradient: "from-violet-500 to-purple-600",
    },
    {
        title: "Immersive Reader",
        description: "Preview your ebook in a clean, read-only format. Adjust font sizes for a comfortable reading experience before you export.",
        icon: BookOpen,
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        title: "One-Click Export",
        description: "Export your ebook to PDF, and DOCX formats instantly, ready for publishing",
        icon: Download,
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        title: "eBook Management",
        description: "Organize all your ebook projects in a personal dashboard. Easily track progress, edit drafts, and manage your library",
        icon: Library,
        gradient: "from-pink-500 to-rose-600",
    },
];

export const TESTIMONIALS = [
    {
        quote: 'This platform made it so easy to write and publish my first ebook. The AI assistant is a game-changer',
        author: 'Sarah Johnson',
        title: 'Bestselling Author',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        rating: 5,
    },
    {
        quote: 'I love the customizable templates. I was able to create a beautiful ebook that matches my brand perfectly',
        author: 'Michael Chen',
        title: 'Marketing Expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 5,
    },
    {
        quote: 'The one-click export feature saved me so much time. I was able to publish my ebook on multiple platforms in minutes.',
        author: 'Emily Rodriguez',
        title: 'Indie Publisher',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 5,
    }
];