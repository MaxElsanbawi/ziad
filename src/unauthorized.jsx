import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from './AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Shield size={48} className="text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          غير مصرح بالوصول
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.
          {user && (
            <span className="block mt-2 text-sm">
              دورك الحالي: <span className="font-semibold text-primary">{user.role}</span>
            </span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary transition-colors duration-200 flex items-center justify-center"
          >
            <Home size={20} className="ml-2" />
            العودة للرئيسية
          </button>

          <button
            onClick={handleGoBack}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="ml-2" />
            العودة للصفحة السابقة
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع المسؤول
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 