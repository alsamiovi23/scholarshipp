import { lazy, Suspense, useEffect, useState } from "react";

// The globe code loads only when needed, after the main content.
const Globe = lazy(() => import("./Globe.jsx"));

// Static image instead of the live globe: reduced motion, data saver, slow network, weak device.
function useStatic() {
  const c = navigator.connection || {};
  return (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    c.saveData ||
    /2g/.test(c.effectiveType || "") ||
    (navigator.deviceMemory || 8) <= 2 ||
    (navigator.hardwareConcurrency || 8) <= 2
  );
}

export default function GlobeSlot() {
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useStatic()) return;
    const go = () => setLive(true);
    const id = "requestIdleCallback" in window ? requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 1200);
    return () => ("cancelIdleCallback" in window ? cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  return (
    <div className="globe" role="img" aria-label="A slowly turning globe with a marker on Bangladesh. Decorative only.">
      {!ready && <img src="/globe-static.svg" alt="" width="380" height="380" />}
      {live && (
        <Suspense fallback={null}>
          <Globe onReady={() => setReady(true)} />
        </Suspense>
      )}
    </div>
  );
}
