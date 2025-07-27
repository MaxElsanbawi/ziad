import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const TechnicalSupport = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="p-8 container-about mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">{t("technical.title")}</h1>

      {/* Technical Support Description */}
      <section>
        <p className="mb-4">{t("technical.description")}</p>
        <ul className="list-disc ml-6 mb-4">
          <li>{t("technical.supportMethods.teamViewer")}</li>
          <li>{t("technical.supportMethods.socialMedia")}</li>
          <li>{t("technical.supportMethods.phoneSupport")}</li>
          <li>{t("technical.supportMethods.inClassSupport")}</li>
          <li>{t("technical.supportMethods.emailSupport")}</li>
          <li>{t("technical.supportMethods.websiteForm")}</li>
        </ul>
      </section>

      {/* Support Channels */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{t("technical.channels.title")}</h2>
        <div className="mb-4">
          <strong>{t("technical.channels.contactCenter")}</strong>
          <p>
            {t("technical.channels.contactCenterNumbers")}{" "}
            {t("technical.channels.contactCenterHours")}
          </p>
        </div>
        <div className="mb-4">
          <strong>{t("technical.channels.emailSupport")}</strong>
          <p>{t("technical.channels.emailAddress")}</p>
        </div>
        <div className="mb-4">
          <strong>{t("technical.channels.socialMedia")}</strong>
          <p>{t("technical.channels.socialMediaDescription")}</p>
        </div>
      </section>

      {/* Roles and Responsibilities */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{t("technical.roles.title")}</h2>
        <p className="mb-4">{t("technical.roles.description")}</p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            <strong>{t("technical.roles.level1.title")}</strong>
            <p>{t("technical.roles.level1.description")}</p>
          </li>
          <li>
            <strong>{t("technical.roles.level2.title")}</strong>
            <p>{t("technical.roles.level2.description")}</p>
          </li>
        </ul>
      </section>

      {/* Working Hours */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{t("technical.workingHours.title")}</h2>
        <p>{t("technical.workingHours.description")}</p>
      </section>

      {/* Customer Satisfaction */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{t("technical.customerSatisfaction.title")}</h2>
        <p>{t("technical.customerSatisfaction.description")}</p>
      </section>
      <WhatsAppButton/>
    </div>
  );
};

export default TechnicalSupport;