import { useState, useEffect } from 'react';
import { Layout } from '../../../shared/components/layout/Layout';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { CustomerCard } from '../components/CustomerCard';
import { CustomerForm } from '../components/CustomerForm';
import { customersAPI } from '../services/customers.api';
import { debounce } from '../../../shared/utils';
import toast from 'react-hot-toast';

export const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            fetchCustomers();
        }, 300);

        debouncedSearch();
    }, [searchTerm]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;

            const response = await customersAPI.getCustomers(params);
            if (response.success) {
                setCustomers(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomer = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleDeleteCustomer = (customerId) => {
        setCustomers(customers.filter(c => c.id !== customerId));
    };

    const handleFormSuccess = (customerData) => {
        if (editingCustomer) {
            // Update existing customer
            setCustomers(customers.map(c =>
                c.id === editingCustomer.id ? customerData : c
            ));
        } else {
            // Add new customer
            setCustomers([customerData, ...customers]);
        }
        setShowForm(false);
        setEditingCustomer(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCustomer(null);
    };

    const vipCustomers = customers.filter(c => (c.totalSpending || 0) >= 10000);
    const totalSpending = customers.reduce((sum, c) => sum + (c.totalSpending || 0), 0);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                        <p className="text-gray-600">
                            Manage your customer database ({customers.length} customers)
                        </p>
                    </div>
                    <Button onClick={handleAddCustomer}>
                        Add Customer
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-600">Total Customers</p>
                                <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-yellow-600">VIP Customers</p>
                                <p className="text-2xl font-bold text-yellow-900">{vipCustomers.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-900">
                                    ₹{totalSpending.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Form */}
                {showForm && (
                    <CustomerForm
                        customer={editingCustomer}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                )}

                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search customers by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Customers Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search term.' : 'Get started by adding your first customer.'}
                        </p>
                        {!searchTerm && (
                            <div className="mt-6">
                                <Button onClick={handleAddCustomer}>
                                    Add Customer
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map(customer => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onEdit={handleEditCustomer}
                                onDelete={handleDeleteCustomer}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};