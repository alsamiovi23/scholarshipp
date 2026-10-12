import { useEffect, useState } from "react";

const KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");

  const apply = (t) => {
    document.documentElement.dataset.theme = t;
    setTheme(t);
  };

  // Follow the system setting until the visitor picks a theme.
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      let saved = null;
      try { saved = localStorage.getItem(KEY); } catch {}
      if (!saved) apply(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch {}
    apply(next);
  };

  return (
    <button className="theme-btn" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
