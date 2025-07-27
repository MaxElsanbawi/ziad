import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(""); // State to store the email input
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [errorMessage, setErrorMessage] = useState(null); // State to handle error messages
  const [successMessage, setSuccessMessage] = useState(null); // State to handle success messages
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    setLoading(true); // Set loading to true while the request is in progress
    setErrorMessage(null); // Clear any previous error messages
    setSuccessMessage(null); // Clear any previous success messages

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      Email: email, // Use the email from state
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://backend.camels.center/api/auth/forgot-password",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json(); // Parse the JSON response

      // Handle the response based on the message
      if (result.message === "OTP sent for password reset. Check your email.") {
        setSuccessMessage("OTP sent for password reset. Check your email."); // Set success message
        setTimeout(() => {
          navigate("/VerifyOTPPage"); // Navigate to the Verify OTP page after 5 seconds
        }, 5000); // 5000 milliseconds = 5 seconds
      } else if (result.message === "Email not found") {
        setErrorMessage("Email not found. Please check your email address."); // Set error message
      } else {
        console.log("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again."); // Set error message for errors
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
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

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6 mt-7">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
