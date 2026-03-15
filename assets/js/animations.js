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

export function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(counterElement) {
  const target = Number(counterElement.dataset.target || 0);
  const duration = 1200;
  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counterElement.textContent = Math.floor(target * eased).toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      counterElement.textContent = target.toString();
    }
  };

  requestAnimationFrame(step);
}
