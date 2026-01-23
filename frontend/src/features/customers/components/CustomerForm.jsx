import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { customersAPI } from '../services/customers.api';
import toast from 'react-hot-toast';

export const CustomerForm = ({ customer, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);

    const isEditing = !!customer;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: customer || {
            name: '',
            email: '',
            phone: '',
            address: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            let response;
            if (isEditing) {
                response = await customersAPI.updateCustomer(customer.id, data);
            } else {
                response = await customersAPI.createCustomer(data);
            }

            if (response.success) {
                toast.success(`Customer ${isEditing ? 'updated' : 'created'} successfully`);
                reset();
                onSuccess(response.data);
            }
        } catch (error) {
            const message = error.response?.data?.error?.message ||
                `Failed to ${isEditing ? 'update' : 'create'} customer`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    {isEditing ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <p className="text-gray-600 mt-1">
                    {isEditing ? 'Update customer information' : 'Fill in the details to add a new customer'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            label="Full Name"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' }
                            })}
                            error={errors.name?.message}
                            placeholder="Enter customer name"
                        />
                    </div>

                    <div>
                        <Input
                            label="Email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            error={errors.email?.message}
                            placeholder="customer@example.com"
                        />
                    </div>
                </div>

                <div>
                    <Input
                        label="Phone Number"
                        {...register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^(\+91[-\s]?)?[0]?(91)?[6789]\d{9}$/,
                                message: 'Invalid Indian phone number'
                            }
                        })}
                        error={errors.phone?.message}
                        placeholder="+91-9876543210"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <textarea
                        {...register('address', {
                            required: 'Address is required',
                            minLength: { value: 10, message: 'Address must be at least 10 characters' }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter complete address"
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Customer' : 'Add Customer')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    );
};