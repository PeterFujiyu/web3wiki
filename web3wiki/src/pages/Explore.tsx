import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Explore.css";

function Explore() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="explore-page page-transition">
      <div className="explore-container">
        <h1 className="explore-title">{t("explore.title")}</h1>
        <p className="explore-subtitle">{t("explore.subtitle")}</p>

        <div className="featured-articles">
          <h2>{t("main.featuredArticles")}</h2>
          <div className="article-grid">
            <div className="article-card" onClick={() => navigate("/article/web3-tutorial")}>
              <h3>{t("main.articles.web3Tutorial.title")}</h3>
              <p>{t("main.articles.web3Tutorial.description")}</p>
            </div>
            <div className="article-card" onClick={() => navigate("/article/blockchain")}>
              <h3>{t("main.articles.blockchain.title")}</h3>
              <p>{t("main.articles.blockchain.description")}</p>
            </div>
            <div className="article-card" onClick={() => navigate("/article/ethereum")}>
              <h3>{t("main.articles.ethereum.title")}</h3>
              <p>{t("main.articles.ethereum.description")}</p>
            </div>
            <div className="article-card" onClick={() => navigate("/article/nft")}>
              <h3>{t("main.articles.nft.title")}</h3>
              <p>{t("main.articles.nft.description")}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Explore;
