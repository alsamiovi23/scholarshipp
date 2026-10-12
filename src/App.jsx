import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import content from "./content.js";
import DevBanner from "./components/DevBanner.jsx";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";

// Pages built in later steps show a simple notice for now.
const Stub = ({ title }) => (
  <main id="main" className="wrap page">
    <h1>{title}</h1>
    <p>This page is built in a later step.</p>
  </main>
);

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // start each page at the top
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <DevBanner />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        {content.nav.slice(1).map(([label, to]) => (
          <Route key={to} path={to} element={<Stub title={label} />} />
        ))}
        <Route path="*" element={<Stub title="Page not found" />} />
      </Routes>
      <footer className="wrap foot">
        © {new Date().getFullYear()} {content.site.name}
      </footer>
    </>
  );
}
