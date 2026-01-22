import { forwardRef } from 'react';
import { cn } from '../../utils';

const Button = forwardRef(({
    className,
    variant = 'primary',
    size = 'default',
    disabled,
    children,
    ...props
}, ref) => {
    const baseClasses = 'btn';

    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        danger: 'btn-danger',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 text-base',
    };

    return (
        <button
            className={cn(
                baseClasses,
                variants[variant],
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;