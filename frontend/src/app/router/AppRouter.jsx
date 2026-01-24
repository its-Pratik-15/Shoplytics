import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, ProtectedRoute } from '../../features/auth';
import { LandingPage } from '../../features/landing';
import { DashboardPage } from '../../features/dashboard';
import { ProductsPage, ProductEditPage } from '../../features/products';
import { CustomersPage } from '../../features/customers';
import { TransactionsPage } from '../../features/transactions';
import { FeedbackPage } from '../../features/feedback';
import { AnalyticsPage, MostSellingProductsPage, HighestRevenueProductsPage } from '../../features/analytics';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
            <Route
                path="/*"
                element={<LandingPage />} 
            />
        </Routes>
    );
};