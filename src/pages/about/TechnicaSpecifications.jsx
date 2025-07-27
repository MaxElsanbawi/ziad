import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const TechnicalSpecifications = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="p-6 bg-white shadow-md rounded-lg">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">
        {t("technicalSpecs.title")}
      </h1>

      {/* Description */}
      <p className="text-gray-500 font-normal text-sm mb-6">
        {t("technicalSpecs.description", {
          date: "01/03/2020",
        })}
      </p>

      {/* Specifications List */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          {t("technicalSpecs.users.title")}
        </h2>
        <ul className="list-disc list-inside text-gray-500 font-normal text-sm mb-4">
          <li>{t("technicalSpecs.users.admin")}</li>
          <li>{t("technicalSpecs.users.trainees")}</li>
        </ul>
      </div>

      {/* Server Details */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          {t("technicalSpecs.server.title")}{" "}
          <span className="text-gray-500 font-normal text-sm">
            {t("technicalSpecs.server.value")}
          </span>
        </h2>
      </div>

      {/* Continuous Monitoring */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          {t("technicalSpecs.monitoring.title")}{" "}
          <span className="text-gray-500 font-normal text-sm">
            {t("technicalSpecs.monitoring.value")}
          </span>
        </h2>
      </div>

      {/* Database Details */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          {t("technicalSpecs.database.title")}{" "}
          <span className="text-gray-500 font-normal text-sm">
            {t("technicalSpecs.database.value")}
          </span>
        </h2>
      </div>

      {/* Cloud Server */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          {t("technicalSpecs.cloudServer.title")}{" "}
          <span className="text-gray-500 font-normal text-sm">
            {t("technicalSpecs.cloudServer.value")}
          </span>
        </h2>
      </div>

      {/* Network Connection */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          {t("technicalSpecs.network.title")}{" "}
          <span className="text-gray-500 font-normal text-sm">
            {t("technicalSpecs.network.value")}
          </span>
        </h2>
      </div>

      {/* Website Protection */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          {t("technicalSpecs.protection.title")}{" "}
          <span className="text-gray-500 font-normal text-sm">
            {t("technicalSpecs.protection.value")}
          </span>
        </h2>
      </div>

      {/* Technical Support Table */}
      <div className="flex justify-center items-center mt-6">
        <table className="min-w-full bg-white border border-gray-200">
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b font-semibold">
                {t("technicalSpecs.table.users")}
              </td>
              <td className="py-2 px-4 border-b">{t("technicalSpecs.table.usersValue")}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-semibold">
                {t("technicalSpecs.table.server")}
              </td>
              <td className="py-2 px-4 border-b">{t("technicalSpecs.table.serverValue")}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-semibold">
                {t("technicalSpecs.table.network")}
              </td>
              <td className="py-2 px-4 border-b">{t("technicalSpecs.table.networkValue")}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-semibold">
                {t("technicalSpecs.table.protection")}
              </td>
              <td className="py-2 px-4 border-b">{t("technicalSpecs.table.protectionValue")}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b font-semibold">
                {t("technicalSpecs.table.supportTeam")}
              </td>
              <td className="py-2 px-4 border-b">
                <ul className="list-disc list-inside text-gray-500 font-normal text-sm">
                  <li>{t("technicalSpecs.table.supportMember1")}</li>
                  <li>{t("technicalSpecs.table.supportMember2")}</li>
                  <li>{t("technicalSpecs.table.supportMember3")}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <WhatsAppButton/>
    </div>
  );
};

export default TechnicalSpecifications;