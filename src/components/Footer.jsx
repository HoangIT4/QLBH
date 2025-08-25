import React, { useState } from 'react';
import styles from '@styles/components/Footer.module.scss';

export default function Footer() {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            alert('Cảm ơn bạn đã đăng ký nhận tin!');
            setEmail('');
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h3 className={styles.title}>QLBH Store</h3>
                        <p className={styles.description}>
                            Hệ thống quản lý bán hàng hiện đại, giúp bạn dễ dàng
                            quản lý sản phẩm, đơn hàng và khách hàng một cách
                            hiệu quả nhất.
                        </p>
                        <div className={styles.socialSection}>
                            <div className={styles.socialLinks}>
                                <a
                                    href='#'
                                    className={styles.socialLink}
                                    aria-label='Facebook'
                                >
                                    <span className={styles.icon}>📘</span>
                                </a>
                                <a
                                    href='#'
                                    className={styles.socialLink}
                                    aria-label='Twitter'
                                >
                                    <span className={styles.icon}>🐦</span>
                                </a>
                                <a
                                    href='#'
                                    className={styles.socialLink}
                                    aria-label='Instagram'
                                >
                                    <span className={styles.icon}>📷</span>
                                </a>
                                <a
                                    href='#'
                                    className={styles.socialLink}
                                    aria-label='LinkedIn'
                                >
                                    <span className={styles.icon}>💼</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.title}>Liên kết nhanh</h3>
                        <ul className={styles.linkList}>
                            <li className={styles.linkItem}>
                                <a href='/' className={styles.link}>
                                    Trang chủ
                                </a>
                            </li>
                            <li className={styles.linkItem}>
                                <a href='/login' className={styles.link}>
                                    Đăng nhập
                                </a>
                            </li>
                            <li className={styles.linkItem}>
                                <a href='#' className={styles.link}>
                                    Về chúng tôi
                                </a>
                            </li>
                            <li className={styles.linkItem}>
                                <a href='#' className={styles.link}>
                                    Liên hệ
                                </a>
                            </li>
                            <li className={styles.linkItem}>
                                <a href='#' className={styles.link}>
                                    Hỗ trợ
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.title}>Liên hệ</h3>
                        <div className={styles.contactSection}>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>📧</span>
                                <span>info@qlbh.com</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>📞</span>
                                <span>(+84) 123 456 789</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>📍</span>
                                <span>Hà Nội, Việt Nam</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}>🕒</span>
                                <span>T2-T6: 8:00 - 18:00</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.title}>Nhận tin tức</h3>
                        <div className={styles.newsletter}>
                            <h4 className={styles.newsletterTitle}>
                                Đăng ký nhận tin
                            </h4>
                            <p className={styles.newsletterDescription}>
                                Nhận thông tin về sản phẩm mới và ưu đãi đặc
                                biệt.
                            </p>
                            <form
                                className={styles.newsletterForm}
                                onSubmit={handleSubscribe}
                            >
                                <input
                                    type='email'
                                    className={styles.emailInput}
                                    placeholder='Nhập email của bạn'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type='submit'
                                    className={styles.subscribeBtn}
                                >
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.copyright}>
                        &copy; {currentYear}{' '}
                        <span className={styles.brand}>QLBH Store</span>. Tất cả
                        quyền được bảo lưu.
                    </div>
                    <div className={styles.links}>
                        <a href='#' className={styles.link}>
                            Chính sách bảo mật
                        </a>
                        <a href='#' className={styles.link}>
                            Điều khoản sử dụng
                        </a>
                        <a href='#' className={styles.link}>
                            Cookie
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
