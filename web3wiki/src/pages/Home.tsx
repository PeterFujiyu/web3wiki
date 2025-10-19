import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Newsletter from "../components/Newsletter";
import "./Home.css";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="home-page page-transition">
      <div className="home-hero">
        <div className="home-container">
          <h1 className="home-title">{t("home.title")}</h1>
          <p className="home-subtitle">{t("home.subtitle")}</p>

          <div className="home-cta">
            <button className="cta-button primary" onClick={() => navigate("/explore")}>
              {t("home.exploreButton")}
            </button>
            <button className="cta-button secondary" onClick={() => navigate("/about")}>
              {t("home.learnMore")}
            </button>
          </div>
        </div>
      </div>

      <Newsletter />
    </main>
  );
}

export default Home;
