import React, { useState } from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ onSearch, value = '' }) => {
  const [searchValue, setSearchValue] = useState(value)

  const handleChange = (e) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onSearch(newValue)
  }

  const handleClear = () => {
    setSearchValue('')
    onSearch('')
  }

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onChange={handleChange}
          className="search-input"
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="clear-search-btn"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar