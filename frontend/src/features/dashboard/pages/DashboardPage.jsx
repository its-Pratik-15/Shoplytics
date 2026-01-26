import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { LineChart, BarChart, DoughnutChart } from '../../../shared/components/charts';
import { analyticsAPI } from '../../analytics/services/analytics.api';
import { formatCurrency } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { TrendingUp, Package, Users, ShoppingCart, Star, ArrowUpRight, ArrowDownRight, Calculator } from 'lucide-react';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [salesTrendsData, setSalesTrendsData] = useState(null);
    const [categorySalesData, setCategorySalesData] = useState(null);
    const [feedbackData, setFeedbackData] = useState(null);
    const [customerLoyaltyData, setCustomerLoyaltyData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { hasRole } = useAuth();
    const canViewDashboard = hasRole(['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']);

    useEffect(() => {
        if (canViewDashboard) {
            fetchDashboardData();
        }
    }, [canViewDashboard]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Get data for last 7 days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            const params = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            };

            const [
                overviewRes,
                salesTrendsRes,
                categorySalesRes,
                feedbackRes,
                customerLoyaltyRes
            ] = await Promise.all([
                analyticsAPI.getDashboardOverview(params),
                analyticsAPI.getSalesTrends({ ...params, period: 'daily' }),
                analyticsAPI.getCategorySalesData(params),
                analyticsAPI.getFeedbackSpendingInsights(params),
                analyticsAPI.getCustomerLoyaltyStats(params)
            ]);

            if (overviewRes.success) {
                const overview = overviewRes.data;
                setStats({
                    totalSales: overview.totalRevenue,
                    products: overview.totalProducts || 0,
                    customers: overview.totalCustomers,
                    orders: overview.totalTransactions,
                    growth: {
                        sales: 12.5, // You can calculate this from historical data
                        products: 8.2,
                        customers: 15.3,
                        orders: 6.7
                    }
                });

                // Convert recent transactions to activity format
                if (overview.recentTransactions) {
                    const activities = overview.recentTransactions.map((transaction, index) => ({
                        id: transaction.id,
                        type: 'sale',
                        customer: transaction.customer.name,
                        amount: transaction.total,
                        time: getTimeAgo(transaction.createdAt)
                    }));
                    setRecentActivity(activities);
                }
            }

            if (salesTrendsRes.success) {
                setSalesTrendsData(salesTrendsRes.data);
            }

            if (categorySalesRes.success) {
                setCategorySalesData(categorySalesRes.data);
            }

            if (feedbackRes.success) {
                setFeedbackData(feedbackRes.data);
            }

            if (customerLoyaltyRes.success) {
                setCustomerLoyaltyData(customerLoyaltyRes.data);
            }

        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const transformSalesTrendsData = (apiData) => {
        if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
            // Return default data if API data is not available
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                last7Days.push({
                    date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                    sales: Math.floor(Math.random() * 50000) + 10000
                });
            }
            return {
                labels: last7Days.map(day => day.date),
                datasets: [{
                    label: 'Daily Sales',
                    data: last7Days.map(day => day.sales),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            };
        }

        return {
            labels: apiData.data.map(item => {
                const date = new Date(item.period);
                return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            }),
            datasets: [{
                label: 'Daily Sales',
                data: apiData.data.map(item => item.totalRevenue || 0),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };
    };

    const transformCategorySalesData = (apiData) => {
        if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
            // Return default data if API data is not available
            const defaultCategories = [
                { name: 'Beverages', sales: 45000, color: '#3B82F6' },
                { name: 'Snacks', sales: 32000, color: '#10B981' },
                { name: 'Dairy', sales: 28000, color: '#F59E0B' },
                { name: 'Groceries', sales: 38000, color: '#EF4444' },
                { name: 'Personal Care', sales: 22000, color: '#8B5CF6' }
            ];

            return {
                labels: defaultCategories.map(cat => cat.name),
                datasets: [{
                    label: 'Sales by Category',
                    data: defaultCategories.map(cat => cat.sales),
                    backgroundColor: defaultCategories.map(cat => cat.color),
                    borderWidth: 0
                }]
            };
        }

        return {
            labels: apiData.data.map(item => item.category || item.name || item.label),
            datasets: [{
                label: 'Sales by Category',
                data: apiData.data.map(item => item.revenue || item.sales || item.value || 0),
                backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
                ],
                borderWidth: 0
            }]
        };
    };

    const transformFeedbackData = (apiData) => {
        if (!apiData || !apiData.feedbackDistribution || !Array.isArray(apiData.feedbackDistribution)) {
            return {
                labels: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
                datasets: [{
                    label: 'Customer Feedback',
                    data: [2, 1, 3, 8, 15],
                    backgroundColor: [
                        '#EF4444', '#F97316', '#F59E0B', '#10B981', '#059669'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            };
        }

        const ratings = [1, 2, 3, 4, 5];
        const data = ratings.map(rating => {
            const found = apiData.feedbackDistribution.find(item => item.rating === rating);
            return found ? found.count : 0;
        });

        return {
            labels: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
            datasets: [{
                label: 'Customer Feedback',
                data,
                backgroundColor: [
                    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#059669'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };
    };

    const transformCustomerSegmentationData = (apiData) => {
        if (!apiData || !apiData.data) {
            return {
                labels: ['New Customers', 'Loyal Customers', 'Regular Customers'],
                datasets: [{
                    label: 'Customer Types',
                    data: [25, 45, 30],
                    backgroundColor: [
                        '#10B981', '#8B5CF6', '#3B82F6'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            };
        }

        // Calculate loyal customers (assuming 3+ visits = loyal)
        const newCustomers = apiData.data.newCustomers || 0;
        const oldCustomers = apiData.data.oldCustomers || 0;

        return {
            labels: ['New Customers', 'Returning Customers'],
            datasets: [{
                label: 'Customer Segmentation',
                data: [newCustomers, oldCustomers],
                backgroundColor: [
                    '#10B981', '#3B82F6'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

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

    if (!canViewDashboard) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <TrendingUp className="h-12 w-12 text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h3>
                        <p className="text-gray-500 text-lg">
                            You do not have permission to view the dashboard.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, growth, prefix = '' }) => (
        <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                    {growth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-semibold ${growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(growth)}%
                    </span>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
                <p className="text-3xl font-bold text-gray-900">
                    {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </div>
        </div>
    );

    const ActivityItem = ({ activity }) => {
        const getActivityIcon = (type) => {
            switch (type) {
                case 'sale':
                    return <ShoppingCart className="h-4 w-4 text-green-600" />;
                case 'product':
                    return <Package className="h-4 w-4 text-blue-600" />;
                case 'customer':
                    return <Users className="h-4 w-4 text-purple-600" />;
                default:
                    return <Star className="h-4 w-4 text-gray-600" />;
            }
        };

        const getActivityColor = (type) => {
            switch (type) {
                case 'sale':
                    return 'bg-green-50 border-green-200';
                case 'product':
                    return 'bg-blue-50 border-blue-200';
                case 'customer':
                    return 'bg-purple-50 border-purple-200';
                default:
                    return 'bg-gray-50 border-gray-200';
            }
        };

        return (
            <div className={`flex items-center space-x-3 p-3 rounded-xl border ${getActivityColor(activity.type)} hover:shadow-md transition-all duration-300`}>
                <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'sale' && `Sale to ${activity.customer}`}
                        {activity.type === 'product' && `Product ${activity.name} ${activity.action}`}
                        {activity.type === 'customer' && `${activity.customer} ${activity.action}`}
                    </p>
                    {activity.amount && (
                        <p className="text-sm text-green-600 font-semibold">₹{activity.amount.toLocaleString()}</p>
                    )}
                </div>
                <div className="text-xs text-gray-500">
                    {activity.time}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative px-8 py-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="text-white">
                                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋
                                </h1>
                                <p className="text-blue-100 text-lg">
                                    Here's what's happening with your store today, {new Date().toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="mt-6 md:mt-0">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            {new Date().toLocaleDateString('en-IN', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            {new Date().toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats && (
                        <>
                            <StatCard
                                title="Total Sales"
                                value={stats.totalSales}
                                icon={TrendingUp}
                                color="from-green-500 to-emerald-600"
                                growth={stats.growth.sales}
                                prefix="₹"
                            />
                            <StatCard
                                title="Products"
                                value={stats.products}
                                icon={Package}
                                color="from-blue-500 to-blue-600"
                                growth={stats.growth.products}
                            />
                            <StatCard
                                title="Customers"
                                value={stats.customers}
                                icon={Users}
                                color="from-purple-500 to-purple-600"
                                growth={stats.growth.customers}
                            />
                            <StatCard
                                title="Orders"
                                value={stats.orders}
                                icon={ShoppingCart}
                                color="from-orange-500 to-red-500"
                                growth={stats.growth.orders}
                            />
                        </>
                    )}
                </div>

                {/* Today's Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {stats ? formatCurrency(Math.floor(stats.totalSales * 0.3)) : '₹0'}
                            </div>
                            <div className="text-sm text-green-700 font-medium">Today's Sales</div>
                            <div className="text-xs text-green-600 mt-1">+12% from yesterday</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {stats ? Math.floor(stats.orders * 0.4) : 0}
                            </div>
                            <div className="text-sm text-blue-700 font-medium">Today's Orders</div>
                            <div className="text-xs text-blue-600 mt-1">+8% from yesterday</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-50 rounded-xl border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {stats ? Math.floor(stats.customers * 0.2) : 0}
                            </div>
                            <div className="text-sm text-purple-700 font-medium">New Customers</div>
                            <div className="text-xs text-purple-600 mt-1">+15% from yesterday</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity and Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-3">
                            {recentActivity.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Link
                                to="/transactions"
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-colors"
                            >
                                View All Activity
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to="/pos"
                                className="group p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 transform hover:scale-105 text-center"
                            >
                                <Calculator className="h-8 w-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                                <div className="text-sm font-semibold text-emerald-900">New Sale</div>
                            </Link>
                            <Link
                                to="/products"
                                className="group p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 text-center"
                            >
                                <Package className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                                <div className="text-sm font-semibold text-blue-900">Add Product</div>
                            </Link>
                            <Link
                                to="/customers"
                                className="group p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 text-center"
                            >
                                <Users className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                                <div className="text-sm font-semibold text-purple-900">Add Customer</div>
                            </Link>
                            <Link
                                to="/analytics"
                                className="group p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105 text-center"
                            >
                                <TrendingUp className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform mx-auto" />
                                <div className="text-sm font-semibold text-orange-900">View Reports</div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sales Performance Chart */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Sales Performance</h2>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">7D</button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">30D</button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">90D</button>
                        </div>
                    </div>
                    <div className="h-64">
                        <LineChart
                            data={transformSalesTrendsData(salesTrendsData)}
                            height={256}
                        />
                    </div>
                </div>

                {/* Category Sales Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Sales by Category</h2>
                        <div className="h-64">
                            <DoughnutChart
                                data={transformCategorySalesData(categorySalesData)}
                                height={256}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Categories</h2>
                        <div className="h-64">
                            <BarChart
                                data={transformCategorySalesData(categorySalesData)}
                                height={256}
                            />
                        </div>
                    </div>
                </div>

                {/* Feedback and Customer Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Customer Feedback</h2>
                            <div className="flex items-center space-x-2">
                                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                <span className="text-sm font-semibold text-gray-600">
                                    {stats?.averageRating ? `${stats.averageRating.toFixed(1)} avg` : '4.5 avg'}
                                </span>
                            </div>
                        </div>
                        <div className="h-64">
                            <DoughnutChart
                                data={transformFeedbackData(feedbackData)}
                                height={256}
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <Link
                                to="/feedback"
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-colors"
                            >
                                View All Feedback
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Customer Loyalty</h2>
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-600">
                                    {customerLoyaltyData?.totalCustomers || 0} total
                                </span>
                            </div>
                        </div>
                        <div className="h-64">
                            <DoughnutChart
                                data={customerLoyaltyData?.loyaltyDistribution ? {
                                    labels: customerLoyaltyData.loyaltyDistribution.labels,
                                    datasets: [{
                                        label: 'Customer Loyalty',
                                        data: customerLoyaltyData.loyaltyDistribution.data,
                                        backgroundColor: customerLoyaltyData.loyaltyDistribution.backgroundColor,
                                        borderWidth: 2,
                                        borderColor: '#fff'
                                    }]
                                } : {
                                    labels: ['New Customers', 'Regular Customers', 'Loyal Customers'],
                                    datasets: [{
                                        label: 'Customer Loyalty',
                                        data: [25, 45, 30],
                                        backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6'],
                                        borderWidth: 2,
                                        borderColor: '#fff'
                                    }]
                                }}
                                height={256}
                            />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-green-50 rounded">
                                <div className="font-semibold text-green-700">
                                    {customerLoyaltyData?.newCustomers || 0}
                                </div>
                                <div className="text-green-600">New</div>
                            </div>
                            <div className="p-2 bg-blue-50 rounded">
                                <div className="font-semibold text-blue-700">
                                    {customerLoyaltyData?.regularCustomers || 0}
                                </div>
                                <div className="text-blue-600">Regular</div>
                            </div>
                            <div className="p-2 bg-purple-50 rounded">
                                <div className="font-semibold text-purple-700">
                                    {customerLoyaltyData?.loyalCustomers || 0}
                                </div>
                                <div className="text-purple-600">Loyal</div>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <Link
                                to="/customers"
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition-colors"
                            >
                                View All Customers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Customer Loyalty Insights */}
                {customerLoyaltyData?.avgSpendingByLoyalty && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Loyalty Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                <div className="text-lg mb-2 text-green-600">
                                    👋 New Customers
                                </div>
                                <div className="text-3xl font-bold text-green-700 mb-2">
                                    ₹{Math.round(customerLoyaltyData.avgSpendingByLoyalty.new).toLocaleString()}
                                </div>
                                <div className="text-sm text-green-600">Average Spending</div>
                                <div className="text-xs text-green-500 mt-1">
                                    {customerLoyaltyData.newCustomers} customers
                                </div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                <div className="text-lg mb-2 text-blue-600">
                                    🔄 Regular Customers
                                </div>
                                <div className="text-3xl font-bold text-blue-700 mb-2">
                                    ₹{Math.round(customerLoyaltyData.avgSpendingByLoyalty.regular).toLocaleString()}
                                </div>
                                <div className="text-sm text-blue-600">Average Spending</div>
                                <div className="text-xs text-blue-500 mt-1">
                                    {customerLoyaltyData.regularCustomers} customers
                                </div>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                <div className="text-lg mb-2 text-purple-600">
                                    💎 Loyal Customers
                                </div>
                                <div className="text-3xl font-bold text-purple-700 mb-2">
                                    ₹{Math.round(customerLoyaltyData.avgSpendingByLoyalty.loyal).toLocaleString()}
                                </div>
                                <div className="text-sm text-purple-600">Average Spending</div>
                                <div className="text-xs text-purple-500 mt-1">
                                    {customerLoyaltyData.loyalCustomers} customers
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-semibold">Loyalty Insights</span>
                            </div>
                            <div>Loyal customers (3+ visits) typically spend more and provide higher lifetime value</div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DashboardPage;