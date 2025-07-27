import { useEffect, useState } from "react";
import WhatsAppButton from "../../components/WhatsApp";

export default function ContactPage() {
  const [code, setCode] = useState("");
  const [randomCode, setRandomCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    generateRandomCode();
  }, []);

  const generateRandomCode = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // يولد رقم عشوائي مكون من 5 أرقام
    setRandomCode(randomNumber.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === randomCode) {

    } else {
      setMessage("تحقق مرة أخرى، قد تكون روبوتًا.");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8">التصل بنا</h1>
        <p className="text-center mb-8">هل لديك استفسار؟ اقتراحات أو شكاوى</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">معلومات الاتصال</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  الاسم
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  أدخل الكود{" "}
                </label>
                <input
                  type="text"
                  placeholder="أدخل الكود هنا"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {randomCode}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                إرسال
              </button>
              
            </div>{message && <p className="mt-4 text-center">{message}</p>}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">تفاصيل الاتصال</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  منسق التدريب الخارجي و الشركات
                </p>
                <p className="text-sm font-medium">أراض إبراهيم: 0581627503</p>
                <p className="text-sm font-medium">ramje@abadnet.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  منسق الشهادات الحكومية و الوظائف
                </p>
                <p className="text-sm font-medium">أ- حسن الشمري: 0542509116</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">للتسجيل والاستفسارات</p>
                <p className="text-sm font-medium">عبدالله: 0507189889</p>
                <p className="text-sm font-medium">
                  أ- أحمد الكثير: 0541457482
                </p>
                <p className="text-sm font-medium">
                  أ- أشرف الحزاري: 0595688312
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">كيفية الوصول؟</h2>
          <p className="text-sm text-gray-600">
            الرياض، الرمضة، شارع بن شاهين، مقابل هاشم الرمضة
          </p>
          <p className="text-sm text-gray-600">
            المملكة العربية السعودية (SA) 13213
          </p>
          <p className="text-sm text-gray-600">info@abadnet.com.sa</p>
        </div>
      </div>
      <WhatsAppButton/>
    </div>
  );
}
