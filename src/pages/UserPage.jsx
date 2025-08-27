import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import ProfileCard from '@components/ProfileCard';

export default function UserPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication and role
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user || user.role !== 'user') {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        // Load data
        loadData();
    }, [navigate]);

    const loadData = async () => {
        try {
            const response = await fetch('/data.json');
            const data = await response.json();
            setProducts(data.products.filter((p) => p.stock > 0)); // Only show available products
            setOrders(
                data.orders.filter(
                    (o) =>
                        o.userId ===
                        JSON.parse(localStorage.getItem('currentUser')).id
                )
            );
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                setCart(
                    cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                );
            } else {
                alert('Không đủ hàng trong kho!');
            }
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
    };

    const updateCartQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }

        const product = products.find((p) => p.id === productId);
        if (newQuantity > product.stock) {
            alert('Không đủ hàng trong kho!');
            return;
        }

        setCart(
            cart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const getCartTotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        const newOrder = {
            id: `o${Date.now()}`,
            userId: currentUser.id,
            items: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity
            })),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Add to orders (in real app, this would be sent to server)
        setOrders([...orders, newOrder]);
        setCart([]);
        setShowCart(false);
        setActiveTab('orders');
        alert('Đặt hàng thành công! Đơn hàng đang được xử lý.');
    };

    const getProductName = (productId) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    const getOrderTotal = (order) => {
        return order.items.reduce((total, item) => {
            const product = products.find((p) => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    if (!currentUser) {
        return <div>Đang tải...</div>;
    }

    return (
        <Layout>
            <div style={{ padding: '20px', minHeight: '80vh' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}
                >
                    <h1>Cửa hàng trực tuyến</h1>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <button
                            onClick={() => navigate('/user/edit-profile')}
                            style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            👤 Chỉnh sửa thông tin
                        </button>
                        <button
                            onClick={() => setShowCart(true)}
                            style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '10px 15px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            🛒 Giỏ hàng ({cart.length})
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div
                    style={{
                        marginBottom: '20px',
                        borderBottom: '1px solid #ddd'
                    }}
                >
                    <button
                        onClick={() => setActiveTab('products')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background:
                                activeTab === 'products'
                                    ? '#007bff'
                                    : 'transparent',
                            color:
                                activeTab === 'products' ? 'white' : '#007bff',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Sản phẩm
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background:
                                activeTab === 'orders'
                                    ? '#007bff'
                                    : 'transparent',
                            color: activeTab === 'orders' ? 'white' : '#007bff',
                            cursor: 'pointer'
                        }}
                    >
                        Đơn hàng của tôi
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div>
                        <h2>Danh sách Sản phẩm</h2>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '20px'
                            }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        background: 'white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: '0 0 10px 0',
                                            color: '#333'
                                        }}
                                    >
                                        {product.name}
                                    </h3>
                                    <p
                                        style={{
                                            margin: '0 0 15px 0',
                                            color: '#666',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {product.description}
                                    </p>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: '#e74c3c'
                                            }}
                                        >
                                            {product.price.toLocaleString()} VND
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                color: '#666'
                                            }}
                                        >
                                            Còn: {product.stock}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                        style={{
                                            width: '100%',
                                            background:
                                                product.stock > 0
                                                    ? '#007bff'
                                                    : '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            cursor:
                                                product.stock > 0
                                                    ? 'pointer'
                                                    : 'not-allowed'
                                        }}
                                    >
                                        {product.stock > 0
                                            ? 'Thêm vào giỏ'
                                            : 'Hết hàng'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        <h2>Đơn hàng của tôi</h2>
                        {orders.length === 0 ? (
                            <p
                                style={{
                                    textAlign: 'center',
                                    color: '#666',
                                    fontSize: '16px',
                                    margin: '40px 0'
                                }}
                            >
                                Bạn chưa có đơn hàng nào.
                            </p>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}
                            >
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            background: 'white',
                                            boxShadow:
                                                '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '15px'
                                            }}
                                        >
                                            <h3 style={{ margin: 0 }}>
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <span
                                                style={{
                                                    padding: '5px 15px',
                                                    borderRadius: '20px',
                                                    fontSize: '14px',
                                                    background:
                                                        order.status ===
                                                        'delivered'
                                                            ? '#d4edda'
                                                            : order.status ===
                                                                'pending'
                                                              ? '#fff3cd'
                                                              : '#f8d7da',
                                                    color:
                                                        order.status ===
                                                        'delivered'
                                                            ? '#155724'
                                                            : order.status ===
                                                                'pending'
                                                              ? '#856404'
                                                              : '#721c24'
                                                }}
                                            >
                                                {order.status === 'delivered'
                                                    ? 'Đã giao'
                                                    : order.status === 'pending'
                                                      ? 'Chờ xử lý'
                                                      : 'Đã hủy'}
                                            </span>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <strong>Sản phẩm:</strong>
                                            {order.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        marginLeft: '20px',
                                                        margin: '5px 0'
                                                    }}
                                                >
                                                    •{' '}
                                                    {getProductName(
                                                        item.productId
                                                    )}{' '}
                                                    x{item.quantity}
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span style={{ color: '#666' }}>
                                                Ngày đặt:{' '}
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    color: '#e74c3c'
                                                }}
                                            >
                                                Tổng:{' '}
                                                {getOrderTotal(
                                                    order
                                                ).toLocaleString()}{' '}
                                                VND
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Cart Modal */}
                {showCart && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}
                    >
                        <div
                            style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '8px',
                                maxWidth: '600px',
                                width: '90%',
                                maxHeight: '80vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}
                            >
                                <h2 style={{ margin: 0 }}>Giỏ hàng</h2>
                                <button
                                    onClick={() => setShowCart(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'black',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                        padding: '5px'
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <p
                                    style={{
                                        textAlign: 'center',
                                        color: '#666'
                                    }}
                                >
                                    Giỏ hàng trống
                                </p>
                            ) : (
                                <div>
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '15px',
                                                borderBottom: '1px solid #eee'
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <h4
                                                    style={{
                                                        margin: '0 0 5px 0'
                                                    }}
                                                >
                                                    {item.name}
                                                </h4>
                                                <span style={{ color: '#666' }}>
                                                    {item.price.toLocaleString()}{' '}
                                                    VND
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    style={{
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span
                                                    style={{
                                                        minWidth: '20px',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    style={{
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                    style={{
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        marginLeft: '10px'
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div
                                        style={{
                                            marginTop: '20px',
                                            padding: '15px',
                                            background: '#f8f9fa',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '15px'
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Tổng cộng:
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: 'bold',
                                                    color: '#e74c3c'
                                                }}
                                            >
                                                {getCartTotal().toLocaleString()}{' '}
                                                VND
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleCheckout}
                                            style={{
                                                width: '100%',
                                                background: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '15px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Đặt hàng
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
