import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrationModal = ({ isOpen, onClose, courseId }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    NationalId: '',
    phonenumber: '',
    location: '',
    Language: 'عربي',
    Write_an_inquiry: '',
    status: 'Pending',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  
  // Generate verification code when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
      setVerificationCode(randomCode);
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullname || !formData.email || !formData.phonenumber || !formData.NationalId) {
      alert('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    if (enteredCode !== verificationCode) {
      alert('رمز التحقق غير صحيح.');
      return;
    }

    setIsSubmitting(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      ...formData,
      CourseID: courseId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://backend.camels.center/api/registrations", requestOptions);
      const result = await response.json();
      
      if (response.ok) {
        alert('تم التسجيل بنجاح!');
        onClose(); // Close modal on success
        // Optionally reset form
        setFormData({
            fullname: '', email: '', NationalId: '', phonenumber: '',
            location: '', Language: 'عربي', Write_an_inquiry: '', status: 'Pending',
        });
      } else {
        alert(`حدث خطأ في التسجيل: ${result.message || 'يرجى المحاولة مرة أخرى'}`);
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert('حدث خطأ في الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { 
      y: "0", 
      opacity: 1,
      transition: { delay: 0.2, type: "spring", stiffness: 120 }
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            variants={modal}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#011B7D]">سجل الآن</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Inputs */}
              <div className="flex flex-col">
                <label className="text-right text-sm font-bold mb-1">الاسم الرباعي</label>
                <input type="text" value={formData.fullname} onChange={e => handleInputChange('fullname', e.target.value)} className="w-full border-2 border-[#4B55A1] rounded-lg p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="text-right text-sm font-bold mb-1">البريد الإلكتروني</label>
                <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full border-2 border-[#4B55A1] rounded-lg p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="text-right text-sm font-bold mb-1">رقم الهوية</label>
                <input type="text" value={formData.NationalId} onChange={e => handleInputChange('NationalId', e.target.value)} className="w-full border-2 border-[#4B55A1] rounded-lg p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="text-right text-sm font-bold mb-1">رقم الجوال</label>
                <input type="text" value={formData.phonenumber} onChange={e => handleInputChange('phonenumber', e.target.value)} className="w-full border-2 border-[#4B55A1] rounded-lg p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="text-right text-sm font-bold mb-1">المنطقة</label>
                <input type="text" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} className="w-full border-2 border-[#4B55A1] rounded-lg p-2" />
              </div>
              <div className="flex flex-col">
                <label className="text-right text-sm font-bold mb-1">اللغة</label>
                <select value={formData.Language} onChange={e => handleInputChange('Language', e.target.value)} className="w-full border-2 border-[#4B55A1] rounded-lg p-2">
                  <option value="عربي">عربي</option>
                  <option value="English">English</option>
                </select>
              </div>
              
              {/* Textarea */}
              <div className="md:col-span-2 flex flex-col">
                <label className="text-right text-sm font-bold mb-1">استفسار (اختياري)</label>
                <textarea value={formData.Write_an_inquiry} onChange={e => handleInputChange('Write_an_inquiry', e.target.value)} className="w-full border-2 border-[#4B55A1] rounded-lg p-2 min-h-[80px]"></textarea>
              </div>

              {/* Verification Code */}
              <div className="md:col-span-2 flex flex-col items-center gap-2 mt-4">
                 <label className="text-right text-sm font-bold">ادخل الكود</label>
                 <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                    <span className="bg-[#4B55A1] text-white font-extrabold text-2xl rounded-lg px-8 py-2 tracking-widest">
                        {verificationCode}
                    </span>
                    <input
                        type="text"
                        placeholder="ادخل الكود هنا"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        className="w-full border-2 border-[#4B55A1] rounded-lg p-2 text-center text-xl font-bold"
                        required
                    />
                 </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-center mt-6">
                <button type="submit" disabled={isSubmitting} className="w-full md:w-1/2 bg-[#4B55A1] text-white font-bold rounded-lg px-8 py-3 text-xl hover:bg-[#374285] transition disabled:opacity-50">
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal; 