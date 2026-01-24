import { useState, useEffect } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { transactionsAPI } from '../services/transactions.api';
import { productsAPI } from '../../products/services/products.api';
import { customersAPI } from '../../customers/services/customers.api';
import { formatCurrency } from '../../../shared/utils';
import toast from 'react-hot-toast';

export const TransactionForm = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [paymentMode, setPaymentMode] = useState('CASH');
    const [items, setItems] = useState([{ productId: '', quantity: 1 }]);

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getProducts();
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await customersAPI.getCustomers();
            if (response.success) {
                setCustomers(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch customers');
        }
    };

    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index, field, value) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setItems(updatedItems);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                return total + (product.price * item.quantity);
            }
            return total;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate items
        const validItems = items.filter(item => item.productId && item.quantity > 0);
        if (validItems.length === 0) {
            toast.error('Please add at least one valid item');
            return;
        }

        try {
            setLoading(true);
            const transactionData = {
                items: validItems,
                paymentMode,
                customerId: selectedCustomer || null
            };

            const response = await transactionsAPI.createTransaction(transactionData);
            if (response.success) {
                toast.success('Transaction created successfully');
                onSuccess(response.data);
            }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create transaction';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">New Transaction</h2>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer (Optional)
                    </label>
                    <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Walk-in Customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name} - {customer.email}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Payment Mode */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Mode
                    </label>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Card</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                </div>

                {/* Items */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Items
                        </label>
                        <Button type="button" variant="outline" onClick={addItem}>
                            Add Item
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <select
                                        value={item.productId}
                                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} - {formatCurrency(product.price)} (Stock: {product.quantity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                        placeholder="Qty"
                                        required
                                    />
                                </div>
                                {items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-green-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <Button
                        type="submit"
                        disabled={loading || calculateTotal() === 0}
                        className="flex-1"
                    >
                        {loading ? 'Creating...' : 'Create Transaction'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    );
};