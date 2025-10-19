import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./TextSelectionToolbar.css";

interface TextSelectionToolbarProps {
  onReport: (selectedText: string) => void;
}

function TextSelectionToolbar({ onReport }: TextSelectionToolbarProps) {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          setSelectedText(text);
          setVisible(true);
        }
      } else {
        setVisible(false);
      }
    };

    // Listen to both mouseup and touchend for mobile support
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("touchend", handleSelectionChange);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("touchend", handleSelectionChange);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const handleReportClick = () => {
    onReport(selectedText);
    setVisible(false);
    // Clear selection
    window.getSelection()?.removeAllRanges();
  };

  if (!visible) return null;

  return (
    <div
      className="text-selection-toolbar"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <button className="report-button" onClick={handleReportClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 -960 960 960"
          width="16px"
        >
          <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
        {t("feedback.report")}
      </button>
    </div>
  );
}

export default TextSelectionToolbar;
