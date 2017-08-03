import React from 'react'
import { Route } from 'react-router-dom'
import BookList from './BookList'
import Search from './Search'
import { getAll, update, search } from './BooksAPI'
import { makeBooks } from './Book'
import _ from 'lodash'

import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      books: {
        currentlyReading: [],
        wantToRead: [],
        read: []
      },
      results: [],
      query: '',
      loading: false,
      error: ''
    }
  }
  
  componentDidMount(){
    this.loadBooks()

    this.handleSearchDebounced = _.debounce(() => {
      search(this.state.query, 20).then( books => {
        if (books.error) {
          this.setState({ results:[], loading: false, error: 'No books found' })
          console.error("---- No books found !")
        } else {
          const myBooks = [ 
            ...this.state.books.currentlyReading, 
            ...this.state.books.wantToRead, 
            ...this.state.books.read ]

          const returnedBooks = books ? makeBooks(books) : []

          const results = returnedBooks.map(rBook => {
            for (let mBook of myBooks) {
              if (mBook.id === rBook.id) {
                return {...rBook, shelf: mBook.shelf}
              }
            }
            return rBook
          })

          this.setState({ results, loading: false, error: '' })
        }
      })
      .catch(
        err => {
          console.error(">>>> Error in updateQuery", err)
          this.setState({ results: [], loading: false, error: 'Error updating book' })
        }
      )
    }, 500)
  }

  loadBooks() {
    this.setState({ loading: true })

    getAll().then(books => {
            
      if (!books) {
        this.setState({ loading: false, error: 'No books loaded' })
        console.error("No books !")
        return
      }

      const newBooks = makeBooks(books)

      const currentlyReading = newBooks.filter(book =>  book.shelf === 'currentlyReading')
      const wantToRead = newBooks.filter(book =>  book.shelf === 'wantToRead')
      const read = newBooks.filter(book =>  book.shelf === 'read')

      this.setState({
        loading: false,
        error: '',
        books: {
          currentlyReading,
          wantToRead,
          read
        }
      })
    })
    .catch(
      error => {
        this.setState({ results:[], loading: false, error: 'Error getting books' })
        console.error(error)
      }
    )
  }

  handleChange = (id, origin, destination) => {
    const books = this.state.books
    const movingBook = books[origin].find(x => x.id === id)
  
    // remove book id from origin shelf
    const originShelf = books[origin].filter(
      book => book.id !== id
    )

    // update the origin shelf without the moving book
    books[origin] = originShelf

    if (destination !== 'none') {
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
      books[destination] = destinationShelf
    }
    
    // call API to update book shelf
    update(movingBook, destination).then(
      this.setState({books})
    ).catch(
      error => {
        this.setState({ error: 'Error moving book' })
        console.error(error)
      })
  }

  putOnShelf = (book, destination) => {
    if (destination === 'none') return

    // call API to update book shelf
    update(book, destination).then( res => {
      book.shelf = destination
      const booksToUpdate = this.state.books
      booksToUpdate[destination] = [...booksToUpdate[destination], book] 
    }).catch(
      error => {
        this.setState({ error: 'Error updating book'})
        console.error(error)
      }
    ) 
  }
  
  updateQuery = (event) => {
    const q = event.target.value
    this.setState({query: q, loading: true, error: ''})
    this.handleSearchDebounced()
  }  

  resetQuery = () => {
    this.setState({ query: '', results:[], error: '' })
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" render={() => (
          <Search {...this.state} 
            putOnShelf={this.putOnShelf} 
            updateQuery={this.updateQuery} 
            resetQuery={this.resetQuery} />
        )} />
        <Route exact path="/" render={ () => (
          <BookList {...this.state} 
            onShelfChanged={this.handleChange}
            resetQuery={this.resetQuery} />
        )} />
      </div>
    )
  }
}

export default App
