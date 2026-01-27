import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

const PublicNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle hash navigation when component mounts or location changes
    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            const sectionId = location.hash.substring(1); // Remove the '#'
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100); // Small delay to ensure page is loaded
        }
    }, [location]);

    const handleSectionClick = (sectionId) => {
        if (location.pathname === '/') {
            // If already on landing page, scroll to section
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If on different page, navigate to landing page with hash
            navigate(`/#${sectionId}`);
        }
        setIsMenuOpen(false); // Close mobile menu
    };

    return (
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/">
                        <Logo size="md" showText={true} />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => handleSectionClick('features')}
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => handleSectionClick('pricing')}
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                        >
                            Pricing
                        </button>
                        <button
                            onClick={() => handleSectionClick('testimonials')}
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                        >
                            Reviews
                        </button>
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
                            <button
                                onClick={() => handleSectionClick('features')}
                                className="text-gray-600 hover:text-blue-600 font-medium text-left"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => handleSectionClick('pricing')}
                                className="text-gray-600 hover:text-blue-600 font-medium text-left"
                            >
                                Pricing
                            </button>
                            <button
                                onClick={() => handleSectionClick('testimonials')}
                                className="text-gray-600 hover:text-blue-600 font-medium text-left"
                            >
                                Reviews
                            </button>
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
    );
};

export default PublicNavbar;