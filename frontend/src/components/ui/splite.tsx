"use client";

import { Suspense, lazy, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

/* Loading skeleton shown before & during Spline download */
function SplineSkeleton() {
  return (
    <motion.div
      key="skeleton"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050810",
        zIndex: 5,
      }}
    >
      {/* Pulsing robot silhouette placeholder */}
      <motion.div
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "160px",
          height: "220px",
          borderRadius: "50% 50% 40% 40% / 40% 40% 50% 50%",
          background: "radial-gradient(ellipse at 50% 30%, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0.04) 60%, transparent 100%)",
          border: "1px solid rgba(14,165,233,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spline-loader" />
      </motion.div>
    </motion.div>
  );
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    /* Container must be relative so the skeleton overlays correctly */
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

      {/* Skeleton fades out once Spline fires onLoad */}
      <AnimatePresence>
        {!loaded && <SplineSkeleton />}
      </AnimatePresence>

      {/* Spline fades in once loaded — starts fully transparent */}
      <Suspense fallback={null}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Spline
            scene={scene}
            className={className}
            onLoad={() => setLoaded(true)}
          />
        </motion.div>
      </Suspense>
    </div>
  );
}
