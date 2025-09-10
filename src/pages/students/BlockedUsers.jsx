import React, { useState, useEffect } from 'react';
import { Search, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const BlockedUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for blocked users data
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch blocked users data on component mount
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };

        const response = await fetch('https://phpstack-1509731-5843882.cloudwaysapps.com/api/auth/blocked-users', requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch blocked users');
        }
        const data = await response.json();
        setBlockedUsers(data.blockedUsers || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.UserID.toString().includes(searchQuery) ||
      user.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.PhoneNumber.includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to user details
  const handleRowClick = (userId) => {
    navigate(`/students/${userId}/details`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading blocked users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
                <button
          onClick={() => navigate('/students')}
          className="flex items-center text-primary hover:text-secondary mb-6"
        >
          <ArrowRight size={20} className="ml-2" />
          العودة إلى قائمة الطلاب
        </button>
      <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
        <Lock className="text-red-500" size={24} />
        المستخدمون المحظورون
        <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {blockedUsers.length}
        </span>
      </h2>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="ابحث عن مستخدم محظور..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا يوجد مستخدمون محظورون
          </div>
        ) : (
          <>
            <table className="min-w-full bg-white">
              <thead className="hidden md:table-header-group">
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم المستخدم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الاسم الكامل</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الهاتف</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ الإنشاء</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.UserID}
                    onClick={() => handleRowClick(user.UserID)}
                    className="border-b cursor-pointer hover:bg-red-50 transition-colors"
                  >
                    {/* Stacked layout for mobile */}
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">رقم المستخدم: </span>
                      {user.UserID}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">الاسم الكامل: </span>
                      {user.FullName}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">البريد الإلكتروني: </span>
                      {user.Email}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">رقم الهاتف: </span>
                      {user.PhoneNumber}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">تاريخ الإنشاء: </span>
                      {new Date(user.CreatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
              <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlockedUsers;