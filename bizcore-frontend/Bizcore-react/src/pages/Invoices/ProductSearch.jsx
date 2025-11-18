import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductSearch = ({ index, setItemDetails, items }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    if (searchQuery.length > 2) {
      axios.get(`http://localhost:8000/api/products/?search=${searchQuery}`)
        .then(response => {
          setFilteredProducts(response.data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  const handleProductSelect = (product) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      product: product.name,
      code: product.sku_code,
      hsn: product.hsn_sac_code,
      rate: product.retail_price,
      uom: product.unit_of_measurement,
    };
    setItemDetails(updatedItems); // Update the state with the selected product details
    setSearchQuery(product.name); // Set the search query to the selected product name
    setIsDropdownVisible(false); // Hide the dropdown after selection
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-1 border border-gray-300"
        placeholder="Search Product"
        onFocus={() => setIsDropdownVisible(true)} // Show dropdown on focus
      />
      {isDropdownVisible && filteredProducts.length > 0 && (
        <div className="absolute top-0 left-50 w-full bg-white border border-gray-300 z-99">
          <ul className="max-h-40 overflow-auto">
            {filteredProducts.map((product, idx) => (
              <li
                key={idx}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleProductSelect(product)}
              >
                {product.name} ({product.sku_code})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
