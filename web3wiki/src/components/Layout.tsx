import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, Link } from "react-router-dom";

function Layout() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "dark");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langSelectorRef.current &&
        !langSelectorRef.current.contains(event.target as Node)
      ) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setShowLangMenu(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1>{t("header.title")}</h1>
          </Link>
          <div
            className="language-selector"
            ref={langSelectorRef}
            onClick={() => setShowLangMenu(!showLangMenu)}
          >
            <span>
              {i18n.language === "en"
                ? t("language.english")
                : t("language.chinese")}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
            {showLangMenu && (
              <div className="language-menu">
                <div
                  className="language-option"
                  onClick={() => changeLanguage("en")}
                >
                  {t("language.english")}
                </div>
                <div
                  className="language-option"
                  onClick={() => changeLanguage("zh")}
                >
                  {t("language.chinese")}
                </div>
              </div>
            )}
          </div>
        </div>
        <nav>
          <div>
            <Link to="/">{t("header.nav.home")}</Link>
            <Link to="/explore">{t("header.nav.explore")}</Link>
            <Link to="/about">{t("header.nav.about")}</Link>
            <Link to="/editor" className="nav-item">
              <span>{t("header.nav.editor")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#1a1a1a"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
            </Link>
            <div className="nav-item">
              <a href="#">{t("header.nav.try")} </a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
              </svg>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="App-footer">
        <p>{t("footer.copyright")}</p>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#ffffff"
          >
            <path d="M396-396q-32-32-58.5-67T289-537q-5 14-6.5 28.5T281-480q0 83 58 141t141 58q14 0 28.5-2t28.5-6q-39-22-74-48.5T396-396Zm57-56q51 51 114 87.5T702-308q-40 51-98 79.5T481-200q-117 0-198.5-81.5T201-480q0-65 28.5-123t79.5-98q20 72 56.5 135T453-452Zm290 72q-20-5-39.5-11T665-405q8-18 11.5-36.5T680-480q0-83-58.5-141.5T480-680q-20 0-38.5 3.5T405-665q-8-19-13.5-38T381-742q24-9 49-13.5t51-4.5q117 0 198.5 81.5T761-480q0 26-4.5 51T743-380ZM440-840v-120h80v120h-80Zm0 840v-120h80V0h-80Zm323-706-57-57 85-84 57 56-85 85ZM169-113l-57-56 85-85 57 57-85 84Zm671-327v-80h120v80H840ZM0-440v-80h120v80H0Zm791 328-85-85 57-57 84 85-56 57ZM197-706l-84-85 56-57 85 85-57 57Zm199 310Z" />
          </svg>
        </button>
      </footer>
    </div>
  );
}

export default Layout;
