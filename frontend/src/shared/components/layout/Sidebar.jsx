import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    MessageSquare,
    BarChart3,
    Menu
} from 'lucide-react';
import Logo from '../ui/Logo';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/products', icon: Package },
        { name: 'Transactions', href: '/transactions', icon: ShoppingCart },
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Feedback', href: '/feedback', icon: MessageSquare },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ];

    const handleLinkClick = () => {
        onClose(); // Close sidebar on mobile when link is clicked
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Shoplytics Header - Only visible on desktop */}
                    <div className="hidden lg:flex items-center justify-center h-16 px-4 bg-blue-600">
                        <Logo showText={true} variant="white" />
                    </div>

                    {/* Mobile header spacer - matches header height */}
                    <div className="lg:hidden h-16"></div>


                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={handleLinkClick}
                                    className={`
                                        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                                        ${isActive
                                            ? 'bg-blue-100 text-blue-700'
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
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

export default Sidebar;