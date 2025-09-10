import { useState, useEffect } from 'react';
import { UploadCloud, ArrowRight, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OffersImageUpload() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [partners, setPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const partnersPerPage = 5;

  // Fetch partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch("https://phpstack-1509731-5843882.cloudwaysapps.com/api/offers");
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      } else {
        throw new Error('Failed to fetch partners');
      }
    } catch (err) {
      console.error(err);
      toast.error('فشل في جلب بيانات الشركاء');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await fetch("https://phpstack-1509731-5843882.cloudwaysapps.com/api/Offers", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('تم رفع صورة العرض بنجاح!');
        // Reset form
        setName("");
        setSelectedFile(null);
        setImagePreview(null);
        // Refresh partners list
        fetchPartners();
      } else {
        throw new Error(result.message || 'Failed to submit the form');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'فشل في رفع الصورة. يرجى المحاولة مرة أخرى.');
      toast.error(err.message || 'فشل في رفع الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
      try {
        const response = await fetch(`https://phpstack-1509731-5843882.cloudwaysapps.com/api/Offers/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success('تم حذف العرض بنجاح');
          fetchPartners();
        } else {
          throw new Error('Failed to delete partner');
        }
      } catch (err) {
        console.error(err);
        toast.error('فشل في حذف العرض');
      }
    }
  };

  // Filter partners based on search query
  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(indexOfFirstPartner, indexOfLastPartner);
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      {/* Toast Container */}
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

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-secondary"
      >
        <ArrowRight size={20} className="ml-2" />
        العودة
      </button>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          رفع صورة عرض
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Client Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm t1 font-medium text-primary mb-1">
              رابط العرض
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          {/* Client Image Field */}
          <div className="mb-4">
            <label htmlFor="clientImage" className="block text-sm font-medium text-primary mb-1">
              صورة العرض
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="clientImage"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none"
                  >
                    <span>اختر ملف</span>
                    <input
                      id="clientImage"
                      name="image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pr-1">أو قم بسحب وإفلات</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</p>
              </div>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الرفع...' : 'رفع الصورة'}
          </button>
        </form>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">إدارة الشركاء</h2>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Partners Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">#</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">اسم العرض</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">الصورة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-primary">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentPartners.length > 0 ? (
                currentPartners.map((partner, index) => (
                  <tr
                    key={partner.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">#: </span>
                      {indexOfFirstPartner + index + 1}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">اسم العرض: </span>
                      {partner.name}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <span className="font-semibold md:hidden">الصورة: </span>
                      <div className="bg-white shadow-lg rounded-xl flex justify-center items-center h-[120px] w-[200px]">
              {partner.image_url ? (
                <img 
                  src={partner.image_url} 
                  className="w-full h-full  object-contain bg-cover" 
                  alt={partner.name || 'partner logo'}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = ''; // Clear the broken image
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-[80px] h-[80px] flex items-center justify-center text-gray-400">
                  {partner.name || 'No Image'}
                </div>
              )}
            </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-700 block md:table-cell">
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="حذف العرض"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    لا يوجد شركاء لعرضهم
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPartners.length > partnersPerPage && (
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 rounded-md ${
                  currentPage === i + 1
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}