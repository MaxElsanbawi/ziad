import React, { useContext, useEffect, useState } from 'react';
import { Users, CreditCard, Package, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CourseContext } from '../context/DashoaedContexr';
const Courses = () => {
  const [courses, setCourses] = useState([]); 
  const { totalCourses, setTotalCourses } = useContext(CourseContext);
  const [endedCourses, setEndedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [startingSoonCourses, setStartingSoonCourses] = useState([]);

  const navigate = useNavigate();

    // Handle row click to navigate to course details
  const handleRowClick = (courseId) => {
    navigate(`/courses/${courseId}/details`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://backend.camels.center/api/courses");
        const result = await response.json();
        setCourses(result);

        const now = new Date();
        setEndedCourses(result.filter(course => new Date(course.EndingTime) < now));
        setOngoingCourses(result.filter(course => new Date(course.StartingTime) <= now && new Date(course.EndingTime) >= now));
        setStartingSoonCourses(result.filter(course => new Date(course.StartingTime) > now));
        setTotalCourses(result.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const renderCourseTable = (courses, title) => (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-primary">{title}</h2>
      <table className="min-w-full bg-white">
        <thead className="hidden md:table-header-group">
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رقم الدورة</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">اسم الدورة</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">رمز الدورة</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الفئة</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ البدء</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-primary">تاريخ الانتهاء</th>
          </tr>
        </thead>
        <tbody>
          {courses.slice(0, 5).map((course) => (
<tr   onClick={() => handleRowClick(course.CourseID)}
            key={course.CourseID} className="border-b cursor-pointer hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">رقم الدورة: </span>{course.CourseID}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">اسم الدورة: </span>{course.CourseName}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">رمز الدورة: </span>{course.CourseCode}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">الفئة: </span>{course.CategoryID}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">تاريخ البدء: </span>{new Date(course.StartingTime).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                <span className="font-semibold md:hidden">تاريخ الانتهاء: </span>{new Date(course.EndingTime).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-primary p-3 rounded-full text-white">
            <Users size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">إجمالي الدورات</h2>
            <p className="text-2xl font-bold">{totalCourses}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-secondary p-3 rounded-full text-white">
            <CreditCard size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">الدورات المنتهية</h2>
            <p className="text-2xl font-bold">{endedCourses.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-primary p-3 rounded-full text-white">
            <Package size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">الدورات الجارية</h2>
            <p className="text-2xl font-bold">{ongoingCourses.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-secondary p-3 rounded-full text-white">
            <Activity size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">الدورات القادمة</h2>
            <p className="text-2xl font-bold">{startingSoonCourses.length}</p>
          </div>
        </div>
      </div>

      {renderCourseTable(ongoingCourses, "الدورات الجارية")}
      {renderCourseTable(startingSoonCourses, "الدورات القادمة")}
      {renderCourseTable(endedCourses, "الدورات المنتهية")}
    </>
  );
};

export default Courses;