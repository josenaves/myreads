import React from 'react'
import { Route, Link } from 'react-router-dom'
import BookShelf from './BookShelf'
import Book from './Book'
import { getAll, search, update } from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      books: {
        currentlyReading: [],
        wantToRead: [],
        read: []
      },
      results: [],
      query: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
    this.putOnShelf = this.putOnShelf.bind(this)
    this.makeBooks = this.makeBooks.bind(this)
  }
  
  makeBooks(books){
    console.log("makebooks: ", books)
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
  
  componentDidMount(){
    getAll().then(books => {
      if (!books) console.error("No books !")
      const newBooks = this.makeBooks(books)

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

  updateQuery(query) {
    this.setState({ query: query.trim() })
    search(query, 20).then( books => {
      if (!books) console.error("No books !")
      const searchedBooks = books ? this.makeBooks(books) : []
      this.setState({ results: searchedBooks })
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

  putOnShelf(book, destination) {
    if (destination === 'none') return
    
    const books = this.state.books

    // add new book into destination shelf
    const destinationShelf = books[destination] = [
      ...books[destination],
      {
        id: book.id,
        title: book.title,
        author: book.author,
        image: book.image,
        shelf: destination,
      }
    ]

    // set state with update shelves
    books[destination] = destinationShelf
    
    // call API to update book shelf
    update(book, destination).then(
      this.setState({books})
    ).catch(
      error => console.error(error)
    ) 
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              
              <Link
                to="/"
                className="close-search" 
                onClick={ () => this.setState({results:[], query:''}) }>
                Close</Link>
                            
              <div className="search-books-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={ event => this.updateQuery(event.target.value)}/>           
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
              { this.state.results.map( book =>
                <li key={book.id}>
                  <Book 
                    {...book}
                    onShelfChanged={ e => this.putOnShelf(book, e.target.value) } />
                </li> 
              )}
              </ol>
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
              <Link to="/search"
                onClick={ () => this.setState({results:[], query:''}) }
              >Add a book</Link>
            </div>
          </div>
        )} />
        
      </div>
    )
  }
}

export default BooksApp
