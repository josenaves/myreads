import React from 'react'
import Book from './Book'
import PropTypes from 'prop-types'

function BookShelf({ title, books, onShelfChanged=f=>f }) {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
        { books.map( book =>
          <li key={book.id}>
            <Book 
              id={book.id}
              title={book.title} 
              author={book.author} 
              image={book.image}
              shelf={book.shelf}
              onChangeShelf={ event => onShelfChanged(book.id, book.shelf, event.target.value) } />
          </li>
        ) }
        </ol>
      </div>
    </div>    
  )    
}

BookShelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  onShelfChanged: PropTypes.func
}

export default BookShelf
