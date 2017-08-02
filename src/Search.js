import React from 'react'
import { Link } from 'react-router-dom'
import Book from './Book'

function Search({query="", loading=false, results=[], putOnShelf=f=>f, updateQuery=f=>f})  {
  const linkTo = { pathname: '/', state: { query : '', results:[] } }
  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to={linkTo} className="close-search">
          Close
        </Link>
                      
        <div className="search-books-input-wrapper">
          <input 
            type="text" 
            placeholder="Search by title or author"
            value={query}
            onChange={ e => updateQuery(e)}/>
        </div>
      </div>
      <div className="search-books-results">
        { loading ? ( <div><p>Loading...</p></div> )
          : (
            <div>
              <ol className="books-grid">
              { results.map( book =>
                <li key={book.id}>
                  <Book 
                    {...book}
                    onShelfChanged={ e => putOnShelf(book, e.target.value) } />
                </li> 
              )}
              </ol>
            </div>
            )
        }
      </div>
    </div>
  )
}

export default Search