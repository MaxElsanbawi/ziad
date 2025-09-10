import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { toast, ToastContainer } from 'react-toastify';

export default function StudentInvoice() {
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    RegistrationID: '',
    Registrationpn: '',
    CourseID: '',
    coursePrice: 0,
    taxRate: 0,
    discountRate: 0,
    payment: 0,
    balance: 0,
    studentId: '',
    invoiceNumber: '',
    studentName: '',
    email: '',
    phone: '',
    startDate: new Date().toLocaleDateString(),
    date: new Date().toLocaleDateString(),
    paymentType: 'نقد',
    transactionId: '',
    existingInvoice: null
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });
  const [printMode, setPrintMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetInvoice = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://phpstack-1509731-5843882.cloudwaysapps.com/api/invoices");
        const allInvoices = await response.json();

        if (state?.RegistrationID) {
          const foundInvoice = allInvoices.find(
            inv => inv.registration_id == state.RegistrationID
          );
          if (foundInvoice) {
            setFormData(prev => ({
              ...prev,
              ...state,
              ...foundInvoice,
              balance: foundInvoice.balance || 0,
              startDate: state.coursesdays ? new Date(state.coursesdays).toLocaleDateString() : prev.startDate,
              existingInvoice: foundInvoice
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              ...state,
              balance: 0,
              startDate: state.coursesdays ? new Date(state.coursesdays).toLocaleDateString() : prev.startDate,
              existingInvoice: null
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast.error("حدث خطأ في جلب بيانات الفاتورة", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          rtl: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetInvoice();
  }, [state]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getValue = (key) => {
    return formData[key] !== undefined && formData[key] !== null && formData[key] !== ''
      ? Number(formData[key])
      : 0;
  };

  const coursePrice = getValue('coursePrice');
  const taxRate = getValue('taxRate');
  const discountRate = getValue('discountRate');
  const payment = getValue('payment');

  const taxAmount = (coursePrice * taxRate / 100) || 0;
  const discount = (coursePrice * discountRate / 100) || 0;
  const totalPayment = (coursePrice + taxAmount - discount) || 0;
  const calculatedBalance = (totalPayment - payment) || 0;

  const generatePDF = async () => {
    setPrintMode(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 10,
      filename: `invoice_${formData.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setPrintMode(false);
    }
  };

  const saveInvoice = async () => {
    setIsSaving(true);
    setSaveMessage({ text: '', type: '' });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "registration_id": formData.RegistrationID,
      "CourseID": formData.CourseID,
      "payment": formData.payment,
      "tax_rate": formData.taxRate,
      "discount_rate": formData.discountRate,
      "payment_type": formData.paymentType,
      "transaction_id": formData.transactionId,
      "course_price": coursePrice,
      "balance": calculatedBalance
    });

    try {
      let response;
      if (formData.existingInvoice) {
        response = await fetch(`https://phpstack-1509731-5843882.cloudwaysapps.com/api/invoices/${formData.RegistrationID}`, {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        });
      } else {
        response = await fetch("https://phpstack-1509731-5843882.cloudwaysapps.com/api/invoices", {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        });
      }

      const result = await response.json();
      
      if (response.ok) {
        toast.success(formData.existingInvoice ? "تم تحديث الفاتورة بنجاح!" : "تم إنشاء الفاتورة بنجاح!", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          rtl: true,
        });
        setFormData(prev => ({ ...prev, existingInvoice: result, balance: result.balance || 0 }));
      } else {
        throw new Error(result.message || 'Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      setSaveMessage({ text: `خطأ في حفظ الفاتورة: ${error.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 font-sans" dir="rtl" id="invoice-content">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="text-right">
          <h1 className="text-xl font-bold text-gray-800">شبكة أباد للتدريب</h1>
          <p className="text-sm text-gray-600">Abadnet Training & Development</p>
          <p className="text-xs text-gray-500">P.O.Box 110298 | Riyadh 11465 | Saudi Arabia</p>
          <p className="text-xs text-gray-500">T: +966 1 4781299 | M: +966 533155640</p>
        </div>
        <div className="text-left">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">ABAD</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-200 rounded-t-lg mb-6">
        {['Abadnet', 'Abadnet', 'Abadnet', 'Abadnet', 'Abadnet', 'Abadnet', 'Abadnet'].map((tab, index) => (
          <button
            key={index}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-300 first:rounded-tr-lg last:rounded-tl-lg"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Save message */}
      {saveMessage.text && (
        <div className={`mb-4 p-3 rounded ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {saveMessage.text}
        </div>
      )}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Course Details */}
        <div className="space-y-4">
          {/* Course Name */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              اسم الدورة / Course
            </label>
            {printMode ? (
              <span className="px-3 py-2 flex-1 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.courseName || ' '}
              </span>
            ) : (
              <input
                type="text"
                value={formData.courseName}
                onChange={e => handleInputChange('courseName', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1 text-center"
              />
            )}
            <span className="text-sm text-gray-600 w-8">شهادة</span>
          </div>

          {/* Course Code */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              كود الدورة / Course Code
            </label>
            {printMode ? (
              <span className="px-3 py-2 flex-1 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.courseCode || ' '}
              </span>
            ) : (
              <input
                type="text"
                value={formData.courseCode}
                onChange={e => handleInputChange('courseCode', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1 text-center"
              />
            )}
          </div>
          
          {/* Balance */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              الباقي / Balance
            </label>
            <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {formData.existingInvoice ? formData.balance : calculatedBalance}
            </span>
            <span className="text-sm text-gray-600 w-8">SAR</span>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              المبلغ المدفوع / Payment
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.payment || '0'}
              </span>
            ) : (
              <input
                type="number"
                value={formData.payment}
                onChange={e => handleInputChange('payment', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32 text-center"
              />
            )}
            <span className="text-sm text-gray-600 w-8">SAR</span>
          </div>

          {/* Tax Rate */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              ضريبة القيمة المضافة
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.taxRate || '0'}
              </span>
            ) : (
              <input
                type="number"
                value={formData.taxRate}
                onChange={e => handleInputChange('taxRate', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32 text-center"
              />
            )}
            <span className="text-sm text-gray-600 w-8">%</span>
          </div>

          {/* Tax Amount */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              إجمالي ضريبة القيمة المضافة
            </label>
            <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {taxAmount || '0'}
            </span>
            <span className="text-sm text-gray-600 w-8">SAR</span>
          </div>

          {/* Discount */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              الخصم / Discount
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.discountRate || '0'}
              </span>
            ) : (
              <input
                type="number"
                value={formData.discountRate}
                onChange={e => handleInputChange('discountRate', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32 text-center"
              />
            )}
            <span className="text-sm text-gray-600 w-8">%</span>
          </div>

          {/* Total Payment */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              إجمالي المدفوع / Total Payment
            </label>
            <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {totalPayment || '0'}
            </span>
            <span className="text-sm text-gray-600 w-8">SAR</span>
          </div>

          {/* Course Price */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              سعر الدورة / Course Price
            </label>
            <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {formData.coursePrice || '0'}
            </span>
            <span className="text-sm text-gray-600 w-8">SAR</span>
          </div>

          {/* Student ID */}

        </div>

        {/* Right Column - Student Details */}
        <div className="bg-gray-100 p-4 rounded-lg space-y-4">
          {/* Invoice Number */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              الفاتورة / Invoice
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-40 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.invoiceNumber || ' '}
              </span>
            ) : (
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={e => handleInputChange('invoiceNumber', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-40 text-center"
              />
            )}
          </div>

          {/* Student Name */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              اسم الطالب / Student Name
            </label>
            <span className="px-3 py-2 w-40 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {formData.studentName || ' '}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              البريد الإلكتروني / E-mail
            </label>
            <span className="px-3 py-2 flex-1 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {formData.email || ' '}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              رقم الجوال / Cell Phone
            </label>
            <span className="px-3 py-2 w-40 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {formData.Registrationpn || ' '}
            </span>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              تاريخ البدء / Start Date
            </label>
            <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {formData.startDate || ' '}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 text-right">التاريخ / Date:</h3>
          <span className="border border-gray-200 bg-gray-50 rounded px-3 py-2 w-full text-center inline-block">
            {formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ' '}
          </span>

          <h3 className="font-semibold text-gray-800 text-right">طريقة الدفع / Payment Type:</h3>
          {printMode ? (
            <span className="border border-gray-200 bg-gray-50 rounded px-3 py-2 w-full text-center inline-block">
              {formData.paymentType || ' '}
            </span>
          ) : (
            <select
              value={formData.paymentType}
              onChange={e => handleInputChange('paymentType', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-center"
            >
              <option value="شيك">شيك</option>
              <option value="نقد">نقد</option>
              <option value="بطاقة ائتمان">بطاقة ائتمان</option>
              <option value="تحويل بنكي">تحويل بنكي</option>
            </select>
          )}

          {formData.paymentType === "تحويل بنكي" && (
            <div className="mt-2">
           <h3 className="font-semibold text-gray-800 text-right">المتعامل:</h3>
          {printMode ? (
            <span className="border border-gray-200 bg-gray-50 rounded px-3 py-2 w-full text-center inline-block">
              {formData.transactionId || ' '}
            </span>
          ) : (
            <input
              type="text"
              value={formData.transactionId}
              onChange={e => handleInputChange('transactionId', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-center"
            />
          )}
            </div>
          )}



          <div className="flex gap-2">
            <span className="text-sm text-gray-600">سنة</span>
            <span className="border border-gray-200 bg-gray-50 rounded px-2 py-1 w-16 text-center text-xs inline-block">{new Date().getFullYear()}</span>
            <span className="text-sm text-gray-600">شهر</span>
            <span className="border border-gray-200 bg-gray-50 rounded px-2 py-1 flex-1 text-center text-xs inline-block">{String(new Date().getMonth() + 1).padStart(2, '0')}</span>
            <span className="text-sm text-gray-600">يوم</span>
            <span className="border border-gray-200 bg-gray-50 rounded px-2 py-1 flex-1 text-center text-xs inline-block">{String(new Date().getDate()).padStart(2, '0')}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-black flex items-center justify-center text-white text-xs">
            QR CODE
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            الرقم المرجعي: {formData.transactionId || ' '}
          </p>
        </div>

        {/* Stamp/Seal */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-32 h-32 border-2 border-gray-400 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-600">الختم الرسمي</div>
              <div className="text-xs text-gray-500 mt-2">Official Seal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 text-right mb-2">الشروط والأحكام:</h3>
        <div className="text-sm text-gray-600 space-y-1 text-right">
          <p>1. يجب تسجيل الدورة بشكل مسبق بقدرا صالحة لمدة 24 ساعة من تاريخ الاستلام.</p>
          <p>2. المبلغ المدفوع غير صالح للاسترداد بعد انتهاء 24 ساعة من تاريخ الاستلام.</p>
          <p>3. يستحق المتدرب تلقي شهادة من الجهة المعتمدة في حالة اجتياز الدورة.</p>
          <p>4. يجب على المتدرب الحضور في الوقت المحدد.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center flex flex-col items-center gap-2">

        <div className="flex gap-4">
          <button
            onClick={saveInvoice}
            disabled={isSaving}
            className={`px-4 py-2 rounded text-sm ${isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ الفاتورة'}
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            تحميل الفاتورة PDF
          </button>
        </div>
      </div>
    </div>
  );
}