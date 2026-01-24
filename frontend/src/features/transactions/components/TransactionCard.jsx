import { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import { formatCurrency, formatDateTime } from '../../../shared/utils';
import { transactionsAPI } from '../services/transactions.api';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';

export const TransactionCard = ({ transaction, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const { hasRole } = useAuth();

    const canUpdateStatus = hasRole(['OWNER', 'ADMIN', 'MANAGER']);

    const handleStatusUpdate = async (newStatus) => {
        if (!canUpdateStatus) {
            toast.error('You do not have permission to update transaction status');
            return;
        }

        try {
            setLoading(true);
            await transactionsAPI.updateTransactionStatus(transaction.id, newStatus);
            toast.success('Transaction status updated successfully');
            onUpdate(transaction.id, newStatus);
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to update transaction status';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentModeColor = (mode) => {
        switch (mode) {
            case 'CASH':
                return 'bg-blue-100 text-blue-800';
            case 'UPI':
                return 'bg-purple-100 text-purple-800';
            case 'CARD':
                return 'bg-indigo-100 text-indigo-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
                            Transaction #{transaction.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {formatDateTime(transaction.createdAt)}
                        </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentModeColor(transaction.paymentMode)}`}>
                            {transaction.paymentMode}
                        </span>
                    </div>
                </div>

                {/* Customer Info */}
                {transaction.customer && (
                    <div className="border-t pt-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600">Customer:</p>
                                <p className="font-medium text-gray-900">{transaction.customer.name}</p>
                                <p className="text-sm text-gray-600">{transaction.customer.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(transaction.customer.isNewCustomer)}`}>
                                {transaction.customer.isNewCustomer ? 'New' : 'Old'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Items */}
                {transaction.items && transaction.items.length > 0 && (
                    <div className="border-t pt-3">
                        <p className="text-sm text-gray-600 mb-2">Items ({transaction.items.length}):</p>
                        <div className="space-y-1">
                            {transaction.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-900">
                                        {item.product?.name || 'Unknown Product'} x{item.quantity}
                                    </span>
                                    <span className="text-gray-600">
                                        {formatCurrency(item.subtotal)}
                                    </span>
                                </div>
                            ))}
                            {transaction.items.length > 3 && (
                                <p className="text-xs text-gray-500">
                                    +{transaction.items.length - 3} more items
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Total */}
                <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-green-600">
                        {formatCurrency(transaction.total)}
                    </span>
                </div>

                {/* Actions */}
                {canUpdateStatus && transaction.status === 'PENDING' && (
                    <div className="border-t pt-3 flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => handleStatusUpdate('COMPLETED')}
                            disabled={loading}
                            className="flex-1"
                        >
                            Complete
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate('CANCELLED')}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};