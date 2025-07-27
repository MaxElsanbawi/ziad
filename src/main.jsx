// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./scrollbar.css";

import NotFound from "./pages/notFound";
import ProtectedRoute from "./ProtectedRoute"; // Adjust the path as necessary
import { AuthProvider } from "./AuthContext";
import Home from "./pages/Home/home";
import Layout from "./layout/Layout"
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import ContactInfo from "./pages/Contant/ContantInfo";
import ContactPage from "./pages/Contactpage/ContactPage";
import Technical from "./pages/about/technical-support";
import Academic from "./pages/about/academic-integrity-policies-and-laws";
import Teams from "./pages/about/terms-conditions";
import Attendance from "./pages/about/attendance-policy";
import LegalPage from "./pages/about/principles-of-intellectual";
import TechnicalSupport from "./pages/about/TechnicalSupport";
import VerificationSystem from "./pages/about/VerificationSystem";
import TraineeVerificationMechanism from "./pages/about/TraineeVerificationMechanism";
import AbadNetInfo from "./pages/about/content-is-up-to-date";
import RolesAndResponsibilities from "./pages/about/roles-and-responsibilities-document";
import CategoryCoursesPage from "./pages/CourseDetails/CategoryCoursesPage";
import TechnicalSpecifications from "./pages/about/TechnicaSpecifications";
import PartnersAndAffiliation from "./pages/Training methods/Partners and affiliation";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import AllCategories from "./pages/CourseDetails/AllCategories";
import RegisterForm from "./pages/users/RegisterForm";
import LoginPage from "./pages/users/Login";
import ProfilePage from "./pages/users/ProfilePage";
import ForgotPasswordPage from "./pages/users/ForgotPassword";
import VerifyOTPPage from "./pages/users/VerfyCode";
import ResetPasswordPage from "./pages/users/ResetPassword";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            <Route path="ContactInfo" element={<ContactInfo />} />
            <Route path="LoginPage" element={<LoginPage />} />
            <Route path="ContactPage" element={<ContactPage />} />
            <Route path="Technical" element={<Technical />} />
            <Route path="Academic" element={<Academic />} />
            <Route path="Attendance" element={<Attendance />} />
            <Route path="Teams" element={<Teams />} />
            <Route path="LegalPage" element={<LegalPage />} />
            <Route path="TechnicalSupport" element={<TechnicalSupport />} />
            <Route path="VerificationSystem" element={<VerificationSystem />} />
            <Route path="TraineeVerificationMechanism" element={<TraineeVerificationMechanism />} />
            <Route path="content-is-up-to-date" element={<AbadNetInfo />} />
            <Route path="roles-and-responsibilities-document" element={<RolesAndResponsibilities />} />
            <Route path="/courses/:categoryId/courses" element={<CategoryCoursesPage />} />
            <Route path="system-technical-specification-document" element={<TechnicalSpecifications />} />
            <Route path="PartnersAndAffiliation" element={<PartnersAndAffiliation />} />      
            <Route path="/AllCategories" element={<AllCategories />} />
            <Route path="/RegisterForm" element={<RegisterForm />} />
            <Route path="/ResetPassword" element={<ResetPasswordPage />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
            <Route path="/VerifyOTPPage" element={<VerifyOTPPage />} />
        


          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <I18nextProvider i18n={i18n}>
    <App />   </I18nextProvider>,
  </StrictMode>
);
