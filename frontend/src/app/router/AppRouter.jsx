import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ProtectedRoute } from '../../features/auth';
import { DashboardPage } from '../../features/dashboard';

// Placeholder Dashboard component
const Dashboard = () => (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-soft">
                    <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">$12,345</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-soft">
                    <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                    <p className="text-3xl font-bold text-success-600 mt-2">156</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-soft">
                    <h3 className="text-lg font-semibold text-gray-900">Customers</h3>
                    <p className="text-3xl font-bold text-warning-600 mt-2">89</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-soft">
                    <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                    <p className="text-3xl font-bold text-danger-600 mt-2">234</p>
                </div>
            </div>
        </div>
    </div>
);

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};