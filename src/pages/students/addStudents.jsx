import React, { useState } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStudents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for form fields
  const [nationalId, setNationalId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState(''); // Default role is Student
  const [companyName ,setCompanyName] = useState('');
  const [error, setError] = useState('');
  // Role options
  const roleOptions = [
    { value: 'Student', label: 'طالب' },
    { value: 'manager', label: 'مدير' },
    { value: 'Admin', label: 'مسؤل'   },
    { value: 'trainer', label: 'مدرب'   },
    { value: 'partner', label: 'شريك'   },
    // Add more roles as needed
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the request headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${user.token}`);

    // Prepare the request body
    const raw = JSON.stringify({
      NationalId: nationalId,
      Username: username,
      Password: password,
      FullName: fullName,
      Email: email,
      PhoneNumber: phoneNumber,
      Role: role,
      companyName:companyName,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch("https://backend.camels.center/api/users", requestOptions);
      const result = await response.json();

      if (response.ok) {
        console.log('New User Added:', result);
        toast.success('تمت إضافة المستخدم بنجاح!');
        // Clear all form inputs
        setNationalId('');
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setRole('Student'); // Reset to default role
        setCompanyName('');
        setError('');
      } else {
        setError(result.message || 'فشل في إضافة المستخدم');
        toast.error(result.message || 'فشل في إضافة المستخدم');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ أثناء إضافة المستخدم');
      toast.error('حدث خطأ أثناء إضافة المستخدم');
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Toast Container */}
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Back Button */}
        <button
          onClick={() => navigate('/students')}
          className="flex items-center text-primary hover:text-secondary mb-6"
        >
          <ArrowRight size={20} className="ml-2" />
          العودة إلى قائمة الطلاب
        </button>

        {/* Page Title */}
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <UserPlus size={24} className="ml-2" />
          إضافة مستخدم جديد
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Add User Form */}
        <form onSubmit={handleSubmit}>
          {/* National ID Field */}
          <div className="mb-4">
            <label htmlFor="nationalId" className="block text-sm font-medium text-primary mb-1">
              الرقم القومي
            </label>
            <input
              type="text"
              id="nationalId"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل الرقم القومي"
              required
            />
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-primary mb-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          {/* Full Name Field */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-primary mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-primary mb-1">
              رقم الهاتف
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل رقم الهاتف"
              required
            />
          </div>


          {/* Role Field */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-primary mb-1">
              الدور
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Company Name Field - Only show when role is partner */}
          {role === 'partner' && (
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-primary mb-1">
                اسم الشركة
              </label>
              <input
              name='companyName'
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="أدخل اسم الشركة"
                required
              />
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            إضافة مستخدم
          </button>
        </form>
      </div>
    </>
  );
};

export default AddStudents;