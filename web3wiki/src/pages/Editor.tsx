import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CollapsibleCode from "../components/CollapsibleCode";
import Quiz from "../components/Quiz";
import { parseQuizzes } from "../utils/quizParser";
import "highlight.js/styles/github-dark.css";
import "./Editor.css";

function Editor() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [articleId, setArticleId] = useState("");
  const [language, setLanguage] = useState<"en_us" | "zh_cn">("en_us");
  const [markdown, setMarkdown] = useState("# New Article\n\nStart writing your article here...");
  const [previewMode, setPreviewMode] = useState<"edit" | "split" | "preview">("split");

  const handleSave = () => {
    // 在实际应用中，这里应该将markdown内容保存到服务器
    // 现在只是演示功能
    const langDisplay = language === "en_us" ? "English" : "中文";
    alert(`${t("editor.saved")}\nID: ${articleId}\n${t("language.chinese")}: ${langDisplay}\n${t("editor.savedInfo").replace("{length}", markdown.length.toString())}`);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${articleId || "article"}_${language}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse markdown for quizzes
  const parsedContent = useMemo(() => parseQuizzes(markdown), [markdown]);

  // Render markdown with quizzes
  const renderPreview = () => {
    const parts = parsedContent.markdown.split(/---QUIZ-(\d+)---/);
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
        const quiz = parsedContent.quizzes[quizIndex];
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
    <main className="editor-page page-transition">
      <div className="editor-container">
        <div className="editor-toolbar">
          <button className="back-button" onClick={() => navigate("/")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
            {t("editor.back")}
          </button>

          <div className="editor-controls">
            <input
              type="text"
              placeholder={t("editor.articleId")}
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              className="article-id-input"
            />

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en_us" | "zh_cn")}
              className="language-select"
            >
              <option value="en_us">{t("language.english")}</option>
              <option value="zh_cn">{t("language.chinese")}</option>
            </select>

            <div className="view-mode-buttons">
              <button
                className={previewMode === "edit" ? "active" : ""}
                onClick={() => setPreviewMode("edit")}
              >
                {t("editor.edit")}
              </button>
              <button
                className={previewMode === "split" ? "active" : ""}
                onClick={() => setPreviewMode("split")}
              >
                {t("editor.split")}
              </button>
              <button
                className={previewMode === "preview" ? "active" : ""}
                onClick={() => setPreviewMode("preview")}
              >
                {t("editor.preview")}
              </button>
            </div>

            <button className="save-button" onClick={handleSave}>
              {t("editor.save")}
            </button>
            <button className="download-button" onClick={handleDownload}>
              {t("editor.download")}
            </button>
          </div>
        </div>

        <div className={`editor-content editor-mode-${previewMode}`}>
          {(previewMode === "edit" || previewMode === "split") && (
            <div className="editor-pane">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Write your markdown here..."
                className="markdown-editor"
              />
            </div>
          )}

          {(previewMode === "preview" || previewMode === "split") && (
            <div className="preview-pane">
              <div className="markdown-preview">
                {renderPreview()}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Editor;
