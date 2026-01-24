import { Link } from 'react-router-dom';
import {
    BarChart3,
    ShoppingCart,
    Users,
    TrendingUp,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import Logo from '../../../shared/components/ui/Logo';
import Footer from '../../../shared/components/layout/Footer';

const LandingPage = () => {
    const features = [
        {
            icon: ShoppingCart,
            title: 'Point of Sale',
            description: 'Streamlined checkout process with inventory management and real-time stock updates.'
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Comprehensive insights into sales performance, customer behavior, and business trends.'
        },
        {
            icon: Users,
            title: 'Customer Management',
            description: 'Track customer preferences, purchase history, and build lasting relationships.'
        },
        {
            icon: TrendingUp,
            title: 'Revenue Tracking',
            description: 'Monitor profit margins, revenue streams, and identify your best-selling products.'
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security with role-based access control and data protection.'
        },
        {
            icon: Zap,
            title: 'Fast Performance',
            description: 'Lightning-fast transactions and real-time updates for seamless operations.'
        }
    ];

    const benefits = [
        'Real-time inventory management',
        'Detailed sales analytics and reporting',
        'Customer relationship management',
        'Multi-user role-based access',
        'Mobile-responsive design',
        'Secure payment processing'
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Logo size="md" showText={true} />
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Modern POS & Analytics
                            <span className="text-blue-600 block">for Smart Retailers</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Streamline your retail operations with our comprehensive point-of-sale system.
                            Get real-time insights, manage inventory, and grow your business with data-driven decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                View Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Run Your Store
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to help you manage your retail business efficiently and profitably.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Why Choose Shoplytics?
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Built for modern retailers who want to leverage technology to grow their business.
                                Our platform combines ease of use with powerful analytics.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">₹2,999</div>
                                <div className="text-gray-500 mb-6">per month</div>
                                <div className="space-y-3 text-left mb-8">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-600">Unlimited transactions</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-600">Advanced analytics</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-600">24/7 support</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-600">Multi-user access</span>
                                    </div>
                                </div>
                                <Link
                                    to="/register"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
                                >
                                    Start Your Free Trial
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of retailers who trust Shoplytics to manage their operations and grow their revenue.
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                    >
                        Get Started Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;