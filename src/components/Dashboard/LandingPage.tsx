"use client";
import React , {useEffect} from "react";

const LandingPage: React.FC = () => {

  useEffect(() => {

    window.location.href = '/auth/signin'
   
  }, [])
  
  return (
    <div className="flex justify-center items-center">
      <h1>Landing Page</h1>
    </div>
  );
};

export default LandingPage;
