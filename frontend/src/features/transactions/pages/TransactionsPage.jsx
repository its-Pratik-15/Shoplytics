import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { TransactionCard } from '../components/TransactionCard';
import { TransactionForm } from '../components/TransactionForm';
import { transactionsAPI } from '../services/transactions.api';
import { debounce } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { ShoppingCart, Plus, Clock, CheckCircle, Users, UserPlus, Search, Filter, TrendingUp } from 'lucide-react';

export const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { hasRole } = useAuth();

    const canCreateTransaction = hasRole(['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']);

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            fetchTransactions();
        }, 300);

        debouncedSearch();
    }, [searchTerm, statusFilter]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;

            const response = await transactionsAPI.getTransactions(params);
            if (response.success) {
                setTransactions(response.data.transactions || response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransaction = () => {
        if (!canCreateTransaction) {
            toast.error('You do not have permission to create transactions');
            return;
        }
        setShowForm(true);
    };

    const handleFormSuccess = (transactionData) => {
        setTransactions([transactionData, ...transactions]);
        setShowForm(false);
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleTransactionUpdate = (transactionId, newStatus) => {
        setTransactions(transactions.map(t =>
            t.id === transactionId ? { ...t, status: newStatus } : t
        ));
    };

    const pendingTransactions = transactions.filter(t => t.status === 'PENDING');
    const completedTransactions = transactions.filter(t => t.status === 'COMPLETED');
    const newCustomerTransactions = transactions.filter(t => t.customer?.isNewCustomer);
    const oldCustomerTransactions = transactions.filter(t => t.customer && !t.customer.isNewCustomer);
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + Number(t.total || 0), 0);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative px-8 py-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="text-white">
                                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                                    Transaction Management
                                </h1>
                                <p className="text-green-100 text-lg">
                                    Manage your {transactions.length} transactions worth ₹{totalRevenue.toLocaleString()}
                                </p>
                                <div className="flex items-center mt-4 space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                        <span className="text-white font-semibold">{pendingTransactions.length} Pending</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        <span className="text-white font-semibold">{completedTransactions.length} Completed</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 flex space-x-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">₹{Math.round(totalRevenue / 1000)}K</div>
                                        <div className="text-green-100 text-sm">Total Revenue</div>
                                    </div>
                                </div>
                                {canCreateTransaction && (
                                    <button
                                        onClick={handleCreateTransaction}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center space-x-2"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>New Transaction</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Transaction Form */}
                {showForm && (
                    <div className="transform hover:scale-[1.02] transition-transform duration-300">
                        <TransactionForm
                            onSuccess={handleFormSuccess}
                            onCancel={handleFormCancel}
                        />
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total</p>
                                <p className="text-3xl font-bold mt-1">{transactions.length}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <ShoppingCart className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold mt-1">{pendingTransactions.length}</p>
                                <div className="flex items-center mt-1">
                                    <div className="w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
                                    <span className="text-yellow-100 text-xs ml-2">Processing</span>
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Clock className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Completed</p>
                                <p className="text-3xl font-bold mt-1">{completedTransactions.length}</p>
                                <div className="flex items-center mt-1">
                                    <div className="w-2 h-2 bg-green-200 rounded-full"></div>
                                    <span className="text-green-100 text-xs ml-2">Success</span>
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">New Customers</p>
                                <p className="text-3xl font-bold mt-1">{newCustomerTransactions.length}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <UserPlus className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-100 text-sm font-medium">Returning</p>
                                <p className="text-3xl font-bold mt-1">{oldCustomerTransactions.length}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Users className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Transactions
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    placeholder="Search by customer name or transaction ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="lg:w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="">All Status</option>
                                <option value="PENDING">⏳ Pending</option>
                                <option value="COMPLETED">✅ Completed</option>
                                <option value="CANCELLED">❌ Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                        </div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-lg">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <ShoppingCart className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No transactions found</h3>
                            <p className="text-gray-500 text-lg mb-6">
                                {searchTerm || statusFilter ? 'Try adjusting your search filters.' : 'Get started by creating your first transaction.'}
                            </p>
                            {searchTerm || statusFilter ? (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('');
                                    }}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            ) : canCreateTransaction ? (
                                <button
                                    onClick={handleCreateTransaction}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Create First Transaction</span>
                                </button>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {transactions.map((transaction, index) => (
                            <div
                                key={transaction.id}
                                className="transform hover:scale-105 transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <TransactionCard
                                    transaction={transaction}
                                    onUpdate={handleTransactionUpdate}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
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