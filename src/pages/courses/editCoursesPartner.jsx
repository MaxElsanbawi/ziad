import React, { useState, useEffect } from 'react';
import { UserPlus, ArrowRight, UploadCloud } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../AuthContext';

const EditCoursesPartner = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
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
  const [startingTime, setStartingTime] = useState('');
  const [endingTime, setEndingTime] = useState('');
  const [lessonsTime, setLessonsTime] = useState('');
  const [instructorID, setInstructorID] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [error, setError] = useState('');
  const [pdfFiles, setPdfFiles] = useState([null]); // Array of PDF files

  // State for categories
  const [categories, setCategories] = useState([]);

  // State for trainers
  const [trainers, setTrainers] = useState([]);

  // State for lessons time
  const [lessonsStartTime, setLessonsStartTime] = useState('');
  const [lessonsEndTime, setLessonsEndTime] = useState('');

  // Fetch course data on component mount
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`https://backend.camels.center/api/courses/${courseId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user?.token}`
          },
          redirect: "follow",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }

        const courseData = await response.json();
        
        // Populate form fields with existing data
        setCourseName(courseData.CourseName || '');
        setDescription(courseData.Description || '');
        setPrice(courseData.Price || '');
        setCourseType(courseData.CourseType || 'OnSite');
        setCourseLink(courseData.CourseLink || '');
        setCategoryID(courseData.CategoryID || '');
        setStartingTime(courseData.StartingTime ? new Date(courseData.StartingTime).toISOString().split('T')[0] : '');
        setEndingTime(courseData.EndingTime ? new Date(courseData.EndingTime).toISOString().split('T')[0] : '');
        setLessonsTime(courseData.LessonsTime || '');
        setInstructorID(courseData.InstructorID || '');
        setInstructorName(courseData.InstructorName || '');
        
        // Set image preview if exists
        if (courseData.courseImgUrl) {
          setImagePreview(courseData.courseImgUrl);
        }

        // Parse lessons time if exists
        if (courseData.LessonsTime) {
          // Try different time formats
          let timeMatch = courseData.LessonsTime.match(/من (\d{1,2}:\d{2}) حتى (\d{1,2}:\d{2})/);
          if (!timeMatch) {
            // Try alternative format
            timeMatch = courseData.LessonsTime.match(/(\d{1,2}:\d{2}) - (\d{1,2}:\d{2})/);
          }
          if (!timeMatch) {
            // Try simple time range
            timeMatch = courseData.LessonsTime.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
          }
          
          if (timeMatch) {
            setLessonsStartTime(timeMatch[1]);
            setLessonsEndTime(timeMatch[2]);
          }
        }

      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('حدث خطأ أثناء جلب بيانات الدورة');
      }
    };

    if (courseId && user?.token) {
      fetchCourseData();
    }
  }, [courseId, user?.token]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://backend.camels.center/api/categories", {
          method: "GET",
          redirect: "follow",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('حدث خطأ أثناء جلب الفئات');
      }
    };

    fetchCategories();
  }, []);

  // Fetch users with role of "trainer" on component mount
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch("https://backend.camels.center/api/users", {
          method: "GET",
          redirect: "follow",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const result = await response.json();
        const trainers = result.filter((user) => user.Role === 'trainer');
        setTrainers(trainers);
      } catch (error) {
        console.error('Error fetching trainers:', error);
        toast.error('حدث خطأ أثناء جلب المدربين');
      }
    };

    fetchTrainers();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle PDF file change for a specific index
  const handlePdfFileChange = (idx, file) => {
    setPdfFiles(prev => {
      const updated = [...prev];
      updated[idx] = file;
      return updated;
    });
  };

  // Add more PDF file input fields
  const handleAddMorePdfInput = () => {
    setPdfFiles(prev => [...prev, null]);
  };

  // Remove PDF file input at specific index
  const handleRemovePdfInput = (idx) => {
    setPdfFiles(prev => {
      const updated = prev.filter((_, index) => index !== idx);
      // Ensure we always have at least one input
      return updated.length === 0 ? [null] : updated;
    });
  };

  // Format time for API
  const formatTimeForAPI = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'مساءً' : 'صباحاً';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Reset form fields
  const resetForm = () => {
    setCourseName('');
    setDescription('');
    setCourseImage(null);
    setImagePreview('');
    setPdfFiles([null]);
    setPrice('');
    setCourseType('OnSite');
    setCourseLink('');
    setCategoryID('');
    setStartingTime('');
    setEndingTime('');
    setLessonsTime('');
    setLessonsStartTime('');
    setLessonsEndTime('');
    setInstructorID('');
    setInstructorName('');
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format lessons time
    const formattedLessonsTime = `من ${formatTimeForAPI(lessonsStartTime)} حتى ${formatTimeForAPI(lessonsEndTime)}`;
    setLessonsTime(formattedLessonsTime);

    // Create FormData object
    const formData = new FormData();
    
    // Only append files if they exist
    if (courseImage) {
      formData.append("courseImage", courseImage);
    }
    
    // Append all PDF files
    const validPdfFiles = pdfFiles.filter(f => f);
    validPdfFiles.forEach((file, idx) => {
      formData.append("pdfFile", file);
    });
    
    // Append other form data
    formData.append("CourseName", courseName);
    formData.append("Description", description);
    formData.append("Price", price);
    formData.append("CourseType", courseType);
    formData.append("CategoryID", categoryID);
    formData.append("StartingTime", new Date(startingTime).toISOString());
    formData.append("EndingTime", new Date(endingTime).toISOString());
    formData.append("LessonsTime", formattedLessonsTime);
    formData.append("InstructorID", instructorID);
    formData.append("InstructorName", instructorName);
    
    if (courseLink) {
      formData.append("CourseLink", courseLink);
    }

    const requestOptions = {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${user.token}`
      },
      body: formData,
      redirect: "follow",
    };
    
    try {
      const response = await fetch(`https://backend.camels.center/api/courses/${courseId}`, requestOptions);
      const result = await response.json();
      
      if (response.ok) {
        toast.success('تمت تعديل الدورة بنجاح!');
        resetForm();
      } else {
        setError(result.message || 'فشل في تعديل الدورة');
        toast.error(result.message || 'فشل في تعديل الدورة');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ أثناء تعديل الدورة');
      toast.error('حدث خطأ أثناء تعديل الدورة');
    }
  };

  // Update instructor name when instructor ID changes
  useEffect(() => {
    if (instructorID) {
      const selectedTrainer = trainers.find(trainer => trainer.UserID == instructorID);
      if (selectedTrainer) {
        setInstructorName(selectedTrainer.FullName);
      }
    } else {
      setInstructorName('');
    }
  }, [instructorID, trainers]);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Toast Container */}
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Back Button */}
        <button
          onClick={() => navigate('/CoursesPartner')}
          className="flex items-center text-primary hover:text-secondary mb-6"
        >
          <ArrowRight size={20} className="ml-2" />
          العودة إلى قائمة الدورات
        </button>

        {/* Page Title */}
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <UserPlus size={24} className="ml-2" />
          تعديل دورة جديدة
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Add Course Form */}
        <form onSubmit={handleSubmit}>
          {/* Course Name Field */}
          <div className="mb-4">
            <label htmlFor="courseName" className="block text-sm font-medium text-primary mb-1">
              اسم الدورة
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل اسم الدورة"
              required
            />
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-primary mb-1">
              وصف الدورة
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل وصف الدورة"
              required
            />
          </div>

          {/* Course Image Field */}
          <div className="mb-4">
            <label htmlFor="courseImage" className="block text-sm font-medium text-primary mb-1">
              صورة الدورة
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="courseImage"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none"
                  >
                    <span>اختر صورة</span>
                    <input
                      id="courseImage"
                      name="courseImage"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pr-1">أو قم بسحب وإفلات</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</p>
              </div>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* PDF Files Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary mb-1">
              ملفات PDF للدورة (اختياري)
            </label>
            <div className="space-y-4">
              {pdfFiles.map((file, idx) => (
                <div key={idx} className="relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {/* X button to remove this input */}
                  {pdfFiles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePdfInput(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 focus:outline-none"
                    >
                      ×
                    </button>
                  )}
                  <div className="space-y-1 text-center">
                    <UploadCloud
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor={`pdfFile-${idx}`}
                        className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none"
                      >
                        <span>اختر ملف PDF</span>
                        <input
                          id={`pdfFile-${idx}`}
                          name={`pdfFile-${idx}`}
                          type="file"
                          className="sr-only"
                          accept="application/pdf"
                          onChange={e => handlePdfFileChange(idx, e.target.files[0])}
                        />
                      </label>
                      <p className="pr-1">أو قم بسحب وإفلات</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF حتى 10MB</p>
                    {file && (
                      <p className="text-xs text-green-600">تم اختيار: {file.name}</p>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMorePdfInput}
                className="bg-gray-200 text-primary px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                تعديل ملف PDF آخر
              </button>
            </div>
          </div>

          {/* Price Field */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-primary mb-1">
              السعر
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="أدخل السعر"
              required
            />
          </div>

          {/* Course Type Field */}
          <div className="mb-4">
            <label htmlFor="courseType" className="block text-sm font-medium text-primary mb-1">
              نوع الدورة
            </label>
            <select
              id="courseType"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="OnSite">حضوري</option>
              <option value="Online">عبر الإنترنت</option>
            </select>
          </div>

          {/* Course Link Field (only shown for online courses) */}
          {courseType === 'Online' && (
            <div className="mb-4">
              <label htmlFor="courseLink" className="block text-sm font-medium text-primary mb-1">
                رابط الدورة
              </label>
              <input
                type="url"
                id="courseLink"
                value={courseLink}
                onChange={(e) => setCourseLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="أدخل رابط الدورة عبر الإنترنت"
                required={courseType === 'Online'}
              />
            </div>
          )}

          {/* Category ID Field */}
          <div className="mb-4">
            <label htmlFor="categoryID" className="block text-sm font-medium text-primary mb-1">
              الفئة
            </label>
            <select
              id="categoryID"
              value={categoryID}
              onChange={(e) => setCategoryID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="">اختر الفئة</option>
              {categories.map((category) => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Starting Time Field */}
          <div className="mb-4">
            <label htmlFor="startingTime" className="block text-sm font-medium text-primary mb-1">
              تاريخ البدء
            </label>
            <input
              type="date"
              id="startingTime"
              value={startingTime}
              onChange={(e) => setStartingTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          {/* Ending Time Field */}
          <div className="mb-4">
            <label htmlFor="endingTime" className="block text-sm font-medium text-primary mb-1">
              تاريخ الانتهاء
            </label>
            <input
              type="date"
              id="endingTime"
              value={endingTime}
              onChange={(e) => setEndingTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          {/* Lessons Time Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary mb-1">
              مدة الدروس
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lessonsStartTime" className="block text-xs text-gray-500 mb-1">
                  من
                </label>
                <input
                  type="time"
                  id="lessonsStartTime"
                  value={lessonsStartTime}
                  onChange={(e) => setLessonsStartTime(e.target.value)}
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
                  onChange={(e) => setLessonsEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Instructor ID Field */}
          <div className="mb-4">
            <label htmlFor="instructorID" className="block text-sm font-medium text-primary mb-1">
              المدرب
            </label>
            <select
              id="instructorID"
              value={instructorID}
              onChange={(e) => setInstructorID(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="">اختر المدرب</option>
              {trainers.map((trainer) => (
                <option key={trainer.UserID} value={trainer.UserID}>
                  {trainer.FullName} ({trainer.Username})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            تعديل دورة
          </button>
        </form>
      </div>
    </>
  );
};

export default EditCoursesPartner;