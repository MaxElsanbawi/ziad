import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");

      if (!token || !name) {
        setError("No token or name found. Please log in.");
        setLoading(false);
        navigate("/");
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://backend.camels.center/api/profile",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setProfileData(result);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to fetch profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading profile data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-xl">No profile data available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className=" bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {profileData ? (<div>
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
{profileData.fullName}
        </h1>
        
          <div className="space-y-4">
            <h2 className="text-2xl text-center font-semibold text-gray-800">
              <p className="text-gray-700">
                <span className="font-semibold"></span>Welcome to your profile
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
          </div></div>
        ) : (
          <div className="text-center text-gray-600">No profile data available.</div>
          
        )}
      </div>
    </div>

        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
    Course Registrations
  </h2>
  
  {profileData.coursesRegistration.length === 0 ? (
    <p className="text-gray-600 text-center">No course registrations found.</p>
  ) : (
    <div className="overflow-x-auto">
      {/* Desktop/Large Table */}
      <table className="hidden md:table min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {profileData.coursesRegistration.map((course) => (
            <tr key={course.RegistrationID}>
              <td className="px-4 py-3 max-w-xs">
                <div className="text-sm font-medium text-gray-900 truncate" title={course.CourseName}>
                  {course.CourseName}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {course.CourseCode}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(course.RegistrationDate).toLocaleDateString()}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.Status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {course.Status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile/Small Screen Cards */}
      <div className="md:hidden space-y-4">
        {profileData.coursesRegistration.map((course) => (
          <div key={course.RegistrationID} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate" title={course.CourseName}>
                  {course.CourseName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {course.CourseCode}
                </p>
              </div>
              <span
                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  course.Status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {course.Status}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Registered: {new Date(course.RegistrationDate).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default ProfilePage;