import { useState } from 'react';
import { Card, Button } from '../../../shared/components/ui';

const QRCodeGenerator = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const feedbackUrl = `${window.location.origin}/customer-feedback`;

    const generateQRCode = async () => {
        setLoading(true);
        try {
            // Using QR Server API (free service)
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(feedbackUrl)}`;
            setQrCodeUrl(qrUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadQRCode = () => {
        if (qrCodeUrl) {
            const link = document.createElement('a');
            link.href = qrCodeUrl;
            link.download = 'shoplytics-feedback-qr.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const printQRCode = () => {
        if (qrCodeUrl) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Shoplytics Feedback QR Code</title>
                            <style>
                                body {
                                    font-family: 'Arial', sans-serif;
                                    text-align: center;
                                    padding: 40px;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    margin: 0;
                                    min-height: 100vh;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }
                                .qr-container {
                                    background: white;
                                    border-radius: 20px;
                                    padding: 40px;
                                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                                    max-width: 400px;
                                }
                                .title {
                                    font-size: 32px;
                                    font-weight: bold;
                                    margin-bottom: 10px;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    -webkit-background-clip: text;
                                    -webkit-text-fill-color: transparent;
                                    background-clip: text;
                                }
                                .subtitle {
                                    font-size: 18px;
                                    color: #666;
                                    margin-bottom: 30px;
                                }
                                .qr-image {
                                    border-radius: 15px;
                                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                                }
                                .instructions {
                                    font-size: 16px;
                                    margin-top: 30px;
                                    color: #333;
                                    line-height: 1.6;
                                }
                                .url {
                                    font-size: 12px;
                                    color: #888;
                                    margin-top: 20px;
                                    word-break: break-all;
                                    background: #f8f9fa;
                                    padding: 10px;
                                    border-radius: 8px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="qr-container">
                                <div class="title">Shoplytics</div>
                                <div class="subtitle">Share Your Experience</div>
                                <img src="${qrCodeUrl}" alt="Feedback QR Code" class="qr-image" />
                                <div class="instructions">
                                    📱 Scan this QR code with your phone camera<br>
                                    ⭐ Share your shopping experience with us<br>
                                    💬 Your feedback helps us improve
                                </div>
                                <div class="url">${feedbackUrl}</div>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="relative">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative p-8">
                    <div className="text-center">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Customer Feedback QR Code
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                                Generate a beautiful QR code for customers to easily access and share their feedback
                            </p>
                        </div>

                        {!qrCodeUrl ? (
                            <div className="space-y-4">
                                <Button
                                    onClick={generateQRCode}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Generating...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                            <span>Generate QR Code</span>
                                        </div>
                                    )}
                                </Button>
                                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">Feedback URL Preview</span>
                                    </div>
                                    <code className="text-xs break-all text-blue-600">{feedbackUrl}</code>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* QR Code Display */}
                                <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 inline-block shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="text-center space-y-4">
                                        <div className="text-xl font-bold text-gray-900">Shoplytics</div>
                                        <div className="text-sm text-gray-600 font-medium">Share Your Experience</div>
                                        <div className="relative group">
                                            <img
                                                src={qrCodeUrl}
                                                alt="Feedback QR Code"
                                                className="mx-auto rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium">
                                            📱 Scan to leave feedback
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        onClick={downloadQRCode}
                                        variant="outline"
                                        className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Download</span>
                                    </Button>

                                    <Button
                                        onClick={printQRCode}
                                        variant="outline"
                                        className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        <span>Print</span>
                                    </Button>

                                    <Button
                                        onClick={() => setQrCodeUrl('')}
                                        variant="outline"
                                        className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Generate New</span>
                                    </Button>
                                </div>

                                {/* URL Display */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2 mb-3">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="font-bold text-blue-900">Feedback URL</span>
                                        </div>
                                        <code className="text-sm break-all text-blue-700 bg-white px-4 py-2 rounded-lg border border-blue-200 inline-block">
                                            {feedbackUrl}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default QRCodeGenerator;