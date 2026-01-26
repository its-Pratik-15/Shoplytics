import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/ui/Card';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import { productsAPI } from '../services/products.api';
import toast from 'react-hot-toast';

export const ProductForm = ({ product, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const isEditing = !!product;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: product || {
            name: '',
            description: '',
            sellingPrice: '',
            costPrice: '',
            quantity: '',
            category: '',
            sku: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'sellingPrice' || key === 'costPrice' || key === 'quantity') {
                    formData.append(key, parseFloat(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            });

            if (imageFile) {
                formData.append('images', imageFile); // Send as 'images' to match backend
            }

            let response;
            if (isEditing) {
                response = await productsAPI.updateProduct(product.id, formData);
            } else {
                response = await productsAPI.createProduct(formData);
            }

            if (response.success) {
                toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
                reset();
                setImageFile(null);
                setImagePreview(null);
                onSuccess(response.data);
            }
        } catch (error) {
            const message = error.response?.data?.error?.message ||
                `Failed to ${isEditing ? 'update' : 'create'} product`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-gray-600 mt-1">
                    {isEditing ? 'Update product information' : 'Fill in the details to add a new product'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <Input
                            {...register('name', {
                                required: 'Product name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' }
                            })}
                            error={errors.name?.message}
                            placeholder="Enter product name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU
                        </label>
                        <Input
                            {...register('sku', {
                                required: 'SKU is required',
                                pattern: {
                                    value: /^[A-Z0-9]+$/,
                                    message: 'SKU must contain only uppercase letters and numbers'
                                }
                            })}
                            error={errors.sku?.message}
                            placeholder="e.g., PROD001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.sku && (
                            <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        {...register('description', {
                            required: 'Description is required',
                            minLength: { value: 10, message: 'Description must be at least 10 characters' }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter product description"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selling Price (₹)
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            {...register('sellingPrice', {
                                required: 'Selling price is required',
                                min: { value: 0.01, message: 'Selling price must be greater than 0' }
                            })}
                            error={errors.sellingPrice?.message}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.sellingPrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.sellingPrice.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cost Price (₹)
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            {...register('costPrice', {
                                required: 'Cost price is required',
                                min: { value: 0.01, message: 'Cost price must be greater than 0' }
                            })}
                            error={errors.costPrice?.message}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.costPrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.costPrice.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                        </label>
                        <Input
                            type="number"
                            {...register('quantity', {
                                required: 'Quantity is required',
                                min: { value: 0, message: 'Quantity cannot be negative' }
                            })}
                            error={errors.quantity?.message}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <Input
                            {...register('category', {
                                required: 'Category is required'
                            })}
                            error={errors.category?.message}
                            placeholder="e.g., Beverages"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                    </label>

                    {/* Current Image Preview (for editing) */}
                    {isEditing && product?.imageUrls && product.imageUrls.length > 0 && !imagePreview && (
                        <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                            <div className="relative inline-block">
                                <img
                                    src={product.imageUrls[0]}
                                    alt="Current product"
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                            </div>
                        </div>
                    )}

                    {/* New Image Preview */}
                    {imagePreview && (
                        <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                        Upload an image (max 5MB). Supported formats: JPG, PNG, GIF
                        {isEditing && ' - Leave empty to keep current image'}
                    </p>
                    {imageFile && (
                        <p className="text-green-600 text-sm mt-1">
                            Selected: {imageFile.name}
                        </p>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
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