/*
 * ALL site text lives in this file.
 * Anything inside [square brackets] is a placeholder. The production build
 * fails until every placeholder is replaced with real, proven information.
 */

// Set to true only when Ovi says "launch" (Step 6 connects this to search engines).
export const LAUNCH = false;

const content = {
  site: {
    name: "Al-Sami Bin Hossain Ovi",
    shortName: "Al-Sami Ovi",
    country: "Bangladesh",
  },

  // [label, path]
  nav: [
    ["Home", "/"],
    ["About", "/about"],
    ["Work", "/work"],
    ["Achievements", "/achievements"],
    ["Education", "/education"],
    ["Contact", "/contact"],
  ],

  home: {
    statement: "Environmental science student from Bangladesh.",
    goal: "I am applying for a bachelor's scholarship at an international university.",
    facts: [
      { label: "Education", value: "SSC 2024 and HSC 2026, St. Gregory's High School & College" },
      {
        label: "GPA",
        value: "5 out of 5 in both SSC and HSC",
        note: "Bangladesh uses a 5-point scale. A GPA of 5 is the highest grade.",
      },
      { label: "Field", value: "Environmental science and engineering" },
      { label: "Research interest", value: "Open data and satellite images" },
    ],
    // Ovi must confirm this number before launch.
    statCount: "[N: confirm number of events]",
    featured: [
      { title: "[Project 1 title]", summary: "[Problem and result in one line]" },
      { title: "[Project 2 title]", summary: "[Problem and result in one line]" },
      { title: "[Project 3 title]", summary: "[Problem and result in one line]" },
    ],
    itHighlight: {
      title: "IT olympiad",
      result: "1st place, national level",
      organizer: "[Organizer]",
      year: "[Year]",
      proof: "[Certificate or link]",
    },
    serviceHighlight: {
      title: "Scouting: street cleaning",
      text: "With other scouts, I helped keep a busy street clean.",
      place: "[Place]",
      date: "[Date]",
      proof: "[Photo or report]",
    },
    currently: "[One short line about what you are working on now]",
    cv: "[CV PDF link]", // Later: "/cv.pdf" after you add public/cv.pdf
  },
};

/** True if a string contains [placeholder] text. */
export const isPlaceholder = (s) => typeof s === "string" && /\[[^\]]+\]/.test(s);

/** Returns every placeholder in the content, with its path. */
export function findPlaceholders(value, path = "content") {
  if (typeof value === "string") return isPlaceholder(value) ? [{ path, text: value }] : [];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => findPlaceholders(v, `${path}.${k}`));
  }
  return [];
}

export default content;
