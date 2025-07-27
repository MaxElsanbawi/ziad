import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

const StudentsDetails = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Changed from courseId to userId

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'GET',
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const result = await response.json();
        setUser(result);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الطالب</h2>
          <p className="text-center">تحميل...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الطالب</h2>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Page Title and Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center">
            تفاصيل الطالب
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/users/${userId}/print`)}
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Printer size={18} className="ml-2" />
              طباعة تفاصيل الطالب
            </button>
          </div>
        </div>

        {user && (
          <div className="space-y-6 printable-area">
            {/* User Information Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">رقم المستخدم</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {user.UserID}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">الاسم الكامل</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {user.FullName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">البريد الإلكتروني</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {user.Email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">رقم الهاتف</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {user.PhoneNumber}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">رقم الهوية الوطنية</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {user.NationalId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">تاريخ الإنشاء</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {new Date(user.CreatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentsDetails;