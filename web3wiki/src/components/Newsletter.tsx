import { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../config/api";
import "./Newsletter.css";

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(API_ENDPOINTS.newsletter.subscribe, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setEmail("");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 -960 960 960"
            width="48px"
          >
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
          </svg>
        </div>
        <h2 className="newsletter-title">{t("newsletter.title")}</h2>
        <p className="newsletter-subtitle">{t("newsletter.subtitle")}</p>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletter.placeholder")}
            className="newsletter-input"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="newsletter-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("newsletter.submitting") : t("newsletter.subscribe")}
          </button>
        </form>

        {submitStatus === "success" && (
          <p className="newsletter-message success">{t("newsletter.success")}</p>
        )}
        {submitStatus === "error" && (
          <p className="newsletter-message error">{t("newsletter.error")}</p>
        )}
      </div>
    </div>
  );
}

export default Newsletter;
