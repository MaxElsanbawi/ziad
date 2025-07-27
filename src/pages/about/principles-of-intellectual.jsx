import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const LegalPage = () => {
  const { t ,i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <>
    <div dir={i18n.dir()} className="py-32 px-3 flex flex-col about container-about">
      {/* Title */}
      <div className="font-extrabold text-2xl">{t("legal.title")}</div>
      <br />

      {/* Intellectual Property Policy */}
      <h4>{t("legal.intellectualPropertyPolicy")}</h4>
      <br />
      <p>{t("legal.contentProtected")}</p>
      <p>{t("legal.trainerContentRestrictions")}</p>
      <p>{t("legal.lecturesOwnership")}</p>
      <p>{t("legal.respectIntellectualProperty")}</p>

      <br />

      {/* Copyrights and Publishing Rights */}
      <h4>{t("legal.copyrightsAndPublishingRights")}</h4>
      <br />
      <p>{t("legal.commitmentToIPProtection")}</p>
      <p>{t("legal.clearIPPolicy")}</p>
      <p>{t("legal.complianceWithStandards")}</p>

    </div>
    <WhatsAppButton/>
    </>
  );
};

export default LegalPage;