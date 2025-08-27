import React from 'react';
import styles from '@styles/components/Card.module.scss';

export function Card({
    children,
    className = '',
    clickable = false,
    bordered = false,
    elevated = false,
    onClick,
    ...props
}) {
    const cardClasses = [
        styles.card,
        clickable ? styles.clickable : '',
        bordered ? styles.bordered : '',
        elevated ? styles.elevated : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClasses} onClick={onClick} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({
    children,
    title,
    subtitle,
    noBorder = false,
    className = ''
}) {
    const headerClasses = [
        styles.cardHeader,
        noBorder ? styles.noBorder : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={headerClasses}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {children}
        </div>
    );
}

export function CardContent({
    children,
    compact = false,
    spacious = false,
    className = ''
}) {
    const contentClasses = [
        styles.cardContent,
        compact ? styles.compact : '',
        spacious ? styles.spacious : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={contentClasses}>{children}</div>;
}

export function CardActions({ children, position = 'end', className = '' }) {
    const actionsClasses = [styles.cardActions, styles[position], className]
        .filter(Boolean)
        .join(' ');

    return <div className={actionsClasses}>{children}</div>;
}

// Product Card Component
export function ProductCard({ product, onAddToCart, className = '' }) {
    const getStockStatus = (stock) => {
        if (stock === 0) return 'outOfStock';
        if (stock <= 5) return 'lowStock';
        return 'inStock';
    };

    const getStockText = (stock) => {
        if (stock === 0) return 'Hết hàng';
        if (stock <= 5) return `Còn ${stock}`;
        return `Còn ${stock}`;
    };

    return (
        <div className={`${styles.productCard} ${className}`}>
            {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                />
            )}

            <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>
                    {product.description}
                </p>
                <div className={styles.productPrice}>
                    {product.price.toLocaleString()} VND
                </div>
                <div className={styles.productMeta}>
                    <span
                        className={`${styles.stock} ${styles[getStockStatus(product.stock)]}`}
                    >
                        {getStockText(product.stock)}
                    </span>
                    <span>
                        {new Date(product.createdAt).toLocaleDateString(
                            'vi-VN'
                        )}
                    </span>
                </div>
            </div>

            {onAddToCart && (
                <div className={styles.productActions}>
                    <button
                        className={styles.addToCartBtn}
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                    >
                        {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                </div>
            )}
        </div>
    );
}

// Order Card Component
export function OrderCard({ order, products = [], className = '' }) {
    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'delivered':
                return 'Đã giao';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getProductName = (productId) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.name : 'Sản phẩm không tồn tại';
    };

    const getOrderTotal = () => {
        return order.items.reduce((total, item) => {
            const product = products.find((p) => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    return (
        <div className={`${styles.orderCard} ${className}`}>
            <div className={styles.orderHeader}>
                <span className={styles.orderNumber}>Đơn hàng #{order.id}</span>
                <span
                    className={`${styles.orderStatus} ${styles[order.status]}`}
                >
                    {getStatusText(order.status)}
                </span>
            </div>

            <div className={styles.orderItems}>
                {order.items.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
                        <span className={styles.itemName}>
                            {getProductName(item.productId)}
                        </span>
                        <span className={styles.itemQuantity}>
                            x{item.quantity}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.orderFooter}>
                <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </span>
                <span className={styles.orderTotal}>
                    {getOrderTotal().toLocaleString()} VND
                </span>
            </div>
        </div>
    );
}

export default Card;


