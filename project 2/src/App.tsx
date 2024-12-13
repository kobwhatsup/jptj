import React from 'react';
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

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;