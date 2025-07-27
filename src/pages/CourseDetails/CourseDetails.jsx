import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import WhatsAppButton from "../../components/WhatsApp";

function getCourseDurationText(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? "يوم" : "أيام"}`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? "شهر" : "أشهر"}`;
  }
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} ${diffYears === 1 ? "سنة" : "سنوات"}`;
}

const reviews = [
  {
    text: "هذي تجربتي الثانية مع اباد، كورس Cisco (CCNA) كورس جميل جدا و استفدت منه أشياء كثير.",
    name: "Moustafa Swelm",
    initials: "MS",
    rating: 4.5,
  },
  {
    text: "هذي تجربتي الثانية مع اباد، كورس Cisco (CCNA) كورس جميل جدا و استفدت منه أشياء كثير.",
    name: "Moustafa Swelm",
    initials: "MS",
    rating: 4.5,
  },
  {
    text: "هذي تجربتي الثانية مع اباد، كورس Cisco (CCNA) كورس جميل جدا و استفدت منه أشياء كثير.",
    name: "Moustafa Swelm",
    initials: "MS",
    rating: 4.5,
  },
  {
    text: "هذي تجربتي الثانية مع اباد، كورس Cisco (CCNA) كورس جميل جدا و استفدت منه أشياء كثير.",
    name: "Moustafa Swelm",
    initials: "MS",
    rating: 4.5,
  },
];

function ReviewStars({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <i key={i} className="fa-solid fa-star text-yellow-400 text-2xl"></i>
      ))}
      {halfStar && <i className="fa-solid fa-star-half-stroke text-yellow-400 text-2xl"></i>}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <i key={i} className="fa-regular fa-star text-yellow-400 text-2xl"></i>
      ))}
    </div>
  );
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('tab1');
  const { t, i18n } = useTranslation(); // Destructure t and i18n from useTranslation
  const navigate = useNavigate();

  // Get userId from localStorage
  const userId = localStorage.getItem("user_id");

  // State for form inputs
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const formatDateAndTime = (isoString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return new Date(isoString).toLocaleDateString("en-US", options);
  };
  const [verificationCode, setVerificationCode] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    Language: "",
    Write_an_inquiry: "",
    status: "Pending",
    NationalId: "" // Add this line
  });
  const [enteredCode, setEnteredCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      try {
        const response = await fetch(
          `http://localhost:3000/api/courses/${courseId}`,
          requestOptions
        );
        const result = await response.json();
        setCourse(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    // Generate random 5-digit code
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    setVerificationCode(randomCode);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if userId exists in localStorage
    if (!userId) {
      setShowLoginMessage(true); // Show login message
      return; // Stop further execution
    }

    // Validate verification code
    if (enteredCode !== verificationCode) {
      alert("الكود غير صحيح");
      return;
    }

    // Validate required fields
// Validate required fields
if (!formData.fullName || !formData.email || !formData.phoneNumber || 
  !formData.location || !formData.Language || !formData.NationalId) {
alert("يرجى ملء جميع الحقول المطلوبة");
return;
}
    setIsSubmitting(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "fullname": formData.fullName,
  "email": formData.email,
  "phonenumber": formData.phoneNumber,
  "location": formData.location,
  "Language": formData.Language,
  "Write_an_inquiry": formData.Write_an_inquiry,
  "status": "Pending",
  "CourseID": parseInt(courseId),
  "NationalId": formData.NationalId // Add this line
});

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://localhost:3000/api/registrations", requestOptions);
      const result = await response.json();
      console.log(result);
      
      if (response.ok) {
        alert("تم التسجيل بنجاح!");
        // Reset form
// Reset form
setFormData({
  fullname: "",
  email: "",
  phoneNumber: "",
  location: "",
  Language: "",
  Write_an_inquiry: "",
  status: "Pending",
  NationalId: "" // Add this line
});
        setEnteredCode("");
        // Generate new verification code
        const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
        setVerificationCode(randomCode);
      } else {
        alert("حدث خطأ في التسجيل: " + (result.message || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [reviewStartIdx, setReviewStartIdx] = useState(0);
  const visibleReviewCount = 3;
  const handlePrevReview = () => {
    setReviewStartIdx((prev) => Math.max(prev - 1, 0));
  };
  const handleNextReview = () => {
    setReviewStartIdx((prev) => Math.min(prev + 1, reviews.length - visibleReviewCount));
  };

  if (!course) {
    return<div className="text-center flex items-center justify-center p-16 bg-[#F9FAFC]"> <svg className="lds-harmony" width="180px" height="180px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{background: 'none'}}>
    <g transform="translate(50,50)">
      <g transform="scale(0.5)">
        <g transform="translate(-50,-50)">
          <g transform="rotate(207.504 50 50)">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" values="360 50 50;0 50 50" keyTimes="0;1" dur="0.9s" keySplines="0.5 0.5 0.5 0.5" calcMode="spline" />
            <path fill="#0a5f91" d="M42.9,17.8c-1.4-5.4,1.9-11,7.3-12.4c0.6-0.2,1.3-0.3,1.9-0.3l0.8,0l0,0c4-0.2,8,0.1,11.9,1.1 c3.6,0.9,7.2,2.5,10.6,4.7c3.3,2.2,6.2,4.8,8.4,7.6c2.3,3,4.2,6.2,5.4,9.7c0.3,0.9,0.6,1.8,0.9,2.7c0.2,0.9,0.4,1.8,0.6,2.7l0.1,0.6 l0.4,3.4c0,0.3,0,0.6,0,0.9l0,1.8c0,0.4,0,0.8,0,1.2c-0.1,0.9-0.2,1.8-0.2,2.7c-0.3,2-0.6,3.6-1.2,5.2c-1.1,3.5-2.6,6.6-4.6,9.3 c-2,2.8-4.4,5.2-7.1,7.2c-0.2,0.2-0.5,0.3-0.7,0.5c-0.5,0.3-1,0.7-1.4,0.9l-2.3,1.3c-1.6,0.7-3.1,1.4-4.6,1.8 c-3.3,1-6.6,1.5-9.6,1.4c-3.2-0.1-6.4-0.7-9.3-1.7c-2.9-1.1-5.6-2.6-8-4.5l-1.1-0.9c-0.2-0.2-0.4-0.3-0.6-0.5l-1.6-1.6 c-1.6-1.8-3-3.8-4.1-5.9c1.4,1.9,3.1,3.5,4.9,5c0.8,0.6,1.7,1.3,2.6,1.8l1.1,0.6c2.5,1.3,5.1,2.2,7.9,2.8c2.6,0.4,5.4,0.4,8,0 c2.4-0.3,5-1.2,7.5-2.4c1.1-0.5,2-1.1,2.9-1.7l1.9-1.5c0.3-0.3,0.6-0.6,0.9-0.8c0.1-0.1,0.3-0.3,0.4-0.4l0.1-0.1 c1.7-1.8,3.1-3.8,4.2-6.1c1-2.1,1.6-4.4,1.9-6.8c0.2-1,0.2-2,0.1-2.8l0-0.6l0-0.3c-0.1-0.5-0.1-1-0.1-1.4c0-0.4-0.1-0.8-0.2-1.1 l-0.2-1c0-0.2-0.1-0.3-0.1-0.5L78,37.7l-0.4-1c-0.2-0.4-0.4-0.9-0.6-1.3L77,35.1c-0.2-0.4-0.5-0.8-0.7-1.2l-0.1-0.1 c-1.1-1.8-2.5-3.5-4.1-4.9c-1.5-1.3-3.2-2.4-5.4-3.2c-2.1-0.8-4-1.2-5.8-1.3C53.9,24.2,45.5,27.5,42.9,17.8z" />
            <path fill="#fdb614" d="M33.2,74.3c-2.1-0.9-3.9-1.9-5.4-3.2c-1.6-1.4-3-3-4.1-4.9l-0.1-0.1c-0.2-0.4-0.4-0.8-0.7-1.2l-0.1-0.3 c-0.2-0.4-0.4-0.9-0.6-1.3c-3.2-8.4-0.9-17.9,5.7-24.1c9-8.4,22.7-8,32.3-0.9c1.8,1.5,3.5,3.1,4.9,5c-1.1-2.2-2.5-4.1-4.1-5.9 C44.8,20.4,17,28.7,10.2,50.4c-0.5,1.6-0.8,3.2-1.2,5.2c-0.1,0.9-0.2,1.8-0.2,2.7c0,0.4,0,0.8,0,1.2l0,1.9c0,0.3,0,0.6,0,0.9 l0.4,3.4l0.1,0.6c0.2,0.9,0.4,1.8,0.6,2.7c0.3,0.9,0.6,1.8,0.9,2.7c1.3,3.5,3.1,6.7,5.4,9.7c2.2,2.9,5.1,5.4,8.4,7.6 c3.4,2.2,7,3.8,10.6,4.7c3.8,1,7.8,1.4,11.9,1.1l0,0l0.8,0c0.6,0,1.3-0.1,1.9-0.3c2.6-0.7,4.8-2.4,6.2-4.7c1.4-2.3,1.8-5.1,1.1-7.7 c-1.4-5.4-7-8.7-12.4-7.3c-1.9,0.5-3.7,0.7-5.6,0.6C37.3,75.5,35.3,75.1,33.2,74.3z" />
          </g>
        </g>
      </g>
    </g>
  </svg>  </div>;
  }

  return (
    <>
<div
  className="w-full  bg-cover bg-center rounded-lg text-white relative"
  style={{
    backgroundImage: course.courseImgUrl
      ? `url(${course.courseImgUrl})`
      : undefined,
  }}
>
  <div className="inset-0 bg-yl rounded-lg"></div>
  {/* Overlay Layer */}
  <div className="absolute inset-0 bg-blue-900/60 rounded-lg"></div>

  <div className="relative z-10">
    <div
      dir={i18n.dir()}
      className="p-16  bg-center bg-cover rounded-lg relative"
    >
       <div className="mb-4">
        <span className="inline-block bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded-xl text-sm">
          الأكثر مبيعاً <i className="fa-solid fa-award ml-1"></i>
        </span>
      </div>
      <h1 className="text-2xl font-bold mb-4 lg:text-start text-center lg:pt-2 pt-9">
        {course.CourseName}
      </h1>
      <div className="  mb-4 lg:text-start text-sm md:w-2/4 text-center lg:pt-2 pt-9">
      {course.Description}
      </div>
      
      {/* Rating and stars */}
      <div className="flex items-center gap-2 justify-start mb-4">
        <span className="text-2xl font-bold">1,421</span>
        <span className="flex text-yellow-400 text-2xl">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fa-solid fa-star"></i>
          ))}
        </span>
        <span className="text-2xl font-bold">4.5</span>
      </div>

      {/* Training style and dates */}
      <div className="flex flex-col items-start gap-2 justify-start mb-4">
        <div className="text-xl font-bold mb-2">اختر اسلوب التدريب / التواريخ المتاحة</div>
        <div className="flex flex-col md:flex-col gap-4 r">
          {/* Training style select */}
          <div className="flex flex-col md:flex-row-reverse gap-2">
            <button className="flex items-center border-2 border-white rounded-xl px-6 py-2 text-white text-lg bg-transparent hover:bg-white hover:text-blue-900 transition font-bold">
            <i className="fa-solid fa-arrow-left ml-2" />

              ----
            </button>
            <button className="flex items-center border-2 border-yellow-400 rounded-xl px-6 py-2 text-blue-900 text-lg bg-white font-bold shadow hover:bg-yellow-400 hover:text-white transition">
              <i className="fa-solid fa-arrow-left ml-2"></i>
              أساليب التدريب
            </button>
          </div>
          {/* Dates and types */}
          <div className="flex md:flex-row-reverse  flex-col-reverse  justify-center items-center gap-2">
            <div className="bg-white rounded-xl px-4 py-2 flex flex-col text-blue-900 font-bold text-lg shadow">
              <div><p className="lg:text-lg text-[#011B7D] flex items-center gap-2">
                  {new Date(course.StartingTime).toLocaleDateString("ar-sa", { weekday: "long" })}
                  <span>الموافق</span>
                  {formatDateAndTime(course.EndingTime)}
                </p></div>
              <hr className=" border-blue-200" />
              <div>
                <p className="lg:text-lg text-[#011B7D] flex items-center gap-2">
                  {new Date(course.StartingTime).toLocaleDateString("ar-sa", { weekday: "long" })}
                  <span>الموافق</span>
                  {formatDateAndTime(course.StartingTime)}
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse  mt-2">
              <button className="flex-1 bg-[#0FCEC9] mt-1 text-white font-bold rounded-xl px-6 py-2 flex items-center justify-center text-lg shadow">
                حضوري
                <i className="fa-solid fa-chalkboard-user ml-2"></i>
              </button>
              <button className="flex-1 bg-[#fc5e76]  text-white font-bold rounded-xl px-6 py-2 flex items-center justify-center text-lg shadow">
                أون لاين
                <i className="fa-solid fa-wifi ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        
<div className="w-full bg-white rounded-b-2xl shadow flex flex-col md:flex-row-reverse items-center justify-between px-8 py-4 mt-[-20px] z-20 relative">
  {/* Info icons and text */}
  <div className="flex flex-row-reverse gap-8 items-center text-blue-900 font-bold text-lg">
    <div className="flex flex-row items-center">
      <div className="text-sm"><span className="">المدة</span>
      <span className="flex items-center gap-1">
       
        {getCourseDurationText(course.StartingTime,course.EndingTime)}
      </span></div>
      <div className=""> <i className="fa-solid fa-hourglass-half text-3xl"></i></div>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-base">الساعات المعتمدة</span>
      <span className="flex items-center gap-1">
        <i className="fa-regular fa-clock text-2xl"></i>
        16
      </span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-base">اختبار مشمول</span>
      <span className="flex items-center gap-1">
        <i className="fa-regular fa-file-lines text-2xl"></i>
      </span>
    </div>
  </div>
  {/* Action buttons */}
  <div className="flex gap-4 mt-4 md:mt-0">
    <button className="bg-[#4B55A1] text-white font-bold rounded-xl px-8 py-2 text-lg hover:bg-[#374285] transition">التسجيل</button>
    <button className="bg-[#4B55A1] text-white font-bold rounded-xl px-8 py-2 text-lg hover:bg-[#374285] transition">عرض التفاصيل</button>
  </div>
</div>
        
            <div className="">
       
        <div dir={i18n.dir()} className=" py-3 px-20 items-end bg-[#F9FAFC]">
          {/* Tab Buttons */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8" dir={i18n.dir()}>
            {/* Tabs */}
            <div className="flex flex-row md:flex-col w-full md:min-w-[180px] md:w-auto gap-2 md:gap-0 mb-4 md:mb-0">
              <button
                className={`w-full md:w-auto py-2 px-4 text-right flex items-center transition-all text-sm md:text-base ${
                  activeTab === 'tab1'
                    ? 'text-blue-800 font-bold bg-blue-50   rounded-xl '
                    : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                } focus:outline-none`}
                onClick={() => setActiveTab('tab1')}
              >
                {activeTab === 'tab1' && (
                  i18n.dir() === 'rtl' ? (
                    <svg className="ml-2 w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="0,10 10,0 10,7 20,7 20,13 10,13 10,20" />
                    </svg>
                  ) : (
                    <svg className="mr-2 w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="20,10 10,0 10,7 0,7 0,13 10,13 10,20" />
                    </svg>
                  )
                )}
                {t("description1")}
              </button>
              <button
                className={`w-full md:w-auto py-2 px-4 text-right flex items-center transition-all text-sm md:text-base ${
                  activeTab === 'tab2'
                    ? 'text-blue-800 font-bold bg-blue-50 rounded-xl'
                    : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                } focus:outline-none`}
                onClick={() => setActiveTab('tab2')}
              >
                {activeTab === 'tab2' && (
                  i18n.dir() === 'rtl' ? (
                    <svg className="ml-2 w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="0,10 10,0 10,7 20,7 20,13 10,13 10,20" />
                    </svg>
                  ) : (
                    <svg className="mr-2 w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="20,10 10,0 10,7 0,7 0,13 10,13 10,20" />
                    </svg>
                  )
                )}
                {t("duration")}
              </button>
              <button
                className={`w-full md:w-auto py-2 px-4 text-right flex items-center transition-all text-sm md:text-base ${
                  activeTab === 'tab3'
                    ? 'text-blue-800 font-bold bg-blue-50 rounded-xl'
                    : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                } focus:outline-none`}
                onClick={() => setActiveTab('tab3')}
              >
                {activeTab === 'tab3' && (
                  i18n.dir() === 'rtl' ? (
                    <svg className="ml-2 w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="0,10 10,0 10,7 20,7 20,13 10,13 10,20" />
                    </svg>
                  ) : (
                    <svg className="mr-2 w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <polygon points="20,10 10,0 10,7 0,7 0,13 10,13 10,20" />
                    </svg>
                  )
                )}
                {t("price")}
              </button>
            </div>
            <div className="hidden md:block border-l-2 border-gray-300 self-stretch"></div>
            {/* Tab Content */}
            <div className="flex-1">
              <div className="p-4 md:p-6 rounded-lg min-h-[120px] text-right text-sm md:text-base">
                {activeTab === 'tab1' && <div>{course.Description}</div>}
                {activeTab === 'tab2' && <div>{course.LessonsTime}</div>}
                {activeTab === 'tab3' && <div>{course.Price} $</div>}
              </div>
            </div>
          </div>


<div className="w-full mt-12">
  <h2 className="text-3xl font-bold text-center text-[#011B7D] mb-8">آراء العملاء</h2>
  <div className="flex items-center justify-between mb-4 px-4">
    {/* Arrows */}
    <div className="flex gap-2">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-2xl text-[#011B7D] hover:bg-gray-100 transition"
        onClick={handlePrevReview}
        disabled={reviewStartIdx === 0}
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-2xl text-[#011B7D] hover:bg-gray-100 transition"
        onClick={handleNextReview}
        disabled={reviewStartIdx >= reviews.length - (window.innerWidth < 768 ? 1 : visibleReviewCount)}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  </div>
  <div className="relative w-full overflow-hidden px-4 pb-4">
    <div
      className="flex gap-6 transition-transform duration-500"
      style={{
        transform: `translateX(-${reviewStartIdx * (window.innerWidth < 768 ? 340 : 340 + 24)}px)` // 340px card + 24px gap
      }}
    >
      {reviews.map((review, idx) => (
        <div
          key={idx}
          className="min-w-[340px] max-w-[340px] bg-white rounded-2xl border border-gray-300 p-6 flex flex-col gap-2 shadow-sm"
        >
          <ReviewStars rating={review.rating} />
          <div className="text-[#011B7D] font-bold mb-2 text-right">
            {course?.CourseName}
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <span className="font-bold text-gray-500">{review.name}</span>
            <span className="bg-[#011B7D] text-white font-bold rounded px-2 py-1">{review.initials}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

<div className="max-w-5xl mx-auto py-8 px-2">
  <h2 className="text-4xl font-bold text-center text-[#011B7D] mb-8">سجل الان</h2>
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    {/* Right column */}
    <div className="flex flex-col gap-6">
      <label className="text-right text-gray-700 font-bold">الاسم الرباعي كامل</label>
      <input className="border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none" type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
      <label className="text-right text-gray-700 font-bold">رقم الجوال</label>
      <input className="border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none" type="text" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
      
      <label className="text-right text-gray-700 font-bold">اللغة</label>
      <select className="border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none text-[#4B55A1] font-bold" value={formData.Language} onChange={(e) => handleInputChange('Language', e.target.value)}>
        <option>اختار اللغيه</option>
        <option>عربي</option>
        <option>English</option>
      </select>
      <label className="text-right text-gray-700 font-bold">اكتب استفسار</label>
      <textarea className="w-full border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none min-h-[100px]" value={formData.Write_an_inquiry} onChange={(e) => handleInputChange('Write_an_inquiry', e.target.value)} />
    
    </div>
    {/* Left column */}
    <div className="flex flex-col gap-6">
      <label className="text-right text-gray-700 font-bold">البريد الالكتروني</label>
      <input className="border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
      <label className="text-right text-gray-700 font-bold">المنطقة</label>
      <input className="border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none" type="text" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
      <label className="text-right text-gray-700 font-bold">رقم الهويه </label>
      <input className="border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none" type="text" value={formData.NationalId} onChange={(e) => handleInputChange('NationalId', e.target.value)} />

      <label className="text-right text-gray-700 font-bold">ادخل الكود</label>
      <div className="md:relative">
        <span className="md:absolute left-0 top-1/2 -translate-y-1/2 bg-[#4B55A1] text-white font-extrabold text-2xl rounded-lg px-8 py-2 ml-2">
          {verificationCode}
        </span>
        <input
          className="w-full border-2 border-[#4B55A1] rounded-lg px-4 py-2 focus:outline-none  md:text-start text-2xl font-bold"
          type="text"
          placeholder="ادخل الكود"
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
        />
      </div>
      
    </div>
    {/* Textarea (full width) */}
    <div className="col-span-1 md:col-span-2">
</div>
    {/* Submit button (full width, centered) */}
    <div className="col-span-1 md:col-span-2 flex justify-center">
      <button
        type="submit"
        className="bg-[#4B55A1] text-white font-bold rounded-lg px-16 py-2 text-2xl hover:bg-[#374285] transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? "جاري الإرسال..." : "إرسال"}
      </button>
    </div>
  </form>
</div>

        </div>
      </div>
      <WhatsAppButton />
    </>
  );
}
