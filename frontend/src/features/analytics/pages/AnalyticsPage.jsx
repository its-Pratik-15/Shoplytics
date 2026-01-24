import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { Card } from '../../../shared/components/ui/Card';
import { analyticsAPI } from '../services/analytics.api';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    Star,
    Package,
    AlertTriangle,
    Calendar,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Eye
} from 'lucide-react';

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
                        <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <BarChart3 className="h-12 w-12 text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h3>
                        <p className="text-gray-500 text-lg">
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
                <div className="flex justify-center items-center py-20">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, trend, prefix = '', suffix = '' }) => (
        <div className={`group bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-1">
                        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                    </p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            {trend > 0 ? (
                                <ArrowUpRight className="h-4 w-4 text-white/80" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 text-white/80" />
                            )}
                            <span className="text-white/80 text-xs ml-1">
                                {Math.abs(trend)}% vs last period
                            </span>
                        </div>
                    )}
                </div>
                <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Icon className="h-8 w-8" />
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative px-8 py-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="text-white">
                                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                                    Analytics Dashboard
                                </h1>
                                <p className="text-purple-100 text-lg">
                                    Business insights and performance metrics
                                </p>
                                <div className="flex items-center mt-4 space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <BarChart3 className="h-5 w-5 text-purple-200" />
                                        <span className="text-white font-semibold">Real-time Data</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <label className="block text-purple-100 text-sm font-medium mb-2">
                                        <Calendar className="h-4 w-4 inline mr-2" />
                                        Time Period
                                    </label>
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    >
                                        <option value="7" className="text-gray-900">Last 7 days</option>
                                        <option value="30" className="text-gray-900">Last 30 days</option>
                                        <option value="90" className="text-gray-900">Last 90 days</option>
                                        <option value="365" className="text-gray-900">Last year</option>
                                        <option value="all" className="text-gray-900">All time</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Overview Cards */}
                {overview && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Revenue"
                            value={overview.totalRevenue}
                            icon={TrendingUp}
                            color="from-green-500 to-emerald-600"
                            prefix="₹"
                        />
                        <StatCard
                            title="Total Transactions"
                            value={overview.totalTransactions}
                            icon={ShoppingCart}
                            color="from-blue-500 to-blue-600"
                        />
                        <StatCard
                            title="Active Customers"
                            value={overview.totalCustomers}
                            icon={Users}
                            color="from-purple-500 to-purple-600"
                        />
                        <StatCard
                            title="Average Rating"
                            value={overview.averageRating.toFixed(1)}
                            icon={Star}
                            color="from-yellow-500 to-orange-500"
                            suffix="/5"
                        />
                    </div>
                )}

                {/* Low Stock Alert */}
                {overview && overview.lowStockProducts > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="bg-red-500 p-2 rounded-xl">
                                    <AlertTriangle className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-red-900 mb-2">
                                    Low Stock Alert! ⚠️
                                </h3>
                                <p className="text-red-700">
                                    {overview.lowStockProducts} product(s) are running low on stock and need immediate attention.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Most Selling Products */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 p-2 rounded-xl">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Most Selling Products</h3>
                            </div>
                            <Link
                                to="/analytics/most-selling"
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
                            >
                                <span>See More</span>
                                <Eye className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {mostSellingProducts.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                                <span className="text-sm font-bold text-white">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">{item.product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">{item.totalQuantitySold} sold</p>
                                        <p className="text-sm text-gray-600">{item.totalTransactions} orders</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Highest Revenue Products */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-xl">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Highest Revenue Products</h3>
                            </div>
                            <Link
                                to="/analytics/highest-revenue"
                                className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-semibold transition-colors group"
                            >
                                <span>See More</span>
                                <Eye className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {highestRevenueProducts.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                                <span className="text-sm font-bold text-white">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-600">{item.product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">
                                            {formatCurrency(item.totalRevenue)}
                                        </p>
                                        <p className="text-sm text-gray-600">{item.totalQuantitySold} sold</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Customer Analytics */}
                {customerAnalytics && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-purple-100 p-2 rounded-xl">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Customer Analytics</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <p className="text-3xl font-bold text-blue-600">
                                    {customerAnalytics.totalCustomers}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Total Customers</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <p className="text-3xl font-bold text-green-600">
                                    {customerAnalytics.newCustomers}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">New Customers</p>
                            </div>
                            <div className="text-center p-4 bg-indigo-50 rounded-xl">
                                <p className="text-3xl font-bold text-indigo-600">
                                    {customerAnalytics.oldCustomers}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Returning</p>
                            </div>
                            <div className="text-center p-4 bg-teal-50 rounded-xl">
                                <p className="text-3xl font-bold text-teal-600">
                                    {customerAnalytics.customersWithPurchases}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Active</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-xl">
                                <p className="text-3xl font-bold text-purple-600">
                                    {customerAnalytics.repeatCustomers}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Repeat</p>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-xl">
                                <p className="text-3xl font-bold text-orange-600">
                                    {customerAnalytics.oneTimeCustomers}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">One-time</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sales Trends */}
                {salesTrends.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-indigo-100 p-2 rounded-xl">
                                <BarChart3 className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Recent Sales Trends</h3>
                        </div>
                        <div className="space-y-3">
                            {salesTrends.slice(-7).map((trend, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(trend.period)}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Transactions</p>
                                            <p className="font-bold text-gray-900">{trend.transactionCount}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Revenue</p>
                                            <p className="font-bold text-green-600">
                                                {formatCurrency(trend.totalRevenue)}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Avg Order</p>
                                            <p className="font-bold text-blue-600">
                                                {formatCurrency(trend.avgOrderValue)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};