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
                setTransactions(response.data);
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

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                        <p className="text-gray-600">
                            Manage your transactions ({transactions.length} total)
                        </p>
                    </div>
                    {canCreateTransaction && (
                        <Button onClick={handleCreateTransaction}>
                            New Transaction
                        </Button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-600">Total Transactions</p>
                                <p className="text-2xl font-bold text-blue-900">{transactions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-900">{pendingTransactions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-600">Completed</p>
                                <p className="text-2xl font-bold text-green-900">{completedTransactions.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Form */}
                {showForm && (
                    <TransactionForm
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || statusFilter ? 'Try adjusting your search filters.' : 'Get started by creating your first transaction.'}
                        </p>
                        {!searchTerm && !statusFilter && canCreateTransaction && (
                            <div className="mt-6">
                                <Button onClick={handleCreateTransaction}>
                                    New Transaction
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {transactions.map(transaction => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                onUpdate={handleTransactionUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};