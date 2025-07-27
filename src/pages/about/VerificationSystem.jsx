import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import WhatsAppButton from "../../components/WhatsApp";

const VerificationSystem = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("ar"); // Set the language to Arabic
  }, [i18n]);
  return (
    <div dir={i18n.dir()} className="p-8 container-about mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">{t("verificationSystem.title")}</h1>

      {/* Introduction */}
      <section>
        <p className="mb-4">
          {t("verificationSystem.introduction.website", {
            website: "https://abadnet.com.sa",
          })}
        </p>
        <p className="mb-6">{t("verificationSystem.introduction.description")}</p>
      </section>

      {/* Commitment to Identity Verification */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          {t("verificationSystem.commitment.title")}
        </h2>
        <p className="mb-4">
          {t("verificationSystem.commitment.description")}
        </p>
      </section>

      {/* Verification Mechanisms */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          {t("verificationSystem.mechanisms.title")}
        </h2>
        <p className="mb-4">
          {t("verificationSystem.mechanisms.introduction")}
        </p>
        <ol className="list-decimal ml-6 mb-4">
          <li>
            <strong>{t("verificationSystem.mechanisms.step1.title")}</strong>{" "}
            {t("verificationSystem.mechanisms.step1.description")}
          </li>
          <li>
            <strong>{t("verificationSystem.mechanisms.step2.title")}</strong>{" "}
            {t("verificationSystem.mechanisms.step2.description")}
          </li>
        </ol>
      </section>

      {/* Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          {t("verificationSystem.summary.title")}
        </h2>
        <p className="mb-4">{t("verificationSystem.summary.description")}</p>
      </section>
      <WhatsAppButton/>
    </div>
  );
};

export default VerificationSystem;