import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { baseURL } from '../constants/constants';
import Message from '../components/Message';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [pass1, setPass1] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('activation')) {
            toast.success("Activation link has been sent to your email!", {
                className: 'bg-dark text-white',
            });
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const payload = { username, password: pass1 };
        setIsPending(true);

        fetch(`${baseURL}/api/users/login/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(async (response) => {
                setIsPending(false);

                if (!response.ok) {
                    const data = await response.json();
                    if (data.errors) {
                        setError(data.errors);
                    } else {
                        setError({ general: "Invalid username or password" });
                    }
                    return;
                }

                const data = await response.json();
                localStorage.setItem('authToken', data.access);
                localStorage.setItem('authRefreshToken', data.refresh);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('current_username', data.username);
                localStorage.setItem('current_user_id', data.id)
                window.dispatchEvent(new Event("storage"));
                navigate('/');
            })
            .catch((err) => {
                setIsPending(false);
                setError({ general: err.message });
            });
    };

    return (
        <div className="login-container">
            {isPending && <div>Loading...</div>}
            <div className="form-wrapper">
                <h2>Log In</h2>

                {error?.general && <Message variant="danger">{error.general}</Message>}

                <form onSubmit={submitHandler}>
                    <label htmlFor="username">User Name:</label>
                    <input
                        type="text"
                        required
                        id="username"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {error?.username && error.username.map((err, index) => (
                        <Message key={index} variant="danger">{err}</Message>
                    ))}

                    <label htmlFor="password">Password:</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            id="password"
                            placeholder="Enter Password"
                            value={pass1}
                            onChange={(e) => setPass1(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="password-toggle">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {error?.password && error.password.map((err, index) => (
                        <Message key={index} variant="danger">{err}</Message>
                    ))}

                    {!isPending && <button type="submit">Log In</button>}
                    {isPending && <button disabled>Logging In...</button>}
                </form>

                <p className="sign-up-link">
                    Not a User? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LogIn;
