import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import Logo from '../ui/Logo';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left side - Mobile menu button + Logo */}
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-110"
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>

                    {/* Logo and Brand - Mobile only */}
                    <div className="lg:hidden">
                        <Logo showText={true} className="text-xl font-bold" />
                    </div>
                </div>

                {/* Right side - User info and actions */}
                <div className="flex items-center space-x-3">

                    {/* User info */}
                    <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors duration-300">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-sm font-bold text-white">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Mobile user avatar */}
                    <div className="md:hidden">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-sm font-bold text-white">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm font-semibold text-gray-600 rounded-xl hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
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