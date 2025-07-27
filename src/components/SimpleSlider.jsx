import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



export default function SimpleSlider() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const apiUrl = "https://backend.camels.center/api/clients";
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched clients:", data);
        
        // Ensure image URLs are properly formatted
        const processedClients = data.map(client => ({
          ...client,
          // Add fallback for image_url if it's null/undefined
          image_url: client.image_url 
            ? client.image_url.startsWith('http') 
              ? client.image_url 
              : `${window.location.origin}${client.image_url}`
            : null
        }));
        
        setClients(processedClients);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);
  const settings = {
    dots: true,
    infinite: clients.length > 1,
    speed: 500,
    slidesToShow: Math.min(6, clients.length),
    slidesToScroll: 1,
    centerMode: false,
    arrows: false,
    autoplay: clients.length > 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, clients.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, clients.length),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div className="w-full mb-3 text-center">Loading clients...</div>;
  }

  if (clients.length === 0) {
    return (
      <div className="w-full mb-3 text-center text-gray-500">
        {error ? `Error: ${error}` : "No clients available"}
      </div>
    );
  }

  return (
    <div className="w-full mb-3">
      {error && (
        <div className="text-center text-yellow-600 mb-2">
          Warning: {error}
        </div>
      )}
      <Slider {...settings} className="mx-auto">
        {clients.map((client) => (
          <div key={client.id} className="px-2 py-2">
            <div className="bg-white shadow-lg rounded-xl flex justify-center items-center h-[120px]">
              {client.image_url ? (
                <img 
                  src={client.image_url} 
                  className="w-[80px] h-[80px] object-contain" 
                  alt={client.name || 'Client logo'}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = ''; // Clear the broken image
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-[80px] h-[80px] flex items-center justify-center text-gray-400">
                  {client.name || 'No Image'}
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
    
  );
}