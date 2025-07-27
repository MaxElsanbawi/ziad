import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ApprovedRegistrations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const registrationsPerPage = 10;

  // Fetch data with enhanced error handling
  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://backend.camels.center/api/registrations');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('فشل في تحميل بيانات التسجيلات. يرجى المحاولة مرة أخرى.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [user.user_id]);

  // Enhanced filtering function
  const filteredRegistrations = registrations.filter(registration => {
    const searchLower = searchQuery.toLowerCase();
    const isApproved = registration.Status === 'Approved';
    
    const matchesSearch = 
      (registration.RegistrationID?.toString().includes(searchLower) ||
       registration.UserID?.toString().includes(searchLower) ||
       registration.CourseID?.toString().includes(searchLower) ||
       registration.FullName?.toLowerCase()?.includes(searchLower) ||
       registration.Email?.toLowerCase()?.includes(searchLower));
    
    return isApproved && (searchQuery === '' || matchesSearch);
  });

  // Pagination calculations
  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = filteredRegistrations.slice(
    indexOfFirstRegistration, 
    indexOfLastRegistration
  );
  const totalPages = Math.ceil(filteredRegistrations.length / registrationsPerPage);

  // Handlers
  const handleRowClick = (registrationId) => {
    navigate(`/registrations/${registrationId}/details`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary">التسجيلات المعتمدة</h2>

      {/* Search and Status Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="ابحث برقم التسجيل، المستخدم، الدورة..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        
        <div className="text-sm text-gray-600">
          عرض {filteredRegistrations.length} تسجيل معتمد
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Registrations Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم التسجيل</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم المستخدم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الهويه</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">اسم الدورة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الاسم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ التسجيل</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الوقت</th>
                </tr>
              </thead>
              <tbody>
                {currentRegistrations.length > 0 ? (
                  currentRegistrations.map((registration) => (
                    <tr
                      key={registration.RegistrationID}
                      onClick={() => handleRowClick(registration.RegistrationID)}
                      className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {registration.RegistrationID}
                      </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-700">
                          {registration.PhoneNumber}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-700">
                          {registration.NationalId}
                        </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {registration.CourseName.split(' ').slice(0, 5).join(' ')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {registration.FullName || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {registration.Email || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {registration.RegistrationDate ? 
                          new Date(registration.RegistrationDate).toLocaleDateString('en-GB') : 
                          'غير محدد'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {new Date(registration.StartingTime).toLocaleDateString('en-GB')}
                      </td>

                      <td className="px-6 py-4 text-right text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          registration.Status === 'Approved' ? 
                            'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.Status === 'Approved' ? 'معتمد' : 'قيد الانتظار'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      لا توجد تسجيلات معتمدة مطابقة للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                السابق
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show limited page numbers with ellipsis
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <span className="px-2 py-2">...</span>
              )}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApprovedRegistrations;

