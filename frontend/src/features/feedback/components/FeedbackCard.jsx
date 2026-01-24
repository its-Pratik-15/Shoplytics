import { Card } from '../../../shared/components/ui/Card';
import { formatDateTime } from '../../../shared/utils';

export const FeedbackCard = ({ feedback }) => {
    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-600';
        if (rating >= 3) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getRatingBgColor = (rating) => {
        if (rating >= 4) return 'bg-green-50 border-green-200';
        if (rating >= 3) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`h-5 w-5 transition-colors duration-200 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ));
    };

    const getCustomerTypeColor = (isNewCustomer) => {
        return isNewCustomer
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
    };

    const getCustomerTypeIcon = (isNewCustomer) => {
        return isNewCustomer ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="group">
            <Card className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="p-6">
                    {/* Header with customer info and rating */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {(feedback.customer?.name || 'A').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {feedback.customer?.name || 'Anonymous Customer'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {formatDateTime(feedback.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rating badge */}
                        <div className={`px-4 py-2 rounded-full border-2 ${getRatingBgColor(feedback.rating)} transition-all duration-300 group-hover:scale-110`}>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    {renderStars(feedback.rating)}
                                </div>
                                <span className={`text-lg font-bold ${getRatingColor(feedback.rating)}`}>
                                    {feedback.rating}/5
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer details */}
                    {feedback.customer && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                                            {feedback.customer.email || 'No email provided'}
                                        </span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${getCustomerTypeColor(feedback.customer.isNewCustomer)}`}>
                                    {getCustomerTypeIcon(feedback.customer.isNewCustomer)}
                                    <span>{feedback.customer.isNewCustomer ? 'New Customer' : 'Loyal Customer'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comment section */}
                    {feedback.comment && (
                        <div className="mb-4">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 leading-relaxed italic">
                                            "{feedback.comment}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer with rating summary */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">Experience Rating:</span>
                                <div className="flex items-center space-x-1">
                                    {renderStars(feedback.rating)}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${feedback.rating >= 4 ? 'bg-green-400' : feedback.rating >= 3 ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
                                <span className={`text-sm font-bold ${getRatingColor(feedback.rating)}`}>
                                    {feedback.rating >= 4 ? 'Excellent' : feedback.rating >= 3 ? 'Good' : 'Needs Improvement'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Card>
        </div>
    );
};