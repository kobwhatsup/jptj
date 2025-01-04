import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LawLibraryPage from './pages/LawLibraryPage';
import LawDetailPage from './pages/LawDetailPage';
import PolicyLibraryPage from './pages/PolicyLibraryPage';
import PolicyDetailPage from './pages/PolicyDetailPage';
import IndustryNewsPage from './pages/IndustryNewsPage';
import IndustryNewsDetailPage from './pages/IndustryNewsDetailPage';
import ForumPage from './pages/ForumPage';
import ForumPostDetailPage from './pages/ForumPostDetailPage';
import NewsDetailPage from './pages/NewsDetailPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AIDesigner from './pages/AIDesigner';

import { Product, CartItem } from './lib/types';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header cartItems={cartItems} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/laws" element={<LawLibraryPage />} />
            <Route path="/laws/:id" element={<LawDetailPage />} />
            <Route path="/policies" element={<PolicyLibraryPage />} />
            <Route path="/policies/:id" element={<PolicyDetailPage />} />
            <Route path="/industry" element={<IndustryNewsPage />} />
            <Route path="/industry/:id" element={<IndustryNewsDetailPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/:id" element={<ForumPostDetailPage />} />
            <Route path="/designer" element={<AIDesigner addToCart={addToCart} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
