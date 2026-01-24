import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { transactionsAPI } from '../services/transactions.api';
import { customersAPI } from '../../customers/services/customers.api';
import { productsAPI } from '../../products/services/products.api';
import { formatCurrency } from '../../../shared/utils';
import toast from 'react-hot-toast';

export const TransactionForm = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [total, setTotal] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues: {
            customerId: '',
            paymentMode: 'CASH'
        }
    });

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [selectedItems]);

    const fetchCustomers = async () => {
        try {
            const response = await customersAPI.getCustomers();
            if (response.success) {
                setCustomers(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getProducts();
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const calculateTotal = () => {
        const newTotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
        setTotal(newTotal);
    };

    const addItem = () => {
        setSelectedItems([...selectedItems, {
            productId: '',
            quantity: 1,
            priceAtSale: 0,
            subtotal: 0
        }]);
    };

    const removeItem = (index) => {
        const newItems = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...selectedItems];
        newItems[index][field] = value;

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                newItems[index].priceAtSale = product.price;
                newItems[index].subtotal = product.price * newItems[index].quantity;
            }
        } else if (field === 'quantity' || field === 'priceAtSale') {
            newItems[index].subtotal = newItems[index].priceAtSale * newItems[index].quantity;
        }

        setSelectedItems(newItems);
    };

    const onSubmit = async (data) => {
        if (selectedItems.length === 0) {
            toast.error('Please add at least one item');
            return;
        }

        try {
            setLoading(true);

            const transactionData = {
                ...data,
                items: selectedItems.map(item => ({
                    productId: item.productId,
                    quantity: parseInt(item.quantity),
                    priceAtSale: parseFloat(item.priceAtSale)
                })),
                total: total
            };

            const response = await transactionsAPI.createTransaction(transactionData);

            if (response.success) {
                toast.success('Transaction created successfully');
                reset();
                setSelectedItems([]);
                setTotal(0);
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
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">New Transaction</h2>
                <p className="text-gray-600 mt-1">Create a new transaction</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer and Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer
                        </label>
                        <select
                            {...register('customerId', { required: 'Customer is required' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Customer</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} - {customer.email}
                                </option>
                            ))}
                        </select>
                        {errors.customerId && (
                            <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Mode
                        </label>
                        <select
                            {...register('paymentMode', { required: 'Payment mode is required' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Card</option>
                        </select>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Items</h3>
                        <Button type="button" onClick={addItem} size="sm">
                            Add Item
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {selectedItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border rounded-md">
                                <div className="md:col-span-2">
                                    <select
                                        value={item.productId}
                                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} - {formatCurrency(product.price)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                        placeholder="Qty"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.priceAtSale}
                                        onChange={(e) => updateItem(index, 'priceAtSale', parseFloat(e.target.value))}
                                        placeholder="Price"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(item.subtotal)}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedItems.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No items added. Click "Add Item" to start.
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={loading || selectedItems.length === 0}
                        className="flex-1"
                    >
                        {loading ? 'Creating...' : 'Create Transaction'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    );
};