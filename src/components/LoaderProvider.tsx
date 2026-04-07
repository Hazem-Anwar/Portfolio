"use client";

import React, { createContext, useContext, useState } from "react";
import Loader from "@/components/Loader";

interface LoaderContextType {
  loading: boolean;
}

const LoaderContext = createContext<LoaderContextType>({ loading: true });

export const useLoader = () => useContext(LoaderContext);

export default function LoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  // Once loading is finished, we keep it false for the entire session
  // unless the page is hard-refreshed.

  return (
    <LoaderContext.Provider value={{ loading }}>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 1.2s ease-out",
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </LoaderContext.Provider>
  );
}
