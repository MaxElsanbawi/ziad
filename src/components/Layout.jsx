import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Home, Users, Settings, BarChart, Dot, Bell, ChevronDown, ChevronUp, Search, User, LogOut, Contact, Package, Map, FileText, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth from your AuthContext

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // Track user dropdown state
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Track if sidebar is minimized
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const location = useLocation(); // Get the current route location
  const { logout, user } = useAuth(); // Use the logout function and user from AuthContext

const [totalPending, setTotalPending] = useState(0);
const [lastSeenCount, setLastSeenCount] = useState(() => {
  // Initialize from localStorage if available
  return parseInt(localStorage.getItem('lastSeenNotifications') || 0);
});
// Calculate unseen notifications
const unseenCount = Math.max(0, totalPending - lastSeenCount);

  const inventorymanagerMenuCamp = [
    { icon: Home, text: 'الكاشير', href: '/' },
    { icon: ShoppingBag, text: 'الطلبات', href: '/orders', 
      subItems: [
        { text: 'طلبات الفرع اليوم', href: '/orders/today' },
        { text: 'طباعة الطلبات', href: '/orders/print' },
      ]},
    { icon: Package, text: 'المخزن', href: '/stock', subItems: [
      { text: 'إضافة منتجات للفرع', href: '/stock/add' },
      { text: 'كل المنتجات', href: '/products' },
      { text: 'أضافة منتج', href: '/products/add' },
    ]},
    { icon: FileText, text: 'المرتجعات', href: '/refunds'},
    { icon: Map, text: 'فرع سيدي بشر', href: '/sidibishr'}
  ]

  const cashierMenu = [
    { icon: Home, text: 'الكاشير', href: '/' },
    { icon: ShoppingBag, text: 'الطلبات', href: '/orders', 
      subItems: [
        { text: 'طلبات الفرع اليوم', href: '/orders/today' },
        { text: 'طباعة الطلبات', href: '/orders/print' },
      ]},
    { icon: Package, text: 'المخزن', href: '/stock'},
    { icon: FileText, text: 'المرتجعات', href: '/refunds'},
    { icon: Map, text: 'فرع سيدي بشر', href: '/sidibishr'}
  ]

  const callCenterMenu = [
    { icon: ShoppingBag, text: 'الطلبات', href: '/orders'},
  ];
  const trainerMenu = [
    { icon: ShoppingBag, text: 'الطلبات', href: '/allcorcrsestrainer'},
    { icon: Settings, text: 'الإعدادات', subItems: [
      { text: 'ملفي الشخصي', href: '/ProfilePage' },
      { text: 'تسجيل الخروج', onClick: () => handleLogout() },
    ] },
  ];

  const accountManagerMenu = [
    { icon: ShoppingBag, text: 'الطلبات', href: '/orders'},
    { icon: Settings, text: 'الإعدادات', subItems: [{ text: 'تسجيل الخروج', onClick: () => handleLogout() }] },
  ];

  const accountantMenu = [
    { icon: ShoppingBag, text: 'الطلبات', href: '/orders', subItems: [
      { text: 'تحصيل من شركة الشحن', href: '/orders/unpaid' },
      { text: 'طلبات مكتملة و محصلة', href: '/orders/paid' },
    ]},    
    { icon: Settings, text: 'الإعدادات', subItems: [{ text: 'تسجيل الخروج', onClick: () => handleLogout() }] },
  ];

  const moderatorMenu = [
    { icon: Home, text: 'لوحة التحكم', href: '/' },
    { icon: ShoppingBag, text: 'الطلبات', href: '/orders'},
    { icon: Map, text: 'فرع سيدي بشر', href: '/sidibishr'},
    { icon: Settings, text: 'الإعدادات', subItems: [{ text: 'تسجيل الخروج', onClick: () => handleLogout() }] },
  ];
  const partnerMenu = [
    { icon: Home, text: ' الدورات', href: 'CoursesPartner' },

    { icon: Settings, text: 'الإعدادات', subItems: [{ text: 'تسجيل الخروج', onClick: () => handleLogout() }] },
  ];

  const adminMenu = [
    { icon: Home, text: 'لوحة التحكم', href: '/' },
    { icon: FileText, text: 'التسجيلات', href: '/registrations', subItems: [
      { text: 'كل الطلبات', href: '/registrations/all' },
      { text: 'الطلبات الجديدة', href: '/registrations/pending' },
      { text: 'التسجيلات التامة', href: '/registrations/approved' },
      { text: 'التسجيل المرفوضة', href: '/registrations/rejected' },
    ]},
    { icon: Package, text: 'الدورات', href: '/courses', subItems: [
      { text: 'كل الدورات', href: '/courses/all' },
      { text: 'أضافة دورة ', href: '/courses/addSame' },
      { text: 'أضافة دورة جديدة', href: '/courses/add' },
      { text: 'أقسام الدورات', href: '/courses/categories' },
      { text: 'أضافة قسم جديد', href: '/courses/categories/add' },
    ]},
    { icon: Contact, text: 'الطلاب', href: '/students', subItems: [
      { text: 'كل الطلاب', href: '/students/all' },
      { text: 'أضافة طالب جديد', href: '/students/add' },
      { text: 'الطلاب المحظورين', href: '/students/blocked' },
      { text: 'كل الطلاب المحظورين', href: '/students/Allblocked' },

    ]},
    {icon: Contact, text: 'الشكوي', href: '/AllComplaints'},
    { icon: Package, text: 'العروض', href: 'OffersImageUpload'},
    { icon: Contact, text: 'عملاؤنا و شركاؤنا', subItems: [

      { text: '  شركاؤنا', href: 'OurPartnersImageUpload' },
      { text: '  عملاؤنا', href: 'ClientImageUpload' },
    ]},
    { icon: Users, text: 'المستخدمين', href: '/users', subItems: [
      { text: 'إضافة مستخدم', href: '/users/add' }
    ]},
    { icon: BarChart, text: 'الحسابات', href: '/accounts' , subItems: [
      { text: 'التقارير' },
      { text: 'الرسوم البيانية' },
      { text: 'الإحصائيات' },
    ]},
    { icon: Settings, text: 'الإعدادات', subItems: [
      { text: 'ملفي الشخصي', href: '/ProfilePage' },
      { text: 'تسجيل الخروج', onClick: () => handleLogout() },
    ] },
  ];

  // Get menu based on user role
  const getMenu = () => {
    switch (user.role) {
      case 'admin': return adminMenu;
      case 'moderator': return moderatorMenu;
      case 'accountmanager': return accountManagerMenu;
      case 'callcenter': return callCenterMenu;
      case 'accountant': return accountantMenu;
      case 'casher': return cashierMenu;
      case 'inventorymanager': return inventorymanagerMenuCamp;
      case 'trainer': return trainerMenu;
      case 'partner': return partnerMenu;
      default: return [];
    }
  };

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Handle navigation
  const handleNavigation = (href) => {
    navigate(href);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if a menu item is active
  const isActive = (href) => location.pathname === href;

  // Toggle sidebar minimize
  const toggleSidebarMinimize = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };
  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await fetch("https://phpstack-1509731-5843882.cloudwaysapps.com/api/registrations");
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        if (!isMounted) return;

        const pending = data.filter(reg => reg.Status === 'Pending').length;
        setTotalPending(pending);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleNotificationClick = () => {
    // Update last seen count to current total
    setLastSeenCount(totalPending);
    // Persist to localStorage
    localStorage.setItem('lastSeenNotifications', totalPending.toString());
    navigate("/notifications");
  };

