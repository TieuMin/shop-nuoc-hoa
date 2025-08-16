import React from "react";
import Banner from "./components/Banner";
import SpecialOffers from "./components/SpecialOffers";
import FeaturedFragrances from "./components/FeaturedFragrances";
import CustomerTestimonials from "./components/CustomerTestimonials";
import DeliveryProcess from "./components/DeliveryProcess";
import ShopByCategory from "./components/ShopByCategory";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-50">
      <Banner />

      <SpecialOffers />

      <FeaturedFragrances />

      <CustomerTestimonials />

      <DeliveryProcess />

      <ShopByCategory />
    </div>
  );
};

export default Home;
