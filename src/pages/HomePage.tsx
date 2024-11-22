import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import AdminDashboard from '../components/admin/AdminDashboard';

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      <Navbar 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <>
          <Hero />
          <Categories selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
        </>
      )}
      <Footer />
    </>
  );
};

export default HomePage;