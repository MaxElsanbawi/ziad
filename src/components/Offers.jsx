
import React, { useState, useEffect } from 'react';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };

        const response = await fetch("https://backend.camels.center/api/Offers", requestOptions);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOffers(data);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleImageClick = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return <div>Loading offers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="offers-container my-16">

      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-item">
            <img
              src={offer.image_url}
              alt={`Offer ${offer.id}`}
              onClick={() => handleImageClick(offer.name)}
              style={{ cursor: 'pointer' }}
            />
            <p>Created: {new Date(offer.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;