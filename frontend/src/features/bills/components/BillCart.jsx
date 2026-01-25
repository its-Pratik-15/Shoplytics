import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, Edit3, Check, X } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils';

const BillCart = ({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    discount = 0,
    discountType = 'percentage',
    onDiscountChange,
    onDiscountTypeChange
}) => {
    const [editingQuantity, setEditingQuantity] = useState(null);
    const [tempQuantity, setTempQuantity] = useState('');

    const subtotal = items.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

    const discountAmount = discountType === 'percentage'
        ? (subtotal * discount) / 100
        : discount;

    const total = Math.max(0, subtotal - discountAmount);
    const tax = total * 0.18; // 18% GST
    const finalTotal = total + tax;

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            onRemoveItem(itemId);
        } else {
            onUpdateQuantity(itemId, newQuantity);
        }
    };

    const startEditingQuantity = (itemId, currentQuantity) => {
        setEditingQuantity(itemId);
        setTempQuantity(currentQuantity.toString());
    };

    const saveQuantityEdit = (itemId) => {
        const newQuantity = parseInt(tempQuantity) || 1;
        handleQuantityChange(itemId, newQuantity);
        setEditingQuantity(null);
        setTempQuantity('');
    };

    const cancelQuantityEdit = () => {
        setEditingQuantity(null);
        setTempQuantity('');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-xl">
                        <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Bill Items</h3>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={onClearCart}
                        className="text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No items in bill</p>
                    <p className="text-gray-400 text-sm">Add products to start billing</p>
                </div>
            ) : (
                <>
                    {/* Items List */}
                    <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                                    <p className="text-xs text-gray-600">{formatCurrency(item.sellingPrice)} each</p>
                                    {item.quantity > item.stock && (
                                        <p className="text-xs text-red-600 font-medium">⚠️ Low stock ({item.stock} available)</p>
                                    )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-2 mx-4">
                                    {/* Decrement Button */}
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className="bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    {/* Quantity Display/Edit */}
                                    <div className="flex items-center">
                                        {editingQuantity === item.id ? (
                                            <div className="flex items-center space-x-1">
                                                <input
                                                    type="number"
                                                    value={tempQuantity}
                                                    onChange={(e) => setTempQuantity(e.target.value)}
                                                    className="w-16 text-center border border-gray-300 rounded px-1 py-1 text-sm"
                                                    min="1"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveQuantityEdit(item.id);
                                                        if (e.key === 'Escape') cancelQuantityEdit();
                                                    }}
                                                />
                                                <button
                                                    onClick={() => saveQuantityEdit(item.id)}
                                                    className="bg-green-100 text-green-600 p-1 rounded hover:bg-green-200 transition-colors"
                                                >
                                                    <Check className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={cancelQuantityEdit}
                                                    className="bg-gray-100 text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startEditingQuantity(item.id, item.quantity)}
                                                className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded border border-blue-200 transition-colors"
                                            >
                                                <span className="font-semibold text-blue-700">{item.quantity}</span>
                                                <Edit3 className="h-3 w-3 text-blue-600" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Increment Button */}
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="bg-green-100 text-green-600 p-1 rounded-full hover:bg-green-200 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors ml-2"
                                        title="Remove item"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div className="text-right min-w-0">
                                    <p className="font-bold text-gray-900 text-sm">
                                        {formatCurrency(item.sellingPrice * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Discount Section */}
                    <div className="border-t pt-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <label className="text-sm font-medium text-gray-700">Discount:</label>
                            <select
                                value={discountType}
                                onChange={(e) => onDiscountTypeChange?.(e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                            >
                                <option value="percentage">%</option>
                                <option value="fixed">₹</option>
                            </select>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => onDiscountChange?.(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                                placeholder="0"
                                min="0"
                                max={discountType === 'percentage' ? 100 : subtotal}
                            />
                        </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold">{formatCurrency(subtotal)}</span>
                        </div>

                        {discountAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount:</span>
                                <span className="font-semibold text-red-600">
                                    -{formatCurrency(discountAmount)}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">GST (18%):</span>
                            <span className="font-semibold">{formatCurrency(tax)}</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total:</span>
                            <span className="text-green-600">{formatCurrency(finalTotal)}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BillCart;