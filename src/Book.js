import React from 'react'
import PropTypes from 'prop-types'

export default function Book({ title, author, image, shelf, onShelfChanged=f=>f }) {
  return (
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `${image}` }}></div>
        <div className="book-shelf-changer">
          <select value={ shelf } onChange={ onShelfChanged }>
            <option value="none" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{ title }</div>
      <div className="book-authors">{ author }</div>
    </div>
  )
}

Book.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  shelf: PropTypes.string.isRequired,
  onShelfChanged: PropTypes.func
}

export const makeBooks = (books) => {
    if (!books) console.error("no books!")
    return books.map( book => {
      const image = book.imageLinks ? `url("${book.imageLinks.thumbnail}")` : `url("./no-image.png")`
      const author = book.authors ? book.authors.join(", ") : "authors unknown"
      const title = book.title
      const shelf = book.shelf
      const id = book.id
      return { id, title, author, image, shelf }
    })
  }