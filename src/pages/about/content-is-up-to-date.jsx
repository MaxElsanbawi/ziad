import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const AbadNetInfo = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="py-32 px-3 flex flex-col about container-about">
      {/* Header */}
      <h1 className="text-2xl text-center font-bold text-gray-800 mb-6">
        {t("abadNetInfo.title")}
      </h1>

      {/* Main Content */}
      <div className="space-y-6 text-gray-700">
        <p>{t("abadNetInfo.content1")}</p>
        <p>{t("abadNetInfo.content2")}</p>
        <p>{t("abadNetInfo.content3")}</p>
        <p>{t("abadNetInfo.content4")}</p>

        {/* Acknowledgment Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            {t("abadNetInfo.acknowledgmentTitle")}
          </h2>
          <p className="mb-4">{t("abadNetInfo.acknowledgmentIntro")}</p>
          <ol className="list-decimal list-inside space-y-4">
            <li>{t("abadNetInfo.acknowledgmentPoint1")}</li>
            <li>{t("abadNetInfo.acknowledgmentPoint2")}</li>
            <li>{t("abadNetInfo.acknowledgmentPoint3")}</li>
            <li>{t("abadNetInfo.acknowledgmentPoint4")}</li>
          </ol>
        </div>
      </div>
      <WhatsAppButton/>
    </div>
  );
};

export default AbadNetInfo;