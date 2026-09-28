import { ViewTransition, type ReactNode } from "react";

interface DirectionalTransitionProps {
  children: ReactNode;
}

export const DirectionalTransition = ({
  children,
}: DirectionalTransitionProps) => {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
};
