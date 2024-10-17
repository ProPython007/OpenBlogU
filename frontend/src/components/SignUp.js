import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { baseURL } from '../constants/constants';
import Message from './Message';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');

    const [error, setError] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const payload = {
            username, email, password: pass1, password2: pass2
        };

        setIsPending(true);

        fetch(`${baseURL}/api/users/register/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(async (response) => {
                setIsPending(false);

                if (!response.ok) {
                    const data = await response.json();
                    setError(data.errors || { general: "Something went wrong. Please try again." });
                    return;
                }

                console.log('New user added!');
                navigate('/login?activation=true');
            })
            .catch((err) => {
                setIsPending(false);
                setError({ general: err.message });
            });
    };

    return (
        <div className="signup-container">
            {isPending && <div>Loading...</div>}
            <div className="form-wrapper">
                <h2>Sign Up</h2>
                {error?.general && <Message variant="danger">{error.general}</Message>}
                <form onSubmit={submitHandler}>
                    <label>User Name:</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {error?.username && error.username.map((err, index) => (
                        <Message key={index} variant="danger">{err}</Message>
                    ))}

                    <label>Email:</label>
                    <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error?.email && error.email.map((err, index) => (
                        <Message key={index} variant="danger">{err}</Message>
                    ))}

                    <label>Password:</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
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

                    <label>Confirm Password:</label>
                    <div className="password-input">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={pass2}
                            onChange={(e) => setPass2(e.target.value)}
                        />
                        <span onClick={toggleConfirmPasswordVisibility} className="password-toggle">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {error?.password2 && error.password2.map((err, index) => (
                        <Message key={index} variant="danger">{err}</Message>
                    ))}

                    {!isPending && <button type="submit">Sign Up</button>}
                    {isPending && <button disabled>Signing Up...</button>}
                </form>
                <p className="login-link">
                    Already a user? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
