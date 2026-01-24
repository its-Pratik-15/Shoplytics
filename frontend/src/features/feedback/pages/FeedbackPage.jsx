import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import Input from '../../../shared/components/ui/Input';
import { FeedbackCard } from '../components/FeedbackCard';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { feedbackAPI } from '../services/feedback.api';
import { debounce } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';

export const FeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const { hasRole } = useAuth();

    const canViewFeedback = hasRole(['OWNER', 'ADMIN', 'MANAGER']);

    useEffect(() => {
        if (canViewFeedback) {
            fetchFeedback();
        }
    }, [canViewFeedback]);

    useEffect(() => {
        if (canViewFeedback) {
            const debouncedSearch = debounce(() => {
                fetchFeedback();
            }, 300);

            debouncedSearch();
        }
    }, [searchTerm, ratingFilter, canViewFeedback]);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (ratingFilter) params.rating = ratingFilter;

            const response = await feedbackAPI.getFeedback(params);
            if (response.success) {
                setFeedback(response.data.feedback || response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch feedback');
        } finally {
            setLoading(false);
        }
    };

    if (!canViewFeedback) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Restricted</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You do not have permission to view feedback.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    const averageRating = feedback.length > 0
        ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: feedback.filter(f => f.rating === rating).length,
        percentage: feedback.length > 0
            ? ((feedback.filter(f => f.rating === rating).length / feedback.length) * 100).toFixed(1)
            : 0
    }));

    const newCustomerFeedback = feedback.filter(f => f.customer?.isNewCustomer);
    const oldCustomerFeedback = feedback.filter(f => f.customer && !f.customer.isNewCustomer);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="space-y-8 p-6">
                    {/* Enhanced Header with gradient background */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="relative px-8 py-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="text-white">
                                    <h1 className="text-4xl font-bold mb-2 tracking-tight">
                                        Customer Feedback
                                    </h1>
                                    <p className="text-blue-100 text-lg">
                                        Insights from {feedback.length} customer reviews
                                    </p>
                                    <div className="flex items-center mt-4 space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-white font-semibold text-lg">{averageRating}/5</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 md:mt-0">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">{feedback.length}</div>
                                            <div className="text-blue-100 text-sm">Total Reviews</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                    </div>

                    {/* QR Code Generator with enhanced styling */}
                    <div className="transform hover:scale-[1.02] transition-transform duration-300">
                        <QRCodeGenerator />
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Feedback</p>
                                    <p className="text-3xl font-bold mt-1">{feedback.length}</p>
                                    <div className="flex items-center mt-2">
                                        <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
                                        <span className="text-blue-100 text-xs ml-2">Active</span>
                                    </div>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v8a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Average Rating</p>
                                    <p className="text-3xl font-bold mt-1">{averageRating}/5</p>
                                    <div className="flex items-center mt-2">
                                        <div className="flex space-x-1">
                                            {[...Array(Math.floor(averageRating))].map((_, i) => (
                                                <div key={i} className="w-1.5 h-1.5 bg-yellow-200 rounded-full"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">New Customers</p>
                                    <p className="text-3xl font-bold mt-1">{newCustomerFeedback.length}</p>
                                    <div className="flex items-center mt-2">
                                        <div className="w-2 h-2 bg-green-200 rounded-full animate-bounce"></div>
                                        <span className="text-green-100 text-xs ml-2">Growing</span>
                                    </div>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Returning Customers</p>
                                    <p className="text-3xl font-bold mt-1">{oldCustomerFeedback.length}</p>
                                    <div className="flex items-center mt-2">
                                        <div className="w-2 h-2 bg-purple-200 rounded-full"></div>
                                        <span className="text-purple-100 text-xs ml-2">Loyal</span>
                                    </div>
                                </div>
                                <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Rating Distribution */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Rating Distribution</h3>
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                {feedback.length} Reviews
                            </div>
                        </div>
                        <div className="space-y-4">
                            {ratingDistribution.map(({ rating, count, percentage }) => (
                                <div key={rating} className="group">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2 w-20">
                                            <span className="text-lg font-semibold text-gray-700">{rating}</span>
                                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 relative">
                                            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out group-hover:from-purple-500 group-hover:to-pink-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="w-24 text-right">
                                            <div className="text-lg font-bold text-gray-900">{count}</div>
                                            <div className="text-sm text-gray-500">({percentage}%)</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Filters */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Feedback
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <Input
                                        placeholder="Search by customer name or comment..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Rating
                                </label>
                                <select
                                    value={ratingFilter}
                                    onChange={(e) => setRatingFilter(e.target.value)}
                                    className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                    <option value="3">⭐⭐⭐ 3 Stars</option>
                                    <option value="2">⭐⭐ 2 Stars</option>
                                    <option value="1">⭐ 1 Star</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Feedback Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                            </div>
                        </div>
                    ) : feedback.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-lg">
                            <div className="max-w-md mx-auto">
                                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v8a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No feedback found</h3>
                                <p className="text-gray-500 text-lg">
                                    {searchTerm || ratingFilter ? 'Try adjusting your search filters.' : 'No customer feedback available yet.'}
                                </p>
                                {searchTerm || ratingFilter ? (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setRatingFilter('');
                                        }}
                                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {feedback.map((feedbackItem, index) => (
                                <div
                                    key={feedbackItem.id}
                                    className="transform hover:scale-105 transition-all duration-300"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: 'fadeInUp 0.6s ease-out forwards'
                                    }}
                                >
                                    <FeedbackCard feedback={feedbackItem} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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
        </Layout>
    );
};