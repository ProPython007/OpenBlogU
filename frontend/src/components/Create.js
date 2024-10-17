import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../services/axiosConfig'; // Import your Axios instance
import { isAuthenticated } from '../services/authService';

const Create = () => {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const [title, setTitle] = useState('');
    const [body, setBody] = useState(''); // Will now store rich text content
    const [isPending, setIsPending] = useState(false);
    const history = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body }; // No need to include author here

        setIsPending(true);

        // Use Axios instance for the POST request
        api.post('/blogs/', blog)
            .then(() => {
                console.log('New blog added!');
                setIsPending(false);
                history('/');
            })
            .catch((error) => {
                console.error('Error adding blog:', error.response.data); // Log the response data for better debugging
                setIsPending(false);
            });
    };

    return (
        <div>
            {authenticated ? (
                <div className="create">
                    <h2>Add a New Blog</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Blog Title:</label>
                        <input
                            type="text"
                            required 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <label>Blog Body:</label>
                        <ReactQuill 
                            value={body} 
                            onChange={setBody} 
                            placeholder="Write your blog content here..." 
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    ['link', 'image'],
                                    [{ 'align': [] }],
                                    ['clean']
                                ]
                            }}
                            formats={[
                                'header', 'font',
                                'list', 'bullet',
                                'bold', 'italic', 'underline', 'strike',
                                'link', 'image', 'align'
                            ]}
                        />
                        <br />
                        <label>Blog Author:</label>
                        <input
                            type="text"
                            required 
                            value={localStorage.getItem('current_username')}
                            disabled
                        />
                        {!isPending && <button>Add Blog</button>}
                        {isPending && <button disabled>Adding Blog...</button>}
                    </form>
                </div>
            ) : (
                <div>
                    <Link to="/login">Please LogIn First</Link>
                </div>
            )}
        </div>
    );
}

export default Create;