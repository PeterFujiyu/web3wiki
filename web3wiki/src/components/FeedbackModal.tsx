import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "./CustomSelect";
import "./FeedbackModal.css";

interface FeedbackModalProps {
  selectedText: string;
  articleId: string;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  selectedText: string;
  suggestion: string;
  type: "correction" | "improvement" | "addition" | "question";
  contactEmail?: string;
}

function FeedbackModal({ selectedText, articleId, onClose, onSubmit }: FeedbackModalProps) {
  const { t } = useTranslation();
  const [suggestion, setSuggestion] = useState("");
  const [type, setType] = useState<FeedbackData["type"]>("correction");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypeOptions = [
    { value: "correction", label: t("feedback.types.correction") },
    { value: "improvement", label: t("feedback.types.improvement") },
    { value: "addition", label: t("feedback.types.addition") },
    { value: "question", label: t("feedback.types.question") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!suggestion.trim()) {
      return;
    }

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      selectedText,
      suggestion: suggestion.trim(),
      type,
      contactEmail: contactEmail.trim() || undefined,
    };

    try {
      await onSubmit(feedbackData);
      onClose();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="feedback-modal-backdrop" onClick={handleBackdropClick}>
      <div className="feedback-modal">
        <div className="feedback-modal-header">
          <h3>{t("feedback.modalTitle")}</h3>
          <button className="close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="feedback-section">
            <label>{t("feedback.selectedText")}</label>
            <div className="selected-text-display">
              "{selectedText}"
            </div>
          </div>

          <div className="feedback-section">
            <label>{t("feedback.typeLabel")}</label>
            <CustomSelect
              options={feedbackTypeOptions}
              value={type}
              onChange={(value) => setType(value as FeedbackData["type"])}
            />
          </div>

          <div className="feedback-section">
            <label htmlFor="feedback-suggestion">{t("feedback.suggestionLabel")}</label>
            <textarea
              id="feedback-suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder={t("feedback.suggestionPlaceholder")}
              className="feedback-textarea"
              rows={6}
              required
            />
          </div>

          <div className="feedback-section">
            <label htmlFor="feedback-email">{t("feedback.emailLabel")}</label>
            <input
              id="feedback-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={t("feedback.emailPlaceholder")}
              className="feedback-input"
            />
          </div>

          <div className="feedback-modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("feedback.cancel")}
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !suggestion.trim()}
            >
              {isSubmitting ? t("feedback.submitting") : t("feedback.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackModal;
