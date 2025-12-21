import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

import { IoSearchOutline, IoSearchSharp } from "react-icons/io5";
import { FaCircleUser, FaMoon, FaSun } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { MdContacts } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/authContext';
import { shopDataContext } from '../context/ShopContext';
import { ThemeContext } from '../context/ThemeContext';

function Nav() {

  // ✅ CONTEXTS
  const { userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCartCount, products } =
    useContext(shopDataContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // ✅ LOCAL STATE
  const [showProfile, setShowProfile] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  // ✅ LOGOUT HANDLER (FIXED)
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      // 🔥 IMPORTANT FIX
      setUserData(null);          // clear user state
      setShowProfile(false);      // close dropdown
      setShowSearch(false);       // close search
      setSearch("");              // clear search
      navigate("/login");         // redirect

    } catch (error) {
      console.log(error);
    }
  };

  // ===== AUTOCOMPLETE LOGIC =====
  const query = search?.trim() || "";

  const computeSuggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    // Priority: name match, then category/subCategory
    const scored = products.map(p => {
      let score = 0;
      if (p.name?.toLowerCase().includes(q)) score += 3;
      if (p.category?.toLowerCase().includes(q)) score += 2;
      if (p.subCategory?.toLowerCase().includes(q)) score += 1;
      return { score, p };
    }).filter(x => x.score > 0);

    scored.sort((a,b) => b.score - a.score || (a.p.name || "").localeCompare(b.p.name || ""));
    return scored.slice(0, 8).map(x => x.p);
  }, [products, query]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSuggestions(computeSuggestions);
      setActiveIndex(-1);
    }, 200);
    return () => clearTimeout(t);
  }, [computeSuggestions]);

  const navigateToSuggestion = (prod) => {
    if (!prod?._id) return;
    setShowSearch(false);
    setSuggestions([]);
    setActiveIndex(-1);
    navigate(`/productdetail/${prod._id}`);
  };

  const onSearchKeyDown = (e) => {
    const key = e.key;
    if (key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = (prev + 1) % (suggestions.length || 1);
        return next;
      });
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = prev <= 0 ? (suggestions.length - 1) : prev - 1;
        return suggestions.length > 0 ? next : -1;
      });
    } else if (key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        navigateToSuggestion(suggestions[activeIndex]);
      } else {
        // fallback to collections search
        navigate('/collection');
      }
    } else if (key === 'Escape') {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const highlight = (text = "", q = "") => {
    const idx = text.toLowerCase().indexOf((q || "").toLowerCase());
    if (idx === -1 || !q) return <span>{text}</span>;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
      <span>
        {before}
        <span className='text-[#2f97f1] font-semibold'>{match}</span>
        {after}
      </span>
    );
  };

  return (
    <div className='w-[100vw] z-10 fixed top-0 nav-glass border-b border-[#b8dce8] shadow-[0_2px_10px_rgba(20,136,170,0.1)] bg-white/95 backdrop-blur-sm'>
      {/* Main Navigation */}
      <div className='h-[80px] flex items-center justify-between px-[20px] lg:px-[40px]'>
        
        {/* LOGO */}
        <motion.div 
          className='flex items-center gap-[10px] cursor-pointer'
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={logo} alt="logo" className='w-[40px] h-[40px]' />
          <h1 className='text-[20px] font-extrabold hidden sm:flex bg-gradient-to-r from-[#65d8f7] via-[#00d4ff] to-[#65d8f7] bg-clip-text text-transparent'>RS Enterprises</h1>
        </motion.div>

        {/* DESKTOP MENU */}
        <div className='hidden md:flex items-center gap-[15px]'>
          {[
            { path: "/", label: "HOME", icon: null },
            { path: "/collection", label: "PRODUCT", icon: null },
            { path: "/about", label: "ABOUT", icon: null },
            { path: "/contact", label: "CONTACT", icon: null }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className='group relative px-[16px] py-[8px] cursor-pointer rounded-lg hover:bg-[#e8f4f8] transition-all duration-300'
            >
              <div className='flex items-center gap-[6px] text-[14px] font-semibold text-[#0a5f7a] group-hover:text-[#1488aa] transition-colors'>
                {item.icon && <span className='text-[18px]'>{item.icon}</span>}
                {item.label}
              </div>
              <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-[#65d8f7] to-[#00d4ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center'></div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className='flex items-center gap-[20px]'>
          
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className='cursor-pointer'
          >
            {theme === 'light' ? (
              <FaMoon className='w-[24px] h-[24px] text-[#1488aa] hover:text-[#0a5f7a] transition-colors' />
            ) : (
              <FaSun className='w-[24px] h-[24px] text-[#fbbc04] hover:text-[#f59e0b] transition-colors' />
            )}
          </motion.button>
          
          {/* Search Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='cursor-pointer'
            onClick={() => setShowSearch(prev => !prev)}
          >
            {!showSearch ? (
              <IoSearchOutline className='w-[28px] h-[28px] text-[#1488aa] hover:text-[#0a5f7a] transition-colors' />
            ) : (
              <IoSearchSharp className='w-[28px] h-[28px] text-[#1488aa]' />
            )}
          </motion.div>

          {/* Profile Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='cursor-pointer'
            onClick={() => setShowProfile(prev => !prev)}
          >
            {!userData ? (
              <FaCircleUser className='w-[28px] h-[28px] text-[#1488aa] hover:text-[#0a5f7a] transition-colors' />
            ) : (
              <motion.div
                className='w-[36px] h-[36px] bg-gradient-to-br from-[#65d8f7] to-[#00d4ff] text-[#0a0a0a] rounded-full flex items-center justify-center font-bold text-[16px] cursor-pointer hover:shadow-[0_0_20px_rgba(101,216,247,0.5)] transition-all'
                whileHover={{ boxShadow: '0 0 25px rgba(101, 216, 247, 0.6)' }}
              >
                {userData?.name?.charAt(0).toUpperCase()}
              </motion.div>
            )}
          </motion.div>

          {/* Cart Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='hidden md:flex relative cursor-pointer'
            onClick={() => navigate("/cart")}
          >
            <MdOutlineShoppingCart className='w-[32px] h-[32px] text-[#1488aa] hover:text-[#0a5f7a] transition-colors' />
            {getCartCount() > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className='absolute -top-[8px] -right-[8px] w-[24px] h-[24px] bg-gradient-to-br from-[#ea4335] to-[#fbbc04] text-white text-[11px] font-bold rounded-full flex items-center justify-center'
              >
                {getCartCount()}
              </motion.span>
            )}
          </motion.div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='md:hidden text-[#1488aa]'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FaTimes className='w-[28px] h-[28px]' />
            ) : (
              <FaBars className='w-[28px] h-[28px]' />
            )}
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='fixed left-0 right-0 top-[80px] w-screen border-t border-[#b8dce8] bg-white shadow-md py-[20px] z-50'
        >
          <div className='relative w-[100vw] flex flex-col items-center justify-center gap-[15px]'>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search products, categories..."
              autoFocus
              className='w-[90vw] lg:w-[85vw] h-[48px] bg-white border-2 border-[#1488aa]/40 rounded-[25px] px-[20px] text-[#0a5f7a] text-[16px] placeholder:text-[#5a8899] focus:outline-none focus:border-[#1488aa] focus:shadow-[0_0_20px_rgba(20,136,170,0.2)] transition-all'
            />
          </div>

          {query.length >= 2 && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='w-[90vw] lg:w-[85vw] mx-auto max-h-[320px] overflow-auto bg-white text-[#0a5f7a] rounded-[15px] mt-3 shadow-lg border-2 border-[#b8dce8] absolute left-[50%] translate-x-[-50%] top-[120px]'
            >
              {suggestions.map((s, i) => (
                <motion.div
                  key={s._id}
                  whileHover={{ backgroundColor: 'rgba(101, 216, 247, 0.1)' }}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#65d8f7]/10 last:border-b-0 ${
                    i === activeIndex ? 'bg-[#65d8f7]/20' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => navigateToSuggestion(s)}
                >
                  <img src={s.image1} alt="" className='w-12 h-12 rounded-[8px] object-cover border border-[#65d8f7]/30' />
                  <div className='flex flex-col flex-1'>
                    <div className='text-[14px] font-semibold'>{highlight(s.name, query)}</div>
                    <div className='text-[12px] text-[#5a8899]'>
                      {highlight(`${s.category || ''}${s.subCategory ? ' • ' + s.subCategory : ''}`, query)}
                    </div>
                  </div>
                  <div className='text-[13px] font-semibold text-[#1488aa]'>₹ {s.price}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {query.length >= 2 && suggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='w-[90vw] lg:w-[85vw] bg-white text-[#5a8899] rounded-[15px] mt-3 shadow-lg border-2 border-[#b8dce8] py-3 text-sm text-center absolute left-[50%] translate-x-[-50%] top-[120px]'
            >
              No matches. Press Enter to search all.
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='absolute top-[100%] right-[20px] lg:right-[40px] w-[220px] bg-white rounded-[15px] border border-[#b8dce8] shadow-[0_0_30px_rgba(20,136,170,0.15)] overflow-hidden'
        >
          <ul className='flex flex-col text-[#0a5f7a] text-[14px]'>
            {!userData && (
              <motion.li
                whileHover={{ backgroundColor: 'rgba(232, 244, 248, 0.8)' }}
                className='px-[15px] py-[12px] cursor-pointer border-b border-[#b8dce8] font-semibold transition-colors'
                onClick={() => {
                  navigate("/login");
                  setShowProfile(false);
                }}
              >
                🔐 Login
              </motion.li>
            )}

            {userData && (
              <motion.li
                whileHover={{ backgroundColor: 'rgba(232, 244, 248, 0.8)' }}
                className='px-[15px] py-[12px] cursor-pointer border-b border-[#b8dce8] font-semibold transition-colors'
                onClick={handleLogout}
              >
                🚪 Logout
              </motion.li>
            )}

            <motion.li
              whileHover={{ backgroundColor: 'rgba(232, 244, 248, 0.8)' }}
              className='px-[15px] py-[12px] cursor-pointer border-b border-[#b8dce8] font-semibold transition-colors'
              onClick={() => {
                navigate("/order");
                setShowProfile(false);
              }}
            >
              📦 Orders
            </motion.li>

            <motion.li
              whileHover={{ backgroundColor: 'rgba(232, 244, 248, 0.8)' }}
              className='px-[15px] py-[12px] cursor-pointer font-semibold transition-colors'
              onClick={() => {
                navigate("/about");
                setShowProfile(false);
              }}
            >
              ℹ️ About
            </motion.li>
          </ul>
        </motion.div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='md:hidden border-t border-[#b8dce8] bg-white'
        >
          <div className='px-[20px] py-[15px] flex flex-col gap-[10px]'>
            {[
              { path: "/", label: "HOME" },
              { path: "/collection", label: "PRODUCT" },
              { path: "/about", label: "ABOUT" },
              { path: "/contact", label: "CONTACT" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className='text-[#1488aa] hover:text-[#0a5f7a] cursor-pointer py-[10px] px-[12px] rounded-[8px] border border-[#b8dce8] hover:border-[#1488aa] hover:bg-[#e8f4f8] transition-all text-[14px] font-semibold'
              >
                {item.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <div className='fixed bottom-0 left-0 w-full h-[80px] nav-glass border-t border-[#b8dce8] md:hidden flex justify-between px-[15px] py-[10px] bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(20,136,170,0.1)]'>
        {[
          { path: "/", icon: <IoMdHome className='w-[24px] h-[24px]' />, label: "Home" },
          { path: "/collection", icon: <HiOutlineCollection className='w-[24px] h-[24px]' />, label: "Collections" },
          { path: "/contact", icon: <MdContacts className='w-[24px] h-[24px]' />, label: "Contact" },
          { path: "/cart", icon: <MdOutlineShoppingCart className='w-[24px] h-[24px]' />, label: "Cart" }
        ].map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
            className='text-[#0a5f7a] flex flex-col items-center gap-[4px] text-[11px] font-semibold hover:text-[#1488aa] transition-colors'
          >
            <span className='text-[#1488aa] group-hover:text-[#0a5f7a]'>{item.icon}</span>
            {item.label}
          </motion.button>
        ))}

        {getCartCount() > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='absolute top-[10px] right-[32px] w-[22px] h-[22px] bg-gradient-to-br from-[#ea4335] to-[#fbbc04] text-white text-[9px] font-bold rounded-full flex items-center justify-center'
          >
            {getCartCount()}
          </motion.span>
        )}
      </div>
    </div>
  );
}

export default Nav;
