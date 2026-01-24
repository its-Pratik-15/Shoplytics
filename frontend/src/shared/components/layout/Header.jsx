import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import Logo from '../ui/Logo';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left side - Mobile menu button + Logo */}
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>

                    {/* Logo and Brand */}
                    <Logo showText={true} className="lg:hidden" />
                </div>

                {/* Right side - User info and actions */}
                <div className="flex items-center space-x-4">
                    {/* User info */}
                    <div className="hidden md:flex items-center space-x-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Mobile user avatar */}
                    <div className="md:hidden">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Logout button - visible on all screen sizes */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;