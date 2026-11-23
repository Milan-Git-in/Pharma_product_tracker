"use client";

import dynamic from "next/dynamic";

const HashRouterApp = dynamic(
  () => import("@/components/router/HashRouterApp"),
  { ssr: false }
);

export default function RootPage() {
  return <HashRouterApp />;
}
