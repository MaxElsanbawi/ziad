import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const TraineeVerificationMechanism = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <><div dir={i18n.dir()} className="py-32 about container-about">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        {t("verification.title")}
      </h1>

      {/* Description */}
      <p className="text-gray-700 text-base leading-relaxed mb-4">
        {t("verification.description")}{" "}
        {t("verification.contactSupport", {
          email: "Support@abadnet.com.sa",
        })}
      </p>
    </div>
    <WhatsAppButton/>
    </>
  );
};

export default TraineeVerificationMechanism;