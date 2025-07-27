import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';

const AllCategories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for categories data
  const [categories, setCategories] = useState([]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  // Fetch categories data on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };

        const response = await fetch('https://backend.camels.center/api/categories', requestOptions);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [user.user_id]);

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.CategoryID.toString().includes(searchQuery) ||
      category.CategoryName.includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to category details
  const handleRowClick = (categoryId) => {
    navigate(`/courses/categories/${categoryId}/details`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">إدارة الفئات</h2>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الفئة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">اسم الفئة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">وصف الفئة</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category) => (
                <tr
                  key={category.CategoryID}
                  onClick={() => handleRowClick(category.CategoryID)}
                  className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {/* Stacked layout for mobile */}
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">رقم الفئة: </span>
                    {category.CategoryID}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">اسم الفئة: </span>
                    {category.CategoryName}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">وصف الفئة: </span>
                    {category.CategoryDescription || 'لا يوجد وصف'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(filteredCategories.length / categoriesPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllCategories;