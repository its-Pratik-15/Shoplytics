import { Card } from '../../../shared/components/ui/Card';
import { formatDateTime } from '../../../shared/utils';

export const FeedbackCard = ({ feedback }) => {
    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-600';
        if (rating >= 3) return 'text-yellow-600';
        return 'text-red-600';
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
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
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800';
    };

    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                            {feedback.customer?.name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {formatDateTime(feedback.createdAt)}
                        </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1">
                            {renderStars(feedback.rating)}
                        </div>
                        <span className={`text-lg font-bold ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}/5
                        </span>
                    </div>
                </div>

                {/* Customer Info */}
                {feedback.customer && (
                    <div className="border-t pt-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">Customer:</p>
                                <p className="font-medium text-gray-900">{feedback.customer.name}</p>
                                <p className="text-sm text-gray-600">{feedback.customer.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(feedback.customer.isNewCustomer)}`}>
                                {feedback.customer.isNewCustomer ? 'New' : 'Old'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Comment */}
                {feedback.comment && (
                    <div className="border-t pt-3">
                        <p className="text-sm text-gray-600 mb-1">Comment:</p>
                        <p className="text-gray-900 italic">"{feedback.comment}"</p>
                    </div>
                )}

                {/* Rating Summary */}
                <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overall Rating:</span>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                {renderStars(feedback.rating)}
                            </div>
                            <span className={`font-semibold ${getRatingColor(feedback.rating)}`}>
                                {feedback.rating}/5
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};