import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoimg from "../../public/Abad.png";
import { FaBars, FaRegUser, FaTimes } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ categories: [], courses: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { t, i18n } = useTranslation();

  const token = localStorage.getItem("token"); // Check if token exists

  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language dynamically
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      try {
        const response = await fetch(
          "https://backend.camels.center/api/categories",
          requestOptions
        );
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all courses once on component mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      try {
        const response = await fetch(
          "https://backend.camels.center/api/courses",
          requestOptions
        );
        const result = await response.json();
        setAllCourses(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllCourses();
  }, []);

  // Fetch courses when category is hovered
  useEffect(() => {
    if (hoveredCategory) {
      const filteredCourses = allCourses.filter(
        (course) => course.CategoryID === hoveredCategory.CategoryID
      );
      setCourses(filteredCourses);
    } else {
      // Clear courses when no category is hovered
      setCourses([]);
    }
  }, [hoveredCategory, allCourses]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setShowSearchResults(false);
      return;
    }

    // Filter categories and courses based on search query
    const filteredCategories = categories.filter((category) =>
      category.CategoryName.toLowerCase().includes(query.toLowerCase())
    );

    const filteredCourses = allCourses.filter((course) =>
      course.CourseName.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults({
      categories: filteredCategories,
      courses: filteredCourses,
    });
    setShowSearchResults(true);
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    // Check if we have exact matches
    const exactCategoryMatch = searchResults.categories.find(
      (category) => category.CategoryName.toLowerCase() === searchQuery.toLowerCase()
    );

    const exactCourseMatch = searchResults.courses.find(
      (course) => course.CourseName.toLowerCase() === searchQuery.toLowerCase()
    );

    // Navigate based on matches
    if (exactCourseMatch) {
      navigate(`/courses/${exactCourseMatch.CourseID}`);
    } else if (exactCategoryMatch) {
      navigate(`/courses/${exactCategoryMatch.CategoryID}/courses`);
    } else if (searchResults.courses.length > 0) {
      // If no exact match but we have course results, go to the first course
      navigate(`/courses/${searchResults.courses[0].CourseID}`);
    } else if (searchResults.categories.length > 0) {
      // If no exact match but we have category results, go to the first category
      navigate(`/courses/${searchResults.categories[0].CategoryID}/courses`);
    } else {
      // No matches found, could show a message or redirect to a search results page
      console.log("No matches found");
    }

    // Clear search and hide results
    setShowSearchResults(false);
  };

  // Handle clicking outside the search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle key press (Enter) for search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("user_id");
  };

  return (
    <header
      className="Nav  flex flex-col mx-auto shadow-2xl z-50 shadow-black font-semibold"
      dir={i18n.dir()}
    >
      {/* Top Bar */}
      <div className="bg-[#f1f2f2]">
        <ul className="container flex gap-4 justify-end text-[#011b70] py-2 pe-5">
          <li>{t("aboutUs")}</li>
          <li
            className="cursor-pointer"
            onClick={() => changeLanguage(i18n.language === "en" ? "ar" : "en")}
          >
            {i18n.language === "en" ? " العربية" : "English "}
          </li>
        </ul>
      </div>

      {/* Main Navbar */}
      <div className="container flex flex-col lg:flex-row justify-between gap-4 lg:gap-16 mx-auto py-5  lg:px-0">
        {/* Logo and Menu */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center w-full lg:w-auto">
          <div className="flex justify-between items-center">
            <div
              className="menu lg:hidden cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaBars />
            </div>
            <div className="ms-2 me-5">
              <Link to="/">
                <img src={logoimg} className="w-[160px]" alt="Logo" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div
            className={`${menuOpen ? "block" : "hidden"} lg:block mt-4 lg:mt-0 mx-auto`}
          >
            <ul className="flex flex-col lg:flex-row gap-4 lg:gap-8 text-[#011b70] mx-auto lg:px-20">
              {/* Courses & Categories Dropdown */}
              <li
                className="relative group py-2"
                onMouseLeave={() => {
                  // Add a small delay before clearing the hovered category
                  setTimeout(() => {
                    if (
                      !document.querySelector(":hover > .categories-dropdown")
                    ) {
                      setHoveredCategory(null);
                    }
                  }, 100);
                }}
              >
                <span className="cursor-pointer">
                  {t("certificatesAndCourses")}
                </span>
                <div className="categories-dropdown absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <ul>
                    {categories.map((category) => (
                      <ul key={category.CategoryID}>
                        <Link to={`/courses/${category.CategoryID}/courses`}>
                          <li
                            className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer hover:rounded-lg z-50"
                            onMouseEnter={() => setHoveredCategory(category)}
                            onClick={() => setMenuOpen(!menuOpen)}
                          >
                            {category.CategoryName}
                          </li>
                        </Link>
                        {/* Courses Submenu */}
                        {hoveredCategory?.CategoryID === category.CategoryID &&
                          courses.length > 0 && (
                            <div
                              className={`absolute z-50 lg:top-0 lg:block hidden bg-white shadow-lg rounded-lg ${
                                i18n.dir() === "rtl"
                                  ? "right-full"
                                  : "left-full"
                              }`}
                            >
                              <ul>
                                {courses.map((course) => (
                                  <Link
                                    key={course.CourseID}
                                    to={`/courses/${course.CourseID}`}
                                  >
                                    <li className="px-4 py-2 w-auto hidden lg:block hover:bg-gray-100 whitespace-nowrap hover:rounded-lg">
                                      {course.CourseName}
                                    </li>
                                  </Link>
                                ))}
                              </ul>
                            </div>
                          )}
                      </ul>
                    ))}
                  </ul>
                  <ul>
                    <Link to="/AllCategories">
                      <li
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer hover:rounded-lg z-50"
                      >
                        عرض الكل
                      </li>
                    </Link>
                  </ul>
                </div>
              </li>

              {/* About Menu */}
              <li className="relative group py-2">
                <span className="cursor-pointer">{t("trainingMethods")}</span>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <ul>
                    <Link to="/PartnersAndAffiliation">
                      <li className="px-4 py-2 text-sm hover:bg-gray-100">
                        {t("partnersAndAffiliation")}
                      </li>
                    </Link>
                    <Link to="/Teams">
                      <li className="px-4 text-sm py-2  hover:bg-gray-100">
                        {t("privacyPolicy")}
                      </li>
                    </Link>
                    <Link to="/Academic">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("academicIntegrity")}
                      </li>
                    </Link>
                    <Link to="/Attendance">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("attendancePolicy")}
                      </li>
                    </Link>
                    <Link to="/TechnicalSupport">
                      {" "}
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("technicalSupport")}
                      </li>
                    </Link>
                  </ul>
                </div>
              </li>
              <li className="relative group py-2">
                <span className="cursor-pointer"> {t("aboutInstitute")}</span>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <ul>
                    <Link to="/LegalPage">
                      <li className="px-4 py-2 text-sm hover:bg-gray-100">
                        {t("intellectualPropertyRights")}
                      </li>
                    </Link>
                    <Link to="/Teams">
                      <li className="px-4 text-sm py-2  hover:bg-gray-100">
                        {t("privacyPolicy")}
                      </li>
                    </Link>
                    <Link to="/Academic">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("academicIntegrity")}
                      </li>
                    </Link>
                    <Link to="/Attendance">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("attendancePolicy")}
                      </li>{" "}
                    </Link>
                    <Link to="/TechnicalSupport">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("technicalSupport")}
                      </li>
                    </Link>
                    <Link to="/VerificationSystem">
                      {" "}
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("identityVerification")}
                      </li>
                    </Link>
                    <Link to="/TraineeVerificationMechanism">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("traineeVerificationMechanism")}
                      </li>
                    </Link>
                    <Link to="/content-is-up-to-date">
                      {" "}
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("upToDateContent")}
                      </li>
                    </Link>
                    <Link to="/roles-and-responsibilities-document">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("rolesAndResponsibilities")}
                      </li>
                    </Link>
                    <Link to="/system-technical-specification-document">
                      <li className="px-4 text-sm py-2 hover:bg-gray-100">
                        {t("technicalSpecifications")}
                      </li>
                    </Link>
                  </ul>
                </div>
              </li>
              <Link to="/ContactInfo">
                <li className="py-2">{t("branches")}</li>
              </Link>
              <Link
                to="https://abadnet.com.sa/online/"
                className="text-red-600"
              >
                <li className="py-2">{t("onlineCourses")}</li>
              </Link>

              <Link to="/ContactPage">
                <li className="py-2">{t("contactUs")}</li>
              </Link>
            </ul>
          </div>
        </div>

        {/* Search and User Icon */}
        <div className="flex items-center gap-4 lg:gap-2 lg:pt-4">
          <div className="relative" ref={searchRef}>
            <input
              type="text"
              className="border-2 rounded-lg px-2 w-[10rem] py-1"
              placeholder="بحث"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            <span 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            >
              
            </span>

            {/* Search Results Dropdown */}
            {showSearchResults && (searchResults.categories.length > 0 || searchResults.courses.length > 0) && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white shadow-lg rounded-lg z-50 overflow-hidden">
                {searchResults.categories.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-100 font-semibold">{t("categories")}</div>
                    <ul>
                      {searchResults.categories.map((category) => (
                        <li
                          key={category.CategoryID}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate(`/courses/${category.CategoryID}/courses`);
                            setShowSearchResults(false);
                            setSearchQuery("");
                          }}
                        >
                          {category.CategoryName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchResults.courses.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-100 font-semibold">{t("courses")}</div>
                    <ul>
                      {searchResults.courses.map((course) => (
                        <li
                          key={course.CourseID}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate(`/courses/${course.CourseID}`);
                            setShowSearchResults(false);
                            setSearchQuery("");
                          }}
                        >
                          {course.CourseName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conditional rendering based on token presence */}
          {!token ? (
            <Link to="/LoginPage">
              
              <div>
                تسجيل الدخول
              </div>
            </Link>
          ) : (<>
          <Link to="/ProfilePage"><div className="text-[#011B70]">
                <FaRegUser />
              </div>
          </Link>
            <Link to="/">
            <button onClick={handleLogout}>
              تسجيل الخروج 
            </button>
            </Link>
          </>)}
        </div>
      </div>
    </header>
  );
}