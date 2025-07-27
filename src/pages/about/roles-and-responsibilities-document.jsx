import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const RolesAndResponsibilities = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="py-32 px-3 flex flex-col about container-about">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6">
        {t("roles.title")}
      </h1>

      {/* Description */}
      <p className="text-center mb-4 text-black">
        {t("roles.description")}
      </p>
      <p className="mb-4">{t("roles.siteRestriction")}</p>
      <p className="mb-6">{t("roles.noExams")}</p>
      <p className="mb-6">{t("roles.courseAccess")}</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">{t("roles.table.serial")}</th>
              <th className="py-2 px-4 border-b">{t("roles.table.employeeName")}</th>
              <th className="py-2 px-4 border-b">{t("roles.table.jobTitle")}</th>
              <th className="py-2 px-4 border-b">{t("roles.table.responsibilities")}</th>
              <th className="py-2 px-4 border-b">{t("roles.table.contactInfo")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b text-center">1</td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee1.name")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee1.title")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee1.responsibilities")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <p>{t("roles.table.employee1.mobile")}</p>
                <p>{t("roles.table.employee1.unifiedNumber")}</p>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-center">2</td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee2.name")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee2.title")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee2.responsibilities")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <p>{t("roles.table.employee2.mobile")}</p>
                <p>{t("roles.table.employee2.unifiedNumber")}</p>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b text-center">3</td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee3.name")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee3.title")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {t("roles.table.employee3.responsibilities")}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <p>{t("roles.table.employee3.unifiedNumber")}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <WhatsAppButton/>
    </div>
  );
};

export default RolesAndResponsibilities;