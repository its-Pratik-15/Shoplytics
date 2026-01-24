import { useState, useEffect } from 'react';
import { Card, Button, Input, Logo } from '../../../shared/components/ui';
import { submitCustomerFeedback } from '../services/feedback.api';
import { Star, Heart, MessageCircle, User, Mail, Phone, CheckCircle, Sparkles } from 'lucide-react';

const CustomerFeedbackPage = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        rating: 0,
        comment: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    // Clear URL hash on component mount
    useEffect(() => {
        if (window.location.hash) {
            window.history.replaceState(null, null, window.location.pathname);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleRatingClick = (rating) => {
        setFormData(prev => ({
            ...prev,
            rating
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.customerName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (formData.rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await submitCustomerFeedback(formData);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const getRatingText = (rating) => {
        const texts = {
            0: 'Click to rate your experience',
            1: '😞 Poor - We can do better',
            2: '😐 Fair - Room for improvement',
            3: '😊 Good - We\'re getting there',
            4: '😄 Very Good - Almost perfect',
            5: '🤩 Excellent - Outstanding service!'
        };
        return texts[rating] || '';
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-500';
        if (rating >= 3) return 'text-yellow-500';
        if (rating >= 2) return 'text-orange-500';
        return 'text-red-500';
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg">
                    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                        {/* Success Animation Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10"></div>

                        <div className="relative p-8 text-center">
                            {/* Logo */}
                            <div className="mb-8">
                                <Logo size="lg" className="mx-auto" />
                            </div>

                            {/* Success Animation */}
                            <div className="mb-8">
                                <div className="relative mx-auto w-24 h-24 mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-12 h-12 text-white animate-bounce" />
                                    </div>
                                    {/* Sparkle effects */}
                                    <div className="absolute -top-2 -right-2">
                                        <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2">
                                        <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                                    Thank You! 🎉
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Your feedback has been submitted successfully! We truly appreciate you taking the time to share your experience with us.
                                </p>
                            </div>

                            {/* Rating Display */}
                            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <span className="text-sm font-medium text-gray-600">Your Rating:</span>
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`font-bold ${getRatingColor(formData.rating)}`}>
                                        {formData.rating}/5
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {getRatingText(formData.rating)}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setFormData({
                                            customerName: '',
                                            email: '',
                                            phone: '',
                                            rating: 0,
                                            comment: ''
                                        });
                                    }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Submit Another Review
                                </Button>

                                <button
                                    onClick={() => window.close()}
                                    className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium transition-colors"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 right-10 w-16 h-16 bg-purple-200/30 rounded-full animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-1/3 w-8 h-8 bg-yellow-200/30 rounded-full animate-bounce"></div>
            </div>

            <div className="w-full max-w-lg relative z-10">
                <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
                    {/* Header gradient */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="mb-6">
                                <Logo size="lg" className="mx-auto" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                Share Your Experience ✨
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We'd love to hear about your shopping experience with us! Your feedback helps us serve you better.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-shake">
                                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-bold">!</span>
                                    </div>
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            {/* Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="customerName" className="flex items-center text-sm font-semibold text-gray-700">
                                    <User className="w-4 h-4 mr-2 text-blue-500" />
                                    Your Name *
                                </label>
                                <div className="relative">
                                    <Input
                                        id="customerName"
                                        name="customerName"
                                        type="text"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                        className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                                    />
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700">
                                    <Mail className="w-4 h-4 mr-2 text-green-500" />
                                    Email (Optional)
                                </label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className="pl-10 h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                                    />
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="flex items-center text-sm font-semibold text-gray-700">
                                    <Phone className="w-4 h-4 mr-2 text-purple-500" />
                                    Phone Number (Optional)
                                </label>
                                <div className="relative">
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                                    />
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Rating Section */}
                            <div className="space-y-4">
                                <label className="flex items-center text-sm font-semibold text-gray-700">
                                    <Heart className="w-4 h-4 mr-2 text-pink-500" />
                                    Rate Your Experience *
                                </label>

                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border-2 border-yellow-100">
                                    <div className="flex justify-center space-x-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRatingClick(star)}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                className="group relative p-2 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-4 focus:ring-yellow-200"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-all duration-300 ${star <= (hoveredRating || formData.rating)
                                                            ? 'text-yellow-400 fill-current drop-shadow-lg'
                                                            : 'text-gray-300 hover:text-gray-400'
                                                        }`}
                                                />
                                                {/* Tooltip */}
                                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                                    {star} Star{star > 1 ? 's' : ''}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <p className={`text-sm font-medium transition-all duration-300 ${getRatingColor(hoveredRating || formData.rating)}`}>
                                            {getRatingText(hoveredRating || formData.rating)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Comment Field */}
                            <div className="space-y-2">
                                <label htmlFor="comment" className="flex items-center text-sm font-semibold text-gray-700">
                                    <MessageCircle className="w-4 h-4 mr-2 text-indigo-500" />
                                    Additional Comments (Optional)
                                </label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows={4}
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    placeholder="Tell us more about your experience... What did you love? What could we improve?"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-white/80 backdrop-blur-sm transition-all duration-300"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Submitting...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Heart className="w-5 h-5" />
                                        <span>Submit Feedback</span>
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-sm text-gray-600 mb-1">
                                    🔒 Your feedback is secure and helps us improve
                                </p>
                                <p className="text-xs text-gray-500">
                                    Thank you for choosing <span className="font-semibold text-blue-600">Shoplytics</span>!
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default CustomerFeedbackPage;