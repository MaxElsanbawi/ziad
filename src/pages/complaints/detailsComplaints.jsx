import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await fetch(`https://phpstack-1509731-5843882.cloudwaysapps.com/api/complaints/${complaintId}`, {
          method: 'GET',
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch complaint details');
        }

        const result = await response.json();
        setComplaint(result);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [complaintId]);

  if (loading) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الشكوى</h2>
          <p className="text-center">تحميل...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الشكوى</h2>
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
            تفاصيل الشكوى #{complaint?.id}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/complaints/${complaintId}/print`)}
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Printer size={18} className="ml-2" />
              طباعة تفاصيل الشكوى
            </button>
          </div>
        </div>

        {complaint && (
          <div className="space-y-6 printable-area">
            {/* Complaint Information Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">رقم الشكوى</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {complaint.id}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">الاسم</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {complaint.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">البريد الإلكتروني</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {complaint.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">رقم الهاتف</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {complaint.phone}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">الحالة</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    complaint.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {complaint.status === 'pending' ? 'قيد المراجعة' : 'تم الحل'}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">تاريخ الإنشاء</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {new Date(complaint.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1">الرسالة</label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-20">
                  {complaint.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ComplaintDetails;