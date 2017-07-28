import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Book from './Book'
import { search, update } from './BooksAPI'
import { makeBooks } from './Book'
import _ from 'lodash'

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      results: [],
      query: '',
      loading: false
    }
    this.updateQuery = this.updateQuery.bind(this)
  }

  putOnShelf(book, destination) {
    if (destination === 'none') return

    // call API to update book shelf
    update(book, destination).then( (res) => {
      this.setState({
        results: this.state.results.map((b) => 
          b.id === book.id ? {...book, shelf: destination} : b
        )
      })
    }).catch(
      error => console.error(error)
    ) 
  }

  componentDidMount() {
    this.handleSearchDebounced = _.debounce(() => {
      search(this.state.query, 20).then( books => {
        if (books.error) {
          console.error("---- No books !")
          this.setState({ results:[], loading: false })
        } else {
          const searchedBooks = books ? makeBooks(books) : []
          this.setState({ results: searchedBooks, loading: false })
        }
      })
      .catch(
        err => {
          console.error(">>>> Error in updateQuery", err)
          this.setState({ results: [], loading: false })
        }
      )
    }, 500)
  }
  
  updateQuery(event) {
    const q = event.target.value
    this.setState({query: q, loading: true})
    this.handleSearchDebounced()
  }  

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          
          <Link
            to="/"
            className="close-search" 
            onClick={ () => this.setState({results:[], query:'', loading: false}) }>
            Close</Link>
                        
          <div className="search-books-input-wrapper">
            <input 
              type="text" 
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={ e => this.updateQuery(e)}/>           
          </div>
        </div>
        <div className="search-books-results">
          { this.state.loading 
            ? ( <div><p>Loading...</p></div> )
            : (
              <div>
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
              )
          }
        </div>
      </div>
    )
  }
}

export default Search