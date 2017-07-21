import React from 'react'
import PropTypes from 'prop-types'

function Book({ title, author, image, shelf, onChangeShelf=f=>f }) {
  return (
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `${image}` }}></div>
        <div className="book-shelf-changer">
          <form onSubmit={ event => event.preventDefault() }>
            <select value={ shelf } onChange={ onChangeShelf }>
              <option value="none" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </form>
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
  onChangeShelf: PropTypes.func
}

export default Book