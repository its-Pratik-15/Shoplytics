import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    MessageSquare,
    BarChart3,
    Receipt,
    Calculator
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../../features/auth/hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { hasRole } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
        { name: 'Checkout Counter', href: '/pos', icon: Calculator, color: 'from-emerald-500 to-emerald-600', roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'] },
        { name: 'Bills', href: '/bills', icon: Receipt, color: 'from-teal-500 to-teal-600', roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'] },
        { name: 'Products', href: '/products', icon: Package, color: 'from-green-500 to-green-600', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
        { name: 'Transactions', href: '/transactions', icon: ShoppingCart, color: 'from-purple-500 to-purple-600', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
        { name: 'Customers', href: '/customers', icon: Users, color: 'from-indigo-500 to-indigo-600', roles: ['OWNER', 'ADMIN', 'MANAGER', 'CASHIER'] },
        { name: 'Feedback', href: '/feedback', icon: MessageSquare, color: 'from-pink-500 to-pink-600', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
        { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-orange-500 to-orange-600', roles: ['OWNER', 'ADMIN', 'MANAGER'] },
    ];

    const handleLinkClick = () => {
        onClose(); // Close sidebar on mobile when link is clicked
    };

    // Filter navigation items based on user role
    const filteredNavigation = navigation.filter(item =>
        hasRole(item.roles)
    );

    return (
        <>
            {/* Fixed Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="flex flex-col h-full bg-white shadow-2xl border-r border-gray-200">
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
                        <div className="flex items-center justify-center">
                            <Logo showText={true} variant="white" className="text-xl font-bold" />
                        </div>
                        <div className="mt-2 text-center">
                            <div className="text-blue-100 text-sm">Point of Sale Analytics</div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {filteredNavigation.map((item, index) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={handleLinkClick}
                                    className={`
                                        group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105
                                        ${isActive
                                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'slideInLeft 0.6s ease-out forwards'
                                    }}
                                >
                                    <div className={`
                                        p-2 rounded-lg mr-3 transition-all duration-300
                                        ${isActive
                                            ? 'bg-white/20'
                                            : 'bg-gray-100 group-hover:bg-gray-200'
                                        }
                                    `}>
                                        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`} />
                                    </div>
                                    <span className="font-semibold">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="text-center">
                            <div className="text-xs text-gray-500 mb-2">Powered by</div>
                            <div className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Shoplytics
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <style jsx>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;