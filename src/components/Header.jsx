import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '@styles/components/Header.module.scss';

export default function Header() {
    const [currentUser, setCurrentUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        navigate('/');
        setShowDropdown(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setShowDropdown(false);
    };

    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <div
                    className={styles.logo}
                    onClick={() => handleNavigation('/')}
                >
                    🛍️ QLBH
                </div>
                <div className={styles.subtitle}>Quản Lý Bán Hàng</div>
            </div>

            <nav className={styles.navigation}>
                <a
                    href='/'
                    className={`${styles.navLink} ${
                        isActivePath('/') ? styles.active : ''
                    }`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigation('/');
                    }}
                >
                    Trang chủ
                </a>

                {currentUser && (
                    <a
                        href={currentUser.role === 'admin' ? '/admin' : '/user'}
                        className={`${styles.navLink} ${
                            isActivePath(
                                currentUser.role === 'admin'
                                    ? '/admin'
                                    : '/user'
                            )
                                ? styles.active
                                : ''
                        }`}
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(
                                currentUser.role === 'admin'
                                    ? '/admin'
                                    : '/user'
                            );
                        }}
                    >
                        {currentUser.role === 'admin' ? 'Quản trị' : 'Cửa hàng'}
                    </a>
                )}

                {!currentUser ? (
                    <div className={styles.authButtons}>
                        <button
                            className={styles.loginBtn}
                            onClick={() => handleNavigation('/login')}
                        >
                            Đăng nhập
                        </button>
                    </div>
                ) : (
                    <div className={styles.userSection}>
                        <span className={styles.userName}>
                            Xin chào, {currentUser.name}
                        </span>
                        <div
                            className={styles.dropdown}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <div className={styles.avatar}>
                                {getUserInitials(currentUser.name)}
                            </div>
                            {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    <button
                                        className={styles.dropdownItem}
                                        onClick={() =>
                                            handleNavigation(
                                                currentUser.role === 'admin'
                                                    ? '/admin'
                                                    : '/user'
                                            )
                                        }
                                    >
                                        📊 Dashboard
                                    </button>
                                    <button
                                        className={`${styles.dropdownItem} ${styles.danger}`}
                                        onClick={handleLogout}
                                    >
                                        🚪 Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
