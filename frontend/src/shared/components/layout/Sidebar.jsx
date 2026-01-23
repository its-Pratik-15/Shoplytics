import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    MessageSquare,
    BarChart3,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../../features/auth/hooks/useAuth';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { logout, user } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Transactions', href: '/transactions', icon: ShoppingCart },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Feedback', href: '/feedback', icon: MessageSquare },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md bg-white shadow-md"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
                        <h1 className="text-xl font-bold text-white">Shoplytics</h1>
                    </div>

                    {/* User info */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary-600">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;