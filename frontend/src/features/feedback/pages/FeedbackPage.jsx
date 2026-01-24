import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import Input from '../../../shared/components/ui/Input';
import { FeedbackCard } from '../components/FeedbackCard';
import { feedbackAPI } from '../services/feedback.api';
import { debounce } from '../../../shared/utils';
import toast from 'react-hot-toast';

export const FeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchFeedback();
        fetchStats();
    }, []);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            fetchFeedback();
        }, 300);

        debouncedSearch();
    }, [searchTerm, ratingFilter]);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (ratingFilter) params.rating = ratingFilter;

            const response = await feedbackAPI.getFeedback(params);
            if (response.success) {
                setFeedback(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch feedback');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await feedbackAPI.getFeedbackStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch feedback stats:', error);
        }
    };

    const handleDeleteFeedback = (feedbackId) => {
        setFeedback(feedback.filter(f => f.id !== feedbackId));
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    const averageRating = stats?.averageRating || 0;
    const totalFeedback = feedback.length;

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
                        <p className="text-gray-600">
                            View and manage customer feedback ({totalFeedback} reviews)
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-600">Total Reviews</p>
                                <p className="text-2xl font-bold text-blue-900">{totalFeedback}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex items-center">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-yellow-600">Average Rating</p>
                                <p className="text-2xl font-bold text-yellow-900">
                                    {averageRating.toFixed(1)}/5
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-600">Positive Reviews</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {feedback.filter(f => f.rating >= 4).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                {stats?.ratingDistribution && (
                    <div className="bg-white border rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map(rating => {
                                const count = stats.ratingDistribution.find(r => r.rating === rating)?.count || 0;
                                const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;

                                return (
                                    <div key={rating} className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-1 w-16">
                                            <span className="text-sm font-medium">{rating}</span>
                                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>

                {/* Feedback Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : feedback.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || ratingFilter ? 'Try adjusting your search filters.' : 'No customer feedback available yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feedback.map(feedbackItem => (
                            <FeedbackCard
                                key={feedbackItem.id}
                                feedback={feedbackItem}
                                onDelete={handleDeleteFeedback}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};