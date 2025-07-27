import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WhatsAppButton from "../../components/WhatsApp";

export default function AllCategories() {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      try {
        const response = await fetch(
          "https://backend.camels.center/api/categories",
          requestOptions
        );
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="py-32 about p-16 bg-[#F9FAFC]">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link className="text-blue-600 hover:text-blue-800"
            key={category.CategoryID}
            to={`/courses/${category.CategoryID}/courses`}
          >
            <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              
              <h2 className="text-xl text-center font-semibold mt-2">
                {category.CategoryName}
              </h2>
            </div>
          </Link>
        ))}
      </div>
      <WhatsAppButton/>
    </div>
  );
}