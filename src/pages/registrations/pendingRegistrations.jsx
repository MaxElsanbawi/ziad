import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const PendingRegistrations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for registrations data
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const registrationsPerPage = 10;

  // Fetch registrations data on component mount
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        const response = await fetch('https://phpstack-1509731-5843882.cloudwaysapps.com/api/registrations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch registrations');
        }
        
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []); // Removed user.user_id from dependencies as it's not used

  // Filter registrations based on search query and status
  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration?.Status === 'Pending' &&
      (
        registration?.RegistrationID?.toString().includes(searchQuery) ||
        registration?.UserID?.toString().includes(searchQuery) ||
        registration?.CourseID?.toString().includes(searchQuery) ||
        registration?.FullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        registration?.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        registration?.PhoneNumber?.includes(searchQuery)
      )
  );

  // Pagination logic
  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = filteredRegistrations.slice(
    indexOfFirstRegistration, 
    indexOfLastRegistration
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to registration details
  const handleRowClick = (registrationId) => {
    navigate(`/registrations/${registrationId}/details`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-primary">إدارة التسجيلات</h2>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Registrations Table */}
      <div className="overflow-x-auto">
        {filteredRegistrations.length === 0 ? (
          <p className="text-center py-4">لا توجد تسجيلات معلقة</p>
        ) : (
          <>
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                    رقم التسجيل
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                    الاسم الكامل
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                    رقم الهويه
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                    رقم الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                    اسم الدورة
                  </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                        الوقت
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-primary">
                        تاريخ
                      </th>
                </tr>
              </thead>
              <tbody>
                {currentRegistrations.map((registration) => (
                  <tr
                    key={registration.RegistrationID}
                    onClick={() => handleRowClick(registration.RegistrationID)}
                    className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {registration.RegistrationID}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {registration.FullName}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {registration.NationalId}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {registration.Email}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      {registration.PhoneNumber}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                    {registration.CourseName.split(' ').slice(0, 5).join(' ')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                    {new Date(registration.StartingTime).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                        {registration.RegistrationDate ? 
                          new Date(registration.RegistrationDate).toLocaleDateString('en-GB') : 
                          'غير محدد'}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredRegistrations.length > registrationsPerPage && (
              <div className="flex justify-center mt-6">
                {Array.from(
                  { length: Math.ceil(filteredRegistrations.length / registrationsPerPage) }, 
                  (_, i) => (
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
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PendingRegistrations;
