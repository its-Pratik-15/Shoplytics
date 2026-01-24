import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    BarChart3,
    ShoppingCart,
    Users,
    TrendingUp,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight,
    Star,
    Play,
    Award,
    Globe,
    Clock,
    Smartphone,
    CreditCard,
    PieChart,
    Target,
    Sparkles,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import Logo from '../../../shared/components/ui/Logo';
import Footer from '../../../shared/components/layout/Footer';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const features = [
        {
            icon: ShoppingCart,
            title: 'Smart Point of Sale',
            description: 'Lightning-fast checkout with intelligent inventory tracking and automated stock alerts.',
            color: 'from-blue-500 to-cyan-500',
            stats: '99.9% Uptime'
        },
        {
            icon: BarChart3,
            title: 'AI-Powered Analytics',
            description: 'Get actionable insights with machine learning-driven sales forecasting and trend analysis.',
            color: 'from-purple-500 to-pink-500',
            stats: '50+ Reports'
        },
        {
            icon: Users,
            title: 'Customer Intelligence',
            description: 'Build stronger relationships with detailed customer profiles and purchase behavior analysis.',
            color: 'from-green-500 to-emerald-500',
            stats: 'Unlimited Customers'
        },
        {
            icon: TrendingUp,
            title: 'Revenue Optimization',
            description: 'Maximize profits with dynamic pricing insights and margin analysis across all products.',
            color: 'from-orange-500 to-red-500',
            stats: '30% Avg Growth'
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Bank-level encryption with role-based access control and comprehensive audit trails.',
            color: 'from-indigo-500 to-purple-500',
            stats: 'ISO 27001 Certified'
        },
        {
            icon: Zap,
            title: 'Real-time Sync',
            description: 'Instant updates across all devices with cloud-based synchronization and offline support.',
            color: 'from-yellow-500 to-orange-500',
            stats: '<100ms Response'
        }
    ];

    const testimonials = [
        {
            name: 'Rajesh Kumar',
            role: 'Store Owner, Mumbai',
            content: 'Shoplytics transformed our business! Sales increased by 40% in just 3 months with their analytics insights.',
            rating: 5,
            avatar: 'RK'
        },
        {
            name: 'Priya Sharma',
            role: 'Retail Chain Manager, Delhi',
            content: 'The best POS system we\'ve used. Customer management features are outstanding and support is excellent.',
            rating: 5,
            avatar: 'PS'
        },
        {
            name: 'Amit Patel',
            role: 'Electronics Store, Bangalore',
            content: 'Real-time inventory tracking saved us from stockouts. Revenue tracking helps us make better decisions.',
            rating: 5,
            avatar: 'AP'
        }
    ];

    const stats = [
        { number: '10,000+', label: 'Happy Merchants', icon: Users },
        { number: '₹500Cr+', label: 'Transactions Processed', icon: CreditCard },
        { number: '99.9%', label: 'Uptime Guarantee', icon: Shield },
        { number: '24/7', label: 'Expert Support', icon: Clock }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Logo size="md" showText={true} />

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
                            <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Reviews</a>
                        </nav>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100">
                            <div className="flex flex-col space-y-4">
                                <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
                                <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</a>
                                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium">Reviews</a>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold text-center"
                                >
                                    Start Free Trial
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 mb-8">
                            <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-semibold text-blue-600">India's #1 Smart POS Solution</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Transform Your
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                                Retail Business
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                            The most advanced Point of Sale system with AI-powered analytics.
                            <span className="font-semibold text-gray-800"> Increase sales by 40%</span> and streamline operations with real-time insights.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <Link
                                to="/register"
                                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center"
                            >
                                Start Free 30-Day Trial
                                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="group border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center hover:border-gray-400">
                                <Play className="mr-3 h-6 w-6 text-blue-600" />
                                Watch Demo
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                No setup fees
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                Cancel anytime
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                24/7 support
                            </div>
                        </div>
                    </div>

                    {/* Hero Image/Dashboard Preview */}
                    <div className="mt-20 relative">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 max-w-5xl mx-auto transform hover:scale-105 transition-transform duration-500">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 h-96 flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="h-24 w-24 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Dashboard Preview</h3>
                                    <p className="text-gray-600">Real-time analytics and insights at your fingertips</p>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-200 animate-bounce">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-gray-700">Live Sales</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-200 animate-pulse">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-700">+40% Growth</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-4 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
                            <Target className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-semibold text-blue-600">Powerful Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Everything You Need to
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                                Dominate Your Market
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Advanced features designed by retail experts to help you increase sales, reduce costs, and delight customers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {feature.stats}
                                    </span>
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                            <Star className="h-4 w-4 text-yellow-300 mr-2" />
                            <span className="text-sm font-semibold text-white">Customer Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Loved by 10,000+ Retailers
                            <span className="block text-blue-200">Across India</span>
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            See how businesses like yours are growing with Shoplytics
                        </p>
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20">
                            <div className="text-center">
                                <div className="flex justify-center mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
                                    "{testimonials[currentTestimonial].content}"
                                </blockquote>
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-bold text-white">
                                            {testimonials[currentTestimonial].avatar}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-lg font-bold text-white">
                                            {testimonials[currentTestimonial].name}
                                        </div>
                                        <div className="text-blue-200">
                                            {testimonials[currentTestimonial].role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial indicators */}
                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentTestimonial
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
                            <Award className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm font-semibold text-green-600">Simple Pricing</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            One Plan, Everything Included
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            No hidden fees, no surprises. Get all premium features with our transparent pricing.
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto">
                        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-200 shadow-2xl">
                            {/* Popular badge */}
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                                    Most Popular
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Plan</h3>
                                <div className="flex items-center justify-center mb-4">
                                    <span className="text-5xl font-bold text-gray-900">₹2,999</span>
                                    <span className="text-gray-600 ml-2">/month</span>
                                </div>
                                <p className="text-gray-600">Everything you need to grow your business</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    'Unlimited transactions & products',
                                    'Advanced analytics & reporting',
                                    'Multi-location support',
                                    'Customer management system',
                                    'Real-time inventory tracking',
                                    'Role-based user access',
                                    'Mobile app included',
                                    '24/7 priority support',
                                    'Free data migration',
                                    'Regular feature updates'
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/register"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg block text-center"
                            >
                                Start 30-Day Free Trial
                            </Link>

                            <div className="text-center mt-4 text-sm text-gray-500">
                                No credit card required • Cancel anytime
                            </div>
                        </div>
                    </div>

                    {/* Money back guarantee */}
                    <div className="text-center mt-16">
                        <div className="inline-flex items-center px-6 py-3 bg-green-50 rounded-full border border-green-200">
                            <Shield className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-700 font-semibold">30-Day Money Back Guarantee</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
                            <Globe className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm font-semibold text-purple-600">Seamless Integration</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Works With Your
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                                Existing Tools
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Connect with popular payment gateways, accounting software, and e-commerce platforms.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'Razorpay', icon: CreditCard },
                            { name: 'Paytm', icon: Smartphone },
                            { name: 'GST Ready', icon: Shield },
                            { name: 'WhatsApp', icon: Globe }
                        ].map((integration, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow text-center">
                                <integration.icon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Ready to 10X Your
                            <span className="block text-blue-200">Business Growth?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
                            Join 10,000+ successful retailers who've transformed their business with Shoplytics.
                            <span className="font-semibold text-white block mt-2">Start your free trial today - no credit card required!</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                            <Link
                                to="/register"
                                className="group bg-white text-blue-600 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
                            >
                                Start Free 30-Day Trial
                                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="border-2 border-white/30 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                            >
                                Sign In to Dashboard
                            </Link>
                        </div>

                        {/* Final trust indicators */}
                        <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100">
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                Free 30-day trial
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                No setup fees
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                Cancel anytime
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                Money-back guarantee
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Custom animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;