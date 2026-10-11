"use client";
import { Splash } from "./Splash";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Splash />
      {children}
    </>
  );
}
