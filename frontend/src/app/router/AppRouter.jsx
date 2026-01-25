import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ProtectedRoute } from '../../features/auth';
import { LandingPage } from '../../features/landing';
import { DashboardPage } from '../../features/dashboard';
import { ProductsPage, ProductEditPage } from '../../features/products';
import { CustomersPage } from '../../features/customers';
import { TransactionsPage } from '../../features/transactions';
import { FeedbackPage } from '../../features/feedback';
import { AnalyticsPage, MostSellingProductsPage, HighestRevenueProductsPage } from '../../features/analytics';
import CustomerFeedbackPage from '../../features/feedback/pages/CustomerFeedbackPage';
import ScrollToTop from '../../shared/components/ScrollToTop';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const AppRouter = () => {
    const { user, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Public routes */}
                <Route path="/customer-feedback" element={<CustomerFeedbackPage />} />

                {/* Auth routes - redirect to dashboard if already authenticated */}
                <Route
                    path="/login"
                    element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
                />

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <ProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/new"
                    element={
                        <ProtectedRoute>
                            <ProductEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/:id/edit"
                    element={
                        <ProtectedRoute>
                            <ProductEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <CustomersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <TransactionsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/feedback"
                    element={
                        <ProtectedRoute>
                            <FeedbackPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AnalyticsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics/most-selling"
                    element={
                        <ProtectedRoute>
                            <MostSellingProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics/highest-revenue"
                    element={
                        <ProtectedRoute>
                            <HighestRevenueProductsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Root route - redirect based on authentication */}
                <Route
                    path="/"
                    element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
                />

                {/* Catch all route - redirect based on authentication */}
                <Route
                    path="*"
                    element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
                />
            </Routes>
        </>
    );
};