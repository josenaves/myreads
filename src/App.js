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
                <BookShelf 
                  title="Currently Reading" 
                  books={this.state.books.currentlyReading} />

                <BookShelf 
                  title="Want to Read" 
                  books={this.state.books.wantToRead} />

                <BookShelf 
                  title="Read" 
                  books={this.state.books.read} />
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
