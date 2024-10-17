// useFetch.js
import { useEffect, useState } from "react";
import api from '../services/axiosConfig'; // Import the axios instance with interceptors

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortConst = new AbortController();

        // Using Axios to fetch data
        const fetchData = async () => {
            try {
                const response = await api.get(url, { signal: abortConst.signal }); // Use the Axios instance
                setData(response.data);
                setIsPending(false);
                setError(null);
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted!');
                } else {
                    setError(err.message);
                    setIsPending(false);
                }
            }
        };

        fetchData();

        return () => abortConst.abort(); // Cleanup on unmount
    }, [url]);

    return { data, isPending, error };
};

export default useFetch;
