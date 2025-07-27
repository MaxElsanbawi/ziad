import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from react-icons
import i18n from '../i18n';

const WhatsAppButton = () => {
  const phoneNumber = '966541457482'; // Use the correct international format without "00"
  const message = 'Hello, I have a question!'; // Predefined message

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message); // Encode the message
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`; // Use wa.me for cross-platform compatibility
    window.open(url, '_blank'); // Open WhatsApp in a new tab
  };

  return (
    <div className={`fixed bottom-5  z-50 ${i18n.dir() === "rtl" ? "left-5" : "right-5"} `}>
      <button
        onClick={handleClick}
        className="bg-[#25D366]  text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors duration-300 flex items-center justify-center"
        
      >
        <FaWhatsapp className="text-4xl" />
      </button>
    </div>
  );
};

export default WhatsAppButton;


