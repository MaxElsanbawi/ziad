import React, { useEffect, useState } from 'react';
import { Users, CreditCard, Package, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [approvedRegistrations, setApprovedRegistrations] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);

  const navigate = useNavigate();

  // Handle row click to navigate to registration details
  const handleRowClick = (registrationId) => {
    navigate(`/registrations/${registrationId}/details`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://backend.camels.center/api/registrations");
        const result = await response.json();
        setRegistrations(result);

        setApprovedRegistrations(result.filter(registration => registration.Status === "Approved"));
        setPendingRegistrations(result.filter(registration => registration.Status === "Pending"));
        setTotalRegistrations(result.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const renderRegistrationTable = (registrations, title) => (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-primary">{title}</h2>
      <table className="min-w-full bg-white">
        <thead className="hidden md:table-header-group">
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم التسجيل</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم المستخدم</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الدورة</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ التسجيل</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {registrations.slice(0, 5).map((registration) => (
            <tr onClick={() => handleRowClick(registration.RegistrationID)}
                key={registration.RegistrationID} className="border-b cursor-pointer hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">رقم التسجيل: </span>{registration.RegistrationID}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">الحساب البريدي : </span>{registration.Email}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">اسم الدورة: </span>{registration.CourseName.split(' ').slice(0, 5).join(' ')}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">تاريخ التسجيل: </span>{new Date(registration.RegistrationDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">الحالة: </span>{registration.Status}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700">
                <span className="font-semibold md:hidden">الوقت: </span>{new Date(registration.StartingTime).toLocaleDateString('en-GB')}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700">
                <span className="font-semibold md:hidden">تاريخ التسجيل: </span>{new Date(registration.RegistrationDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-primary p-3 rounded-full text-white">
            <Users size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">إجمالي التسجيلات</h2>
            <p className="text-2xl font-bold">{totalRegistrations}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-secondary p-3 rounded-full text-white">
            <CreditCard size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">التسجيلات المعتمدة</h2>
            <p className="text-2xl font-bold">{approvedRegistrations.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-primary p-3 rounded-full text-white">
            <Package size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">التسجيلات المعلقة</h2>
            <p className="text-2xl font-bold">{pendingRegistrations.length}</p>
          </div>
        </div>
      </div>

      {renderRegistrationTable(approvedRegistrations, "التسجيلات المعتمدة")}
      {renderRegistrationTable(pendingRegistrations, "التسجيلات المعلقة")}
    </>
  );
};

export default Registrations;