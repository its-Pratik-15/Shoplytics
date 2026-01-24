import { ShoppingBag } from 'lucide-react';

const Logo = ({ size = 'md', showText = true, className = '', variant = 'default' }) => {
    const sizes = {
        sm: {
            icon: 'h-4 w-4',
            text: 'text-lg',
            container: 'w-6 h-6'
        },
        md: {
            icon: 'h-5 w-5',
            text: 'text-xl',
            container: 'w-8 h-8'
        },
        lg: {
            icon: 'h-6 w-6',
            text: 'text-2xl',
            container: 'w-10 h-10'
        }
    };

    const variants = {
        default: {
            container: 'bg-blue-600',
            icon: 'text-white',
            text: 'text-gray-900'
        },
        white: {
            container: 'bg-white',
            icon: 'text-blue-600',
            text: 'text-white'
        }
    };

    const currentSize = sizes[size];
    const currentVariant = variants[variant];

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <div className={`flex items-center justify-center ${currentSize.container} ${currentVariant.container} rounded-lg`}>
                <ShoppingBag className={`${currentSize.icon} ${currentVariant.icon}`} />
            </div>
            {showText && (
                <h1 className={`${currentSize.text} font-bold ${currentVariant.text}`}>
                    Shoplytics
                </h1>
            )}
        </div>
    );
};

export default Logo;