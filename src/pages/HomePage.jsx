import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import { ProductCard } from '@components/Card';
import Button from '@components/Button';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        // Load products from data.json instead of API
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await fetch('/data.json');
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
    };

    const handleDashboard = () => {
        if (currentUser.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/user');
        }
    };

    return (
        <Layout>
            <div className='container' style={{ padding: '40px 20px', minHeight: '600px' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '40px',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}
                >
                    <h1
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1976d2',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        🛍️ Cửa hàng QLBH
                    </h1>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}
                    >
                        {!currentUser ? (
                            <Button
                                variant='secondary'
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </Button>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                            >
                                <span
                                    style={{
                                        color: '#666',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Xin chào,{' '}
                                    <strong>{currentUser.name}</strong>
                                </span>
                                <Button
                                    variant='primary'
                                    onClick={handleDashboard}
                                >
                                    {currentUser.role === 'admin'
                                        ? 'Quản trị'
                                        : 'Cửa hàng'}
                                </Button>
                                <Button
                                    variant='danger'
                                    size='small'
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h2
                        style={{
                            fontSize: '1.75rem',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}
                    >
                        Danh sách sản phẩm
                    </h2>
                    <p style={{ color: '#666', fontSize: '1rem' }}>
                        Khám phá các sản phẩm chất lượng cao với giá cả hợp lý
                    </p>
                </div>

                {products.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#666'
                        }}
                    >
                        <h3>Chưa có sản phẩm nào</h3>
                        <p>Vui lòng quay lại sau để xem các sản phẩm mới.</p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '24px'
                        }}
                    >
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={
                                    currentUser
                                        ? () =>
                                              alert(
                                                  `Thêm ${product.name} vào giỏ hàng!`
                                              )
                                        : null
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
