import { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { formatCurrency } from '../../../shared/utils';
import { productsAPI } from '../services/products.api';
import toast from 'react-hot-toast';

export const ProductCard = ({ product, onEdit, onDelete }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setLoading(true);
            await productsAPI.deleteProduct(product.id);
            toast.success('Product deleted successfully');
            onDelete(product.id);
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to delete product';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const isLowStock = product.quantity <= 10;

    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
                {product.imageUrls && product.imageUrls.length > 0 && (
                    <div className="mb-3">
                        <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-md"
                        />
                    </div>
                )}

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                            {product.name}
                        </h3>
                        {isLowStock && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                Low Stock
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Price:</span>
                            <span className="font-semibold text-green-600">
                                {formatCurrency(product.price)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Stock:</span>
                            <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                {product.quantity} units
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Category:</span>
                            <span className="text-gray-900">{product.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">SKU:</span>
                            <span className="text-gray-900 font-mono">{product.sku}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="flex-1"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};