import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ProtectedRoute } from '../../features/auth';
import { LandingPage } from '../../features/landing';
import { DashboardPage } from '../../features/dashboard';
import { ProductsPage, ProductEditPage } from '../../features/products';
import { CustomersPage } from '../../features/customers';
import { TransactionsPage } from '../../features/transactions';
import { FeedbackPage } from '../../features/feedback';
import { AnalyticsPage, MostSellingProductsPage, HighestRevenueProductsPage } from '../../features/analytics';
import { POSPage } from '../../features/bills';
import CustomerFeedbackPage from '../../features/feedback/pages/CustomerFeedbackPage';
import ScrollToTop from '../../shared/components/ScrollToTop';
import { useAuth } from '../../features/auth/hooks/useAuth';

/**
 * Role-Based Access Control (RBAC) for Routes
 * 
 * ROLE HIERARCHY (from highest to lowest permissions):
 * 1. OWNER - Full system access, business owner
 * 2. ADMIN - Administrative access, can manage most features
 * 3. MANAGER - Management access, can view analytics and manage operations
 * 4. CASHIER - Basic access, can only handle sales operations
 * 
 * ACCESS LEVELS:
 * - Management Features: OWNER, ADMIN, MANAGER only
 *   (Dashboard, Analytics, Transactions, Feedback, Product Management)
 * - Sales Operations: All roles (OWNER, ADMIN, MANAGER, CASHIER)
 *   (POS, Bills, Customers)
 * - Public: No authentication required
 *   (Customer Feedback, Landing Page)
 */

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

    // Helper function to get default route based on user role
    const getDefaultRoute = () => {
        if (!user) return '/';

        // CASHIER goes to POS (billing), all others go to Dashboard
        if (user.role === 'CASHIER') {
            return '/pos';
        }
        return '/dashboard';
    };

    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Public routes */}
                <Route path="/customer-feedback" element={<CustomerFeedbackPage />} />

                {/* Auth routes - redirect to appropriate page if already authenticated */}
                <Route
                    path="/login"
                    element={user ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to={getDefaultRoute()} replace /> : <RegisterPage />}
                />

                {/* Protected routes with role-based access */}

                {/* OWNER, ADMIN, MANAGER only - Management Features */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <AnalyticsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics/most-selling"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <MostSellingProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics/highest-revenue"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <HighestRevenueProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <TransactionsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/feedback"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <FeedbackPage />
                        </ProtectedRoute>
                    }
                />

                {/* OWNER, ADMIN, MANAGER only - Product Management */}
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <ProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/new"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <ProductEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/:id/edit"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER']}>
                            <ProductEditPage />
                        </ProtectedRoute>
                    }
                />

                {/* All authenticated users - Sales Operations */}
                <Route
                    path="/pos"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']}>
                            <POSPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bills"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']}>
                            <POSPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute requiredRoles={['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']}>
                            <CustomersPage />
                        </ProtectedRoute>
                    }
                />

                {/* Root route - redirect based on authentication and role */}
                <Route
                    path="/"
                    element={user ? <Navigate to={getDefaultRoute()} replace /> : <LandingPage />}
                />

                {/* Catch all route - redirect based on authentication and role */}
                <Route
                    path="*"
                    element={user ? <Navigate to={getDefaultRoute()} replace /> : <Navigate to="/" replace />}
                />
            </Routes>
        </>
    );
};