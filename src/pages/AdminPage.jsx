import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import AdminProfileCard from '@components/AdminProfileCard';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '@apis/ApiProducts';
import { getOrders, updateOrderStatus } from '@apis/ApiOrders';
import { getUsers } from '@apis/ApiUser';

export default function AdminPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication and role
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        // Load data
        void loadData();
    }, [navigate]);

    const loadData = async () => {
        try {
            // Load data using API calls
            const [productsData, ordersData, usersData] = await Promise.all([
                getProducts(),
                getOrders(),
                getUsers()
            ]);

            setProducts(productsData);
            setOrders(ordersData);
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
            return;
        }

        try {
            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: parseInt(newProduct.price),
                stock: parseInt(newProduct.stock),
                createdBy: currentUser.id,
                createdAt: new Date().toISOString()
            };

            const newProductData = await createProduct(productData);
            setProducts([...products, newProductData]);
            setNewProduct({ name: '', description: '', price: '', stock: '' });
            setShowAddProduct(false);
            alert('Thêm sản phẩm thành công!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Có lỗi xảy ra khi thêm sản phẩm!');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString()
        });
        setShowAddProduct(true);
    };

    const handleUpdateProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
            return;
        }

        try {
            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: parseInt(newProduct.price),
                stock: parseInt(newProduct.stock)
            };

            const updatedProductData = await updateProduct(
                editingProduct.id,
                productData
            );

            const updatedProducts = products.map((p) =>
                p.id === editingProduct.id ? updatedProductData : p
            );

            setProducts(updatedProducts);
            setNewProduct({ name: '', description: '', price: '', stock: '' });
            setShowAddProduct(false);
            setEditingProduct(null);
            alert('Cập nhật sản phẩm thành công!');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await deleteProduct(productId);
                setProducts(products.filter((p) => p.id !== productId));
                alert('Xóa sản phẩm thành công!');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm!');
            }
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const updatedOrderData = await updateOrderStatus(
                orderId,
                newStatus
            );

            const updatedOrders = orders.map((order) =>
                order.id === orderId ? updatedOrderData : order
            );
            setOrders(updatedOrders);
            alert(`Cập nhật trạng thái đơn hàng thành ${newStatus}!`);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!');
        }
    };

    const getOrderTotal = (order) => {
        return order.items.reduce((total, item) => {
            const product = products.find((p) => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const getUserName = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.name : 'Unknown';
    };

    const getProductName = (productId) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.name : 'Unknown Product';
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
                    <h1>Trang Quản Trị</h1>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }}
                    >
                        <button
                            onClick={() => navigate('/admin/edit-profile')}
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
                        Quản lý Sản phẩm
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
                        Quản lý Đơn hàng
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}
                        >
                            <h2>Danh sách Sản phẩm</h2>
                            <button
                                onClick={() => {
                                    setShowAddProduct(true);
                                    setEditingProduct(null);
                                    setNewProduct({
                                        name: '',
                                        description: '',
                                        price: '',
                                        stock: ''
                                    });
                                }}
                                style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                + Thêm Sản phẩm
                            </button>
                        </div>

                        {/* Add/Edit Product Form */}
                        {showAddProduct && (
                            <div
                                style={{
                                    background: '#f8f9fa',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    marginBottom: '20px'
                                }}
                            >
                                <h3>
                                    {editingProduct
                                        ? 'Sửa Sản phẩm'
                                        : 'Thêm Sản phẩm mới'}
                                </h3>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '15px'
                                    }}
                                >
                                    <input
                                        type='text'
                                        placeholder='Tên sản phẩm'
                                        value={newProduct.name}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                name: e.target.value
                                            })
                                        }
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <input
                                        type='number'
                                        placeholder='Giá (VND)'
                                        value={newProduct.price}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                price: e.target.value
                                            })
                                        }
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <input
                                        type='number'
                                        placeholder='Số lượng tồn kho'
                                        value={newProduct.stock}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                stock: e.target.value
                                            })
                                        }
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <textarea
                                        placeholder='Mô tả sản phẩm'
                                        value={newProduct.description}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                description: e.target.value
                                            })
                                        }
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            gridColumn: 'span 2'
                                        }}
                                    />
                                </div>
                                <div style={{ marginTop: '15px' }}>
                                    <button
                                        onClick={
                                            editingProduct
                                                ? handleUpdateProduct
                                                : handleAddProduct
                                        }
                                        style={{
                                            background: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '10px'
                                        }}
                                    >
                                        {editingProduct ? 'Cập nhật' : 'Thêm'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddProduct(false);
                                            setEditingProduct(null);
                                            setNewProduct({
                                                name: '',
                                                description: '',
                                                price: '',
                                                stock: ''
                                            });
                                        }}
                                        style={{
                                            background: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Products Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    background: 'white',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Tên sản phẩm
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Mô tả
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'right',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Giá
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Tồn kho
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr
                                            key={product.id}
                                            style={{
                                                borderBottom:
                                                    index < products.length - 1
                                                        ? '1px solid #eee'
                                                        : 'none'
                                            }}
                                        >
                                            <td style={{ padding: '15px' }}>
                                                {product.name}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    maxWidth: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {product.description}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {product.price.toLocaleString()}{' '}
                                                VND
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {product.stock}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleEditProduct(
                                                            product
                                                        )
                                                    }
                                                    style={{
                                                        background: '#ffc107',
                                                        color: 'black',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        marginRight: '5px'
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteProduct(
                                                            product.id
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
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        <h2>Quản lý Đơn hàng</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table
                                style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    background: 'white',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <thead>
                                    <tr style={{ background: '#f8f9fa' }}>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Mã đơn
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Khách hàng
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Sản phẩm
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'right',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Tổng tiền
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Trạng thái
                                        </th>
                                        <th
                                            style={{
                                                padding: '15px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid #ddd'
                                            }}
                                        >
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr
                                            key={order.id}
                                            style={{
                                                borderBottom:
                                                    index < orders.length - 1
                                                        ? '1px solid #eee'
                                                        : 'none'
                                            }}
                                        >
                                            <td style={{ padding: '15px' }}>
                                                {order.id}
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                {getUserName(order.userId)}
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                {order.items.map(
                                                    (item, idx) => (
                                                        <div key={idx}>
                                                            {getProductName(
                                                                item.productId
                                                            )}{' '}
                                                            x{item.quantity}
                                                        </div>
                                                    )
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'right'
                                                }}
                                            >
                                                {getOrderTotal(
                                                    order
                                                ).toLocaleString()}{' '}
                                                VND
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding: '5px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
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
                                                    {order.status ===
                                                    'delivered'
                                                        ? 'Đã giao'
                                                        : order.status ===
                                                            'pending'
                                                          ? 'Chờ xử lý'
                                                          : 'Đã hủy'}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: '15px',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {order.status === 'pending' && (
                                                    <div>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateOrderStatus(
                                                                    order.id,
                                                                    'delivered'
                                                                )
                                                            }
                                                            style={{
                                                                background:
                                                                    '#28a745',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding:
                                                                    '5px 10px',
                                                                borderRadius:
                                                                    '4px',
                                                                cursor: 'pointer',
                                                                marginRight:
                                                                    '5px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            Giao hàng
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateOrderStatus(
                                                                    order.id,
                                                                    'cancelled'
                                                                )
                                                            }
                                                            style={{
                                                                background:
                                                                    '#dc3545',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding:
                                                                    '5px 10px',
                                                                borderRadius:
                                                                    '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            Hủy
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
