import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import WhatsAppButton from "../../components/WhatsApp";
const ContactInfo = () => {
  const { t, i18n } = useTranslation();
  const [verificationCode, setVerificationCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    i18n.changeLanguage("ar");
    // Generate random 5-digit code
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    setVerificationCode(randomCode);
  }, [i18n]);

  const handleVerification = (e) => {
    const input = e.target.value;
    setUserInput(input);
    setIsVerified(input === verificationCode);
  };

  const mainBlue = "#193479";

  return (
    <div dir={i18n.dir()} className="bg-[#F9FAFC] min-h-screen py-8 px-2 ">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ color: mainBlue }}>
          لا تتردد في الاتصال بنا،
        </h2>
        <p className="text-lg" style={{ color: mainBlue }}>
          سنكون سعداء جدا لمساعدتك
        </p>
      </div>

      <div className="container mx-auto max-w-6xl flex flex-col justify-center items-center">
        {/* Contact Info Cards */}
        <div className="flex flex-col md:flex-row md:grid-cols-3 gap-5 items-center justify-center mb-8 w-full">
        <div className="flex flex-col items-center w-full lg:w-1/3 ">
        <div className="bg-white p-6 flex flex-col items-center text-center h-80 w-full md:w-60 ">
        <span className="text-4xl mb-2 text-gray-500">✉️</span>
          <div className="font-bold text-lg mb-1 text-gray-500">البريد الالكتروني</div>
          <a
            href="mailto:info@abadnet.com.sa"
            className="underline"
            style={{ color: mainBlue }}
          >
            info@abadnet.com.sa
          </a>
        </div></div>
        {/* Address */}
        <div className="flex flex-col items-center w-full lg:w-1/3 ">
        <div className="bg-transparent rounded-xl flex flex-col justify-center items-center h-80 w-full md:w-60 border border-black text-gray-800 p-6 text-center">
          <span className="text-4xl  text-gray-500">📍</span>
          <div className="font-bold text-lg mb-1 text-gray-500">العنوان</div>
          <div className="text-sm text-gray-500">
            الرياض، الروضة، شارع ابن شاهين، المملكة العربية السعودية <br />
            (SA) 13213
          </div>
        </div>
        </div>
       
        {/* WhatsApp */}
        <div className="flex flex-col items-center w-full lg:w-1/3 ">
        <div className="bg-transparent text-gray-500 rounded-xl h-80 w-full md:w-60 border border-black p-6 flex flex-col items-center text-center">
        <FontAwesomeIcon icon={faWhatsapp} className="text-4xl  mb-2" />

          <div className="font-bold text-lg mb-1">واتساب</div>
          <div className="text-xl font-bold mb-2">054 145 7482</div>
          <button
            className="text-white px-4 py-1 rounded mt-2"
            style={{ backgroundColor: mainBlue }}
          >
            لحفظ المحادثة
          </button>
        </div>
        </div>
      </div>
</div>

<div className="container mx-auto max-w-6xl flex flex-col justify-center items-center">  
    <div className="flex flex-col md:flex-row md:grid-cols-3 gap-5 items-center justify-center mb-8 w-full">
        {/* Registration & Consultation */}
<div className="flex flex-col items-center w-full lg:w-1/3">

<div className="bg-transparent rounded-xl border border-black p-6 h-80 w-full md:w-60 text-gray-500 text-center">
          <div className="font-bold mb-2 mt-5">للتسجيل والاستشارات</div>
          <div>أ. عبدالله: 0507188989</div>
          <div>أ. أحمد الفني: 0541457482</div>
          <div>أ. أشرف العتاري: 0595688312</div>
        </div>
</div>
        {/* External Training Coordinator */}
        <div className="flex flex-col items-center w-full lg:w-1/3 ">
        <div className="bg-transparent rounded-xl border border-black h-80 w-full md:w-60 p-6 text-center text-gray-500 ">
          <div className="font-bold mb-2 text-gray-500">منسق التدريب الخارجي والشركات</div>
          <div className="text-gray-500" >أ. محمود فهمي: 0582746551<br />m.fahim@abadnet.com.sa</div>
          <div className="text-gray-500">أ. ابراهيم: 0581627503<br />rami@abadnet.com.sa</div>

          <div>منسق المعلومات الصحفية والشكاوى<br />أ. حسن المحمدي: 0542509116</div>
        </div></div>
        {/* Working Hours */}
        <div className="flex flex-col items-center w-full lg:w-1/3 ">
        <div className="bg-transparant rounded-xl border h-80 w-full md:w-60 border-black p-6 text-center flex flex-col items-center">
          <span className="text-3xl mb-2 ">🗓️</span>
          <div className="font-bold mb-2 text-gray-500">مواعيد العمل</div>
          <div className="text-gray-500">
            الأحد - الخميس: 09:00 ص - 09:00 م<br />
            الجمعة: 02:00 م - 09:00 م<br />
            السبت: 02:00 م - 09:00 م
          </div>
        </div></div>
      </div>
      </div>  
      {/* Map and Form Section */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
         {/* Form */}
         <div className="flex-1 rounded-xl p-6 w-full">
          <h3
            className="text-lg font-bold mb-4 text-center"
            style={{ color: mainBlue }}
          >
            هل لديك استفسار ؟ والاقتراحات والشكاوي
          </h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="الاسم الرباعي كامل"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              style={{ borderColor: mainBlue }}
            />
            <input
              type="text"
              placeholder="رقم الجوال"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              style={{ borderColor: mainBlue }}
            />
            <input
              type="email"
              placeholder="البريد الالكتروني"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              style={{ borderColor: mainBlue }}
            />
            <div className="relative w-full mb-2">
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#4B55A1] text-white font-extrabold text-base rounded-lg px-4 py-1 ml-2"
                style={{ letterSpacing: '2px', minWidth: '70px', textAlign: 'center' }}
              >
                {verificationCode}
              </span>
              <input
                type="text"
                placeholder="ادخل الكود"
                className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none p-28`}
                value={userInput}
                onChange={handleVerification}
                maxLength={5}
                style={{ letterSpacing: '2px', color: '#193479' }}
              />
            </div>
            {userInput && !isVerified && (
              <p className="text-red-500 text-sm mt-1">الكود غير صحيح</p>
            )}
            {isVerified && (
              <p className="text-green-500 text-sm mt-1">تم التحقق بنجاح</p>
            )}
            <textarea
              placeholder="اكتب استفسارك او اقتراحك او الشكوى"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              rows={3}
              style={{ borderColor: mainBlue }}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="reset"
                className="px-6 py-1 border rounded hover:bg-gray-100"
                style={{ borderColor: mainBlue, color: mainBlue }}
              >
                حذف
              </button>
              <button
                type="submit"
                className="px-6 py-1 text-white rounded"
                style={{ backgroundColor: mainBlue }}
              >
                إرسال
              </button>
            </div>
          </form>
        </div>
        {/* Map */}
        <div className="flex-1 mb-8 lg:mb-0 w-full">
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1811.7687450926771!2d46.765532!3d24.742754!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f019f2e6aeb79%3A0x6e3ce4e617b5cb9c!2sAbadnet%20Institute%20for%20Training!5e0!3m2!1sen!2sus!4v1738863725858!5m2!1sen!2sus"
            width="100%"
            height="500"
            style={{ border: 0, borderRadius: "0.75rem" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
       
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default ContactInfo;