import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Quiz.css";

interface QuizProps {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation?: string;
}

function Quiz({ question, options, explanation }: QuizProps) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showResult) return; // Already answered
    setSelectedIndex(index);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setShowResult(false);
  };

  const isCorrect = selectedIndex !== null && options[selectedIndex]?.isCorrect;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
        <h3>{t("quiz.title")}</h3>
      </div>

      <p className="quiz-question">{question}</p>

      <div className="quiz-options">
        {options.map((option, index) => {
          const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...
          let optionClass = "quiz-option";

          if (showResult) {
            if (option.isCorrect) {
              optionClass += " correct";
            } else if (index === selectedIndex) {
              optionClass += " incorrect";
            } else {
              optionClass += " disabled";
            }
          } else if (index === selectedIndex) {
            optionClass += " selected";
          }

          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => handleOptionClick(index)}
            >
              <span className="option-label">{optionLabel})</span>
              <span className="option-text">{option.text}</span>
              {showResult && option.isCorrect && (
                <svg
                  className="check-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                >
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              )}
              {showResult && index === selectedIndex && !option.isCorrect && (
                <svg
                  className="cross-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {showResult && (
        <div className={`quiz-result ${isCorrect ? "correct" : "incorrect"}`}>
          <p className="result-text">
            {isCorrect ? t("quiz.correct") : t("quiz.incorrect")}
          </p>
          {explanation && (
            <div className="quiz-explanation">
              <strong>{t("quiz.explanation")}:</strong> {explanation}
            </div>
          )}
          <button className="retry-button" onClick={handleReset}>
            {t("quiz.retry")}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
