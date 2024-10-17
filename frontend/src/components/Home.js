import BlogList from './BlogList'
import useFetch from '../utils/useFetch';
import {baseURL} from '../constants/constants'


const Home = () => {
    const {data: blogs, isPending, error} = useFetch(`${baseURL}/api/blogs`);

    return ( 
        <div className="home">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {blogs && <BlogList blogs={blogs} title="All Blogs!" />}
        </div>
    );
};

export default Home;