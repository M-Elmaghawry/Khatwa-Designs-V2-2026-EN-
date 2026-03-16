const numberFormatter = new Intl.NumberFormat("en-US");

export function initStatsCounter(options = {}) {
  const settings = {
    sectionSelector: ".stats",
    counterSelector: ".counter",
    duration: 1500,
    stagger: 120,
    threshold: 0.35,
    ...options
  };

  const section = document.querySelector(settings.sectionSelector);
  if (!section) {
    return;
  }

  const counters = Array.from(section.querySelectorAll(settings.counterSelector));
  if (!counters.length) {
    return;
  }

  const cards = section.querySelectorAll(".stat");
  cards.forEach((card, index) => {
    card.style.setProperty("--index", String(index));
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hasAnimated = false;

  const startCounters = () => {
    if (hasAnimated) {
      return;
    }

    hasAnimated = true;
    section.classList.add("is-visible");

    if (prefersReducedMotion) {
      counters.forEach((counter) => {
        const target = readTarget(counter.dataset.target);
        const suffix = counter.dataset.suffix || "";
        counter.textContent = `${formatNumber(target)}${suffix}`;
      });
      return;
    }

    counters.forEach((counter, index) => {
      window.setTimeout(() => {
        animateCounter(counter, settings.duration);
      }, index * settings.stagger);
    });
  };

  // Observe the section once, then run counters and disconnect for performance.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        startCounters();
        observer.unobserve(entry.target);
        observer.disconnect();
      });
    },
    {
      threshold: settings.threshold,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  observer.observe(section);
}

function animateCounter(counterElement, duration) {
  const target = readTarget(counterElement.dataset.target);
  const suffix = counterElement.dataset.suffix || "";
  const startTime = performance.now();

  // requestAnimationFrame keeps updates smooth and in sync with browser paint.
  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.round(target * eased);

    counterElement.textContent = `${formatNumber(current)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
      return;
    }

    counterElement.textContent = `${formatNumber(target)}${suffix}`;
  };

  requestAnimationFrame(step);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function readTarget(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value) {
  return numberFormatter.format(value);
}