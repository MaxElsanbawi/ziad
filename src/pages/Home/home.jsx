import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import CategoryCard from "../../components/CateCard";
import CourseCard from "../../components/CourseCard";
import SimpleSlider from "../../components/SimpleSlider";
// Import images if using the src folder
import heroImg from "../../../public/hero-img.png";
import iconBox from "../../../public/icon-box.png";
import hdafLogo from "../../../public/hdaf-logo.png";
import courseIcon1 from "../../../public/course-icon1.png";
import courseIcon2 from "../../../public/course-icon2.png";
import courseIcon3 from "../../../public/course-icon3.png";
import courseIcon4 from "../../../public/course-icon4.png";
import courseIcon5 from "../../../public/course-icon5.png";
import courseIcon6 from "../../../public/course-icon6.png";
import WhatsAppButton from "../../components/WhatsApp";
import OffersPage from "../../components/Offers";
import OurPartners from "../../components/OurPartnersr";

// Reusable component for scroll animations
const AnimatedSection = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  console.log(localStorage);
  return (
    <>
      <main className="flex flex-col  mx-auto bg-[#f9fafc] " dir={i18n.dir()}>
        {/* Hero Section */}
        <section
          className="bg-hero bg-cover bg-no-repeat bg-bottom h-auto w-full py-20"
          style={{
            transform: i18n.dir() === "rtl" ? "scaleX(-1)" : "none", // Mirror effect for RTL
          }}
        >
          <div
            className="container flex lg:flex-nowrap flex-wrap lg:flex-row md:flex-col mx-auto"
            style={{
              transform: i18n.dir() === "rtl" ? "scaleX(-1)" : "none", // Flip content back for RTL
            }}
          >
            <div className="flex flex-col lg:w-1/2 text-white md:mr-16 pb-8">
              <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:text-6xl md:text-5xl text-4xl font-semibold">
                {t("hero.title1")}
              </motion.h1>
              <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="lg:text-6xl md:text-5xl text-4xl font-semibold mt-7">
                {t("hero.title2")}
              </motion.h1>
              <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="lg:text-4xl text-3xl font-medium my-7">
                {t("hero.subtitle")}
              </motion.h1>
              <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="text-4xl mb-7 font-medium">
                {" "}
                {t("hero.InvestinyourFuture")}{" "}
              </motion.h1>
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0 }} className="bg-[#0fcec9] w-[180px] py-2 rounded-lg shadow-lg">
                {t("hero.cta")}
              </motion.button>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }} className="flex lg:w-1/2 justify-center items-center">
              <img src={heroImg} alt="Hero" className="w-[480px] pt-5 pb-64" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <AnimatedSection className="container mx-auto flex flex-wrap items-center justify-center lg:mb-20 z-20 mt-[-200px] lg:gap-36  gap-20">
          <div className="flex bg-white w-[280px] shadow-lg rounded-2xl flex-col items-center sm:mb-2  font-medium py-10 ">
            <img src={iconBox} alt="Icon Box" className="w-[110px]" />
            <p className="mt-6 text-[#011B70] text-lg">{t("features.onlineCourses")}</p>
          </div>
          <div className="flex bg-white w-[280px] shadow-lg rounded-2xl flex-col items-center font-medium py-10 ">
            <img src={hdafLogo} alt="HDAF Logo" className="w-[160px]" />
            <p className="mt-6 text-[#011B70] text-lg">{t("features.supportedByHDAF")}</p>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection className="container flex flex-nowrap lg:flex-wrap lg:flex-row flex-col text-[#011b70] mx-auto items-center overflow-hidden">
          <div className="lg:w-2/6 md:w-2/4 w-full relative h-[280px] flex justify-center items-center overflow-hidden">
            <div className="absolute inset-0 bg-contain bg-mask bg-center bg-no-repeat animate-spinSlow overflow-hidden pe-50"></div>
            <div className="relative z-10 text-2xl text-blue-900 font-bold">
              <h1>{t("proud")}</h1>
            </div>
          </div>
          <div className="lg:w-4/6 md:w-2/4 w-full flex flex-col justify-center lg:text-2xl items-center gap-10">
            <div className="flex text-center gap-6">
              <div className="ml-10 flex flex-col justify-center items-center">
                <h2 className="font-bold">+50,600</h2>
                <h3 className="">{t("stats.trainees")}</h3>
              </div>
              <div className="my-auto bg-[#0ecccc] w-[3px] h-16"></div>
              <div className="mr-10 flex flex-col justify-center items-center">
              <h2 className="font-bold">+50,600</h2>
                <h3>{t("stats.trainingSessions")}</h3>
              </div>
            </div>
            <div className="flex text-center gap-6">
              <div className="ml-10 flex flex-col justify-center items-center">
              <h2 className="font-bold">+50,600</h2>
                <h3>{t("stats.TrainingProgram")}</h3>
              </div>
              <div className="my-auto bg-[#0ecccc] w-[3px] h-16"></div>
              <div className="mr-10 flex flex-col justify-center items-center">
              <h2 className="font-bold">+50,600</h2>
                <h3>{t("stats.BeneficiaryOrigin")}</h3>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Categories Section */}
        <AnimatedSection className="container mx-auto text-[#011b70] font-semibold rounded-2xl text-xl">
          <div className="flex my-10">
            <h2>{t("categories")}</h2>
          </div>
          <motion.div 
            className="grid lg:grid-cols-3 md:grid-cols-2 gap-x-10 lg:gap-y-24 gap-y-9"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {[courseIcon1, courseIcon2, courseIcon3, courseIcon4, courseIcon5, courseIcon6].map((icon, index) => (
              <motion.div key={index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <CategoryCard
                  imgUrl={icon}
                  text={t([
                    "certificatesAndCourses",
                    "onlineCourses",
                    "trainingMethods",
                    "partnersAndAffiliation",
                    "academicIntegrity",
                    "technicalSupport"
                  ][index])}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="flex justify-center items-center">
          <div className="w-[70%]">
            <OffersPage/>
          </div>
        </AnimatedSection>

        {/* Monthly Courses Section */}
        <AnimatedSection
          id="monthlyCourses"
          className="container mx-auto text-[#011b70] mt-20"
        >
          <CourseCard />
        </AnimatedSection>
        {/* Clients Section */}
        <AnimatedSection className="container mx-auto text-[#011b70] mt-20 ">
          <div className="flex w-full my-10 text-center justify-center items-center">
            <h2 className="bg-white px-8 py-2 rounded-lg shadow-xl font-semibold">
              {t("clients")}
            </h2>
          </div>
          <SimpleSlider />
        </AnimatedSection>

        {/* Partners Section */}
        <AnimatedSection className="container mx-auto ff text-[#011b70] mt-20 mb-8">
          <div className="flex w-full my-10 text-center justify-center items-center">
            <h2 className="bg-white px-8 py-2 rounded-lg shadow-xl font-semibold">
              {t("partners")}
            </h2>
          </div>
          <OurPartners/>
        </AnimatedSection>

        {/* Footer Section */}
        <section className="container flex 1 text-[#011b70] mx-auto items-center opacity-45 z-50">
          <div className="w-3/4 flex z-0"></div>
          <div className="w-1/3 mr-[200px] relative h-[300px] mb-[-250px] flex justify-center items-center z-0">
            <div className="absolute inset-0 bg-mask bg-contain bg-center bg-no-repeat animate-spinSlow z-0 overflow-hidden mb-[-19rem] sm:mb-5"></div>
          </div>
        </section>
        <WhatsAppButton/>
      </main>
    </>
  );
}
