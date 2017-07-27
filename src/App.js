import React from 'react'
import { Route } from 'react-router-dom'
import BookList from './BookList'
import Search from './Search'
import './App.css'

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Route path="/search" component={Search}/>
        <Route exact path="/" component={BookList} />
      </div>
    )
  }
}

export default App
