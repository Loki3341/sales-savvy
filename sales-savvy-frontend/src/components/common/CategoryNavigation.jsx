import React from 'react'
import { CATEGORIES } from '../../utils/constants'

const CategoryNavigation = ({ onCategoryClick, activeCategory }) => {
  return (
    <nav className="category-navigation">
      <ul className="category-list">
        {CATEGORIES.map((category, index) => (
          <li
            key={index}
            className={`category-item ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryClick(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default CategoryNavigation