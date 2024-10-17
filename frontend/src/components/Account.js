import { useState } from "react";
import { baseURL } from "../constants/constants";
import { Link } from 'react-router-dom';
import useFetch from '../utils/useFetch';
import BlogList from "./BlogList";
import { isAuthenticated } from '../services/authService';

const Account = () => {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const uname = localStorage.getItem('current_username');
    const { data: blogs, isPending, error } = useFetch(`${baseURL}/api/blogs/author/${uname}`);

    return ( 
        <div>
            {authenticated ? (
                <div>
                    <h1>{`Hello, ${uname}`}</h1>
                    <br />
                    {isPending && <p>Loading blogs...</p>}
                    {error && <p>{error}</p>}
                    {blogs && <BlogList blogs={blogs} title={`Your Blogs:`} />}
                </div>
            ) : (
                <div>
                    <Link to="/login">Please LogIn First</Link>
                </div>
            )}
        </div>
    );
}

export default Account;
