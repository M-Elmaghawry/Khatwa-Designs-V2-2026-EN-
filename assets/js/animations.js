export function initScrollAnimations() {
  const animated = document.querySelectorAll("[data-animate]");
  if (!animated.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => {
          entry.target.classList.add("in-view");
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -20px 0px" }
  );

  animated.forEach((item) => observer.observe(item));
}
