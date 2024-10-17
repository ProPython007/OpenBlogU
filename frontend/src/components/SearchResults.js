import { useState, useEffect } from "react";
import BlogList from "./BlogList";  // Reuse your BlogList component
import { useLocation, useNavigate } from "react-router-dom";
import {baseURL} from "../constants/constants"
import useFetch from "../utils/useFetch"


const SearchResults = () => {
    const {data: blogs, isPending, error} = useFetch(`${baseURL}/api/blogs`);

    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('query').toLowerCase();

    useEffect(() => {
        if (blogs){
            if (query) {
                // Filter blogs by checking if the query is in title, author, or body
                const results = blogs.filter(blog =>
                    blog.title.toLowerCase().includes(query) ||
                    blog.author.username.toLowerCase().includes(query) ||
                    blog.body.toLowerCase().includes(query)
                );
                setFilteredBlogs(results);
            }
        }
    }, [query, blogs]);

    return (
        <div className="search-results">
            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}

            <BlogList blogs={filteredBlogs} title={`Search Results for "${query}"`} />
            {filteredBlogs.length === 0 && <p>No blogs found matching your search.</p>}
        </div>
    );
}

export default SearchResults;