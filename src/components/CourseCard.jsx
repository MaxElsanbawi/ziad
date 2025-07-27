import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import RegistrationModal from "./RegistrationModal";

const CourseCard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleOpenModal = (courseId) => {
    setSelectedCourseId(courseId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourseId(null);
  };

  useEffect(() => {
    i18n.changeLanguage("ar");
  }, [i18n]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:3000/api/courses", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        const sortedCourses = result.sort((a, b) => 
          new Date(a.StartingTime) - new Date(b.StartingTime)
        );
        setCourses(sortedCourses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getBadgeBackgroundColor = (courseType) => {
    if (courseType === "Online") {
      return "bg-[#fc5e76]";
    } else if (courseType === "OnSite") {
      return "bg-[#0FCEC9]";
    }
    return "bg-[#0000ff]";
  };

  const translateCourseType = (courseType) => {
    if (courseType === "Online") {
      return t("online");
    } else if (courseType === "OnSite") {
      return t("onSite");
    }
    return courseType;
  };

  const formatDateAndTime = (isoString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return new Date(isoString).toLocaleDateString("en-US", options);
  };

  const getCourseLink = (course) => {
    if (course.CourseType === "Online") {
      return (course.CourseLink) ;
    } else if (course.CourseType === "OnSite") {
      return `/courses/${course.CourseID}`;
    }
    return "#";
  };

  const isMoreThanThreeDaysOld = (courseStartingTime) => {
    const currentTime = new Date();
    const threeDaysBefore = new Date(currentTime);
    threeDaysBefore.setDate(currentTime.getDate() - 3);
    const courseStartTime = new Date(courseStartingTime);
    return courseStartTime < threeDaysBefore;
  };

  const getArabicMonthName = (monthName) => {
    const months = {
      January: "يناير",
      February: "فبراير",
      March: "مارس",
      April: "أبريل",
      May: "مايو",
      June: "يونيو",
      July: "يوليو",
      August: "أغسطس",
      September: "سبتمبر",
      October: "أكتوبر",
      November: "نوفمبر",
      December: "ديسمبر",
    };
    return months[monthName] || monthName;
  };

  const groupCoursesByMonth = (courses) => {
    const groupedCourses = {};

    courses.forEach((course) => {
      const courseDate = new Date(course.StartingTime);
      const englishMonthName = courseDate.toLocaleString("en-US", { month: "long" });
      const arabicMonthName = getArabicMonthName(englishMonthName);
      const monthYear = `${arabicMonthName} ${courseDate.getFullYear()}`;

      if (!groupedCourses[monthYear]) {
        groupedCourses[monthYear] = [];
      }

      groupedCourses[monthYear].push(course);
    });

    // Sort months chronologically
    const sortedEntries = Object.entries(groupedCourses).sort(([aKey], [bKey]) => {
      const aDate = new Date(aKey.replace(/[^0-9 ]/g, ' ').trim());
      const bDate = new Date(bKey.replace(/[^0-9 ]/g, ' ').trim());
      return aDate - bDate;
    });

    return Object.fromEntries(sortedEntries);
  };

  const groupedCourses = groupCoursesByMonth(courses);

  return (
    <section
      dir={i18n.dir()}
      id="monthlyCourses"
      className="container mx-auto text-[#011B70] mt-20"
    >
      <div className="flex my-10 justify-center md:justify-start text-lg">
        <h2>مواعيد الدورات القادمة</h2>
      </div>
      <div className="flex w-full my-10 text-center justify-center items-center"></div>

      {loading && (
        <div className="text-center my-10">
          <p>جارٍ التحميل...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 my-10">
          <p>حدث خطأ: {error}</p>
        </div>
      )}

      <div className="flex flex-col gap-6 font-semibold">
        {Object.keys(groupedCourses).length > 0 ? (
          Object.entries(groupedCourses).map(([monthYear, monthCourses]) => {
            const filteredCourses = monthCourses.filter(
              (course) => !isMoreThanThreeDaysOld(course.StartingTime)
            );

            if (filteredCourses.length > 0) {
              return (
                <div key={monthYear} className="text-center">
                  <h3 className="text-xl font-bold my-4">{monthYear}</h3>
                  {filteredCourses.map((course, index) => (
                    <div
                      key={course.CourseID || index}
                      className="relative flex flex-row justify-around"
                    >
                      <div>
                        <span
                          className={`absolute top-[-10px] my-4 text-xs font-semibold px-3 text-white py-1 rounded-md ${
                            getBadgeBackgroundColor(course.CourseType)
                          } ${i18n.dir() === "rtl" ? "right-10" : "left-10"}`}
                        >
                          {translateCourseType(course.CourseType)}
                        </span>
                      </div>
                      <div className="bg-white w-full shadow-lg flex lg:justify-between lg:flex-row flex-col px-10 rounded-3xl items-center py-4 my-5">
                        <div className="flex justify-between items-center lg:w-3/4 w-full md:flex-row flex-col">
                          <div className="text-center md:w-1/3 lg:w-[25%] flex md:flex-col items-center justify-center">
                            {course.CourseName.split(" ").slice(0, 5).join(" ")}
                          </div>
                          <div className="flex md:flex-col items-center justify-center py-2 md:py-0 md:w-1/3 lg:w-[25%]">
                            <p className="lg:text-lg pe-1 text-[#011B7D]">
                              {new Date(course.StartingTime).toLocaleDateString(
                                "ar-sa",
                                { weekday: "long" }
                              )}{" "}
                              الموافق
                            </p>
                            <p className="lg:text-lg text-[#011B7D]">
                              {formatDateAndTime(course.StartingTime)}
                            </p>
                          </div>
                          <div className="flex flex-col items-center justify-center text-center pb-2 md:pb-0 md:w-1/3 lg:w-[25%]">
                            {course.LessonsTime && (
                              <>
                                <p className="lg:text-lg text-[#011B7D]">
                                  {course.LessonsTime.slice(
                                    0,
                                    Math.ceil(course.LessonsTime.length / 2)
                                  )}
                                </p>
                                <p className="lg:text-lg text-[#011B7D]">
                                  {course.LessonsTime.slice(
                                    Math.ceil(course.LessonsTime.length / 2)
                                  )}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="lg:right-[19rem] flex lg:flex-col md:flex-row sm:pt-2 lg:pt-0 text-white gap-4">
                          <Link to={getCourseLink(course)}>
                            <button className="bg-[#4b5399] px-2 py-1 rounded-xl">
                              عرض التفاصيل
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleOpenModal(course.CourseID)}
                            className="bg-[#4b5399] px-2 py-1 rounded-xl flex items-center gap-2"
                          >
                            <i className="fas fa-arrow-left"></i>
                            التسجيل
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })
        ) : !loading && !error ? (
          <div className="text-center my-10">
            <p>لا توجد دورات متاحة حالياً.</p>
          </div>
        ) : null}
      </div>
      
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        courseId={selectedCourseId}
      />
    </section>
  );
};

export default CourseCard;