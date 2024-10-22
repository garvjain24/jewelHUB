import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const categories = [
    { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Pendants', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  ];

  return (
    <div className="bg-royal-light">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-royal-dark opacity-50"></div>
        <img
          src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Luxury Jewelry"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-4">Royal Jewels</h1>
          <p className="text-xl md:text-2xl mb-8">Exquisite Indian Jewelry for the Modern Royalty</p>
          <Link
            to="/shop"
            className="bg-royal-accent-diamond text-white px-8 py-3 rounded-full font-semibold hover:bg-royal-interactive transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-royal-accent">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-center mb-12 text-royal-header">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={index} to={`/shop?category=${category.name.toLowerCase()}`} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img src={category.image} alt={category.name} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-dark to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-semibold mb-2">{category.name}</h3>
                    <span className="text-royal-accent-diamond group-hover:text-white transition-colors flex items-center">
                      Shop Now <ChevronRight className="ml-1" size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      {/* Add a carousel component here */}

      {/* About Section */}
      <section className="py-16 bg-royal-light">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src="https://images.unsplash.com/photo-1619119069152-a2b331eb392a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Jewelry Craftsmanship"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="font-playfair text-4xl font-bold mb-6 text-royal-header">Our Heritage</h2>
            <p className="text-lg mb-6 text-royal-dark">
              At Royal Jewels, we blend centuries-old Indian craftsmanship with contemporary design. Each piece tells a story of tradition, luxury, and artistry, crafted to adorn the modern royalty in you.
            </p>
            <Link
              to="#"
              className="inline-block bg-royal-interactive text-white px-6 py-3 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-royal-highlight text-royal-dark text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold mb-6">Experience Luxury Today</h2>
          <p className="text-xl mb-8">Discover our exquisite collection and invest in timeless beauty.</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/shop"
              className="bg-royal-interactive text-white px-8 py-3 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/investment"
              className="bg-royal-button text-royal-dark px-8 py-3 rounded-full font-semibold hover:bg-royal-interactive hover:text-white transition-colors"
            >
              Invest in Gold
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;