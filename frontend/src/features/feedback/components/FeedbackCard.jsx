import { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { formatDateTime } from '../../../shared/utils';
import { feedbackAPI } from '../services/feedback.api';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';

export const FeedbackCard = ({ feedback, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const { hasRole } = useAuth();

    const canDeleteFeedback = hasRole(['OWNER', 'ADMIN', 'MANAGER']);

    const handleDelete = async () => {
        if (!canDeleteFeedback) {
            toast.error('You do not have permission to delete feedback');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        try {
            setLoading(true);
            await feedbackAPI.deleteFeedback(feedback.id);
            toast.success('Feedback deleted successfully');
            onDelete(feedback.id);
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to delete feedback';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-600';
        if (rating >= 3) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="flex items-center">
                                {renderStars(feedback.rating)}
                            </div>
                            <span className={`font-semibold ${getRatingColor(feedback.rating)}`}>
                                {feedback.rating}/5
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            {formatDateTime(feedback.createdAt)}
                        </p>
                    </div>
                    {canDeleteFeedback && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    )}
                </div>

                {/* Customer Info */}
                {feedback.customer && (
                    <div className="border-t pt-3">
                        <p className="font-medium text-gray-900">{feedback.customer.name}</p>
                        <p className="text-sm text-gray-600">{feedback.customer.email}</p>
                    </div>
                )}

                {/* Comment */}
                {feedback.comment && (
                    <div className="border-t pt-3">
                        <p className="text-gray-900 leading-relaxed">"{feedback.comment}"</p>
                    </div>
                )}

                {/* Customer Spending Info */}
                {feedback.customer?.totalSpending && (
                    <div className="border-t pt-3 text-sm text-gray-600">
                        <span>Customer Total Spending: </span>
                        <span className="font-medium text-green-600">
                            ₹{feedback.customer.totalSpending.toLocaleString('en-IN')}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};