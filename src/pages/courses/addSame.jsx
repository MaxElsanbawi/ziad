import React, { useState, useEffect } from 'react';
import { UserPlus, ArrowRight, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../AuthContext';

const AddSameCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for form fields
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [price, setPrice] = useState('');
  const [courseType, setCourseType] = useState('OnSite');
  const [courseLink, setCourseLink] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [courseDays, setCourseDays] = useState('weekdays');
  const [coursesRoom, setcoursesRoom] = useState('');
  const [startingTime, setStartingTime] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [lessonsStartTime, setLessonsStartTime] = useState('');
  const [lessonsEndTime, setLessonsEndTime] = useState('');
  const [lessonsTime, setLessonsTime] = useState('');
  const [instructorID, setInstructorID] = useState('');
  const [error, setError] = useState('');

  // State for categories and trainers
  const [categories, setCategories] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch categories and trainers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("http://localhost:3000/api/categories");
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch trainers
        const trainersResponse = await fetch("http://localhost:3000/api/users");
        if (!trainersResponse.ok) throw new Error('Failed to fetch trainers');
        const trainersData = await trainersResponse.json();
        setTrainers(trainersData.filter(user => user.Role === 'trainer'));
      } catch (error) {
        console.error('Error:', error);
        toast.error('حدث خطأ أثناء جلب البيانات');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          toast.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('An error occurred while fetching courses.');
      }
    };
    fetchCourses();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCourseNameChange = (e) => {
    const searchTerm = e.target.value;
    setCourseName(searchTerm);

    if (searchTerm) {
      const filtered = courses.filter(course =>
        course.CourseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
      setIsDropdownOpen(true);
    } else {
      setFilteredCourses([]);
      setIsDropdownOpen(false);
    }
  };

  const handleCourseSelect = (course) => {
    setCourseName(course.CourseName);
    setDescription(course.Description || '');
    setPrice(course.Price || '');
    setCourseType(course.CourseType || 'OnSite');
    setCourseLink(course.CourseLink || '');
    setCategoryID(course.CategoryID || '');
    setInstructorID(course.InstructorID || '');
    setStartingTime(course.StartingTime ? course.StartingTime.split('T')[0] : '');
    setEndingTime(course.EndingTime ? course.EndingTime.split('T')[0] : '');
    setLessonsTime(course.LessonsTime || '');
    
    // Clear lessons time inputs as they require manual re-entry
    setLessonsStartTime('');
    setLessonsEndTime('');

    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('CourseName', courseName);
    formData.append('Price', price);
    formData.append('CourseType', courseType);
    formData.append('CourseLink', courseLink);
    formData.append('CategoryID', categoryID);
    formData.append('StartingTime', startingTime);
    formData.append('EndingTime', endingTime);
    formData.append('LessonsTime', lessonsTime);
    formData.append("CourseDays", courseDays);
    formData.append('InstructorID', instructorID);
    formData.append('coursesRoom', coursesRoom);
    if (courseImage) {
      formData.append('CourseImage', courseImage);
    }

    try {
      const response = await fetch("http://localhost:3000/api/courses/by-name", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('تمت إضافة الدورة بنجاح!');
        // Reset form
        setCourseName('');
        setDescription('');
        setPrice('');
        setCourseType('OnSite');
        setCourseLink('');
        setCategoryID('');
        setcoursesRoom('');
        setStartingTime('');
        setCourseDays('weekdays');
        setEndingTime('');
        setLessonsStartTime('');
        setLessonsEndTime('');
        setLessonsTime('');
        setInstructorID('');
        setCourseImage(null);
        setImagePreview('');
        setError('');
      } else {
        setError(result.message || 'فشل في إضافة الدورة');
        toast.error(result.message || 'فشل في إضافة الدورة');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ أثناء إضافة الدورة');
      toast.error('حدث خطأ أثناء إضافة الدورة');
    }
  };

  const formatTimeForAPI = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'مساءً' : 'صباحاً';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ToastContainer position="top-left" rtl={true} />
      
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center text-primary hover:text-secondary mb-6"
      >
        <ArrowRight size={20} className="ml-2" />
        العودة إلى قائمة الدورات
      </button>

      <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
        <UserPlus size={24} className="ml-2" />
        إضافة دورة جديدة بنفس البيانات
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-primary mb-1">اسم الدورة</label>
          <input
            type="text"
            value={courseName}
            onChange={handleCourseNameChange}
            onFocus={() => { if (courseName) setIsDropdownOpen(true); }}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="ابحث عن دورة لنسخ بياناتها"
            required
            autoComplete="off"
          />
          {isDropdownOpen && filteredCourses.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
              {filteredCourses.map(course => (
                <div
                  key={course.CourseID}
                  onClick={() => handleCourseSelect(course)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {course.CourseName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Code */}


        {/* Description */}


        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1">السعر</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        {/* Course Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1">نوع الدورة</label>
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="OnSite">حضوري</option>
            <option value="Online">عبر الإنترنت</option>
          </select>
        </div>

        {/* Course Link (shown only for online courses) */}
        {courseType === 'Online' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary mb-1">رابط الدورة</label>
            <input
              type="url"
              value={courseLink}
              onChange={(e) => setCourseLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="https://example.com"
              required={courseType === 'Online'}
            />
          </div>
        )}

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1">الفئة</label>
          <select
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="">اختر الفئة</option>
            {categories.map(category => (
              <option key={category.CategoryID} value={category.CategoryID}>
                {category.CategoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Starting Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1">تاريخ البدء</label>
          <input
            type="date"
            value={startingTime}
            onChange={(e) => setStartingTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        {/* Ending Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1">تاريخ الانتهاء</label>
          <input
            type="date"
            value={endingTime}
            onChange={(e) => setEndingTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        {/* Lessons Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1">وقت الدروس</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lessonsStartTime" className="block text-xs text-gray-500 mb-1">
                من
              </label>
              <input
                type="time"
                id="lessonsStartTime"
                value={lessonsStartTime}
                onChange={(e) => {
                  setLessonsStartTime(e.target.value);
                  const formattedTime = formatTimeForAPI(e.target.value);
                  setLessonsTime(`من ${formattedTime} حتى ${formatTimeForAPI(lessonsEndTime)}`);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>
            <div>
              <label htmlFor="lessonsEndTime" className="block text-xs text-gray-500 mb-1">
                حتى
              </label>
              <input
                type="time"
                id="lessonsEndTime"
                value={lessonsEndTime}
                onChange={(e) => {
                  setLessonsEndTime(e.target.value);
                  const formattedTime = formatTimeForAPI(e.target.value);
                  setLessonsTime(`من ${formatTimeForAPI(lessonsStartTime)} حتى ${formattedTime}`);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
            <label htmlFor="CourseDays" className="block text-sm font-medium text-primary mb-1">
              نوع الدورة
            </label>
            <select
              id="CourseDays"
              value={courseDays}
              onChange={(e) => setCourseDays(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="weekdays">weekdays</option>
              <option value="weekends">weekends </option>
            </select>
          </div>
        {/* Instructor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-1">المدرب</label>
          <select
            value={instructorID}
            onChange={(e) => setInstructorID(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          >
            <option value="">اختر المدرب</option>
            {trainers.map(trainer => (
              <option key={trainer.UserID} value={trainer.UserID}>
                {trainer.FullName} ({trainer.Username})
              </option>
            ))}
          </select>
        </div>


        <div className="mb-4">
            <label htmlFor="coursesRoom" className="block text-sm font-medium text-primary mb-1">
            رقم الفصل 
            </label>
            <textarea
              id="coursesRoom"
              value={coursesRoom}
              onChange={(e) => setcoursesRoom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder=" رقم الفصل   "
              required
            />
          </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          إضافة دورة
        </button>
      </form>
    </div>
  );
};

export default AddSameCourses;