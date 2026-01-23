import { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency } from '../../../shared/utils';
import { customersAPI } from '../services/customers.api';
import toast from 'react-hot-toast';

export const CustomerCard = ({ customer, onEdit, onDelete }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            setLoading(true);
            await customersAPI.deleteCustomer(customer.id);
            toast.success('Customer deleted successfully');
            onDelete(customer.id);
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to delete customer';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const isVIPCustomer = customer.totalSpending >= 10000; // VIP if spent more than ₹10,000

    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                            {customer.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{customer.email}</p>
                    </div>
                    {isVIPCustomer && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            VIP
                        </span>
                    )}
                </div>

                <div className="space-y-2 mb-4 flex-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-gray-900">{customer.phone}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Spending:</span>
                        <span className="font-semibold text-green-600">
                            {formatCurrency(customer.totalSpending || 0)}
                        </span>
                    </div>

                    <div className="text-sm">
                        <span className="text-gray-500">Address:</span>
                        <p className="text-gray-900 mt-1 text-xs leading-relaxed">
                            {customer.address}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(customer)}
                        className="flex-1"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};