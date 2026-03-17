export function initScrollAnimations() {
  const animated = document.querySelectorAll("[data-animate]");
  if (!animated.length) {
    return;
  }

  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

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
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
  );

  animated.forEach((item, index) => {
    item.style.setProperty("--animation-delay", `calc(${index} * 80ms)`);
    observer.observe(item);
  });
}

/**
 * Initialize navbar scroll behavior with shrinking effect and active section tracking
 */
export function initNavbarScrollBehavior() {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".site-nav a");
  const sections = document.querySelectorAll("[id]");

  if (!header) {
    return;
  }

  // Navbar scroll shrinking
  let lastScrollY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      header.classList.toggle("scrolled", scrollY > 20);
      lastScrollY = scrollY;
    },
    { passive: true }
  );

  // Active link highlighting based on scroll position
  if (!navLinks.length) {
    return;
  }

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (lastScrollY >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    },
    { passive: true }
  );
}
