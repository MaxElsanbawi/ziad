import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

const DetailsRegistrations = () => {
  const navigate = useNavigate();
  const { registrationId } = useParams(); // Changed from courseId to registrationId

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      try {
        const response = await fetch(
          `https://phpstack-1509731-5843882.cloudwaysapps.com/api/registrations/${registrationId}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error('Failed to fetch registration details');
        }

        const result = await response.json();
        setRegistration(result);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [registrationId]);

  if (loading) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل التسجيل</h2>
          <p className="text-center">تحميل...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل التسجيل</h2>
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
            تفاصيل التسجيل
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/registrations/${registrationId}/print`)}
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Printer size={18} className="ml-2" />
              طباعة تفاصيل التسجيل
            </button>
          </div>
        </div>

        {registration && (
          <div className="space-y-6 printable-area">
            {/* Registration Information Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">معرف التسجيل</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {registration.RegistrationID}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">معرف المستخدم</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {registration.Email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">معرف الدورة</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {registration.CourseID}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">تاريخ التسجيل</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {new Date(registration.RegistrationDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">حالة التسجيل</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {registration.Status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailsRegistrations;