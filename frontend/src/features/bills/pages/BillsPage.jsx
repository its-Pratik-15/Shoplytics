import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Layout from '../../../shared/components/layout/Layout';
import BillReceipt from '../components/BillReceipt';
import { billsAPI } from '../services/bills.api';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';
import {
    Receipt,
    Search,
    Filter,
    Printer,
    Plus,
    Calendar,
    CreditCard,
    Banknote,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';

const BillsPage = () => {
    const [bills, setBills] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [printingBill, setPrintingBill] = useState(null);

    const { hasRole } = useAuth();
    const canViewBills = hasRole(['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']);
    const receiptRef = useRef();

    useEffect(() => {
        if (canViewBills) {
            fetchBills();
        }
    }, [canViewBills, currentPage]);

    useEffect(() => {
        filterBills();
    }, [searchTerm, statusFilter, paymentFilter, dateFilter, bills]);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await billsAPI.getBills({
                page: currentPage,
                limit: 20
            });

            if (response.success) {
                setBills(response.data);
                setTotalPages(Math.ceil(response.total / 20));
            }
        } catch (error) {
            toast.error('Failed to fetch bills');
        } finally {
            setLoading(false);
        }
    };

    const filterBills = () => {
        let filtered = bills;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(bill =>
                bill.id.toString().includes(searchTerm) ||
                bill.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bill.customer?.phone.includes(searchTerm)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(bill => bill.status === statusFilter);
        }

        // Payment method filter
        if (paymentFilter !== 'all') {
            filtered = filtered.filter(bill => bill.paymentMethod === paymentFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate);
                    break;
            }
        }

        setFilteredBills(filtered);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'PENDING':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            case 'CANCELLED':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
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

    const getPaymentIcon = (method) => {
        return method === 'cash' ?
            <Banknote className="h-4 w-4" /> :
            <CreditCard className="h-4 w-4" />;
    };

    const handlePrintBill = useReactToPrint({
        content: () => receiptRef.current,
        documentTitle: `Bill-${printingBill?.id || 'Receipt'}`,
        onAfterPrint: () => {
            toast.success('Receipt printed successfully!');
            setPrintingBill(null);
        }
    });

    const printBill = async (bill) => {
        try {
            // Fetch full bill details if needed
            const response = await billsAPI.getBillById(bill.id);
            if (response.success) {
                const fullBill = response.data;

                // Calculate totals
                const subtotal = fullBill.items?.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) || bill.subtotal || 0;
                const discountAmount = fullBill.discount || 0;
                const tax = fullBill.tax || (subtotal - discountAmount) * 0.18;
                const total = fullBill.total || bill.total;

                // Set the bill data for printing
                setPrintingBill({
                    ...fullBill,
                    subtotal,
                    discountAmount,
                    tax,
                    total
                });

                // Trigger print after state update
                setTimeout(() => {
                    handlePrintBill();
                }, 100);
            }
        } catch (error) {
            toast.error('Failed to load bill details for printing');
            console.error('Print error:', error);
        }
    };

    if (!canViewBills) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <Receipt className="h-12 w-12 text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h3>
                        <p className="text-gray-500 text-lg">
                            You do not have permission to view bills.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="text-white">
                            <h1 className="text-4xl font-bold mb-2">Bills & Receipts</h1>
                            <p className="text-blue-100 text-lg">
                                View and manage all transaction bills
                            </p>
                        </div>
                        <div className="mt-6 md:mt-0">
                            <Link
                                to="/pos"
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                            >
                                <Plus className="h-5 w-5" />
                                <span>New Bill</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search bills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>

                        {/* Payment Filter */}
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Payments</option>
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                        </select>

                        {/* Date Filter */}
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>

                {/* Bills List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredBills.length === 0 ? (
                        <div className="text-center py-12">
                            <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bills Found</h3>
                            <p className="text-gray-500 mb-6">
                                {bills.length === 0
                                    ? "No bills have been created yet."
                                    : "No bills match your current filters."
                                }
                            </p>
                            <Link
                                to="/pos"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Create First Bill</span>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block">
                                {/* Table Header */}
                                <div className="grid grid-cols-7 gap-6 p-6 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                                    <div className="min-w-0">Bill ID</div>
                                    <div className="min-w-0">Customer</div>
                                    <div className="min-w-0">Date</div>
                                    <div className="min-w-0">Items</div>
                                    <div className="min-w-0">Payment</div>
                                    <div className="min-w-0">Total</div>
                                    <div className="min-w-0">Status</div>
                                </div>

                                {/* Bills */}
                                <div className="divide-y divide-gray-200">
                                    {filteredBills.map(bill => (
                                        <div key={bill.id} className="grid grid-cols-7 gap-6 p-6 hover:bg-gray-50 transition-colors">
                                            <div className="font-semibold text-blue-600 min-w-0">
                                                <span className="truncate block">#{bill.id}</span>
                                            </div>

                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {bill.customer?.name || 'Walk-in Customer'}
                                                </div>
                                                {bill.customer?.phone && (
                                                    <div className="text-sm text-gray-600 truncate">
                                                        {bill.customer.phone}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-sm min-w-0">
                                                <div className="text-gray-900 truncate">
                                                    {formatDate(bill.createdAt)}
                                                </div>
                                                <div className="text-gray-600 truncate">
                                                    {new Date(bill.createdAt).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-600 min-w-0">
                                                <span className="truncate block">{bill.items?.length || 0} items</span>
                                            </div>

                                            <div className="flex items-center space-x-1 min-w-0">
                                                {getPaymentIcon(bill.paymentMethod)}
                                                <span className="text-sm capitalize truncate">
                                                    {bill.paymentMethod}
                                                </span>
                                            </div>

                                            <div className="font-bold text-green-600 min-w-0">
                                                <span className="truncate block">{formatCurrency(bill.total)}</span>
                                            </div>

                                            <div className="flex items-center justify-between min-w-0">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)} min-w-0`}>
                                                    {getStatusIcon(bill.status)}
                                                    <span className="ml-1 truncate">{bill.status}</span>
                                                </span>

                                                <div className="flex space-x-1 flex-shrink-0">
                                                    <button
                                                        onClick={() => printBill(bill)}
                                                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Print Receipt"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden divide-y divide-gray-200">
                                {filteredBills.map(bill => (
                                    <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="font-semibold text-blue-600">
                                                #{bill.id}
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                                {getStatusIcon(bill.status)}
                                                <span className="ml-1">{bill.status}</span>
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm text-gray-600">Customer: </span>
                                                <span className="font-medium text-gray-900">
                                                    {bill.customer?.name || 'Walk-in Customer'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <div>
                                                    <span className="text-sm text-gray-600">Date: </span>
                                                    <span className="text-sm text-gray-900">
                                                        {formatDate(bill.createdAt)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-600">Items: </span>
                                                    <span className="text-sm text-gray-900">
                                                        {bill.items?.length || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-1">
                                                    {getPaymentIcon(bill.paymentMethod)}
                                                    <span className="text-sm capitalize text-gray-900">
                                                        {bill.paymentMethod}
                                                    </span>
                                                </div>
                                                <div className="font-bold text-green-600">
                                                    {formatCurrency(bill.total)}
                                                </div>
                                            </div>

                                            <div className="flex justify-end space-x-2 pt-2">
                                                <button
                                                    onClick={() => printBill(bill)}
                                                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                    title="Print Receipt"
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center p-6 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Showing {filteredBills.length} of {bills.length} bills
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                                            {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Hidden Receipt for Printing */}
                {printingBill && (
                    <div style={{ display: 'none' }}>
                        <BillReceipt
                            ref={receiptRef}
                            bill={printingBill}
                            customer={printingBill.customer}
                            items={printingBill.items || []}
                            discount={0}
                            discountAmount={printingBill.discountAmount || 0}
                            subtotal={printingBill.subtotal || 0}
                            tax={printingBill.tax || 0}
                            total={printingBill.total || 0}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BillsPage;