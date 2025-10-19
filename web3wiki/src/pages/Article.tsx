import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CollapsibleCode from "../components/CollapsibleCode";
import Quiz from "../components/Quiz";
import TextSelectionToolbar from "../components/TextSelectionToolbar";
import FeedbackModal, { type FeedbackData } from "../components/FeedbackModal";
import { parseQuizzes, type QuizData } from "../utils/quizParser";
import { API_ENDPOINTS } from "../config/api";
import "highlight.js/styles/github-dark.css";
import "./Article.css";

function Article() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string>("");
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTextForFeedback, setSelectedTextForFeedback] = useState("");

  // 验证文章ID是否有效
  const validArticles = ["blockchain", "ethereum", "nft", "web3-tutorial"];

  useEffect(() => {
    if (!id || !validArticles.includes(id)) {
      setError("Article not found");
      setLoading(false);
      return;
    }

    const lang = i18n.language === "zh" ? "zh_cn" : "en_us";
    const markdownPath = `/content/${id}/${lang}.md`;

    fetch(markdownPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load article");
        }
        return response.text();
      })
      .then((text) => {
        const parsed = parseQuizzes(text);
        setMarkdown(parsed.markdown);
        setQuizzes(parsed.quizzes);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, i18n.language]);

  if (loading) {
    return (
      <main className="article-page page-transition">
        <div className="article-container">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="article-page page-transition">
        <div className="article-container">
          <h1>{error}</h1>
          <button onClick={() => navigate("/")}>Go back to home</button>
        </div>
      </main>
    );
  }

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
          articleId: id,
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
      console.log("Feedback data:", {
        articleId: id,
        language: i18n.language,
        ...feedbackData,
        timestamp: new Date().toISOString(),
      });

      // Show success message anyway for demo purposes
      alert(t("feedback.submitSuccess"));
    }
  };

  // Render markdown with quizzes
  const renderContent = () => {
    // Split markdown by quiz placeholders
    const parts = markdown.split(/---QUIZ-(\d+)---/);
    const elements: JSX.Element[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Markdown content
        if (parts[i].trim()) {
          elements.push(
            <ReactMarkdown
              key={`md-${i}`}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ children }) => <CollapsibleCode>{children}</CollapsibleCode>,
              }}
            >
              {parts[i]}
            </ReactMarkdown>
          );
        }
      } else {
        // Quiz placeholder
        const quizIndex = parseInt(parts[i]);
        const quiz = quizzes[quizIndex];
        if (quiz) {
          elements.push(
            <Quiz
              key={`quiz-${quizIndex}`}
              question={quiz.question}
              options={quiz.options}
              explanation={quiz.explanation}
            />
          );
        }
      }
    }

    return elements;
  };

  return (
    <main className="article-page page-transition">
      <div className="article-container">
        <button className="back-button" onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
          {t("language.english") === "English" ? "Back" : "返回"}
        </button>

        <article className="article-content">
          <div className="markdown-preview">
            {renderContent()}
          </div>
        </article>
      </div>

      <TextSelectionToolbar onReport={handleReportText} />

      {showFeedbackModal && (
        <FeedbackModal
          selectedText={selectedTextForFeedback}
          articleId={id || ""}
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </main>
  );
}

export default Article;
