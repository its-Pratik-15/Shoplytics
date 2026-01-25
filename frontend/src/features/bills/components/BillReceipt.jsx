import { forwardRef } from 'react';
import { formatCurrency } from '../../../shared/utils';

const BillReceipt = forwardRef(({ bill, customer, items, discount, discountAmount, subtotal, tax, total }, ref) => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN');

    return (
        <>
            <style>
                {`
                    @media print {
                        @page {
                            size: 80mm auto;
                            margin: 0;
                        }
                        .receipt-container {
                            width: 80mm !important;
                            font-size: 12px !important;
                            line-height: 1.2 !important;
                            margin: 0 !important;
                            padding: 5mm !important;
                        }
                        .receipt-container * {
                            color: black !important;
                            background: white !important;
                        }
                    }
                `}
            </style>
            <div ref={ref} className="receipt-container bg-white p-8 max-w-md mx-auto" style={{ fontFamily: 'monospace' }}>
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">SHOPLYTICS</h1>
                    <p className="text-sm">Point of Sale System</p>
                    <p className="text-xs">GST: 29ABCDE1234F1Z5</p>
                    <div className="border-b border-dashed border-gray-400 my-2"></div>
                </div>

                {/* Bill Info */}
                <div className="mb-4 text-sm">
                    <div className="flex justify-between">
                        <span>Bill No:</span>
                        <span>#{bill?.id || 'DRAFT'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{currentDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{currentTime}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cashier:</span>
                        <span>{bill?.createdBy || 'Cashier'}</span>
                    </div>
                </div>

                {/* Customer Info */}
                {customer && customer.id !== 'walk-in' && (
                    <div className="mb-4 text-sm">
                        <div className="border-b border-dashed border-gray-400 mb-2"></div>
                        <div className="font-semibold">Customer Details:</div>
                        <div>{customer.name}</div>
                        {customer.phone && <div>Ph: {customer.phone}</div>}
                        {customer.email && <div>Email: {customer.email}</div>}
                    </div>
                )}

                <div className="border-b border-dashed border-gray-400 my-4"></div>

                {/* Items */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm font-semibold mb-2">
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Rate</span>
                        <span>Amount</span>
                    </div>
                    <div className="border-b border-gray-300 mb-2"></div>

                    {items.map((item, index) => (
                        <div key={index} className="mb-2">
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="flex justify-between text-sm">
                                <span></span>
                                <span>{item.quantity}</span>
                                <span>{formatCurrency(item.sellingPrice)}</span>
                                <span>{formatCurrency(item.sellingPrice * item.quantity)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-b border-dashed border-gray-400 my-4"></div>

                {/* Totals */}
                <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex justify-between">
                            <span>Discount:</span>
                            <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>

                    <div className="border-b border-gray-300 my-2"></div>

                    <div className="flex justify-between text-lg font-bold">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>

                <div className="border-b border-dashed border-gray-400 my-4"></div>

                {/* Footer */}
                <div className="text-center text-xs space-y-1">
                    <p>Thank you for shopping with us!</p>
                    <p>Visit again soon</p>
                    <p>For support: support@shoplytics.com</p>
                    <div className="mt-4">
                        <p>*** CUSTOMER COPY ***</p>
                    </div>
                </div>

                {/* QR Code placeholder */}
                <div className="text-center mt-4">
                    <div className="inline-block border-2 border-gray-300 p-2">
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs">
                            QR CODE
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

BillReceipt.displayName = 'BillReceipt';

export default BillReceipt;