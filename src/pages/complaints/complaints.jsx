import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllComplaints = () => {
  const navigate = useNavigate();

  // State for complaints data
  const [complaints, setComplaints] = useState([]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 10;

  // Fetch complaints data on component mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };

        const response = await fetch('https://phpstack-1509731-5843882.cloudwaysapps.com/api/complaints', requestOptions);
        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.id.toString().includes(searchQuery) ||
      complaint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.phone.includes(searchQuery) ||
      complaint.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle row click to navigate to complaint details
  const handleRowClick = (complaintId) => {
    navigate(`/complaints/${complaintId}/details`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">إدارة الشكاوى</h2>

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

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الشكوى</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الهاتف</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الحالة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ الإنشاء</th>
              </tr>
            </thead>
            <tbody>
              {currentComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  onClick={() => handleRowClick(complaint.id)}
                  className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {/* Stacked layout for mobile */}
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">رقم الشكوى: </span>
                    {complaint.id}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">الاسم: </span>
                    {complaint.name}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">البريد الإلكتروني: </span>
                    {complaint.email}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">رقم الهاتف: </span>
                    {complaint.phone}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">الحالة: </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      complaint.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {complaint.status === 'pending' ? 'قيد المراجعة' : 'تم الحل'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                    <span className="font-semibold md:hidden">تاريخ الإنشاء: </span>
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(filteredComplaints.length / complaintsPerPage) }, (_, i) => (
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

export default AllComplaints;