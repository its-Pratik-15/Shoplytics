import { useState, useEffect } from 'react';
import { Layout } from '../../../shared/components/layout/Layout';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { productsAPI } from '../services/products.api';
import { debounce } from '../../../shared/utils';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            fetchProducts();
        }, 300);

        debouncedSearch();
    }, [searchTerm, categoryFilter]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (categoryFilter) params.category = categoryFilter;

            const response = await productsAPI.getProducts(params);
            if (response.success) {
                setProducts(response.data);

                // Extract unique categories
                const uniqueCategories = [...new Set(response.data.map(p => p.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
    };

    const handleFormSuccess = (productData) => {
        if (editingProduct) {
            // Update existing product
            setProducts(products.map(p =>
                p.id === editingProduct.id ? productData : p
            ));
        } else {
            // Add new product
            setProducts([productData, ...products]);
        }
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const lowStockProducts = products.filter(p => p.quantity <= 10);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600">
                            Manage your product inventory ({products.length} products)
                        </p>
                    </div>
                    <Button onClick={handleAddProduct}>
                        Add Product
                    </Button>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Low Stock Alert
                                </h3>
                                <p className="text-sm text-red-700">
                                    {lowStockProducts.length} product(s) are running low on stock
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Form */}
                {showForm && (
                    <ProductForm
                        product={editingProduct}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                )}

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || categoryFilter ? 'Try adjusting your search filters.' : 'Get started by adding your first product.'}
                        </p>
                        {!searchTerm && !categoryFilter && (
                            <div className="mt-6">
                                <Button onClick={handleAddProduct}>
                                    Add Product
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};