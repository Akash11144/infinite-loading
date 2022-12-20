import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useBookSearch(query, pageNumber) {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
    }, [query])


    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel = null;
        axios({
            method: "GET",
            url: "http://openlibrary.org/search.json",
            params: { q: query, page: pageNumber },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            console.log("data: ", res.data);
            setBooks(prev => {
                return [...new Set([...prev, ...res.data.docs.map(book => { return book.title })])];
            });
            setHasMore(res.data.docs.length > 0);
            setLoading(false);
        }).catch(e => {
            // console.log("error: ", e);
            if (axios.isCancel(e)) return
            setError(true);
            setLoading(false);
        });

        return () => {
            cancel();
        }
    }, [query, pageNumber]);
    return { books, loading, error, hasMore };
}
