import type { ReactNode } from "react";

type PageTransitionProps = {
  pageKey: string;
  children: ReactNode;
};

function PageTransition({
  pageKey,
  children,
}: PageTransitionProps) {
  return (
    <div
      key={pageKey}
      className="page-transition"
    >
      {children}
    </div>
  );
}

export default PageTransition;