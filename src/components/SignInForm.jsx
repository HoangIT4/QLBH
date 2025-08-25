import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInForm() {
    const [state, setState] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (evt) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
        setError(''); // Clear error when user types
    };

    const handleOnSubmit = async (evt) => {
        evt.preventDefault();

        const { username, password } = state;

        try {
            // Fetch users from data.json (simulate API call)
            const response = await fetch('/data.json');
            const data = await response.json();

            // Find user with matching credentials
            const user = data.users.find(
                (u) => u.username === username && u.password === password
            );

            if (user) {
                // Save user to localStorage
                localStorage.setItem(
                    'currentUser',
                    JSON.stringify({
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        role: user.role
                    })
                );

                // Redirect based on role
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi đăng nhập!');
            console.error('Login error:', error);
        }

        // Clear form
        setState({
            username: '',
            password: ''
        });
    };

    return (
        <div className='form-container sign-in-container'>
            <form onSubmit={handleOnSubmit}>
                <h1>Sign in</h1>

                <span>Đăng nhập vào hệ thống</span>
                <br />
                {error && (
                    <div style={{ color: 'red', margin: '10px 0' }}>
                        {error}
                    </div>
                )}
                <input
                    type='text'
                    placeholder='Tên đăng nhập'
                    name='username'
                    value={state.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type='password'
                    name='password'
                    placeholder='Mật khẩu'
                    value={state.password}
                    onChange={handleChange}
                    required
                />
                <div
                    style={{
                        fontSize: '12px',
                        margin: '10px 0',
                        color: '#666'
                    }}
                >
                    <p>Tài khoản demo:</p>
                    <p>
                        <strong>Admin:</strong> admin / 123
                    </p>
                    <p>
                        <strong>User:</strong> user1 / 123
                    </p>
                </div>
                <button type='submit'>Đăng nhập</button>
            </form>
        </div>
    );
}
