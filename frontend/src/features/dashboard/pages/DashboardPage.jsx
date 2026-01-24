import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/layout/Layout';
import { TrendingUp, Package, Users, ShoppingCart, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalSales: 125430,
        products: 156,
        customers: 89,
        orders: 234,
        growth: {
            sales: 12.5,
            products: 8.2,
            customers: 15.3,
            orders: 6.7
        }
    });

    const [recentActivity] = useState([
        { id: 1, type: 'sale', customer: 'Rajesh Kumar', amount: 2450, time: '2 minutes ago' },
        { id: 2, type: 'product', name: 'Tata Tea Premium', action: 'added', time: '15 minutes ago' },
        { id: 3, type: 'customer', customer: 'Priya Sharma', action: 'registered', time: '1 hour ago' },
        { id: 4, type: 'sale', customer: 'Amit Patel', amount: 1200, time: '2 hours ago' },
    ]);

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
                                    Welcome Back! 👋
                                </h1>
                                <p className="text-blue-100 text-lg">
                                    Here's what's happening with your store today
                                </p>
                            </div>
                            <div className="mt-6 md:mt-0">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">Today</div>
                                        <div className="text-blue-100 text-sm">{new Date().toLocaleDateString()}</div>
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
                            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline">
                                View All Activity
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="group p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105">
                                <Package className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                                <div className="text-sm font-semibold text-blue-900">Add Product</div>
                            </button>
                            <button className="group p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105">
                                <ShoppingCart className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                                <div className="text-sm font-semibold text-green-900">New Sale</div>
                            </button>
                            <button className="group p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105">
                                <Users className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                                <div className="text-sm font-semibold text-purple-900">Add Customer</div>
                            </button>
                            <button className="group p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105">
                                <TrendingUp className="h-8 w-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                                <div className="text-sm font-semibold text-orange-900">View Reports</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Sales Performance</h2>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">7D</button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">30D</button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">90D</button>
                        </div>
                    </div>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Chart visualization coming soon</p>
                            <p className="text-gray-400 text-sm">Sales trends and analytics</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;