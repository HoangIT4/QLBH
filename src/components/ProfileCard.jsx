import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileCard({ user }) {
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div
            style={{
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px'
                }}
            >
                <img
                    src={
                        user.avatar ||
                        'https://via.placeholder.com/60x60?text=Avatar'
                    }
                    alt='Avatar'
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                    onError={(e) => {
                        e.target.src =
                            'https://via.placeholder.com/60x60?text=Avatar';
                    }}
                />
                <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                        {user.fullName || user.username || 'Người dùng'}
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {user.email || 'Chưa có email'}
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    marginBottom: '15px'
                }}
            >
                {user.phone && (
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        📞 {user.phone}
                    </div>
                )}
                {user.address && (
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        📍 {user.address}
                    </div>
                )}
                {user.dateOfBirth && (
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        🎂{' '}
                        {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                    </div>
                )}
                {user.gender && (
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        👤{' '}
                        {user.gender === 'male'
                            ? 'Nam'
                            : user.gender === 'female'
                              ? 'Nữ'
                              : 'Khác'}
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/user/edit-profile')}
                style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => (e.target.style.background = '#0056b3')}
                onMouseOut={(e) => (e.target.style.background = '#007bff')}
            >
                ✏️ Chỉnh sửa thông tin
            </button>
        </div>
    );
}
