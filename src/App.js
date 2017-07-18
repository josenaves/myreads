import React from 'react'
import { Route, Link } from 'react-router-dom'
import Book from './Book'
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
  }

  componentDidMount(){
    getAll().then(books => {
      const newBooks = books.map(book => {
        const image = `url("${book.imageLinks.thumbnail}")`
        const author = book.authors.join(", ")
        const title = book.title
        const shelf = book.shelf
        return { title, author, image, shelf }
      })

      const currentlyReading = newBooks.filter((book) =>  book.shelf === 'currentlyReading')
      const wantToRead = newBooks.filter((book) =>  book.shelf === 'wantToRead')
      const read = newBooks.filter((book) =>  book.shelf === 'read')

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
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                    { this.state.books.currentlyReading.map((book, index) =>
                      <li key={index}>
                        <Book 
                          title={book.title} 
                          author={book.author} 
                          image={book.image}
                          shelf={book.shelf} />
                      </li>
                    ) }
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                    { this.state.books.wantToRead.map((book, index) =>
                      <li key={index}>
                        <Book 
                          title={book.title} 
                          author={book.author} 
                          image={book.image}
                          shelf={book.shelf} />
                      </li>
                    ) }
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                    { this.state.books.read.map((book, index) =>
                      <li key={index}>
                        <Book 
                          title={book.title} 
                          author={book.author} 
                          image={book.image}
                          shelf={book.shelf} />
                      </li>
                    ) }
                    </ol>
                  </div>
                </div>
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
