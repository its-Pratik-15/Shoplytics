import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import PublicNavbar from '../../../shared/components/layout/PublicNavbar';

const LoginPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    console.log('LoginPage - user:', user);
    console.log('LoginPage - loading:', loading);
    console.log('LoginPage - location.state:', location.state);

    useEffect(() => {
        if (!loading && user) {
            // If user is already authenticated, redirect to intended destination or dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            console.log('LoginPage - user already authenticated, redirecting to:', from);
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, location.state]);

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

    // If user is authenticated, don't render the form (redirect will happen)
    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            <div className="pt-16">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;