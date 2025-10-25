import "./App.css";
import "./i18n/config";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Article from "./pages/Article";
import Editor from "./pages/Editor";
import About from "./pages/About";
import Glossary from "./pages/Glossary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route path="article/:id" element={<Article />} />
          <Route path="editor" element={<Editor />} />
          <Route path="about" element={<About />} />
          <Route path="glossary" element={<Glossary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
