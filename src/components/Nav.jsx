import { useState } from "react";
import { NavLink } from "react-router-dom";
import content from "../content.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Nav() {
  const [open, setOpen] = useState(false); // mobile menu
  const close = () => setOpen(false);
  return (
    <header className="bar">
      <nav className="wrap bar-in" aria-label="Main">
        <NavLink to="/" className="brand" onClick={close}>{content.site.shortName}</NavLink>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
          Menu
        </button>
        <ul id="nav-links" className={open ? "links open" : "links"}>
          {content.nav.map(([label, to]) => (
            <li key={to}>
              <NavLink to={to} end={to === "/"} onClick={close}>{label}</NavLink>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
