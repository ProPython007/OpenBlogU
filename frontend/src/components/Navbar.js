import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {logout, isAuthenticated} from '../services/authService'


const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const navigate = useNavigate();

    useEffect(() => {
        const listenStorageChange = () => {
            setAuthenticated(JSON.parse(localStorage.getItem("isLoggedIn")));
        };

        window.addEventListener("storage", listenStorageChange);
        return () => window.removeEventListener("storage", listenStorageChange);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`);  // Redirect to a search results page
        }
    }

    return ( 
        <nav className="navbar">
            <Link to="/"><h1>TheOpenBlogU</h1></Link>
            <div className="links">
                {authenticated ? (
                            // Show only LogOut if authenticated
                            <div>
                                <Link to="/account">Account</Link>
                                <Link to="/create">Create</Link>
                                <Link to="/" onClick={handleLogout}>LogOut</Link>
                            </div>
                        ) : (
                            // Show LogIn and SignUp if not authenticated
                            <div>
                                <Link to="/login">LogIn</Link>
                                <Link to="/signup">SignUp</Link>
                            </div>
                        )}
            </div>
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search blogs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </nav>
     );
}

export default Navbar;
