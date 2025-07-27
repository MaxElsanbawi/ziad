import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const UsersDashboards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for users data
  const [users, setUsers] = useState([]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch users data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };

        const response = await fetch('https://backend.camels.center/api/users', requestOptions);
        const data = await response.json();
        // Filter users to include only students
        const students = data.filter((user) => user.Role != 'student');
        setUsers(students);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user.user_id]);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.UserID.toString().includes(searchQuery) ||
      user.FullName.includes(searchQuery) ||
      user.Email.includes(searchQuery) ||
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

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">إدارة المستخدمين</h2>

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

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم المستخدم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الاسم الكامل</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الهاتف</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الصلاحيات</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.UserID}
                  onClick={() => handleRowClick(user.UserID)}
                  className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
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
                    <span className="font-semibold md:hidden">الصلاحيات: </span>
                    {user.Role}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>
    </>
  );
};

export default UsersDashboards;