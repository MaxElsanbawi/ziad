import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages
  const navigate = useNavigate(); // Hook for navigation
  const { t, i18n } = useTranslation(); 
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  const formik = useFormik({
    initialValues: {
      NationalId: '',
      Username: '',
      Password: '',
      FullName: '',
      Email: '',
      PhoneNumber: '',
    },
    validationSchema: Yup.object({
      NationalId: Yup.string().required('Required'),
      Username: Yup.string().required('Required'),
      Password: Yup.string().required('Required'),
      FullName: Yup.string().required('Required'),
      Email: Yup.string().email('Invalid email address').required('Required'),
      PhoneNumber: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        NationalId: values.NationalId,
        Username: values.Username,
        Password: values.Password,
        FullName: values.FullName,
        Email: values.Email,
        PhoneNumber: values.PhoneNumber,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://backend.camels.center/api/auth/register", requestOptions)
        .then((response) => response.json()) // Parse the response as JSON
        .then((result) => {
          if (result.error) {
            // If there's an error, set the error message
            setErrorMessage(result.error.message || 'Error registering student');
            setSuccessMessage(''); // Clear any success message
          } else if (result.message === "Student registered successfully") {
            // If registration is successful, set the success message
            setSuccessMessage(result.message);
            setErrorMessage(''); // Clear any error message

            // Navigate to the login page after 5 seconds
            setTimeout(() => {
              navigate('/LoginPage'); // Replace '/login' with your login route
            }, 5000);
          }
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage('An unexpected error occurred. Please try again.'); // Handle fetch errors
          setSuccessMessage(''); // Clear any success message
        });
    },
  });

  // Clear the success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [successMessage]);

  return (<div  dir={i18n.dir()}>
    <form  onSubmit={formik.handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
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

      <div className="mb-4">
        <label htmlFor="NationalId" className="block text-sm font-medium text-gray-700">{t('nationalId')}</label>
        <input
          id="NationalId"
          name="NationalId"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.NationalId}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formik.touched.NationalId && formik.errors.NationalId ? (
          <div className="text-red-500 text-sm">{formik.errors.NationalId}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="Username" className="block text-sm font-medium text-gray-700">{t('username')}</label>
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
          <div className="text-red-500 text-sm">{formik.errors.Username}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="Password" className="block text-sm font-medium text-gray-700">{t('password')}</label>
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
          <div className="text-red-500 text-sm">{formik.errors.Password}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="FullName" className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
        <input
          id="FullName"
          name="FullName"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.FullName}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formik.touched.FullName && formik.errors.FullName ? (
          <div className="text-red-500 text-sm">{formik.errors.FullName}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="Email" className="block text-sm font-medium text-gray-700">{t('emailre')}</label>
        <input
          id="Email"
          name="Email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.Email}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formik.touched.Email && formik.errors.Email ? (
          <div className="text-red-500 text-sm">{formik.errors.Email}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="PhoneNumber" className="block text-sm font-medium text-gray-700">{t('phoneNumberre')}</label>
        <input
          id="PhoneNumber"
          name="PhoneNumber"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.PhoneNumber}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formik.touched.PhoneNumber && formik.errors.PhoneNumber ? (
          <div className="text-red-500 text-sm">{formik.errors.PhoneNumber}</div>
        ) : null}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {t('submit')}
      </button>
    </form></div>
  );
};

export default RegisterForm;