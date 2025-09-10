import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const CoursesPartner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for courses data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  // Fetch courses data
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://phpstack-1509731-5843882.cloudwaysapps.com/api/courses');
      const data = await response.json();
      
      // Get companyName from localStorage
      const companyName = localStorage.getItem('companyName');
      
      // Filter courses where CoursePartner matches companyName from localStorage
      const partnerCourses = data.filter(course => 
        course.CoursePartner && 
        course.CoursePartner.trim() !== '' && 
        course.CoursePartner === companyName
      );
      
      setCourses(partnerCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };
 console.log(localStorage)
  useEffect(() => {
    fetchCourses();
  }, [user.user_id]);

  // Get company name for display
  const companyName = localStorage.getItem('companyName');

  // Delete course function
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه الدورة؟')) {
      return;
    }

    try {
      const response = await fetch(`https://phpstack-1509731-5843882.cloudwaysapps.com/api/courses/${courseId}`, {
        method: 'DELETE',
        redirect: 'follow'
      });

      if (response.ok) {
        // Refresh the courses list after successful deletion
        await fetchCourses();
      } else {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('فشل حذف الدورة. يرجى المحاولة مرة أخرى.');
    }
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.CourseID.toString().includes(searchQuery) ||
      course.CourseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.CourseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.CategoryID.toString().includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to course details
  const handleRowClick = (courseId, e) => {
    // Don't navigate if the click was on the delete button
    if (e.target.closest('button')) return;
    navigate(`/courses/${courseId}/detailsPartner`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">إدارة الدورات</h2>
        <p className="text-center">تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">إدارة الدورات</h2>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary">
        دورات الشركاء - {companyName || 'غير محدد'}
      </h2>

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

      {/* Courses Table */}
      <div className="overflow-x-auto">
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              لا توجد دورات شركاء متاحة لشركة "{companyName || 'غير محدد'}"
            </p>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الدورة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">اسم الدورة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رمز الدورة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الفئة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ البدء</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ الانتهاء</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course) => (
                <tr
                  key={course.CourseID}
                  onClick={(e) => handleRowClick(course.CourseID, e)}
                  className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">رقم الدورة: </span>
                    {course.CourseID}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">اسم الدورة: </span>
                    {course.CourseName}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">رمز الدورة: </span>
                    {course.CourseCode}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">الفئة: </span>
                    {course.CategoryID}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">تاريخ البدء: </span>
                    {new Date(course.StartingTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">تاريخ الانتهاء: </span>
                    {new Date(course.EndingTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.CourseID}/editPartner`);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="تعديل الدورة"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.CourseID);
                        }}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="حذف الدورة"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Previous button */}
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-2 py-2 md:px-3 md:py-2 rounded-md text-sm ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ←
            </button>
            
            {/* Page numbers - show fewer on mobile */}
            {(() => {
              const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
              const maxVisiblePages = window.innerWidth < 768 ? 3 : 7; // 3 on mobile, 7 on desktop
              
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
              
              // Adjust start page if we're near the end
              if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }
              
              const pages = [];
              
              // Add first page and ellipsis if needed
              if (startPage > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => paginate(1)}
                    className="px-2 py-2 md:px-3 md:py-2 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pages.push(
                    <span key="ellipsis1" className="px-2 py-2 text-gray-500">
                      ...
                    </span>
                  );
                }
              }
              
              // Add visible page numbers
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`px-2 py-2 md:px-3 md:py-2 rounded-md text-sm ${
                      currentPage === i
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              
              // Add last page and ellipsis if needed
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(
                    <span key="ellipsis2" className="px-2 py-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className="px-2 py-2 md:px-3 md:py-2 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    {totalPages}
                  </button>
                );
              }
              
              return pages;
            })()}
            
            {/* Next button */}
            <button
              onClick={() => paginate(Math.min(Math.ceil(filteredCourses.length / coursesPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredCourses.length / coursesPerPage)}
              className={`px-2 py-2 md:px-3 md:py-2 rounded-md text-sm ${
                currentPage === Math.ceil(filteredCourses.length / coursesPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPartner;
