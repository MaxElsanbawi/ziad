import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const AllRegistrations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for registrations data
  const [registrations, setRegistrations] = useState([]);
console.log(registrations);
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const registrationsPerPage = 10;

  // Fetch registrations data on component mount
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };

        const response = await fetch('https://backend.camels.center/api/registrations', requestOptions);
        const data = await response.json();
        setRegistrations(data);

      } catch (error) {
        console.error('Error fetching registrations:', error);
      }
    };

    fetchRegistrations();
  }, [user.user_id]);
  // Filter registrations based on search query
  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration.RegistrationID.toString().includes(searchQuery) ||
      registration.Status.includes(searchQuery) ||
      registration.UserID.toString().includes(searchQuery) ||
      registration.CourseID.toString().includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = filteredRegistrations.slice(indexOfFirstRegistration, indexOfLastRegistration);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to registration details
  const handleRowClick = (registrationId) => {
    navigate(`/registrations/${registrationId}/details`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">إدارة التسجيلات</h2>

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

        {/* Registrations Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم التسجيل</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم المستخدم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الدورة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ التسجيل</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الوقت</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {currentRegistrations.map((registration) => (
                <tr
                  key={registration.RegistrationID}
                  onClick={() => handleRowClick(registration.RegistrationID)}
                  className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {/* Stacked layout for mobile */}
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">رقم التسجيل: </span>
                    {registration.RegistrationID}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">رقم الهاتف: </span>
                    {registration.PhoneNumber}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">اسم الدورة: </span>
                    {registration.CourseName.split(' ').slice(0, 5).join(' ')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">تاريخ التسجيل: </span>
                    {new Date(registration.RegistrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">الوقت: </span>
                    {new Date(registration.StartingTime).toLocaleDateString('en-GB')}
                  </td>
                  
                 
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">الحالة: </span>
                    {registration.Status}
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(filteredRegistrations.length / registrationsPerPage) }, (_, i) => (
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

export default AllRegistrations;