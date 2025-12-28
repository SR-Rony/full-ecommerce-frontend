import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiChevronDown, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import localFont from 'next/font/local';

const myfont = localFont({
  src: '../public/font/fordscript_irz4rr.ttf',
  weight: '400',
});

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItems, setCartItems] = useState(3);
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect with better performance
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only update state if scroll position changes significantly
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setScrolled(currentScrollY > 60);
        lastScrollY = currentScrollY;
      }
    };

    // Use passive scroll for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const userMenuItems = [
    { name: 'My Profile', path: '/account', icon: <FiUser className="w-4 h-4" /> },
    { name: 'My Orders', path: '/orders', icon: <FiPackage className="w-4 h-4" /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings className="w-4 h-4" /> },
    { name: 'Sign Out', path: '/logout', icon: <FiLogOut className="w-4 h-4" /> },
  ];

  return (
    <header 
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || pathname !== '/' 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg' 
          : 'bg-gradient-to-r from-gray-900 to-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <span className={`${myfont.className} text-3xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent`}>
                Hammer & Bell
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.path 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <div className="relative">
              <button 
                onClick={() => router.push('/cart')}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors relative"
                aria-label="Shopping Cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                id="user-menu"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600">
                  <FiUser className="w-4 h-4" />
                </div>
                <FiChevronDown className={`ml-1 h-4 w-4 text-gray-300 transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="mr-3 text-gray-400">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
                aria-label="Toggle menu"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 border-t border-gray-700' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.path
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 pb-2 border-t border-gray-700 mt-2">
            <div className="flex items-center px-4">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                <FiUser className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">User Name</div>
                <div className="text-sm font-medium text-gray-400">user@example.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {userMenuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-400">{item.icon}</span>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
