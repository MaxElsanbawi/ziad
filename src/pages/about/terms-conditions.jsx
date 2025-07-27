import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const Teams = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="py-32 about container-about">
      {/* Title */}
      <h1 className="font-extrabold text-2xl mb-6">
        {t("legals.title")}
      </h1>

      {/* Privacy Policy and Usage */}
      <section>
        <h4 className="text-lg font-semibold mb-4">
          {t("legals.privacyPolicyUsage")}
        </h4>
        <p className="leading-7 text-sm text-stone-500 w-[85%] mx-auto">
          {t("legals.contentProtected")}{" "}
          {t("legals.complianceWithStandards")}.
        </p>
        <p className="leading-7 text-sm text-stone-500 w-[85%] mx-auto mt-4">
          {t("legals.commitmentToIPProtection")}{" "}
          {t("legals.clearIPPolicy")}{" "}
          {t("legals.respectIntellectualProperty")}.
        </p>
      </section>

      {/* legals Terms */}
      <section className="mt-8">
        <h4 className="text-lg font-semibold mb-4">
          {t("legals.legalDisclaimer")}
        </h4>
        <p className="leading-7 text-sm text-stone-500 w-[85%] mx-auto">
          {t("legals.termsAndConditions")}:
        </p>
        <ul className="list-disc list-inside leading-7 text-sm text-stone-500 w-[85%] mx-auto mt-2">
          <li>{t("legals.accessAgreement")}</li>
          <li>{t("legals.lawGoverning")}</li>
          <li>{t("legals.dataPrivacy")}</li>
          <li>{t("legals.accountPrivacy")}</li>
          <li>{t("legals.personalDataCollection")}</li>
          <li>{t("legals.financialSecurity")}</li>
          <li>{t("legals.updatingTerms")}</li>
        </ul>
      </section>
      <WhatsAppButton/>
    </div>
  );
};

export default Teams;