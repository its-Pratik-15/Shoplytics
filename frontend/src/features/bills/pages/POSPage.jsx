import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Layout from '../../../shared/components/layout/Layout';
import ProductSelector from '../components/ProductSelector';
import BillCart from '../components/BillCart';
import CustomerSelector from '../components/CustomerSelector';
import BillReceipt from '../components/BillReceipt';
import { billsAPI } from '../services/bills.api';
import { useAuth } from '../../auth/hooks/useAuth';
import toast from 'react-hot-toast';
import {
    CreditCard,
    Banknote,
    Printer,
    Save,
    RefreshCw,
    Receipt
} from 'lucide-react';

const POSPage = () => {
    const [billItems, setBillItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentBill, setCurrentBill] = useState(null);
    const [, forceUpdate] = useState({}); // For manual re-renders when needed

    // Use refs for values that don't need immediate UI updates
    const paymentMethodRef = useRef('cash');
    const discountRef = useRef(0);
    const discountTypeRef = useRef('percentage');

    const receiptRef = useRef();
    const { user } = useAuth();

    // Calculate totals using ref values
    const subtotal = billItems.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    const discountAmount = discountTypeRef.current === 'percentage'
        ? (subtotal * discountRef.current) / 100
        : discountRef.current;
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const tax = afterDiscount * 0.18; // 18% GST
    const total = afterDiscount + tax;

    const handleAddProduct = (product) => {
        const existingItem = billItems.find(item => item.id === product.id);

        if (existingItem) {
            if (existingItem.quantity >= existingItem.stock) {
                toast.error('Not enough stock available');
                return;
            }
            setBillItems(items =>
                items.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            // Store original stock separately
            setBillItems(items => [...items, { ...product, quantity: 1, stock: product.quantity }]);
        }
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        const item = billItems.find(item => item.id === itemId);
        if (item && newQuantity > item.stock) {
            toast.error('Not enough stock available');
            return;
        }

        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
            return;
        }

        setBillItems(items =>
            items.map(item =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const handleRemoveItem = (itemId) => {
        setBillItems(items => items.filter(item => item.id !== itemId));
    };

    const handleClearCart = () => {
        setBillItems([]);
        setSelectedCustomer(null);
        discountRef.current = 0;
        discountTypeRef.current = 'percentage';
        paymentMethodRef.current = 'cash';
        setCurrentBill(null);
        forceUpdate({}); // Trigger re-render after clearing
    };

    const handleProcessBill = async () => {
        if (billItems.length === 0) {
            toast.error('Please add items to the bill');
            return;
        }

        try {
            setLoading(true);

            const billData = {
                customerId: selectedCustomer?.id !== 'walk-in' ? selectedCustomer?.id : null,
                items: billItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.sellingPrice,
                    subtotal: item.sellingPrice * item.quantity
                })),
                subtotal: subtotal,
                discount: discountAmount,
                tax: tax,
                total: total,
                paymentMode: paymentMethodRef.current.toUpperCase(), // Changed from paymentMethod to paymentMode with uppercase
                status: 'COMPLETED'
            };

            const response = await billsAPI.createBill(billData);

            if (response.success) {
                setCurrentBill(response.data);
                toast.success('Bill created successfully!');

                // Auto-print after successful bill creation
                setTimeout(() => {
                    handlePrint();
                }, 500);
            }
        } catch (error) {
            toast.error('Failed to create bill');
            console.error('Bill creation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        documentTitle: `Bill-${currentBill?.id || 'Draft'}`,
        onBeforeGetContent: () => {
            // Ensure the receipt content is ready
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 100);
            });
        },
        onAfterPrint: () => {
            toast.success('Receipt printed successfully!');
            // Clear the bill after printing
            setTimeout(() => {
                handleClearCart();
            }, 1000);
        },
        onPrintError: (error) => {
            console.error('Print error:', error);
            toast.error('Failed to print receipt');
        }
    });

    const handleSaveDraft = () => {
        if (billItems.length === 0) {
            toast.error('No items to save');
            return;
        }

        const draft = {
            items: billItems,
            customer: selectedCustomer,
            discount: discountRef.current,
            discountType: discountTypeRef.current,
            paymentMethod: paymentMethodRef.current,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('posDraft', JSON.stringify(draft));
        toast.success('Draft saved successfully!');
    };

    const handleLoadDraft = () => {
        const draft = localStorage.getItem('posDraft');
        if (draft) {
            const parsedDraft = JSON.parse(draft);
            setBillItems(parsedDraft.items || []);
            setSelectedCustomer(parsedDraft.customer || null);
            discountRef.current = parsedDraft.discount || 0;
            discountTypeRef.current = parsedDraft.discountType || 'percentage';
            paymentMethodRef.current = parsedDraft.paymentMethod || 'cash';
            forceUpdate({}); // Trigger re-render after loading
            toast.success('Draft loaded successfully!');
        } else {
            toast.error('No draft found');
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl shadow-xl p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="text-white">
                            <h1 className="text-4xl font-bold mb-2">Checkout Counter</h1>
                            <p className="text-green-100 text-lg">Create bills and process payments</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button
                                onClick={handleLoadDraft}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Load Draft</span>
                            </button>
                            <button
                                onClick={handleSaveDraft}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <Save className="h-4 w-4" />
                                <span>Save Draft</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Products */}
                    <div className="lg:col-span-2">
                        <ProductSelector onAddProduct={handleAddProduct} />
                    </div>

                    {/* Right Column - Bill & Customer */}
                    <div className="space-y-6">
                        {/* Customer Selection */}
                        <CustomerSelector
                            selectedCustomer={selectedCustomer}
                            onSelectCustomer={setSelectedCustomer}
                        />

                        {/* Bill Cart */}
                        <BillCart
                            items={billItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onClearCart={handleClearCart}
                            discount={discountRef.current}
                            discountType={discountTypeRef.current}
                            onDiscountChange={(value) => {
                                discountRef.current = value;
                                forceUpdate({});
                            }}
                            onDiscountTypeChange={(value) => {
                                discountTypeRef.current = value;
                                forceUpdate({});
                            }}
                        />

                        {/* Payment & Actions */}
                        {billItems.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment & Actions</h3>

                                {/* Payment Method */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => {
                                                paymentMethodRef.current = 'cash';
                                                forceUpdate({});
                                            }}
                                            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${paymentMethodRef.current === 'cash'
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <Banknote className="h-5 w-5" />
                                            <span>Cash</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                paymentMethodRef.current = 'card';
                                                forceUpdate({});
                                            }}
                                            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${paymentMethodRef.current === 'card'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <CreditCard className="h-5 w-5" />
                                            <span>Card</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleProcessBill}
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Receipt className="h-5 w-5" />
                                                <span>Process Bill & Print</span>
                                            </>
                                        )}
                                    </button>

                                    {currentBill && (
                                        <button
                                            onClick={handlePrint}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <Printer className="h-5 w-5" />
                                            <span>Print Receipt</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hidden Receipt for Printing */}
                <div style={{ display: 'none' }}>
                    <BillReceipt
                        ref={receiptRef}
                        bill={currentBill}
                        customer={selectedCustomer}
                        items={billItems}
                        discount={discountRef.current}
                        discountAmount={discountAmount}
                        subtotal={subtotal}
                        tax={tax}
                        total={total}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default POSPage;