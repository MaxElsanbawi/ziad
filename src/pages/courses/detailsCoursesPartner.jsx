import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Printer, Search, Download, Edit } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

const CourseDetailsPartner = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noRegistrations, setNoRegistrations] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const regsPerPage = 10;

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  // Registration form state
  const [regForm, setRegForm] = useState({
    email: "",
    fullname: "",
    NationalId: "",
    phonenumber: "",
    location: "",
    Language: "",
    Write_an_inquiry: "",
    status: "approved",
    CourseID: courseId,
  });
  const [regFormLoading, setRegFormLoading] = useState(false);
  const [regFormSuccess, setRegFormSuccess] = useState("");
  const [regFormError, setRegFormError] = useState("");

  // PDF management state
  const [coursePdfs, setCoursePdfs] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([null]); // Array of files
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfsLoading, setPdfsLoading] = useState(false);

  // New: Course files table state
  const [courseFiles, setCourseFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Invoice state
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course details
        const courseResponse = await fetch(
          `https://backend.camels.center/api/courses/${courseId}`,
          {
            method: "GET",
            redirect: "follow",
          }
        );

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }

        const courseResult = await courseResponse.json();
        setCourse(courseResult);

        // Fetch registrations - this won't throw an error if response is not OK
        const registrationsResponse = await fetch(
          `https://backend.camels.center/api/registrations/course/${courseId}`,
          {
            method: "GET",
            redirect: "follow",
          }
        );
        console.log(registrationsResponse)
        let registrationsResult = [];
        if (registrationsResponse.ok) {
          registrationsResult = await registrationsResponse.json();
        } else {
          console.warn("Failed to fetch registrations, using empty array");
        }

        setRegistrations(registrationsResult);

        // Check if there are no registrations
        if (registrationsResult.length === 0) {
          setNoRegistrations(true);
        } else {
          setNoRegistrations(false);
        }

        // Calculate status counts
        const counts = {
          pending: 0,
          approved: 0,
          rejected: 0,
          total: registrationsResult.length,
        };

        registrationsResult.forEach((reg) => {
          const status = reg.Status.toLowerCase();
          if (counts[status] !== undefined) {
            counts[status]++;
          }
        });

        setStatusCounts(counts);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // // Fetch course PDFs
  // useEffect(() => {
  //   const fetchCoursePdfs = async () => {
  //     try {
  //       setPdfsLoading(true);
  //       const response = await fetch(`https://backend.camels.center/api/courses/${courseId}/pdfs`, {
  //         method: "GET",
  //       });
  //       if (response.ok) {
  //         const result = await response.json();
  //         setCoursePdfs(Array.isArray(result) ? result : [result]);
  //       } else {
  //         setCoursePdfs([]);
  //       }
  //     } catch (error) {
  //       setCoursePdfs([]);
  //     } finally {
  //       setPdfsLoading(false);
  //     }
  //   };
  //   if (courseId) fetchCoursePdfs();
  // }, [courseId]);

  // // Fetch course files for the new table
  // useEffect(() => {
  //   const fetchCourseFiles = async () => {
  //     try {
  //       setFilesLoading(true);
  //       const response = await fetch(`https://backend.camels.center/api/courses/${courseId}/pdfs`, {
  //         method: "GET",
  //         redirect: "follow"
  //       });
  //       if (response.ok) {
  //         const result = await response.json();
  //         setCourseFiles(result.files || []);
  //       } else {
  //         setCourseFiles([]);
  //       }
  //     } catch (error) {
  //       setCourseFiles([]);
  //     } finally {
  //       setFilesLoading(false);
  //     }
  //   };
  //   if (courseId) fetchCourseFiles();
  // }, [courseId]);

  const handleStatusChange = async (registrationId, newStatus) => {
    try {
      // Find the current registration to get all its data
      const currentRegistration = registrations.find(reg => reg.RegistrationID === registrationId);
      
      if (!currentRegistration) {
        throw new Error("Registration not found");
      }

      // Optimistic UI update
      setRegistrations(prevRegs =>
        prevRegs.map(reg =>
          reg.RegistrationID === registrationId
            ? { ...reg, Status: newStatus }
            : reg
        )
      );
  
      // Update status counts
      setStatusCounts(prev => {
        const updated = { ...prev };
        const oldStatus = currentRegistration.Status?.toLowerCase();
        
        if (oldStatus && updated[oldStatus] > 0) {
          updated[oldStatus]--;
        }
        updated[newStatus]++;
        return updated;
      });
  
      // Prepare the updated registration data with the new structure
      const updatedRegistrationData = {
        fullname: currentRegistration.FullName || currentRegistration.fullname,
        email: currentRegistration.Email || currentRegistration.email,
        phonenumber: currentRegistration.PhoneNumber || currentRegistration.phonenumber,
        location: currentRegistration.Location || currentRegistration.location,
        Language: currentRegistration.Language,
        Write_an_inquiry: currentRegistration.Write_an_inquiry,
        status: newStatus, // Updated status
        CourseID: currentRegistration.CourseID
      };

      // API call
      const response = await fetch(
        `https://backend.camels.center/api/registrations/${registrationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRegistrationData),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      // Optional: show success message
      console.log("Status updated successfully");
      
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert changes if API call fails
      setRegistrations(registrations);
    }
  };

  // Generate Invoice PDF
 const generateInvoice = async (registration) => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    
    const invoiceDate = new Date().toLocaleDateString('ar-EG');
    const invoiceNumber = `INV-${registration.RegistrationID}-${Date.now()}`;

    // Create a temporary div for the invoice
    const invoiceDiv = document.createElement('div');
    invoiceDiv.style.position = 'absolute';
    invoiceDiv.style.left = '-9999px';
    invoiceDiv.style.width = '800px';
    invoiceDiv.style.padding = '20px';
    invoiceDiv.style.fontFamily = "'Tajawal', sans-serif";
    invoiceDiv.dir = 'rtl';
    
    invoiceDiv.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
          <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">
            ${course?.InstructorName || "مركز التدريب"}
          </div>
          <div style="text-align: left;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #2c3e50;">فاتورة تدريب</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: bold; width: 150px;">رقم الفاتورة:</span>
              <span style="flex-grow: 1; text-align: left;">${invoiceNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: bold; width: 150px;">التاريخ:</span>
              <span style="flex-grow: 1; text-align: left;">${invoiceDate}</span>
            </div>
          </div>
        </div>
        
        <!-- Student Info -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">معلومات المتدرب</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; width: 150px;">الاسم:</span>
            <span style="flex-grow: 1; text-align: left;">${registration.FullName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; width: 150px;">رقم الهوية:</span>
            <span style="flex-grow: 1; text-align: left;">${registration.NationalId || 'غير متوفر'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; width: 150px;">البريد الإلكتروني:</span>
            <span style="flex-grow: 1; text-align: left;">${registration.Email}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold; width: 150px;">رقم الهاتف:</span>
            <span style="flex-grow: 1; text-align: left;">${registration.PhoneNumber}</span>
          </div>
        </div>
        
        <!-- Course Details -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">تفاصيل الدورة</div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr>
                <th style="background-color: #f5f5f5; padding: 8px; text-align: right; border: 1px solid #ddd;">الوصف</th>
                <th style="background-color: #f5f5f5; padding: 8px; text-align: right; border: 1px solid #ddd;">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${course?.CourseName || 'دورة تدريبية'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${course?.Price || '0'} ر.س</td>
              </tr>
            </tbody>
          </table>
          <div style="font-size: 18px; font-weight: bold; margin-top: 20px; text-align: left;">المبلغ الإجمالي: ${course?.Price || '0'} ر.س</div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #777;">
          <p>شكراً لاختياركم ${course?.InstructorName || "مركز التدريب"}</p>
          <p>للاستفسارات: ${course?.InstructorPhoneNumber || "0000000000"} | ${course?.InstructorEmail || "info@example.com"}</p>
        </div>
      </div>
    `;

    // Add to document
    document.body.appendChild(invoiceDiv);

    // Load Tajawal font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Wait for font to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Convert to canvas
    const canvas = await html2canvas(invoiceDiv, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: invoiceDiv.scrollWidth,
      windowHeight: invoiceDiv.scrollHeight
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate image dimensions to fit A4
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`invoice_${invoiceNumber}.pdf`);

    // Clean up
    document.body.removeChild(invoiceDiv);
    document.head.removeChild(fontLink);

  } catch (error) {
    console.error('Error generating invoice:', error);
    toast.error('حدث خطأ أثناء إنشاء الفاتورة');
  }
};
  // Filter registrations based on search query and status filter
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.RegistrationID.toString().includes(searchQuery) ||
      registration.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      registration.PhoneNumber.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      registration.Status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
  const statusConfig = {
    approved: {
      text: "معتمد",
      bg: "bg-green-100",
      textColor: "text-green-800",
    },
    rejected: {
      text: "مرفوض",
      bg: "bg-red-100",
      textColor: "text-red-800",
    },
    pending: {
      text: "قيد الانتظار",
      bg: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
  };
  // Pagination logic
  const indexOfLastReg = currentPage * regsPerPage;
  const indexOfFirstReg = indexOfLastReg - regsPerPage;
  const currentRegistrations = filteredRegistrations.slice(
    indexOfFirstReg,
    indexOfLastReg
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRegFormChange = (e) => {
    const { name, value } = e.target;
    setRegForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegFormSubmit = async (e) => {
    e.preventDefault();
    setRegFormLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({ ...regForm, CourseID: courseId });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        "https://backend.camels.center/api/registrations",
        requestOptions
      );
      if (!response.ok) throw new Error("فشل التسجيل. حاول مرة أخرى.");
      toast.success("تم التسجيل بنجاح!", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        rtl: true,
      });
      setRegForm({
        email: "",
        fullname: "",
        NationalId: "",
        phonenumber: "",
        location: "",
        Language: "",
        Write_an_inquiry: "",
        status: "approved",
        CourseID: courseId,
      });
      // Refresh registrations
      // Re-fetch course details (only registrations part)
      const registrationsResponse = await fetch(
        `https://backend.camels.center/api/registrations/course/${courseId}`,
        { method: "GET", redirect: "follow" }
      );
      let registrationsResult = [];
      if (registrationsResponse.ok) {
        registrationsResult = await registrationsResponse.json();
      }
      setRegistrations(registrationsResult);
      // Update status counts
      const counts = {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: registrationsResult.length,
      };
      registrationsResult.forEach((reg) => {
        const status = reg.Status.toLowerCase();
        if (counts[status] !== undefined) {
          counts[status]++;
        }
      });
      setStatusCounts(counts);
    } catch (err) {
      toast.error(err.message || "فشل التسجيل. حاول مرة أخرى.", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        rtl: true,
      });
    } finally {
      setRegFormLoading(false);
    }
  };

  // // Handle PDF file upload (multiple files)
  // const handlePdfSubmit = async (e) => {
  //   e.preventDefault();
  //   const validFiles = pdfFiles.filter(f => f);
  //   if (validFiles.length === 0) {
  //     toast.error("يرجى اختيار ملف PDF واحد على الأقل");
  //     return;
  //   }
  //   setPdfLoading(true);
  //   try {
  //     const formdata = new FormData();
  //     validFiles.forEach((file, idx) => {
  //       // Use the provided filename for the first file, otherwise use the original name
  //       const filename = idx === 0 ? "postman-cloud:///1f05320b-5981-4ff0-9308-421f384716d4" : file.name;
  //       formdata.append("pdfFile", file, filename);
  //     });
  //     const response = await fetch(`https://backend.camels.center/api/courses/${courseId}/pdfs`, {
  //       method: "POST",
  //       body: formdata,
  //       redirect: "follow"
  //     });
  //     if (!response.ok) throw new Error("فشل في رفع PDF");
  //     toast.success("تم رفع PDF بنجاح!");
  //     setPdfFiles([null]);
  //     e.target.reset();
  //     // Refresh list
  //     const refresh = await fetch(`https://backend.camels.center/api/courses/${courseId}/pdfs`, { method: "GET" });
  //     if (refresh.ok) {
  //       const result = await refresh.json();
  //       setCoursePdfs(Array.isArray(result) ? result : [result]);
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "حدث خطأ أثناء رفع PDF");
  //   } finally {
  //     setPdfLoading(false);
  //   }
  // };

  // Handle file input change for a specific index
  // const handlePdfFileChange = (idx, file) => {
  //   setPdfFiles(prev => {
  //     const updated = [...prev];
  //     updated[idx] = file;
  //     return updated;
  //   });
  // };

  // // Add more file input fields
  // const handleAddMorePdfInput = () => {
  //   setPdfFiles(prev => [...prev, null]);
  // };

  // Download PDF utility
  const handleDownloadCoursePdf = async (pdfUrl, fileName) => {
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('فشل تحميل الملف');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'course-document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('تم تحميل الملف بنجاح');
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء تحميل الملف');
    }
  };

  // // Handle PDF file deletion
  // const handleDeletePdf = async (fileName) => {
  //   if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا الملف؟')) return;
  //   try {
  //     const requestOptions = {
  //       method: "DELETE",
  //       redirect: "follow"
  //     };
  //     const response = await fetch(`https://backend.camels.center/api/courses/${courseId}/pdfs/${encodeURIComponent(fileName)}`, requestOptions);
  //     if (!response.ok) throw new Error('فشل حذف الملف');
  //     toast.success('تم حذف الملف بنجاح');
  //     // Refresh list
  //     const refresh = await fetch(`https://backend.camels.center/api/courses/${courseId}/pdfs`, { method: "GET" });
  //     if (refresh.ok) {
  //       const result = await refresh.json();
  //       setCourseFiles(result.files || []);
  //       setCoursePdfs(Array.isArray(result) ? result : [result]);
  //     }
  //   } catch (error) {
  //     toast.error(error.message || 'حدث خطأ أثناء حذف الملف');
  //   }
  // };

  // Parse course PDF URLs - handle multiple PDFs
  const getCoursePdfUrls = () => {
    if (!course.coursePdfUrl) return [];
    
    // If it's a string, try to parse it as JSON
    if (typeof course.coursePdfUrl === 'string') {
      try {
        // Handle the JSON string format with escaped quotes
        let cleanString = course.coursePdfUrl;
        
        // Remove outer quotes if they exist
        if (cleanString.startsWith('"') && cleanString.endsWith('"')) {
          cleanString = cleanString.slice(1, -1);
        }
        
        // Parse the JSON array
        const parsed = JSON.parse(cleanString);
        
        // Return the array of URLs
        if (Array.isArray(parsed)) {
          return parsed;
        } else {
          return [course.coursePdfUrl];
        }
      } catch (error) {
        console.log('Error parsing PDF URLs:', error);
        // If parsing fails, treat as single URL
        return [course.coursePdfUrl];
      }
    }
    
    // If it's already an array
    if (Array.isArray(course.coursePdfUrl)) {
      return course.coursePdfUrl;
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الدورة</h2>
        <p className="text-center">تحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">تفاصيل الدورة</h2>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-6">
      {/* Page Title and Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary flex items-center">
          تفاصيل الدورة
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/courses/${courseId}/editPartner`)}
            className="flex items-center bg-green-500 text-white py-2 px-3 md:px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
          >
            <Edit size={16} className="ml-1 md:ml-2" />
            <span className="hidden sm:inline">تعديل الدورة</span>
            <span className="sm:hidden">تعديل</span>
          </button>
          <button
            onClick={() => navigate(`/courses/${courseId}/print`)}
            className="flex items-center bg-blue-500 text-white py-2 px-3 md:px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            <Printer size={16} className="ml-1 md:ml-2" />
            <span className="hidden sm:inline">طباعة تفاصيل الدورة</span>
            <span className="sm:hidden">طباعة</span>
          </button>
        </div>
      </div>

      {course && (
        <div className="space-y-6 printable-area">
          {/* Toast Container for notifications */}
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
          {/* Course Image */}
          <div className="flex justify-center">
            <img
              src={course.courseImgUrl}
              alt={course.CourseName}
              className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg"
            />
          </div>

          {/* Course Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                رقم الدورة
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.CourseID}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                اسم الدورة
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.CourseName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                رمز الدورة
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.CourseCode}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                الوصف
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.Description || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                السعر
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.Price}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                نوع الدورة
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.CourseType}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                رابط الدورة
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.CourseLink || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                تاريخ البدء
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {new Date(course.StartingTime).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                تاريخ الانتهاء
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {new Date(course.EndingTime).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                وقت الدروس
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.LessonsTime || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                معرف المدرب
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.InstructorID}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                اسم المدرب
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.InstructorName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                بريد المدرب
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.InstructorEmail}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                هاتف المدرب
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {course.InstructorPhoneNumber}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">
                تاريخ الإنشاء
              </label>
              <p className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                {new Date(course.CreatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Course PDFs Section */}
          {(() => {
            const pdfUrls = getCoursePdfUrls();
            return pdfUrls.length > 0 ? (
              <div className="mt-6 md:mt-8">
                <h3 className="text-lg md:text-xl font-bold text-primary mb-4">ملفات PDF للدورة</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">رقم</th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">اسم الملف</th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">رابط</th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">تحميل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pdfUrls.map((pdfUrl, index) => {
                        const fileName = pdfUrl.split('/').pop() || `course-${course.CourseID}-${index + 1}.pdf`;
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm text-gray-700">
                              {index + 1}
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm text-gray-700">
                              <span className="truncate block max-w-20 md:max-w-none">{fileName}</span>
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm text-blue-700">
                              <a 
                                href={pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-900"
                              >
                                عرض
                              </a>
                            </td>
                            <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm">
                              <button
                                type="button"
                                onClick={() => handleDownloadCoursePdf(pdfUrl, fileName)}
                                className="bg-blue-500 text-white px-2 md:px-3 py-1 rounded hover:bg-blue-700 focus:outline-none text-xs md:text-sm"
                              >
                                تحميل
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null;
          })()}

          {/* Registrations Section */}
          <div className="mt-6 md:mt-8">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-4">التسجيلات</h3>

            {/* Registration Form */}
            <form onSubmit={handleRegFormSubmit} className="mb-6 md:mb-8 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <input
                type="text"
                name="fullname"
                placeholder="الاسم الكامل"
                value={regForm.fullname}
                onChange={handleRegFormChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                value={regForm.email}
                onChange={handleRegFormChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
              <input
                type="text"
                name="NationalId"
                placeholder="الرقم الوطني"
                value={regForm.NationalId}
                onChange={handleRegFormChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="text"
                name="phonenumber"
                placeholder="رقم الهاتف"
                value={regForm.phonenumber}
                onChange={handleRegFormChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="الموقع"
                value={regForm.location}
                onChange={handleRegFormChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <select
                name="Language"
                value={regForm.Language}
                onChange={handleRegFormChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              >
                <option value="">اختر اللغة</option>
                <option value="English">English</option>
                <option value="العربية">العربية</option>
              </select>
              <input
                type="text"
                name="Write_an_inquiry"
                placeholder="استفسار (اختياري)"
                value={regForm.Write_an_inquiry}
                onChange={handleRegFormChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary sm:col-span-2 md:col-span-2"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2 md:col-span-1"
                disabled={regFormLoading}
              >
                {regFormLoading ? "جاري التسجيل..." : "تسجيل جديد"}
              </button>
            </form>

            {/* Display a message if there are no registrations */}


            {/* Status Statistics */}
            {!noRegistrations && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h4 className="text-base md:text-lg font-semibold text-blue-700">
                      الكل
                    </h4>
                    <p className="text-xl md:text-2xl font-bold text-blue-900">
                      {statusCounts.total}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <h4 className="text-base md:text-lg font-semibold text-yellow-700">
                      قيد الانتظار
                    </h4>
                    <p className="text-xl md:text-2xl font-bold text-yellow-900">
                      {statusCounts.pending}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <h4 className="text-base md:text-lg font-semibold text-green-700">
                      معتمد
                    </h4>
                    <p className="text-xl md:text-2xl font-bold text-green-900">
                      {statusCounts.approved}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <h4 className="text-base md:text-lg font-semibold text-red-700">
                      مرفوض
                    </h4>
                    <p className="text-xl md:text-2xl font-bold text-red-900">
                      {statusCounts.rejected}
                    </p>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <Search
                      size={18}
                      className="absolute left-3 top-2.5 text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 md:gap-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-2 text-xs md:text-sm rounded-md ${
                        statusFilter === "all"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      الكل
                    </button>
                    <button
                      onClick={() => setStatusFilter("pending")}
                      className={`px-3 py-2 text-xs md:text-sm rounded-md ${
                        statusFilter === "pending"
                          ? "bg-yellow-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      قيد الانتظار
                    </button>
                    <button
                      onClick={() => setStatusFilter("approved")}
                      className={`px-3 py-2 text-xs md:text-sm rounded-md ${
                        statusFilter === "approved"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      معتمد
                    </button>
                    <button
                      onClick={() => setStatusFilter("rejected")}
                      className={`px-3 py-2 text-xs md:text-sm rounded-md ${
                        statusFilter === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      مرفوض
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="hidden md:table-header-group">
                      <tr className="bg-gray-50">
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">
                          رقم التسجيل
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">
                        رقم الهويه 
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">
                          الاسم الكامل
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">
                          البريد الإلكتروني
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">
                          رقم الهاتف
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">
                          الحالة
                        </th>
                        <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs md:text-sm font-semibold text-primary">
                          فاتورة
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRegistrations.map((registration) => (
                        <tr
                          key={registration.RegistrationID}
                          className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm text-gray-700 block md:table-cell">
                            <span className="font-semibold md:hidden">رقم التسجيل: </span>
                            {registration.RegistrationID}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm text-gray-700 block md:table-cell">
                            <span className="font-semibold md:hidden"> رقم الهويه :</span>
                            {registration.NationalId}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                            <span className="font-semibold md:hidden">الاسم الكامل: </span>
                            {registration.FullName}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm text-gray-700 block md:table-cell">
                            <span className="font-semibold md:hidden">البريد الإلكتروني: </span>
                            {registration.Email}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm text-gray-700 block md:table-cell">
                            <span className="font-semibold md:hidden">رقم الهاتف: </span>
                            {registration.PhoneNumber}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm block md:table-cell">
                            <span className="font-semibold md:hidden">الحالة: </span>
                            <div 
                              className="inline-block" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                value={registration.Status.toLowerCase()}
                                onChange={(e) => handleStatusChange(registration.RegistrationID, e.target.value)}
                                className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  statusConfig[registration.Status.toLowerCase()]?.bg || "bg-gray-100"
                                } ${
                                  statusConfig[registration.Status.toLowerCase()]?.textColor || "text-gray-800"
                                }`}
                              >
                                <option value="pending">قيد الانتظار</option>
                                <option value="approved">معتمد</option>
                                <option value="rejected">مرفوض</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-right text-xs md:text-sm block md:table-cell">
                            <button
                              onClick={() => generateInvoice(registration)}
                              className="flex items-center justify-center bg-green-500 text-white px-2 md:px-3 py-1 rounded hover:bg-green-600 focus:outline-none text-xs md:text-sm"
                            >
                              <Download size={14} className="ml-1" />
                              <span className="hidden sm:inline">فاتورة</span>
                              <span className="sm:hidden">فاتورة</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredRegistrations.length > 0 && (
                  <div className="flex justify-center mt-4 md:mt-6">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      {/* Previous button */}
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        ←
                      </button>
                      
                      {/* Page numbers - show fewer on mobile */}
                      {(() => {
                        const totalPages = Math.ceil(filteredRegistrations.length / regsPerPage);
                        const maxVisiblePages = window.innerWidth < 768 ? 3 : 7;
                        
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage < maxVisiblePages - 1) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }
                        
                        const pages = [];
                        
                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              onClick={() => paginate(1)}
                              className="px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                              1
                            </button>
                          );
                          if (startPage > 2) {
                            pages.push(
                              <span key="ellipsis1" className="px-1 md:px-2 py-1 md:py-2 text-gray-500 text-xs md:text-sm">
                                ...
                              </span>
                            );
                          }
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => paginate(i)}
                              className={`px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm ${
                                currentPage === i
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="ellipsis2" className="px-1 md:px-2 py-1 md:py-2 text-gray-500 text-xs md:text-sm">
                                ...
                              </span>
                            );
                          }
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => paginate(totalPages)}
                              className="px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                              {totalPages}
                            </button>
                          );
                        }
                        
                        return pages;
                      })()}
                      
                      {/* Next button */}
                      <button
                        onClick={() => paginate(Math.min(Math.ceil(filteredRegistrations.length / regsPerPage), currentPage + 1))}
                        disabled={currentPage === Math.ceil(filteredRegistrations.length / regsPerPage)}
                        className={`px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm ${
                          currentPage === Math.ceil(filteredRegistrations.length / regsPerPage)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default CourseDetailsPartner;