import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Logo from '../../../shared/components/ui/Logo';
import Footer from '../../../shared/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/ui/Card';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register: registerUser, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the intended destination from location state, default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data;
        const result = await registerUser(userData);
        if (result.success) {
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
                            Join Shoplytics
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Create your POS account
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Sign Up</CardTitle>
                            <CardDescription className="text-center">
                                Fill in your details to create an account
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        {...register('name', {
                                            required: 'Name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters',
                                            },
                                        })}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
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
                                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                                        Account Type
                                    </label>
                                    <select
                                        id="userType"
                                        {...register('userType', { required: 'Account type is required' })}
                                        className="input"
                                    >
                                        <option value="">Select account type</option>
                                        <option value="user">Business Owner/Admin</option>
                                        <option value="employee">Employee/Staff</option>
                                    </select>
                                    {errors.userType && (
                                        <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        {...register('role', { required: 'Role is required' })}
                                        className="input"
                                    >
                                        <option value="">Select a role</option>
                                        {watch('userType') === 'user' && (
                                            <>
                                                <option value="OWNER">Owner</option>
                                                <option value="ADMIN">Admin</option>
                                            </>
                                        )}
                                        {watch('userType') === 'employee' && (
                                            <>
                                                <option value="CASHIER">Cashier</option>
                                                <option value="MANAGER">Manager</option>
                                            </>
                                        )}
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm your password"
                                            {...register('confirmPassword', {
                                                required: 'Please confirm your password',
                                                validate: (value) =>
                                                    value === password || 'Passwords do not match',
                                            })}
                                            className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                                            Creating account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Create Account
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Sign in here
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

export default RegisterForm;