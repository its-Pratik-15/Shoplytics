import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Main content area with proper spacing for fixed sidebar */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="p-6 lg:p-8">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;