return (
    <div className="flex h-screen bg-gray-100 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 transition duration-200 ease-in-out z-[120] ${
          isSidebarMinimized ? 'w-16' : 'w-64'
        } bg-white shadow-lg flex flex-col`}
      >
        {/* Close Button for Mobile */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b">
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Header (Desktop) */}
        <div className="hidden lg:flex items-center justify-between h-16 border-b p-3">
          {!isSidebarMinimized && <img src="/abad-icon.png" alt="Radwa Icon" className="w-10" />}
          <button onClick={toggleSidebarMinimize} className="p-2 rounded-md hover:bg-gray-100">
            {isSidebarMinimized ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto">
          {getMenu().map((item, index) => (
            <div key={index}>
              <span
                className={`flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                  isActive(item.href) ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <item.icon
                    href={item.href || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.href) handleNavigation(item.href);
                    }}
                    className="w-5 h-5 ml-3"
                  />
                  {!isSidebarMinimized && (
                    <a
                      href={item.href || '#'}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.href) handleNavigation(item.href);
                      }}
                    >
                      {item.text}
                    </a>
                  )}
                </div>
                {!isSidebarMinimized && item.subItems && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(index);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-md"
                  >
                    {openDropdown === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                )}
              </span>

              {/* Dropdown Menu */}
              {!isSidebarMinimized && item.subItems && openDropdown === index && (
                <div className="px-4">
                  {item.subItems.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.href || '#'}
                      onClick={(e) => {
                        e.preventDefault();
                        if (subItem.href) handleNavigation(subItem.href);
                        if (subItem.onClick) subItem.onClick();
                      }}
                      className={`flex items-center px-6 py-2 text-gray-600 hover:bg-gray-50 ${
                        isActive(subItem.href) ? 'bg-gray-100' : ''
                      }`}
                    >
                      <Dot size={16} />
                      <span>{subItem.text}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header for Desktop */}
        <header className="hidden lg:flex items-center justify-between bg-white shadow-md h-16 px-6">
          <div className="flex items-center w-96">
            <Users className="w-5 h-5 text-gray-500" />
            <h2 className="mr-5">مرحبا {user.name} - {user.role}</h2>
          </div>
          <div className="flex items-center space-x-4">
          {user.role !== 'partner' && (
            <button 
              className="p-2 rounded-md hover:bg-gray-100 relative"
              onClick={handleNotificationClick}
            >
              <Bell size={24} />
              {unseenCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unseenCount}
                </span>
              )}
            </button>
          )}
            <div className="relative">
              <button onClick={toggleUserDropdown} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                <User size={24} />
              </button>
              {userDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-90">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="ml-2" />
                    <span>تسجيل الخروج</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-md h-16 fixed top-0 right-0 left-0 z-[110]">
          <div className="flex items-center justify-between px-4 h-full">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <img src="/abad-icon.png" alt="Radwa Icon" className="w-10" />
            {user.role !== 'partner' && (
              <button 
                className="p-2 rounded-md hover:bg-gray-100 relative"
                onClick={handleNotificationClick}
              >
                <Bell size={24} />
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unseenCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 lg:pr-6 pt-20 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );

};

export default Layout;