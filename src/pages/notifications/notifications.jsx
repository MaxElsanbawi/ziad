import React, { useState, useEffect, useCallback } from 'react';

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRegistrationsCount, setNewRegistrationsCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Memoized resize handler to prevent unnecessary re-renders
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("https://phpstack-1509731-5843882.cloudwaysapps.com/api/registrations", {
        method: "GET",
        redirect: "follow"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRegistrations(data);
      console.log(data)
      // Count pending registrations
      const pendingCount = data.filter(reg => reg.Status === 'Pending').length;
      setNewRegistrationsCount(pendingCount);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      // You might want to implement retry logic here
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up polling for new registrations
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-700 font-bold';
      case 'pending':
        return 'text-yellow-600 font-bold';
      case 'rejected':
        return 'text-red-600 font-bold';
      default:
        return '';
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Create a reversed copy of the registrations array
  const reversedRegistrations = [...registrations].reverse();

  if (loading && registrations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading registrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">
          Error loading registrations: {error}
          <button 
            onClick={fetchData}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Course Registrations
        </h1>
        {newRegistrationsCount > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {newRegistrationsCount} new
          </span>
        )}
      </div>
      
      {isMobile ? (
        // Mobile view - card layout
        <div className="space-y-4">
          {reversedRegistrations.map((reg) => (
            <div key={reg.RegistrationID} className="bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-xs text-gray-500">User</p>
                  <p className="text-sm font-medium">{reg.Username}</p>
                  <p className="text-xs text-black"> {reg.FullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Course</p>
                  <p className="text-sm font-medium">
                    {reg.CourseName.split(' ').slice(0, 3).join(' ')}
                    {reg.CourseName.split(' ').length > 3 && '...'}
                  </p>
                  <p className="text-xs text-gray-400">ID: {reg.CourseID}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Registered</p>
                  <p className="text-sm">{formatDate(reg.RegistrationDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Starts</p>
                  <p className="text-sm">{formatDate(reg.StartingTime)}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-500">Reg ID: {reg.RegistrationID}</p>
                <p className={`text-sm ${getStatusColor(reg.Status)}`}>
                  {reg.Status}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop view - table layout
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starts</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg ID</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reversedRegistrations.map((reg) => (
                <tr key={reg.RegistrationID} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reg.Username}</div>
                    <div className="text-xs text-gray-500">ID: {reg.UserID}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {reg.CourseName.split(' ').slice(0, 5).join(' ')}
                      {reg.CourseName.split(' ').length > 5 && '...'}
                    </div>
                    <div className="text-xs text-gray-500">ID: {reg.CourseID}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(reg.RegistrationDate)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(reg.StartingTime)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reg.RegistrationID}
                  </td>
                  <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(reg.Status)}`}>
                    {reg.Status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationsPage;