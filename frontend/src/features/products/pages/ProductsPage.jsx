import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import Input from '../../../shared/components/ui/Input';
import { ProductCard } from '../components/ProductCard';
import { productsAPI } from '../services/products.api';
import { debounce } from '../../../shared/utils';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';
import { Plus, AlertTriangle, Package, Search, Filter } from 'lucide-react';

export const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { hasRole, user } = useAuth();

    // Check if user can manage products (OWNER, ADMIN, MANAGER)
    const canManageProducts = hasRole(['OWNER', 'ADMIN', 'MANAGER']);

    useEffect(() => {
        fetchProducts();
        fetchCategories(); // Fetch categories separately
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
            }
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Fetch all products to get all categories
            const response = await productsAPI.getProducts({});
            if (response.success) {
                const uniqueCategories = [...new Set(response.data.map(p => p.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleAddProduct = () => {
        if (!canManageProducts) {
            toast.error('You do not have permission to add products');
            return;
        }

        navigate('/products/new');
    };

    const handleDeleteProduct = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
    };

    const lowStockProducts = products.filter(p => p.quantity <= 10);
    const totalValue = products.reduce((sum, p) => sum + (Number(p.sellingPrice) * p.quantity), 0);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative px-8 py-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="text-white">
                                <h1 className="text-4xl font-bold mb-2 tracking-tight">
                                    Product Inventory
                                </h1>
                                <p className="text-blue-100 text-lg">
                                    Manage your {products.length} products worth ₹{totalValue.toLocaleString()}
                                </p>
                            </div>
                            <div className="mt-6 md:mt-0 flex space-x-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{products.length}</div>
                                        <div className="text-blue-100 text-sm">Total Products</div>
                                    </div>
                                </div>
                                {canManageProducts && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAddProduct();
                                        }}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center space-x-2"
                                        type="button"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>Add Product</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Value</p>
                                <p className="text-3xl font-bold mt-1">₹{totalValue.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Package className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Categories</p>
                                <p className="text-3xl font-bold mt-1">{categories.length}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Filter className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Low Stock</p>
                                <p className="text-3xl font-bold mt-1">{lowStockProducts.length}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="bg-red-500 p-2 rounded-xl">
                                    <AlertTriangle className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-red-900 mb-2">
                                    Low Stock Alert! ⚠️
                                </h3>
                                <p className="text-red-700 mb-4">
                                    {lowStockProducts.length} product(s) are running low on stock and need immediate attention.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {lowStockProducts.slice(0, 3).map(product => (
                                        <span key={product.id} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {product.name} ({product.quantity} left)
                                        </span>
                                    ))}
                                    {lowStockProducts.length > 3 && (
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                            +{lowStockProducts.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Products
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    placeholder="Search by name, description, or SKU..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="lg:w-64">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
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
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-lg">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <Package className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 text-lg mb-6">
                                {searchTerm || categoryFilter ? 'Try adjusting your search filters.' : 'Get started by adding your first product.'}
                            </p>
                            {searchTerm || categoryFilter ? (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setCategoryFilter('');
                                    }}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            ) : canManageProducts ? (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddProduct();
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                                    type="button"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Add Your First Product</span>
                                </button>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="transform hover:scale-105 transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <ProductCard
                                    product={product}
                                    onDelete={handleDeleteProduct}
                                    canManage={canManageProducts}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Layout>
    );
};