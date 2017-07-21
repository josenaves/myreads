import React from 'react'
import { Route, Link } from 'react-router-dom'
import BookShelf from './BookShelf'
import { getAll } from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      books: {
        currentlyReading: [],
        wantToRead: [],
        read: []
      }    
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    getAll().then(books => {
      const newBooks = books.map( (book, index) => {
        const image = `url("${book.imageLinks.thumbnail}")`
        const author = book.authors.join(", ")
        const title = book.title
        const shelf = book.shelf
        return { id: index, title, author, image, shelf }
      })

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
      (error) => console.error(error)
    )
  }

  handleChange(id, origin, destination) {
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
    
    this.setState({books})
  }

   render() {
    return (
      <div className="app">
        <Route path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              
              <Link to="/" className="close-search">Close</Link>
                            
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author"/>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )} />

        <Route exact path="/" render={() => (
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
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />
        
      </div>
    )
  }
}

export default BooksApp
