import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import { CustomerCard } from '../components/CustomerCard';
import { CustomerForm } from '../components/CustomerForm';
import { customersAPI } from '../services/customers.api';
import { debounce } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';

export const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const { hasRole } = useAuth();

    const canManageCustomers = hasRole(['OWNER', 'ADMIN', 'MANAGER']);

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
                setCustomers(response.data.customers || response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSuccess = (customerData) => {
        setShowForm(false);
        setEditingCustomer(null);
        fetchCustomers();
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleDelete = async (customerId) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            const response = await customersAPI.deleteCustomer(customerId);
            if (response.success) {
                toast.success('Customer deleted successfully');
                fetchCustomers();
            }
        } catch (error) {
            toast.error('Failed to delete customer');
        }
    };

    const newCustomers = customers.filter(c => c.isNewCustomer);
    const returningCustomers = customers.filter(c => !c.isNewCustomer);
    const totalSpending = customers.reduce((sum, c) => sum + parseFloat(c.totalSpending || 0), 0);
    const averageSpending = customers.length > 0 ? totalSpending / customers.length : 0;

    return (
        <Layout>
            <div className="space-y-8">
                {/* Enhanced Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative px-8 py-12">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                            <div className="text-white mb-6 lg:mb-0">
                                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                                    Customer Management
                                </h1>
                                <p className="text-green-100 text-lg">
                                    Manage your {customers.length} customers and their information
                                </p>
                                <div className="flex items-center mt-4 space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-white font-semibold">{newCustomers.length} New</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                        <span className="text-white font-semibold">{returningCustomers.length} Returning</span>
                                    </div>
                                </div>
                            </div>
                            {canManageCustomers && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">₹{totalSpending.toLocaleString('en-IN')}</div>
                                            <div className="text-green-100 text-sm">Total Spending</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingCustomer(null);
                                            setShowForm(true);
                                        }}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Add Customer</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Customer Form */}
                {showForm && (
                    <div className="transform hover:scale-[1.02] transition-transform duration-300">
                        <CustomerForm
                            customer={editingCustomer}
                            onSuccess={handleFormSuccess}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingCustomer(null);
                            }}
                        />
                    </div>
                )}

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="group bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Customers</p>
                                <p className="text-3xl font-bold mt-1">{customers.length}</p>
                                <div className="flex items-center mt-2">
                                    <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                                    <span className="text-green-100 text-xs ml-2">Active</span>
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">New Customers</p>
                                <p className="text-3xl font-bold mt-1">{newCustomers.length}</p>
                                <div className="flex items-center mt-2">
                                    <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce"></div>
                                    <span className="text-blue-100 text-xs ml-2">Growing</span>
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Returning Customers</p>
                                <p className="text-3xl font-bold mt-1">{returningCustomers.length}</p>
                                <div className="flex items-center mt-2">
                                    <div className="w-2 h-2 bg-purple-200 rounded-full"></div>
                                    <span className="text-purple-100 text-xs ml-2">Loyal</span>
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Avg. Spending</p>
                                <p className="text-3xl font-bold mt-1">₹{averageSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                                <div className="flex items-center mt-2">
                                    <div className="w-2 h-2 bg-orange-200 rounded-full"></div>
                                    <span className="text-orange-100 text-xs ml-2">Per Customer</span>
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Search */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Customers
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <Input
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Customer Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent absolute top-0"></div>
                        </div>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-lg">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No customers found</h3>
                            <p className="text-gray-500 text-lg mb-6">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first customer.'}
                            </p>
                            {searchTerm ? (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Clear Search
                                </button>
                            ) : canManageCustomers ? (
                                <button
                                    onClick={() => {
                                        setEditingCustomer(null);
                                        setShowForm(true);
                                    }}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add First Customer
                                </button>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map((customer, index) => (
                            <div
                                key={customer.id}
                                className="transform hover:scale-105 transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <CustomerCard
                                    customer={customer}
                                    onEdit={canManageCustomers ? handleEdit : undefined}
                                    onDelete={canManageCustomers ? handleDelete : undefined}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
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