import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BookShelf from './BookShelf'
import { getAll, update } from './BooksAPI'
import { makeBooks } from './Book'

class BookList extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      books: {
        currentlyReading: [],
        wantToRead: [],
        read: []
      }
    }

    this.handleChange = this.handleChange.bind(this)
  }
    
  componentDidMount(){
    getAll().then(books => {
      if (!books) console.error("No books !")
      const newBooks = makeBooks(books)

      const currentlyReading = newBooks.filter(book =>  book.shelf === 'currentlyReading')
      const wantToRead = newBooks.filter(book =>  book.shelf === 'wantToRead')
      const read = newBooks.filter(book =>  book.shelf === 'read')

      this.setState({
        books: {
          currentlyReading: [...currentlyReading],
          wantToRead: [...wantToRead],
          read: [...read]
        }
      })
    })
    .catch(
      error => console.error(error)
    )
  }

  handleChange(id, origin, destination) {
    console.log(id, origin, destination)
    if (destination === 'none') return

    const books = this.state.books
    const movingBook = books[origin].find(x => x.id === id)
  
    // remove book id from origin shelf
    const originShelf = books[origin].filter(
      book => book.id !== id
    )

    // add new book into destination shelf
    const destinationShelf = books[destination] = [
      ...books[destination],
      {
        id: movingBook.id,
        title: movingBook.title,
        author: movingBook.author,
        image: movingBook.image,
        shelf: destination,
      }
    ]

    // set state with update shelves
    books[origin] = originShelf
    books[destination] = destinationShelf
    
    // call API to update book shelf
    update(movingBook, destination).then(
      this.setState({books})
    ).catch(
      error => console.error(error)
    )
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf 
              title="Currently Reading" 
              books={this.state.books.currentlyReading}
              onShelfChanged={this.handleChange} />

            <BookShelf 
              title="Want to Read" 
              books={this.state.books.wantToRead}
              onShelfChanged={this.handleChange} />

            <BookShelf 
              title="Read" 
              books={this.state.books.read}
              onShelfChanged={this.handleChange} />
          </div>
        </div>
        <div className="open-search">
          <Link to="/search"
            onClick={ () => this.setState({results:[], query:''}) }
          >Add a book</Link>
        </div>
      </div>
    )
  }
}

export default BookList