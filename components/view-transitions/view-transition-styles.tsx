const viewTransitionCss = `
:root {
  --duration-exit: 150ms;
  --duration-enter: 210ms;
  --duration-move: 400ms;
}

@keyframes vt-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes vt-slide {
  from { translate: var(--slide-offset); }
  to { translate: 0; }
}

@keyframes vt-via-blur {
  30% { filter: blur(3px); }
}

::view-transition {
  pointer-events: none;
}

::view-transition-old(root) {
  display: none;
}

::view-transition-new(root) {
  animation: none;
}

::view-transition-old(.nav-forward) {
  --slide-offset: -60px;
  animation:
    var(--duration-exit) ease-in both vt-fade reverse,
    var(--duration-move) ease-in-out both vt-slide reverse;
}

::view-transition-new(.nav-forward) {
  --slide-offset: 60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both vt-fade,
    var(--duration-move) ease-in-out both vt-slide;
}

::view-transition-old(.nav-back) {
  --slide-offset: 60px;
  animation:
    var(--duration-exit) ease-in both vt-fade reverse,
    var(--duration-move) ease-in-out both vt-slide reverse;
}

::view-transition-new(.nav-back) {
  --slide-offset: -60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both vt-fade,
    var(--duration-move) ease-in-out both vt-slide;
}

::view-transition-group(.morph) {
  animation-duration: var(--duration-move);
}

::view-transition-image-pair(.morph) {
  animation-name: vt-via-blur;
}

::view-transition-group(site-header),
::view-transition-group(mobile-nav) {
  animation: none;
  z-index: 100;
}

::view-transition-old(site-header),
::view-transition-old(mobile-nav) {
  display: none;
}

::view-transition-new(site-header),
::view-transition-new(mobile-nav) {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
`;

export const ViewTransitionStyles = () => {
  return (
    <style href="view-transitions" precedence="default">
      {viewTransitionCss}
    </style>
  );
};
