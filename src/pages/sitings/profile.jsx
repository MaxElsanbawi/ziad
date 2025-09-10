import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const Name = localStorage.getItem("name");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch profile data when the component mounts
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token"); // Get the token from localStorage

      if (!token) {
        setError("No token found. Please log in."); // Handle case where token is missing
        setLoading(false);// Navigate to home page if no token is found
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`); // Append the token to the Authorization header

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://phpstack-1509731-5843882.cloudwaysapps.com/api/auth/profile",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json(); // Parse the JSON response
        setProfileData(result); // Set the profile data in state
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to fetch profile data. Please try again."); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchProfileData(); // Call the fetch function
  }, []); // Add navigate to the dependency array

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading profile data...</div>
      </div>
    ); // Display loading message with Tailwind CSS
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    ); // Display error message with Tailwind CSS
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          {Name}
        </h1>
        {profileData ? (
          <div className="space-y-4">
            <h2 className="text-2xl text-center font-semibold text-gray-800">
              <p className="text-gray-700">
                <span className="font-semibold"></span> {profileData.message}
              </p>
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <span className="font-semibold">User ID:</span>{" "}
                {profileData.userId}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Role:</span> {profileData.role}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">No profile data available.</div>
          
        )}
      </div>
    </div>
  );
};

export default ProfilePage;