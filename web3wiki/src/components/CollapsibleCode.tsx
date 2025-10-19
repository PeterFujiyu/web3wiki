import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./CollapsibleCode.css";

interface CollapsibleCodeProps {
  children: React.ReactNode;
  className?: string;
}

function CollapsibleCode({ children, className }: CollapsibleCodeProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // 提取代码文本内容
    const codeElement = children as any;
    const codeText = codeElement?.props?.children || "";

    navigator.clipboard.writeText(codeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="collapsible-code-container">
      <div className="code-header">
        <button
          className="code-toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            className={`toggle-icon ${isExpanded ? "expanded" : ""}`}
          >
            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
          </svg>
          <span>{isExpanded ? t("code.hide") : t("code.show")}</span>
        </button>
        {isExpanded && (
          <button
            className="copy-button"
            onClick={handleCopy}
            title={copied ? t("code.copied") : t("code.copy")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#e3e3e3"
            >
              <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
            </svg>
            {copied && <span className="copied-tooltip">{t("code.copied")}</span>}
          </button>
        )}
      </div>
      {isExpanded && (
        <pre className={className}>
          {children}
        </pre>
      )}
    </div>
  );
}

export default CollapsibleCode;
