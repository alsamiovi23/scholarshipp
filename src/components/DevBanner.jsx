import content, { findPlaceholders } from "../content.js";

// Shows only in `npm run dev`. Lists every [placeholder] still in src/content.js.
export default function DevBanner() {
  if (!import.meta.env.DEV) return null;
  const list = findPlaceholders(content);
  if (!list.length) return null;
  return (
    <details className="dev">
      <summary>Dev only: {list.length} placeholders left</summary>
      <ul>
        {list.map((p) => (
          <li key={p.path}>
            <code>{p.path}</code> {p.text}
          </li>
        ))}
      </ul>
    </details>
  );
}
