import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../api';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, priceRange, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await api.products.getAll({
        search: searchTerm,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        category: selectedCategory,
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await api.cart.add({ productId, quantity: 1 });
      // You can add a toast notification here to inform the user that the product was added to the cart
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-playfair text-4xl font-bold mb-8 text-royal-header">
        Shop Our Collection
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="relative mb-4 md:mb-0 md:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-royal-interactive rounded-full focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-royal-interactive"
            size={20}
          />
        </div>
        <div className="flex space-x-4">
          <select
            className="px-4 py-2 border border-royal-interactive rounded-full focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Earrings">Earrings</option>
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Pendants">Pendants</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-royal-interactive text-white rounded-full hover:bg-royal-accent-diamond transition-colors">
            <Filter size={20} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-royal-dark mb-2">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
          className="w-full"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-playfair text-xl font-semibold mb-2 text-royal-header">
                {product.name}
              </h3>
              <p className="text-royal-interactive font-bold mb-2">
                ₹{product.price}
              </p>
              <button
                onClick={() => addToCart(product.id)}
                className="w-full bg-royal-button text-royal-dark py-2 rounded-full font-semibold hover:bg-royal-interactive hover:text-white transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;