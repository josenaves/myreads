import React from 'react'
import { Link } from 'react-router-dom'
import BookShelf from './BookShelf'

export default function BookList({ loading, books, onShelfChanged=f=>f}) {
  const linkTo = { pathname:'/search', state: {query:''} }
  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
          { loading 
          ?  <div> <p>Loading... </p> </div>
          : (
          <div>
            <BookShelf 
              title="Currently Reading" 
              books={books.currentlyReading}
              onShelfChanged={onShelfChanged} />

            <BookShelf 
              title="Want to Read" 
              books={books.wantToRead}
              onShelfChanged={onShelfChanged} />

            <BookShelf 
              title="Read" 
              books={books.read}
              onShelfChanged={onShelfChanged} />
          </div>
        )}
      </div>
      <div className="open-search">
        <Link to={linkTo}>Add a book</Link>
      </div>
    </div>
  )
}