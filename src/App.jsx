import { useCallback, useRef } from 'react';
import { useState } from 'react';
import appStyles from './App.module.css';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, books, hasMore, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookObserverRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prev => prev + 1);
        }
      })
      if (node) observer.current.observe(node);
      console.log(node);
    }, [hasMore, loading]);

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className={appStyles.app}>
      <h1 className={appStyles.pageHeading} >BOOK LIBRARY</h1>
      <input className={appStyles.searchBox} type={"text"} value={query} onChange={handleSearch} placeholder={"Search Books here"} />
      <div className={appStyles.titlesContMain}>
        <div className={appStyles.titlesCont}>
          {books.map((data, index) => {
            if (index === books.length - 1) {
              return <p className={appStyles.titles} ref={lastBookObserverRef} key={index}>{data}</p>
            } else {
              return <p className={appStyles.titles} key={index} >{data}</p>
            }
          })}
        </div>
        {loading && !error && <h1 className={appStyles.loading} >Loading...</h1>}
        {loading && error && <h1 className={appStyles.loading} >loading...</h1>}
        {error && !loading && <h1 className={appStyles.error} >Some Error while getting data</h1>}
      </div>
    </div>
  );
}

export default App;
