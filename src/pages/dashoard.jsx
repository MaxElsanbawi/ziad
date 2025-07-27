import React, { useContext } from 'react';
import { Users, CreditCard, Package, Activity, BarChart2, PieChart, Clock, Settings } from 'lucide-react';
import { CourseContext } from './context/DashoaedContexr';

const Dashboard = () => {
  const { totalCourses } = useContext(CourseContext);
  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-primary p-3 rounded-full text-white">
            <Users size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">إجمالي المستخدمين</h2>
            <p className="text-2xl font-bold">1,234</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-secondary p-3 rounded-full text-white">
            <CreditCard size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">إجمالي الإيرادات</h2>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-primary p-3 rounded-full text-white">
            <Package size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary"  >إجمالي المشاريع</h2>
            <p className="text-2xl font-bold">{totalCourses}</p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-secondary p-3 rounded-full text-white">
            <Activity size={24} />
          </div>
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-primary">المشاريع النشطة</h2>
            <p className="text-2xl font-bold">89</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">مبيعات الشهر</h2>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <BarChart2 size={48} className="text-gray-400" />
            <p className="text-gray-500">رسم بياني توضيحي</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">توزيع المبيعات</h2>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <PieChart size={48} className="text-gray-400" />
            <p className="text-gray-500">رسم بياني دائري</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-primary">النشاطات الأخيرة</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Clock size={20} className="text-primary" />
                <p className="mr-2">تم تسجيل دخول مستخدم جديد</p>
              </div>
              <p className="text-sm text-gray-500">منذ 5 دقائق</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Settings, text: 'إعدادات النظام' },
          { icon: Users, text: 'إدارة المستخدمين' },
          { icon: Package, text: 'إدارة الطلبات' },
          { icon: Activity, text: 'تقارير النشاط' },
        ].map((action, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
            <action.icon size={24} className="text-primary" />
            <p className="mr-2 text-primary">{action.text}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;