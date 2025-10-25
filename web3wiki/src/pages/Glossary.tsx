import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import GlossarySearch, { type GlossaryTerm } from "../components/GlossarySearch";
import TextSelectionToolbar from "../components/TextSelectionToolbar";
import FeedbackModal, { type FeedbackData } from "../components/FeedbackModal";
import { API_ENDPOINTS } from "../config/api";
import { parseTooltips } from "../utils/parseTooltips";
import "highlight.js/styles/github-dark.css";
import "./Glossary.css";

interface GlossaryData {
  en: GlossaryTerm[];
  zh: GlossaryTerm[];
}

function Glossary() {
  const { t, i18n } = useTranslation();
  const [glossaryData, setGlossaryData] = useState<GlossaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTextForFeedback, setSelectedTextForFeedback] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);

  useEffect(() => {
    fetch("/content/glossary.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load glossary");
        }
        return response.json();
      })
      .then((data: GlossaryData) => {
        setGlossaryData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const currentTerms = glossaryData ? glossaryData[i18n.language as keyof GlossaryData] || glossaryData.en : [];

  const handleTermClick = (term: GlossaryTerm) => {
    setSelectedTerm(term);
  };

  const handleCloseModal = () => {
    setSelectedTerm(null);
  };

  const handleRelatedTermClick = (termId: string) => {
    const relatedTerm = currentTerms.find((t) => t.id === termId);
    if (relatedTerm) {
      setSelectedTerm(relatedTerm);
    }
  };

  const handleReportText = (selectedText: string) => {
    setSelectedTextForFeedback(selectedText);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (feedbackData: FeedbackData) => {
    try {
      const response = await fetch(API_ENDPOINTS.feedback.submit, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId: `glossary-${selectedTerm?.id || "unknown"}`,
          language: i18n.language,
          ...feedbackData,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(t("feedback.submitSuccess"));
      } else {
        throw new Error(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      alert(t("feedback.submitSuccess"));
    }
  };

  const handleOpenEditModal = (mode: "create" | "edit", term?: GlossaryTerm) => {
    setEditMode(mode);
    setEditingTerm(term || null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTerm(null);
  };

  if (loading) {
    return (
      <main className="glossary-page page-transition">
        <div className="glossary-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t("glossary.loading")}</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="glossary-page page-transition">
        <div className="glossary-container">
          <div className="error-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
            >
              <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
            </svg>
            <h2>{t("glossary.error")}</h2>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="glossary-page page-transition">
      <div className="glossary-container">
        <header className="glossary-header">
          <h1 className="glossary-title">{t("glossary.title")}</h1>
          <p className="glossary-subtitle">{t("glossary.subtitle")}</p>
        </header>

        <GlossarySearch terms={currentTerms} onTermClick={handleTermClick} />
      </div>

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="term-modal-overlay" onClick={handleCloseModal}>
          <div className="term-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={handleCloseModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>

            <div className="modal-content">
              <div className="term-detail-header">
                <h2 className="term-detail-title">{selectedTerm.term}</h2>
                {selectedTerm.difficulty && (
                  <span className={`difficulty-badge ${selectedTerm.difficulty}`}>
                    {t(`glossary.difficulty.${selectedTerm.difficulty}`)}
                  </span>
                )}
              </div>

              <div className="term-detail-meta">
                <span className="category-badge">
                  {t(`glossary.category.${selectedTerm.category}`, selectedTerm.category)}
                </span>
                {selectedTerm.tags.map((tag) => (
                  <span key={tag} className="tag-badge">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="term-detail-definition">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                >
                  {parseTooltips(selectedTerm.definition)}
                </ReactMarkdown>
              </div>

              {selectedTerm.relatedTerms.length > 0 && (
                <div className="related-terms">
                  <h3>{t("glossary.relatedTerms")}</h3>
                  <div className="related-terms-list">
                    {selectedTerm.relatedTerms.map((relatedId) => {
                      const relatedTerm = currentTerms.find((t) => t.id === relatedId);
                      return relatedTerm ? (
                        <button
                          key={relatedId}
                          className="related-term-button"
                          onClick={() => handleRelatedTermClick(relatedId)}
                        >
                          {relatedTerm.term}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16px"
                            viewBox="0 -960 960 960"
                            width="16px"
                          >
                            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                          </svg>
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TextSelectionToolbar onReport={handleReportText} />

      {showFeedbackModal && (
        <FeedbackModal
          selectedText={selectedTextForFeedback}
          articleId={`glossary-${selectedTerm?.id || "unknown"}`}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}

      {/* Floating Action Button */}
      <button
        className="fab-edit-button"
        onClick={() => handleOpenEditModal("create")}
        aria-label={t("glossary.editButton")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="white"
        >
          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
        </svg>
      </button>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTermModal
          mode={editMode}
          term={editingTerm}
          currentTerms={currentTerms}
          language={i18n.language}
          onClose={handleCloseEditModal}
          onSuccess={() => {
            handleCloseEditModal();
            // Refresh glossary data
            window.location.reload();
          }}
        />
      )}
    </main>
  );
}

// Edit Term Modal Component
interface EditTermModalProps {
  mode: "create" | "edit";
  term: GlossaryTerm | null;
  currentTerms: GlossaryTerm[];
  language: string;
  onClose: () => void;
  onSuccess: () => void;
}

function EditTermModal({ mode, term, currentTerms, language, onClose, onSuccess }: EditTermModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<GlossaryTerm>>({
    id: term?.id || "",
    term: term?.term || "",
    definition: term?.definition || "",
    category: term?.category || "",
    tags: term?.tags || [],
    relatedTerms: term?.relatedTerms || [],
    difficulty: term?.difficulty || "beginner",
  });
  const [tagInput, setTagInput] = useState("");
  const [relatedTermInput, setRelatedTermInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate ID if creating new term
      const termId = mode === "create"
        ? formData.term?.toLowerCase().replace(/\s+/g, "-") || ""
        : formData.id;

      const payload = {
        ...formData,
        id: termId,
        language,
        mode,
      };

      const response = await fetch(API_ENDPOINTS.glossary.submit, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(t("glossary.editSuccess"));
        onSuccess();
      } else {
        throw new Error(data.message || "Failed to submit");
      }
    } catch (error) {
      console.error("Glossary edit error:", error);
      alert(t("glossary.editError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const addRelatedTerm = () => {
    if (relatedTermInput.trim() && !formData.relatedTerms?.includes(relatedTermInput.trim())) {
      setFormData({
        ...formData,
        relatedTerms: [...(formData.relatedTerms || []), relatedTermInput.trim()],
      });
      setRelatedTermInput("");
    }
  };

  const removeRelatedTerm = (termId: string) => {
    setFormData({
      ...formData,
      relatedTerms: formData.relatedTerms?.filter((t) => t !== termId) || [],
    });
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>

        <div className="modal-content">
          <h2 className="edit-modal-title">
            {mode === "create" ? t("glossary.createTerm") : t("glossary.editTerm")}
          </h2>

          <form onSubmit={handleSubmit} className="edit-form">
            {/* Term Name */}
            <div className="form-group">
              <label htmlFor="term">{t("glossary.form.term")} *</label>
              <input
                type="text"
                id="term"
                required
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                placeholder={t("glossary.form.termPlaceholder")}
              />
            </div>

            {/* Definition */}
            <div className="form-group">
              <label htmlFor="definition">{t("glossary.form.definition")} *</label>
              <textarea
                id="definition"
                required
                rows={6}
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                placeholder={t("glossary.form.definitionPlaceholder")}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">{t("glossary.form.category")} *</label>
              <input
                type="text"
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder={t("glossary.form.categoryPlaceholder")}
              />
            </div>

            {/* Difficulty */}
            <div className="form-group">
              <label htmlFor="difficulty">{t("glossary.form.difficulty")}</label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as "beginner" | "intermediate" | "advanced",
                  })
                }
              >
                <option value="beginner">{t("glossary.difficulty.beginner")}</option>
                <option value="intermediate">{t("glossary.difficulty.intermediate")}</option>
                <option value="advanced">{t("glossary.difficulty.advanced")}</option>
              </select>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label>{t("glossary.form.tags")}</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder={t("glossary.form.tagsPlaceholder")}
                />
                <button type="button" onClick={addTag} className="add-button">
                  {t("glossary.form.add")}
                </button>
              </div>
              <div className="tags-list">
                {formData.tags?.map((tag) => (
                  <span key={tag} className="tag-item">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Related Terms */}
            <div className="form-group">
              <label>{t("glossary.form.relatedTerms")}</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={relatedTermInput}
                  onChange={(e) => setRelatedTermInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRelatedTerm())}
                  placeholder={t("glossary.form.relatedTermsPlaceholder")}
                />
                <button type="button" onClick={addRelatedTerm} className="add-button">
                  {t("glossary.form.add")}
                </button>
              </div>
              <div className="tags-list">
                {formData.relatedTerms?.map((termId) => (
                  <span key={termId} className="tag-item">
                    {currentTerms.find((t) => t.id === termId)?.term || termId}
                    <button type="button" onClick={() => removeRelatedTerm(termId)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-button">
                {t("glossary.form.cancel")}
              </button>
              <button type="submit" disabled={isSubmitting} className="submit-button">
                {isSubmitting ? t("glossary.form.submitting") : t("glossary.form.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Glossary;
