'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiFilter, FiX, FiStar, FiShoppingCart, FiSearch } from 'react-icons/fi';
import localFont from 'next/font/local';

const myfont = localFont({
  src: '../../public/font/fordscript_irz4rr.ttf',
  weight: '400',
});

// Mock product data - replace with your actual data fetching
const mockProducts = [
  {
    id: 1,
    name: 'Premium Protein Blend',
    price: 49.99,
    image: '/product1.jpg',
    category: 'Protein',
    rating: 4.8,
    isNew: true,
  },
  // Add more mock products as needed
];

export default function ShopPage() {
  const [products, setProducts] = useState(mockProducts);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-8 pb-16">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`${myfont.className} text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent`}>
            Our Products
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Discover our premium selection of high-quality supplements and fitness essentials.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-4 text-gray-400" />
          </div>
          
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 w-full md:w-auto justify-center text-white backdrop-blur-sm"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {filtersOpen && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button 
                onClick={() => setFiltersOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-white">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400/20" />
                    <span className="ml-2 text-gray-300">Protein</span>
                  </label>
                  {/* Add more category options */}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-white">Price Range</h4>
                <div className="space-y-2">
                  <input type="range" className="w-full" />
                  <div className="flex justify-between text-gray-300">
                    <span>$0</span>
                    <span>$100+</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-white">Rating</h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-300">& Up</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isNew && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-white">{product.name}</h3>
                  <span className="font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 ml-1">({product.rating})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{product.category}</span>
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-md">
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white">
              Previous
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button 
                key={page}
                className={`w-10 h-10 rounded-xl transition-all duration-300 ${page === 1 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'}`}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
