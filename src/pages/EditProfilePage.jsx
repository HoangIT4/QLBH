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
        avatar: '',
        password: '',
        confirmPassword: ''
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
            // Load user data from data.json
            const response = await fetch('/data.json');
            const data = await response.json();

            // Find user in data.json by id
            const userFromData = data.users.find((u) => u.id === user.id);

            const userData = {
                fullName:
                    userFromData?.fullName ||
                    user.fullName ||
                    user.username ||
                    '',
                email: userFromData?.email || user.email || '',
                phone: userFromData?.phone || user.phone || '',
                address: userFromData?.address || user.address || '',
                dateOfBirth:
                    userFromData?.dateOfBirth || user.dateOfBirth || '',
                gender: userFromData?.gender || user.gender || '',
                avatar: userFromData?.avatar || user.avatar || '',
                password: '',
                confirmPassword: ''
            };
            setFormData(userData);
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

            // Validate password if provided
            if (formData.password) {
                if (formData.password.length < 6) {
                    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
                }
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Mật khẩu xác nhận không khớp');
                }
            }

            // In real app, this would be an API call
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Update local storage
            const updatedUser = {
                ...currentUser,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                avatar: formData.avatar
            };

            // Only update password if provided
            if (formData.password) {
                updatedUser.password = formData.password;
            }

            // Update localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            // In real app, you would send this to your API
            // For now, we'll just simulate the update
            console.log('Updated user data:', updatedUser);

            setMessage({
                type: 'success',
                text: 'Cập nhật thông tin thành công!'
            });

            // Redirect back to appropriate page based on user role
            setTimeout(() => {
                if (currentUser.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (currentUser.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/user');
        }
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

                    {/* Password Section */}
                    <div className={styles.passwordSection}>
                        <h3>Thay đổi mật khẩu</h3>
                        <p>Để trống nếu không muốn thay đổi mật khẩu</p>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label htmlFor='password'>Mật khẩu mới</label>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder='Nhập mật khẩu mới (tối thiểu 6 ký tự)'
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='confirmPassword'>
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type='password'
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder='Nhập lại mật khẩu mới'
                                />
                            </div>
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
