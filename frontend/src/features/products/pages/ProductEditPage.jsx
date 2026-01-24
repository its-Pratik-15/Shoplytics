import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { ProductForm } from '../components/ProductForm';
import { productsAPI } from '../services/products.api';
import toast from 'react-hot-toast';

export const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getProduct(id);
            if (response.success) {
                setProduct(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch product');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleFormSuccess = () => {
        navigate('/products');
    };

    const handleFormCancel = () => {
        navigate('/products');
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {id ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p className="text-gray-600">
                            {id ? 'Update product information' : 'Create a new product'}
                        </p>
                    </div>
                </div>

                <ProductForm
                    product={product}
                    onSuccess={handleFormSuccess}
                    onCancel={handleFormCancel}
                />
            </div>
        </Layout>
    );
};