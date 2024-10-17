import { Link } from "react-router-dom";
import DOMPurify from 'dompurify'; // Import DOMPurify
import { useState, useEffect } from "react"; // Import useState and useEffect for managing filter state

const BlogList = (props) => {
    const [filter, setFilter] = useState("recent");
    const [sortedBlogs, setSortedBlogs] = useState([]); // Initialize as an empty array
    const title = props.title;

    // Function to get a preview of the blog body
    const getPreview = (body) => {
        const sanitizedBody = DOMPurify.sanitize(body); // Sanitize the HTML
        const tempDiv = document.createElement("div"); // Create a temporary div to parse HTML
        tempDiv.innerHTML = sanitizedBody; // Set the sanitized HTML as innerHTML
        const textContent = tempDiv.textContent || tempDiv.innerText || ""; // Get text content

        // Limit to the first 100 characters or so
        const maxLength = 50;
        return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
    };

    // Function to handle filter change
    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
        sortBlogs(selectedFilter);
    };

    // Function to sort or randomize blogs based on the selected filter
    const sortBlogs = (selectedFilter) => {
        let updatedBlogs;
        if (selectedFilter === "recent") {
            updatedBlogs = [...props.blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by recent
        } else if (selectedFilter === "old") {
            updatedBlogs = [...props.blogs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort by old
        } else if (selectedFilter === "random") {
            updatedBlogs = [...props.blogs].sort(() => Math.random() - 0.5); // Randomize order
        }
        setSortedBlogs(updatedBlogs); // Update local state with sorted/randomized blogs
    };

    // Effect to set sortedBlogs when the component mounts
    useEffect(() => {
        sortBlogs(filter); // Sort blogs when component mounts
    }, [props.blogs]); // Re-run if props.blogs changes

    return (
        <div className="blog-list">
            <div className="header">
                <h2>{title}</h2>
                <select value={filter} onChange={handleFilterChange} style={{ marginLeft: '10px' }}>
                    <option value="recent">Recent</option>
                    <option value="old">Old</option>
                    <option value="random">Random</option>
                </select>
            </div>
            {sortedBlogs.map((blog) => ( // Use sortedBlogs for rendering
                <div className="blog-preview" key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>
                        <h2>{blog.title}</h2>
                        <p>{getPreview(blog.body)}</p> {/* Display preview of the blog body */}
                        <strong>Written by {blog.author.username}</strong>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default BlogList;
