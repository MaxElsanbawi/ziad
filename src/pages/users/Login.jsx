import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Destructure t and i18n from useTranslation
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  // Formik configuration
  const formik = useFormik({
    initialValues: {
      Username: '',
      Password: '',
    },
    validationSchema: Yup.object({
      Username: Yup.string().required(t('usernameRequired')), // Translated validation message
      Password: Yup.string().required(t('passwordRequired')), // Translated validation message
    }),
    onSubmit: (values) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        Username: values.Username,
        Password: values.Password,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      // Fetch API call
      fetch("https://backend.camels.center/api/auth/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.message === "Invalid username or password") {
            setErrorMessage(t('invalidCredentials')); // Translated error message
            setSuccessMessage('');
            
          }
          
          else if (result.message === "User is blocked") {
            setErrorMessage(t('userBlocked')); // Translated error message for blocked user
            setSuccessMessage('');
          }
          else {
            setSuccessMessage(t('loginSuccess')); // Translated success message
            setErrorMessage('');
            localStorage.setItem("token", result.token);
            localStorage.setItem("name", result.name);
            localStorage.setItem("user_id", result.user_id);
            localStorage.setItem("email", result.email);
            console.log(result);
            setTimeout(() => {
              navigate('/ProfilePage');
            }, 2000);
          }
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage(t('unexpectedError')); // Translated error message
          setSuccessMessage('');
        });
    },
  });

  return (
    <div dir={i18n.dir()} className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={formik.handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t('login')} {/* Translated login text */}
        </h2>

        {/* Display error message if it exists */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Display success message if it exists */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="Username" className="block text-sm font-medium text-gray-700">
            {t('username')} {/* Translated username label */}
          </label>
          <input
            id="Username"
            name="Username"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Username}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.Username && formik.errors.Username ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.Username}</div>
          ) : null}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
            {t('password')} {/* Translated password label */}
          </label>
          <input
            id="Password"
            name="Password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Password}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.Password && formik.errors.Password ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.Password}</div>
          ) : null}
        </div>

        {/* Forgot Password Link */}
        <Link className='text-sm pb-3 text-[#011B70]' to="/ForgotPasswordPage">
          {t('forgotPassword')} {/* Translated forgot password text */}
        </Link>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {t('login')} {/* Translated login button text */}
        </button>

        {/* Sign Up Link */}
        <div className='text-center pt-4'>
          <span className='text-slate-400'>{t('noAccount')}</span>
          <Link to="/RegisterForm">
            <span className='hover:text-[#4f6ac1] text-[#011B70]'>
              {t('signUp')} {/* Translated sign up text */}
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;