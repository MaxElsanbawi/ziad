import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('يرجى ملء جميع الحقول.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "Username": username,
      "Password": password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://phpstack-1509731-5843882.cloudwaysapps.com/api/auth/login", requestOptions);
      const result = await response.json();
      console.log(result)
      if (response.ok) {
        login(result.token, result.role, result.user_id, result.name, result.branch_id, result.companyName);
        window.localStorage.setItem("companyName", result.companyName)
        toast.success('تم تسجيل الدخول بنجاح!', {
          position: 'top-left',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirect based on user role
        if (result.role === 'partner') {
          navigate('/CoursesPartner');
        } else if (result.role === 'admin') {
          navigate('/');
        } else {
          navigate('/');
        }
      } else {
        toast.error('فشل تسجيل الدخول. يرجى التحقق من البيانات المدخلة.', {
          position: 'top-left',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.', {
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 bg-white lg:bg-gray-100" dir="rtl">
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // Enable RTL for Arabic
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="mt-0 mb-6">

      </div>
      <div className="bg-white lg:shadow-lg lg:rounded-lg p-8 w-full h-full lg:h-auto lg:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary font-ibm-plex-sans-arabic">
          تسجيل الدخول
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-ibm-plex-sans-arabic">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-primary font-ibm-plex-sans-arabic">
              اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-primary font-ibm-plex-sans-arabic">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary font-ibm-plex-sans-arabic"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;