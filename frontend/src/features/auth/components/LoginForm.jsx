import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Logo from '../../../shared/components/ui/Logo';
import Footer from '../../../shared/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/ui/Card';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the intended destination from location state, default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    console.log('LoginForm - location.state:', location.state);
    console.log('LoginForm - from:', from);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const result = await login(data);
        if (result.success) {
            console.log('Login successful, navigating to:', from);
            // Navigate to the intended destination or dashboard
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <Logo size="lg" showText={true} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to your POS account
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Sign In</CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Demo Credentials */}
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <h4 className="text-sm font-medium text-blue-800 mb-3">Demo Credentials</h4>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue('email', 'admin@shoplytics.com');
                                                setValue('password', 'admin123');
                                            }}
                                            className="flex-1 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
                                        >
                                            Fill Admin Login
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue('email', 'cashier@shoplytics.com');
                                                setValue('password', 'cashier123');
                                            }}
                                            className="flex-1 px-3 py-2 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 transition-colors"
                                        >
                                            Fill Cashier Login
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters',
                                                },
                                            })}
                                            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <LogIn className="h-4 w-4 mr-2" />
                                            Sign In
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginForm;