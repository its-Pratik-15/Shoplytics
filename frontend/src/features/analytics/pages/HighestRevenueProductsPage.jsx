import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { Card } from '../../../shared/components/ui/Card';
import Input from '../../../shared/components/ui/Input';
import { analyticsAPI } from '../services/analytics.api';
import { formatCurrency, debounce } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';

export const HighestRevenueProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');
    const [limit, setLimit] = useState(50);
    const { hasRole } = useAuth();

    const canViewAnalytics = hasRole(['OWNER', 'ADMIN', 'MANAGER']);

    useEffect(() => {
        if (canViewAnalytics) {
            fetchProducts();
        }
    }, [canViewAnalytics, dateRange, limit]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { limit };

            if (dateRange !== 'all') {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - parseInt(dateRange));
                params.startDate = startDate.toISOString();
                params.endDate = endDate.toISOString();
            }

            const response = await analyticsAPI.getHighestRevenueProducts(params);
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch highest revenue products');
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

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <Link to="/analytics" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
                            ← Back to Analytics
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Highest Revenue Products</h1>
                        <p className="text-gray-600">
                            Products ranked by total revenue generated ({products.length} products)
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-48">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                            <option value="all">All time</option>
                        </select>
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="25">Top 25</option>
                            <option value="50">Top 50</option>
                            <option value="100">Top 100</option>
                        </select>
                    </div>
                </div>

                {/* Products List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0016 7.414V9a2 2 0 012 2v2a2 2 0 01-2 2h-2m-6 0a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No sales data found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No products have been sold in the selected time period.
                        </p>
                    </div>
                ) : (
                    <Card className="overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Revenue Rankings</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Revenue
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Profit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity Sold
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Profit Margin
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((item, index) => {
                                        const cost = item.totalQuantitySold * item.product.costPrice;
                                        const profit = item.totalRevenue - cost;
                                        const profitMargin = item.totalRevenue > 0 ? ((profit / item.totalRevenue) * 100).toFixed(1) : 0;

                                        return (
                                            <tr key={item.product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                                        <span className="text-sm font-medium text-green-600">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.product.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatCurrency(item.product.sellingPrice)} each
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                        {item.product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-green-600">
                                                        {formatCurrency(item.totalRevenue)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-blue-600">
                                                        {formatCurrency(profit)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {item.totalQuantitySold}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.totalTransactions} orders
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-purple-600">
                                                        {profitMargin}%
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    );
};