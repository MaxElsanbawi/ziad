import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white lg:bg-gray-100" dir="rtl">
      {/* Image at the top */}
      <div className="mt-0 mb-6">
        <img src="/Abad.png" alt="Radwa Icon" className="w-72" />
      </div>
        <h1 className='text-3xl font-semibold'>404</h1>      
        <h1 className='text-3xl font-semibold'>الصفحة غير موجودة</h1> 
        <button
            onClick={() => navigate('/')}
            className="w-[260px] my-10 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-primary font-ibm-plex-sans-arabic"
          >
            الرجوع للوحة التحكم
          </button>     
    </div>
  );
};

export default NotFound;