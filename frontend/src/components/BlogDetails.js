import { useParams, Link } from "react-router-dom";
import useFetch from "../utils/useFetch";
import { baseURL } from "../constants/constants";
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization
import { isAuthenticated } from '../services/authService';
import api from '../services/axiosConfig'; // Import your Axios instance
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const BlogDetails = () => {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const { id } = useParams();
    const { data: blog, error, isPending } = useFetch(`${baseURL}/api/blogs/${id}`);
    const currentUserId = localStorage.getItem('current_user_id'); // Get current user ID from local storage
    const navigate = useNavigate(); // Use the useNavigate hook

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);
        const months = Math.floor(diffInSeconds / 2592000); // Average month length in seconds
        const years = Math.floor(diffInSeconds / 31536000); // Average year length in seconds

        if (years > 0) {
            return `Posted ${years} year${years > 1 ? 's' : ''} ago`;
        }
        if (months > 0) {
            return `Posted ${months} month${months > 1 ? 's' : ''} ago`;
        }
        if (days > 0) {
            return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
        }
        if (hours > 0) {
            return `Posted ${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        if (minutes > 0) {
            return `Posted ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        return 'Posted just now'; // If the post is less than a minute old
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            api.delete(`/blogs/${id}/`) // Adjust this endpoint if necessary
                .then(() => {
                    console.log('Blog deleted!');
                    navigate('/'); // Use navigate to redirect after deletion
                })
                .catch((error) => {
                    console.error('Error deleting blog:', error);
                });
        }
    };

    return (
        <div>
            {authenticated ? (
                <div className="blog-details">
                    {isPending && <div>Loading...</div>}
                    {error && <div>{error}</div>}
                    {blog && (
                        <article>
                            <h2>{blog.title}</h2>
                            <strong>Written by
                                <Link to={`/author-blogs/${blog.author.username}`}>
                                    {` ${blog.author.username}`}
                                </Link>
                            </strong>
                            <p>{formatDate(blog.createdAt)}</p> {/* Display the time ago */}
                            <div
                                className="blog-body"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.body) }} // Sanitize and render HTML
                            />
                            {(parseInt(currentUserId) === parseInt(blog.author.id)) && ( // Check if current user is the author
                                <div className="button-container">
                                    <button onClick={handleDelete}>Delete Post</button>
                                </div>
                            )}
                        </article>
                    )}
                </div>
            ) : (
                <div>
                    <Link to="/login">Please LogIn First</Link>
                </div>
            )}
        </div>
    );
}

export default BlogDetails;