import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppButton from "../../components/WhatsApp";

const Academic = () => {
  const { t ,i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="py-32 about container-about">
      {/* Title */}
      <div className="font-extrabold text-2xl">{t("academic.title")}</div>
      <h4>{t("academic.privacyPolicyUsage")}</h4>
      <br />

      {/* First Paragraph */}
      <p className="leading-10 text-sm text-stone-500 w-[85%] container">
        {t("academic.integrityDescription")}
      </p>

      {/* Second Paragraph */}
      <p className="leading-10 text-sm text-stone-500 w-[85%] container">
        {t("academic.academicIntegrityAchievement")}
      </p>
      <br />

      {/* Bullet Points */}
      <div>
        <p className="pb-2 text-sm text-stone-500">
          <FontAwesomeIcon icon={faCircle} size="xs" />{" "}
          {t("academic.guidanceForTrainees")}
        </p>
        <p className="pb-2 text-sm text-stone-500">
          <FontAwesomeIcon icon={faCircle} size="xs" />{" "}
          {t("academic.respectIntellectualProperty")}
        </p>
        <p className="pb-2 text-sm text-stone-500">
          <FontAwesomeIcon icon={faCircle} size="xs" />{" "}
          {t("academic.attendanceAndInteraction")}
        </p>
        <p className="pb-2 text-sm text-stone-500">
          <FontAwesomeIcon icon={faCircle} size="xs" />{" "}
          {t("academic.solveTestsWithoutHelp")}
        </p>
        <p className="pb-2 text-sm text-stone-500">
          <FontAwesomeIcon icon={faCircle} size="xs" />{" "}
          {t("academic.loginOnTime")}
        </p>
        <p className="text-sm text-stone-500">
          <FontAwesomeIcon icon={faCircle} size="xs" />{" "}
          {t("academic.certificateBasedOnAttendance")}
        </p>
      </div>
      <WhatsAppButton/>
    </div>
  );
};

export default Academic;