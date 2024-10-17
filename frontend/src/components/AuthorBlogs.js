import { useParams } from "react-router-dom";
import useFetch from "../utils/useFetch";
import BlogList from "./BlogList"; // Assuming you have a BlogList component
import { baseURL } from "../constants/constants";
import { isAuthenticated } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";


const AuthorBlogs = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the author's ID from the URL
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const { data: blogs, isPending, error } = useFetch(`${baseURL}/api/blogs/author/${id}`); // Adjust the API endpoint if necessary

    if (id === localStorage.getItem('current_username')){
        navigate('/account');
    }

    return (
        <div>
            {authenticated ? (
                <div>
                    {isPending && <p>Loading blogs...</p>}
                    {error && <p>{error}</p>}
                    {blogs && <BlogList blogs={blogs} title={`Blogs by ${id}`} />}
                </div>
            ) : (
                <div>
                    <Link to="/login">Please LogIn First</Link>
                </div>
            )}
        </div>
    );
}

export default AuthorBlogs;
