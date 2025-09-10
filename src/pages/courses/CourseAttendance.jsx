import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Edit3,
  Save,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseAttendance = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState({
    attendance: [],
    scheduleDates: [],
    courseId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Calculate attendance statistics based on the actual attendance data
  const calculateStats = () => {
    const stats = {
      totalDays: attendanceData.scheduleDates.length,
      attendanceRate: {},
      totalStudents: attendanceData.attendance.length,
    };

    // Calculate attendance for each student
    attendanceData.attendance.forEach((student) => {
      let presentCount = 0;
      
      // Count present days for this student
      Object.values(student.attendance).forEach(status => {
        if (status === "Present") presentCount++;
      });

      stats.attendanceRate[student.registrationId] = {
        rate: stats.totalDays > 0 
          ? Math.round((presentCount / stats.totalDays) * 100) 
          : 0,
        present: presentCount,
        total: stats.totalDays,
      };
    });

    // Calculate average attendance rate
    if (stats.totalStudents > 0) {
      const totalRates = Object.values(stats.attendanceRate)
        .reduce((sum, rate) => sum + rate.rate, 0);
      stats.averageRate = Math.round(totalRates / stats.totalStudents);
    } else {
      stats.averageRate = 0;
    }

    return stats;
  };

  const stats = calculateStats();

  // Fetch attendance data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://phpstack-1509731-5843882.cloudwaysapps.com/api/atendance/courses/${courseId}/attendance`
        );
        if (!response.ok) throw new Error("Failed to fetch attendance records");
        const data = await response.json();
        
        if (isMounted) {
          setAttendanceData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          toast.error(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [courseId]);
    console.log(attendanceData)
  // Handle attendance status change
  const handleAttendanceChange = async (
    courseId,
    dateStr,
    registrationId,
    newStatus
  ) => {
    try {
      // Optimistic UI update
      setAttendanceData(prev => ({
        ...prev,
        attendance: prev.attendance.map(student => {
          if (student.registrationId === registrationId) {
            return {
              ...student,
              attendance: {
                ...student.attendance,
                [dateStr]: newStatus,
              },
            };
          }
          return student;
        })
      }));

      // Extract correct date and time from dateStr (fix timezone issue)
      const dt = new Date(dateStr);
      // Use local date to avoid timezone shift
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      const date = `${year}-${month}-${day}`; // YYYY-MM-DD in local timezone
      const time = dt.toTimeString().split(" ")[0]; // HH:mm:ss

      // Send POST request to backend
      const response = await fetch(
        `https://phpstack-1509731-5843882.cloudwaysapps.com/api/atendance/courses/${courseId}/registrations/${registrationId}/attendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            time,
            status: newStatus,
            notes: "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update attendance");
      }

      toast.success("Attendance updated successfully");
    } catch (err) {
      toast.error(err.message || "An error occurred while updating attendance");
      // Revert optimistic update on error
      setAttendanceData(prev => ({
        ...prev,
        attendance: prev.attendance.map(student => {
          if (student.registrationId === registrationId) {
            const originalStatus = student.attendance[dateStr];
            return {
              ...student,
              attendance: {
                ...student.attendance,
                [dateStr]: originalStatus,
              },
            };
          }
          return student;
        })
      }));
    }
  };
  // Check if a date is today
  const isToday = (dateStr) => {
    const today = new Date();
    const dateToCheck = new Date(dateStr);
    
    return today.getFullYear() === dateToCheck.getFullYear() &&
           today.getMonth() === dateToCheck.getMonth() &&
           today.getDate() === dateToCheck.getDate();
  };

  const handleGenerateSchedule = async () => {
    try {
      // Default to Sunday-Thursday: [0,1,2,3,4]
      const daysOfWeek = [0, 1, 2, 3, 4];
      const response = await fetch(`https://phpstack-1509731-5843882.cloudwaysapps.com/api/atendance/courses/${courseId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysOfWeek }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل توليد الجدول");
    //   toast.success( + result.totalDays, {
    //     position: "top-left",
    //     autoClose: 3000,
    //     rtl: true,
    //   });
    } catch (error) {
    //   toast.error(error.message || "حدث خطأ أثناء توليد الجدول", {
    //     position: "top-left",
    //     autoClose: 3000,
    //     rtl: true,
    //   });
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4  border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => {
                window.location.reload();
                handleGenerateSchedule();
              }}
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[85%]  mx-auto ">
      <ToastContainer position="top-left" autoClose={3000} />

      <div className="flex justify-between  items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Course {attendanceData.courseId} Attendance
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-2 top-3 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {attendanceData.scheduleDates.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 container     mb-6 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <CheckCircle className="mr-2" size={20} />
                Attendance Management
              </h2>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  handleGenerateSchedule();
                  
                }}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  isEditing
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                {isEditing ? (
                  <Save size={16} className="mr-2" />
                ) : (
                  <Edit3 size={16} className="mr-2" />
                )}
                {isEditing ? "Save Changes" : "Edit Attendance"}
              </button>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto w-[100%]">
              <table className="w-[50%] border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Student
                    </th>
                    {attendanceData.scheduleDates.map((dateStr, idx) => (
                      <th
                        key={idx}
                        className="border border-gray-300 px-2 py-2 text-center min-w-24"
                      >
                        <div className="text-xs">
                          {new Date(dateStr).toLocaleDateString("ar-eg", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </th>
                    ))}
                    <th className="border border-gray-300 px-2 py-2 text-center">
                      Attendance Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.attendance.map((student) => (
                    <tr key={student.registrationId} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="font-medium">{student.fullName}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      
                      {attendanceData.scheduleDates.map((dateStr, dateIdx) => {
                        const dateKey = dateStr; // استخدام التاريخ مباشرة
                        return (
                          <td
                            key={dateIdx}
                            className="border border-gray-300 px-2 py-2 text-center"
                          >
                            {isEditing ? (
                              <select
                                value={student.attendance[dateKey] || ""}
                                onChange={e => handleAttendanceChange(
                                  courseId,
                                  dateKey,
                                  student.registrationId,
                                  e.target.value
                                )}
                                disabled={!isToday(dateStr)}
                                className={`w-[20%] px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                  !isToday(dateStr) ? 'bg-gray-100 cursor-not-allowed' : ''
                                }`}
                              >
                                <option value="">--</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Excused">Excused</option>
                                <option value="Late">Late</option>
                              </select>
                            ) : (
                              <span className={`inline-block px-2 py-1 text-xs rounded ${
                                student.attendance[dateKey] === "Present" ? "bg-green-100 text-green-800" :
                                student.attendance[dateKey] === "Absent" ? "bg-red-100 text-red-800" :
                                student.attendance[dateKey] === "Excused" ? "bg-blue-100 text-blue-800" :
                                student.attendance[dateKey] === "Late" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {student.attendance[dateKey] || "N/A"}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="font-medium">
                          {stats.attendanceRate[student.registrationId]?.rate || 0}%
                        </span>
                        <div className="text-xs text-gray-500">
                          ({stats.attendanceRate[student.registrationId]?.present || 0}/{stats.totalDays})
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Attendance Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Students</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Total Days</h3>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalDays}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">
                  Average Attendance
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.averageRate}%
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Schedule Type</h3>
                <p className="text-lg font-bold text-orange-600">
                  {stats.totalDays} sessions
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No Schedule Found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            This course doesn't have any scheduled dates yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseAttendance;