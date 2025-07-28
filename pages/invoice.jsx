import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoicePage = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    coursePrice: 0,
    payment: 0,
    taxRate: 15,
    discountRate: 0,
    registration_id: '12345',
    invoice_number: '',
    student_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    startDate: new Date().toISOString().slice(0, 10),
    date: new Date().toISOString().slice(0, 10),
    paymentType: 'شيك',
    transactionId: '',
  });
  const [printMode, setPrintMode] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const taxAmount = (formData.coursePrice * (formData.taxRate / 100)).toFixed(2);
  const totalPaymentAfterTaxes = parseFloat(formData.coursePrice) + parseFloat(taxAmount);
  const discountAmount = (totalPaymentAfterTaxes * (formData.discountRate / 100)).toFixed(2);
  const totalPayment = (totalPaymentAfterTaxes - discountAmount).toFixed(2);
  const balance = (totalPayment - formData.payment).toFixed(2);

  const handleSubmit = async () => {
    // Logic to save the invoice
    console.log('Saving invoice:', formData);
  };

  const generatePDF = () => {
    setPrintMode(true);
    setTimeout(() => {
      const input = document.getElementById('invoice-content');
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice.pdf');
        setPrintMode(false);
      });
    }, 500);
  };

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

          {/* Course Price */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              سعر الدورة / Course Price
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.coursePrice || '0'}
              </span>
            ) : (
              <input
                type="number"
                value={formData.coursePrice}
                onChange={e => handleInputChange('coursePrice', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32 text-center"
              />
            )}
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

          {/* Balance */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              الباقي / Balance
            </label>
            <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
              {balance || '0'}
            </span>
            <span className="text-sm text-gray-600 w-8">SAR</span>
          </div>

          {/* Student ID */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              رقم الطالب / Student ID
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.registration_id}
              </span>
            ) : (
              <input
                type="text"
                value={formData.registration_id || ''}
                readOnly
                className="border border-gray-300 rounded px-3 py-2 w-32 text-center bg-gray-100"
              />
            )}
          </div>
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
                {formData.invoice_number || ' '}
              </span>
            ) : (
              <input
                type="text"
                value={formData.invoice_number || ''}
                readOnly
                className="border border-gray-300 rounded px-3 py-2 w-40 text-center bg-gray-100"
              />
            )}
          </div>

          {/* Student Name */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              اسم الطالب / Student Name
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-40 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.student_name || ' '}
              </span>
            ) : (
              <input
                type="text"
                value={formData.student_name || ''}
                readOnly
                className="border border-gray-300 rounded px-3 py-2 w-40 text-center bg-gray-100"
              />
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              البريد الإلكتروني / E-mail
            </label>
            {printMode ? (
              <span className="px-3 py-2 flex-1 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.email || ' '}
              </span>
            ) : (
              <input
                type="email"
                value={formData.email || ''}
                readOnly
                className="border border-gray-300 rounded px-3 py-2 flex-1 text-center bg-gray-100"
              />
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              رقم الجوال / Cell Phone
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-40 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.phone || ' '}
              </span>
            ) : (
              <input
                type="tel"
                value={formData.phone || ''}
                readOnly
                className="border border-gray-300 rounded px-3 py-2 w-40 text-center bg-gray-100"
              />
            )}
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1 text-right">
              تاريخ البدء / Start Date
            </label>
            {printMode ? (
              <span className="px-3 py-2 w-32 text-center inline-block border border-gray-200 bg-gray-50 rounded">
                {formData.startDate || ' '}
              </span>
            ) : (
              <input
                type="text"
                value={formData.startDate}
                onChange={e => handleInputChange('startDate', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-32 text-center"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 text-right">التاريخ / Date:</h3>
          {printMode ? (
            <span className="border border-gray-200 bg-gray-50 rounded px-3 py-2 w-full text-center inline-block">
              {formData.date || ' '}
            </span>
          ) : (
            <input
              type="text"
              value={formData.date}
              onChange={e => handleInputChange('date', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-center"
            />
          )}

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
        <select className="border border-gray-300 rounded px-3 py-2 text-sm mb-2">
          <option>اختيار المطبوعات</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          حفظ الفاتورة
        </button>
        <button
          onClick={generatePDF}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          تحميل الفاتورة PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
