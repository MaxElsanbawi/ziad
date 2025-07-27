import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Import images
import img1 from '../../public/footer-logos/Asset-3.png';
import img2 from '../../public/footer-logos/Asset-4.png';
import img3 from '../../public/footer-logos/Asset-5.png';
import img4 from '../../public/footer-logos/Asset-6.png';
import img5 from '../../public/footer-logos/Asset-7.png';
import img6 from '../../public/footer-logos/Asset-8.png';
import img7 from '../../public/social-icons/Asset-9.png';
import img8 from '../../public/social-icons/Asset-10.png';
import img9 from '../../public/social-icons/Asset-11.png';
import img10 from '../../public/social-icons/Asset-12.png';
import img11 from '../../public/social-icons/Asset-13.png';
import img12 from '../../public/social-icons/Asset-14.png';
import footerlogo1 from '../../public/footer-logo1.png';
import logo from '../../public/logo.png';

export default function Footer() {

  const [categories, setCategories] = useState([]);
  const { t ,i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  useEffect(() => {
    const fetchCategories = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      try {
        const response = await fetch("https://backend.camels.center/api/categories", requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error(error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="flex flex-col bg-footer bg-fit bg-no-repeat bg-top text-white    font-semibold bg-[#f9fafc] z-50" dir={i18n.dir()} 
    style={{
      transform: i18n.dir() === "ltr" ? "scaleX(-1)" : "none", // Mirror effect for RTL
    }}>
      <div className="container mx-auto flex flex-col px-8" 
      style={{
        transform: i18n.dir() === "ltr" ? "scaleX(-1)" : "none", // Flip content back for RTL
      }}>
        <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 lg:mb-16">
          {/* Column 1: Logo and Description */}
          <div className="items-center text-center">
            <img className="mt-12  items-center" src={logo} alt={t('aboutInstitute')} />
            <div className="mt-8 items-center text-center">{t('description')}</div>
            <div className="md:mt-12 mt-3 items-center text-center">{t('phoneNumber')}</div>
            <div>{t('email')}</div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:mt-[200px] mt-36 flex flex-col items-center text-center">
            <span className="lg:mb-5">{t('quickLinks')}</span>
            <ul className="flex flex-col gap-3">
              <li>{t('home')}</li>
              <li>{t('aboutInstitute')}</li>
              <li>{t('introductoryVideos')}</li>
              <li>{t('branches')}</li>
              <li>{t('upcomingCourses')}</li>
              <li>{t('contactUs')}</li>
              <li>{t('blog')}</li>
              <li>{t('sitemap')}</li>
            </ul>
          </div>

          {/* Column 3: Certificates and Courses */}
          <div className="md:mt-[200px] mt-10 flex flex-col items-center text-center">
            <span className="lg:mb-5">{t('certificatesAndCourses')}</span>
            <ul>
              {categories .slice(0, 5).map((category) => (
                <li key={category.CategoryID} className="relative px-4 py-2 cursor-pointer" onClick={handleCategoryClick}>
                  <Link to={`/courses/${category.CategoryID}/courses`}>{category.CategoryName }</Link>
                </li>
              ))}
              <li>
              <Link to="/AllCategories" onClick={handleCategoryClick}>عرض الكل </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Other Information */}
          <div className="md:mt-[200px] mt-10 flex flex-col items-center text-center">
            <span className="lg:mb-5">{t('otherInfo')}</span>
            <ul className="flex flex-col gap-3">
              <li>{t('newsletter')}</li>
              <li>{t('traineeFeedback')}</li>
              <li>{t('faq')}</li>
              <li>{t('privacyPolicyUsage')}</li>
              <li>{t('privacyPolicy')}</li>
              <li>{t('legalDisclaimer')}</li>
            </ul>
          </div>

          {/* Column 5: Training Methods */}
          <div className="md:mt-[200px] mt-10 flex flex-col items-center text-center">
            <span className="mb-5">{t('trainingMethods')}</span>
            <ul className="flex flex-col gap-3">
              <li>{t('partnersAffiliation')}</li>
              <li>{t('trainerTravelsToMe')}</li>
              <li>{t('privateCourse')}</li>
              <li>{t('remoteTrainingInstitute')}</li>
              <li>{t('onlineTraining')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Supervised By, Logos, and Social Icons */}
        <div className="flex lg:justify-between lg:flex-row flex-col my-10">
          {/* Supervised By Section */}
          <div>
            <span>{t('supervisedBy')}</span>
            <div className="bg-white p-2 rounded-lg my-5 w-[10rem] md:w-auto">
              <img src={footerlogo1} alt={t('supervisedByLogoAlt')} />
            </div>
          </div>

          {/* Logos Section */}
          <div>
            <span>{t('supervisedBy')}</span>
            <div className="my-5 flex flex-wrap justify-center md:gap-3 gap-1">
              <img src={img1} alt={t('logo1Alt')} />
              <img src={img2} alt={t('logo2Alt')} />
              <img src={img3} alt={t('logo3Alt')} />
              <img src={img4} alt={t('logo4Alt')} />
              <img src={img5} alt={t('logo5Alt')} />
              <img src={img6} alt={t('logo6Alt')} />
            </div>
          </div>

          {/* Social Icons Section */}
          <div className="flex flex-col">
            <span className="mb-5">{t('followUs')}</span>
            <div className="flex justify-center gap-3">
            <a href=""><img src={img7} alt={t('socialIcon1Alt')} /></a>
              <a to="https://www.facebook.com/abadnets"><img src={img8} alt={t('socialIcon2Alt')} /></a> 
              <a href="https://www.instagram.com/abadnet/#"><img src={img9} alt={t('socialIcon3Alt')} /></a>
              <a href=""><img src={img10} alt={t('socialIcon4Alt')} /></a>
              <a href=""><img src={img11} alt={t('socialIcon5Alt')} /></a>
              <a href="https://x.com/abadnet"><img src={img12} alt={t('socialIcon6Alt')} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center h-16 bg-white flex items-center justify-center">
        <span className="text-[#011b70]">{t('copyright')}</span>
      </div>
    </footer>
  );
}