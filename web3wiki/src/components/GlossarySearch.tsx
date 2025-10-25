import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "./CustomSelect";
import { stripTooltipSyntax } from "../utils/parseTooltips";
import "./GlossarySearch.css";

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  tags: string[];
  relatedTerms: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
}

interface GlossarySearchProps {
  terms: GlossaryTerm[];
  onTermClick: (term: GlossaryTerm) => void;
}

function GlossarySearch({ terms, onTermClick }: GlossarySearchProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  // Extract unique categories, difficulties, and tags
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(terms.map((term) => term.category)));
    return [
      { value: "all", label: t("glossary.filter.allCategories") },
      ...uniqueCategories.map((cat) => ({
        value: cat,
        label: t(`glossary.category.${cat}`, cat),
      })),
    ];
  }, [terms, t]);

  const difficulties = [
    { value: "all", label: t("glossary.filter.allDifficulties") },
    { value: "beginner", label: t("glossary.difficulty.beginner") },
    { value: "intermediate", label: t("glossary.difficulty.intermediate") },
    { value: "advanced", label: t("glossary.difficulty.advanced") },
  ];

  const tags = useMemo(() => {
    const allTags = terms.flatMap((term) => term.tags);
    const uniqueTags = Array.from(new Set(allTags));
    return [
      { value: "all", label: t("glossary.filter.allTags") },
      ...uniqueTags.map((tag) => ({ value: tag, label: tag })),
    ];
  }, [terms, t]);

  // Filter terms based on search query and filters
  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      // Search query filter (fuzzy search in term and definition)
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.tags.some((tag) => tag.toLowerCase().includes(query));

      // Category filter
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === "all" || term.difficulty === selectedDifficulty;

      // Tag filter
      const matchesTag = selectedTag === "all" || term.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesTag;
    });
  }, [terms, searchQuery, selectedCategory, selectedDifficulty, selectedTag]);

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: GlossaryTerm[] } = {};
    filteredTerms.forEach((term) => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });
    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        letter,
        terms: groups[letter].sort((a, b) => a.term.localeCompare(b.term)),
      }));
  }, [filteredTerms]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedTag("all");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all" || selectedTag !== "all";

  return (
    <div className="glossary-search">
      {/* Search Bar */}
      <div className="search-bar">
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder={t("glossary.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery("")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters">
        <CustomSelect
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder={t("glossary.filter.category")}
        />
        <CustomSelect
          options={difficulties}
          value={selectedDifficulty}
          onChange={setSelectedDifficulty}
          placeholder={t("glossary.filter.difficulty")}
        />
        <CustomSelect
          options={tags}
          value={selectedTag}
          onChange={setSelectedTag}
          placeholder={t("glossary.filter.tags")}
        />
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            {t("glossary.filter.clear")}
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span>
          {filteredTerms.length} {t("glossary.resultsCount", { count: filteredTerms.length })}
        </span>
      </div>

      {/* Terms List */}
      <div className="terms-list">
        {groupedTerms.length === 0 ? (
          <div className="no-results">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
            >
              <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
            <p>{t("glossary.noResults")}</p>
          </div>
        ) : (
          groupedTerms.map((group) => (
            <div key={group.letter} className="term-group">
              <div className="letter-header">{group.letter}</div>
              <div className="term-items">
                {group.terms.map((term) => (
                  <div
                    key={term.id}
                    className="term-item"
                    onClick={() => onTermClick(term)}
                  >
                    <div className="term-header">
                      <h3 className="term-title">{term.term}</h3>
                      {term.difficulty && (
                        <span className={`difficulty-badge ${term.difficulty}`}>
                          {t(`glossary.difficulty.${term.difficulty}`)}
                        </span>
                      )}
                    </div>
                    <p className="term-preview">
                      {(() => {
                        const cleanText = stripTooltipSyntax(term.definition);
                        return cleanText.substring(0, 150) + (cleanText.length > 150 ? "..." : "");
                      })()}
                    </p>
                    <div className="term-meta">
                      <span className="category-badge">
                        {t(`glossary.category.${term.category}`, term.category)}
                      </span>
                      {term.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GlossarySearch;
