import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Trainer1 = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
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
        console.log(result.trainerCourses);
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

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (endDate) => {
    const end = new Date(endDate);
    const now = currentTime;
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isOver: false };
  };

  const formatTimeLeft = (timeLeft) => {
    if (timeLeft.isOver) {
      return <span className="text-red-600 font-semibold">انتهت الدورة</span>;
    }

    if (timeLeft.days > 0) {
      return (
        <span className="text-blue-600 font-semibold">
          {timeLeft.days} يوم {timeLeft.hours} ساعة
        </span>
      );
    } else if (timeLeft.hours > 0) {
      return (
        <span className="text-orange-600 font-semibold">
          {timeLeft.hours} ساعة {timeLeft.minutes} دقيقة
        </span>
      );
    } else if (timeLeft.minutes > 0) {
      return (
        <span className="text-red-600 font-semibold">
          {timeLeft.minutes} دقيقة {timeLeft.seconds} ثانية
        </span>
      );
    } else {
      return (
        <span className="text-red-600 font-semibold">
          {timeLeft.seconds} ثانية
        </span>
      );
    }
  };

  const getTimeLeftClass = (timeLeft) => {
    if (timeLeft.isOver) return "bg-red-100 text-red-800";
    if (timeLeft.days > 7) return "bg-green-100 text-green-800";
    if (timeLeft.days > 3) return "bg-yellow-100 text-yellow-800";
    if (timeLeft.days > 0) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

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

  if (!profileData || !profileData.trainerCourses) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-xl">No trainer courses available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
            Your Courses
          </h2>
          
          {profileData.trainerCourses.length === 0 ? (
            <p className="text-gray-600 text-center">No courses found.</p>
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
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lessons Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Remaining
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profileData.trainerCourses.map((course) => {
                    const timeLeft = calculateTimeLeft(course.EndingTime);
                    return (
                      <tr key={course.CourseID}>
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
                            {new Date(course.StartingTime).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(course.EndingTime).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {course.LessonsTime}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`text-sm px-2 py-1 rounded-full ${getTimeLeftClass(timeLeft)}`}>
                            {formatTimeLeft(timeLeft)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile/Small Screen Cards */}
              <div className="md:hidden space-y-4">
                {profileData.trainerCourses.map((course) => {
                  const timeLeft = calculateTimeLeft(course.EndingTime);
                  return (
                    <div key={course.CourseID} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate" title={course.CourseName}>
                            {course.CourseName}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Code: {course.CourseCode}
                          </p>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getTimeLeftClass(timeLeft)}`}>
                          {formatTimeLeft(timeLeft)}
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Start:</span> {new Date(course.StartingTime).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">End:</span> {new Date(course.EndingTime).toLocaleDateString()}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Time:</span> {course.LessonsTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trainer1;
