import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import { Card } from '../../../shared/components/ui/Card';
import { analyticsAPI } from '../services/analytics.api';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';

export const AnalyticsPage = () => {
    const [overview, setOverview] = useState(null);
    const [mostSellingProducts, setMostSellingProducts] = useState([]);
    const [highestRevenueProducts, setHighestRevenueProducts] = useState([]);
    const [customerAnalytics, setCustomerAnalytics] = useState(null);
    const [salesTrends, setSalesTrends] = useState([]);
    const [feedbackInsights, setFeedbackInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days

    const { hasRole } = useAuth();
    const canViewAnalytics = hasRole(['OWNER', 'ADMIN', 'MANAGER']);

    useEffect(() => {
        if (canViewAnalytics) {
            fetchAllAnalytics();
        }
    }, [canViewAnalytics, dateRange]);

    const fetchAllAnalytics = async () => {
        try {
            setLoading(true);
            const params = {};

            if (dateRange !== 'all') {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - parseInt(dateRange));
                params.startDate = startDate.toISOString();
                params.endDate = endDate.toISOString();
            }

            const [
                overviewRes,
                mostSellingRes,
                highestRevenueRes,
                customerRes,
                salesTrendsRes,
                feedbackRes
            ] = await Promise.all([
                analyticsAPI.getDashboardOverview(params),
                analyticsAPI.getMostSellingProducts({ ...params, limit: 5 }),
                analyticsAPI.getHighestRevenueProducts({ ...params, limit: 5 }),
                analyticsAPI.getCustomerAnalytics(params),
                analyticsAPI.getSalesTrends({ ...params, period: 'daily' }),
                analyticsAPI.getFeedbackSpendingInsights(params)
            ]);

            if (overviewRes.success) setOverview(overviewRes.data);
            if (mostSellingRes.success) setMostSellingProducts(mostSellingRes.data);
            if (highestRevenueRes.success) setHighestRevenueProducts(highestRevenueRes.data);
            if (customerRes.success) setCustomerAnalytics(customerRes.data);
            if (salesTrendsRes.success) setSalesTrends(salesTrendsRes.data);
            if (feedbackRes.success) setFeedbackInsights(feedbackRes.data);

        } catch (error) {
            toast.error('Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (!canViewAnalytics) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Restricted</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You do not have permission to view analytics.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600">Business insights and performance metrics</p>
                    </div>
                    <div>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                            <option value="all">All time</option>
                        </select>
                    </div>
                </div>

                {/* Overview Cards */}
                {overview && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(overview.totalRevenue)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                                    <p className="text-2xl font-bold text-gray-900">{overview.totalTransactions}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Customers</p>
                                    <p className="text-2xl font-bold text-gray-900">{overview.totalCustomers}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {overview.averageRating.toFixed(1)}/5
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Most Selling Products */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Most Selling Products</h3>
                        <div className="space-y-3">
                            {mostSellingProducts.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-blue-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">{item.product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{item.totalQuantitySold} sold</p>
                                        <p className="text-sm text-gray-600">{item.totalTransactions} orders</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Highest Revenue Products */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Highest Revenue Products</h3>
                        <div className="space-y-3">
                            {highestRevenueProducts.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-green-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">{item.product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-600">
                                            {formatCurrency(item.totalRevenue)}
                                        </p>
                                        <p className="text-sm text-gray-600">{item.totalQuantitySold} sold</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Customer Analytics */}
                {customerAnalytics && (
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Analytics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {customerAnalytics.totalCustomers}
                                </p>
                                <p className="text-sm text-gray-600">Total Customers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {customerAnalytics.newCustomers}
                                </p>
                                <p className="text-sm text-gray-600">New Customers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-indigo-600">
                                    {customerAnalytics.oldCustomers}
                                </p>
                                <p className="text-sm text-gray-600">Old Customers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-teal-600">
                                    {customerAnalytics.customersWithPurchases}
                                </p>
                                <p className="text-sm text-gray-600">Active Customers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                    {customerAnalytics.repeatCustomers}
                                </p>
                                <p className="text-sm text-gray-600">Repeat Customers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-orange-600">
                                    {customerAnalytics.oneTimeCustomers}
                                </p>
                                <p className="text-sm text-gray-600">One-time Customers</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Sales Trends */}
                {salesTrends.length > 0 && (
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sales Trends</h3>
                        <div className="space-y-2">
                            {salesTrends.slice(-7).map((trend, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(trend.period)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Transactions</p>
                                            <p className="font-medium text-gray-900">{trend.transactionCount}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Revenue</p>
                                            <p className="font-medium text-green-600">
                                                {formatCurrency(trend.totalRevenue)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Avg Order</p>
                                            <p className="font-medium text-blue-600">
                                                {formatCurrency(trend.avgOrderValue)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Low Stock Alert */}
                {overview && overview.lowStockProducts > 0 && (
                    <Card className="p-4 bg-red-50 border-red-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Low Stock Alert
                                </h3>
                                <p className="text-sm text-red-700">
                                    {overview.lowStockProducts} product(s) are running low on stock
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    );
};