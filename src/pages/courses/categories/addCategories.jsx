import React, { useState } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../AuthContext';

const AddCategories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for form fields
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null); // Add image preview

  // Handle image change with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object
    const formData = new FormData();
    formData.append('CategoryName', categoryName);
    formData.append('CategoryDescription', categoryDescription);
    if (categoryImage) {
      formData.append('categoryImage', categoryImage); // Updated to match backend
    }
  
    // Prepare the request headers
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user.token}`);
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
  
    try {
      const response = await fetch("https://backend.camels.center/api/categories", requestOptions);
      const result = await response.json();
  
      if (response.ok) {
        console.log('New Category Added:', result);
        toast.success('تمت إضافة الفئة بنجاح!');
        // Clear all form inputs
        setCategoryName('');
        setCategoryDescription('');
        setCategoryImage(null);
        setPreviewUrl(null); // Clear preview
        setError('');
        
        // Optionally navigate to categories list
        setTimeout(() => {
          navigate('/categories');
        }, 2000);
      } else {
        // Handle backend errors
        const errorMessage = result.message || result.storageErrors || 'فشل في إضافة الفئة';
        setError(errorMessage.toString());
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ أثناء إضافة الفئة');
      toast.error('حدث خطأ أثناء إضافة الفئة');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <button
          onClick={() => navigate('/categories')}
          className="flex items-center text-primary hover:text-secondary mb-6"
        >
          <ArrowRight size={20} className="ml-2" />
          العودة إلى قائمة الفئات
        </button>

        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <UserPlus size={24} className="ml-2" />
          إضافة فئة جديدة
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {typeof error === 'object' ? JSON.stringify(error) : error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-primary mb-1">
              اسم الفئة
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل اسم الفئة"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="categoryDescription" className="block text-sm font-medium text-primary mb-1">
              وصف الفئة
            </label>
            <textarea
              id="categoryDescription"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل وصف الفئة"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="categoryImage" className="block text-sm font-medium text-primary mb-1">
              صورة الفئة
            </label>
            <input
              type="file"
              id="categoryImage"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              accept="image/*"
              required
            />
            {previewUrl && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-xs rounded-md shadow-sm"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            إضافة فئة
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategories;