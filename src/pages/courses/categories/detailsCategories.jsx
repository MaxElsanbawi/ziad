import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

const DetailsCategories = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // Changed from courseId to categoryId

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`https://backend.camels.center/api/categories/${categoryId}`, {
          method: 'GET',
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch category details');
        }

        const result = await response.json();
        setCategory(result);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  if (loading) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الفئة</h2>
          <p className="text-center">تحميل...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الفئة</h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Page Title and Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center">
            تفاصيل الفئة
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/categories/${categoryId}/print`)}
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Printer size={18} className="ml-2" />
              طباعة تفاصيل الفئة
            </button>
          </div>
        </div>

        {category && (
          <div className="space-y-6 printable-area">
            {/* Category Information Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">رقم الفئة</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {category.CategoryID}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">اسم الفئة</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {category.CategoryName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">وصف الفئة</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {category.CategoryDescription || 'لا يوجد وصف'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">صورة الفئة</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {category.CategoryImgUrl || 'لا يوجد صورة'}
                  <img src={"https://backend.camels.center" + category.CategoryImgUrl} />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailsCategories;