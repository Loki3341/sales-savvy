import React from 'react';
import CategoryNavigation from '../common/CategoryNavigation';
import '../../assets/styles/components.css';

const Navigation = ({ onCategoryClick, activeCategory }) => {
  return (
    <nav className="category-navigation">
      <CategoryNavigation 
        onCategoryClick={onCategoryClick} 
        activeCategory={activeCategory} 
      />
    </nav>
  );
};

export default Navigation;