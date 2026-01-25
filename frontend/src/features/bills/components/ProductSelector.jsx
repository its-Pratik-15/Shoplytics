import { useState, useEffect } from 'react';
import { Search, Plus, Package } from 'lucide-react';
import { billsAPI } from '../services/bills.api';
import toast from 'react-hot-toast';

const ProductSelector = ({ onAddProduct }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await billsAPI.getProductsForPOS();
            if (response.success) {
                setProducts(response.data);
                setFilteredProducts(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    };

    const categories = [...new Set(products.map(p => p.category))];

    const handleAddProduct = (product) => {
        if (product.quantity <= 0) {
            toast.error('Product is out of stock');
            return;
        }
        onAddProduct(product);
        toast.success(`${product.name} added to bill`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-xl">
                    <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Select Products</h3>
            </div>

            {/* Search and Filter */}
            <div className="space-y-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleAddProduct(product)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddProduct(product);
                                }}
                                className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-600">
                                ₹{product.sellingPrice}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${product.quantity > 10
                                    ? 'bg-green-100 text-green-800'
                                    : product.quantity > 0
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                Stock: {product.quantity}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No products found</p>
                </div>
            )}
        </div>
    );
};

export default ProductSelector;