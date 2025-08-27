import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/Layout';
import styles from '@styles/components/EditProfile.module.scss';

export default function EditProfilePage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        avatar: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        // Load user data
        loadUserData(user);
    }, [navigate]);

    const loadUserData = async (user) => {
        try {
            // In real app, this would be an API call
            // For now, we'll use mock data
            const mockUserData = {
                fullName: user.fullName || user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                dateOfBirth: user.dateOfBirth || '',
                gender: user.gender || '',
                avatar: user.avatar || ''
            };
            setFormData(mockUserData);
        } catch (error) {
            console.error('Error loading user data:', error);
            setMessage({
                type: 'error',
                text: 'Không thể tải thông tin người dùng'
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData((prev) => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Validate form
            if (!formData.fullName.trim()) {
                throw new Error('Họ tên không được để trống');
            }
            if (!formData.email.trim()) {
                throw new Error('Email không được để trống');
            }
            if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
                throw new Error('Số điện thoại không hợp lệ');
            }

            // In real app, this would be an API call
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Update local storage
            const updatedUser = {
                ...currentUser,
                ...formData
            };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            setMessage({
                type: 'success',
                text: 'Cập nhật thông tin thành công!'
            });

            // Redirect back to user page after 2 seconds
            setTimeout(() => {
                navigate('/user');
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/user');
    };

    if (!currentUser) {
        return <div>Đang tải...</div>;
    }

    return (
        <Layout>
            <div className={styles.editProfileContainer}>
                <div className={styles.header}>
                    <h1>Chỉnh sửa thông tin cá nhân</h1>
                    <p>Cập nhật thông tin cá nhân của bạn</p>
                </div>

                {message.text && (
                    <div
                        className={`${styles.message} ${styles[message.type]}`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarContainer}>
                            <img
                                src={formData.avatar || '/default-avatar.png'}
                                alt='Avatar'
                                className={styles.avatar}
                                onError={(e) => {
                                    e.target.src =
                                        'https://via.placeholder.com/150x150?text=Avatar';
                                }}
                            />
                            <div className={styles.avatarOverlay}>
                                <label
                                    htmlFor='avatar-upload'
                                    className={styles.avatarUpload}
                                >
                                    <span>📷</span>
                                    <span>Thay đổi ảnh</span>
                                </label>
                                <input
                                    id='avatar-upload'
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor='fullName'>Họ và tên *</label>
                            <input
                                type='text'
                                id='fullName'
                                name='fullName'
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder='Nhập họ và tên'
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor='email'>Email *</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder='Nhập email'
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor='phone'>Số điện thoại</label>
                            <input
                                type='tel'
                                id='phone'
                                name='phone'
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder='Nhập số điện thoại'
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor='dateOfBirth'>Ngày sinh</label>
                            <input
                                type='date'
                                id='dateOfBirth'
                                name='dateOfBirth'
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor='gender'>Giới tính</label>
                            <select
                                id='gender'
                                name='gender'
                                value={formData.gender}
                                onChange={handleInputChange}
                            >
                                <option value=''>Chọn giới tính</option>
                                <option value='male'>Nam</option>
                                <option value='female'>Nữ</option>
                                <option value='other'>Khác</option>
                            </select>
                        </div>

                        <div
                            className={styles.formGroup}
                            data-full-width='true'
                        >
                            <label htmlFor='address'>Địa chỉ</label>
                            <textarea
                                id='address'
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder='Nhập địa chỉ'
                                rows='3'
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type='button'
                            onClick={handleCancel}
                            className={styles.cancelButton}
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            type='submit'
                            className={styles.saveButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
