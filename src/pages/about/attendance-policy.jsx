
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const Attendance = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="py-32 about container-about">
      {/* Title */}
      <div className="font-extrabold text-2xl">{t("attendance.title")}</div>

      <br />

      {/* List of Policies */}
      <div className="list-decimal">
        <li className="pb-2 text-sm text-stone-500">
          {t("attendance.virtualAttendance")}
        </li>
        <li className="pb-2 text-sm text-stone-500">
          {t("attendance.electronicRegistration")}
        </li>
        <li className="pb-2 text-sm text-stone-500">
          {t("attendance.attendancePercentage")}
        </li>
        <li className="pb-2 text-sm text-stone-500">
          {t("attendance.certificateEligibility")}
        </li>
      </div>
      <WhatsAppButton/>
    </div>
  );
};

export default Attendance;