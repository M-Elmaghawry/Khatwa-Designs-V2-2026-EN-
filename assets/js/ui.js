export function renderServices(services) {
  const root = document.getElementById("services-grid");
  const footerServices = document.getElementById("footer-services");
  const serviceSelect = document.getElementById("service");
  if (!root || !footerServices) {
    return;
  }

  root.innerHTML = services
    .map(
      (service) => `
        <article class="service-card" data-animate="fade-up">
          <div class="service-icon" aria-hidden="true">${service.icon}</div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
        </article>
      `
    )
    .join("");

  footerServices.innerHTML = services
    .slice(0, 5)
    .map((service) => `<li><a href="#services">${service.title}</a></li>`)
    .join("");

  if (serviceSelect) {
    serviceSelect.innerHTML = [
      '<option value="">Select service</option>',
      ...services.map((service) => `<option value="${service.title}">${service.title}</option>`)
    ].join("");
  }
}

export function renderPortfolio(projects) {
  const root = document.getElementById("portfolio-grid");
  if (!root) {
    return;
  }

  root.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card" data-animate="zoom-in">
          <img src="${project.image}" alt="${project.title}" width="900" height="600" loading="lazy" decoding="async" />
          <div class="project-overlay">
            <span class="project-chip">${project.category}</span>
            <h3>${project.title}</h3>
            <a class="project-link" href="#contact" aria-label="View project ${project.title}">View Project</a>
          </div>
        </article>
      `
    )
    .join("");
}

export function renderClients(clients) {
  const track = document.getElementById("logo-track");
  if (!track) {
    return;
  }

  // Duplicate logos once to create a seamless marquee effect.
  const looped = [...clients, ...clients];

  track.innerHTML = looped
    .map(
      (client) => `
        <div class="logo-item">
          <img src="${client.logo}" alt="${client.name} logo" width="120" height="44" loading="lazy" decoding="async" />
        </div>
      `
    )
    .join("");
}

export function renderTestimonials(testimonials) {
  const track = document.getElementById("testimonial-track");
  if (!track) {
    return;
  }

  track.innerHTML = testimonials
    .map(
      (item) => `
        <article class="testimonial-item">
          <p>“${item.text}”</p>
          <div class="testimonial-meta">
            <div>
              <strong>${item.name}</strong>
              <div>${item.position || item.company}</div>
            </div>
            <div class="stars" aria-label="${item.rating} out of 5 stars">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div>
          </div>
        </article>
      `
    )
    .join("");
}

export function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

export function initTestimonialSlider(itemsCount) {
  const track = document.getElementById("testimonial-track");
  const prev = document.getElementById("testimonial-prev");
  const next = document.getElementById("testimonial-next");
  const slider = document.getElementById("testimonial-slider");
  
  if (!track || !prev || !next || itemsCount < 2) {
    return;
  }

  let index = 0;
  let itemsPerView = getItemsPerView();
  let autoplayInterval = null;
  let isHovering = false;

  const updateActiveState = () => {
    const items = track.querySelectorAll(".testimonial-item");
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
  };

  const goTo = (newIndex) => {
    const maxIndex = Math.max(itemsCount - itemsPerView, 0);
    if (newIndex < 0) {
      index = maxIndex;
    } else if (newIndex > maxIndex) {
      index = 0;
    } else {
      index = newIndex;
    }

    const firstCard = track.querySelector(".testimonial-item");
    if (!firstCard) {
      return;
    }

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.gap || "0") || 0;
    const cardWidth = Number.parseFloat(window.getComputedStyle(firstCard).width) || firstCard.offsetWidth;
    const stepWidth = cardWidth + gap;
    track.style.transform = `translateX(-${index * stepWidth}px)`;
    
    updateActiveState();
  };

  const syncResponsiveState = () => {
    itemsPerView = getItemsPerView();
    const maxIndex = Math.max(itemsCount - itemsPerView, 0);
    if (index > maxIndex) {
      index = maxIndex;
    }

    const hasOverflow = maxIndex > 0;
    prev.disabled = !hasOverflow;
    next.disabled = !hasOverflow;
    goTo(index);
  };

  const startAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    autoplayInterval = setInterval(() => {
      if (!isHovering && Math.max(itemsCount - itemsPerView, 0) > 0) {
        goTo(index + 1);
      }
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  // Event listeners
  prev.addEventListener("click", () => {
    goTo(index - 1);
    stopAutoplay();
    startAutoplay();
  });

  next.addEventListener("click", () => {
    goTo(index + 1);
    stopAutoplay();
    startAutoplay();
  });

  // Pause on hover
  if (slider) {
    slider.addEventListener("mouseenter", () => {
      isHovering = true;
      stopAutoplay();
    });

    slider.addEventListener("mouseleave", () => {
      isHovering = false;
      startAutoplay();
    });
  }

  window.addEventListener("resize", syncResponsiveState);
  syncResponsiveState();
  startAutoplay();
}

function getItemsPerView() {
  if (window.innerWidth <= 768) {
    return 1;
  }

  if (window.innerWidth <= 1024) {
    return 2;
  }

  return 3;
}

export function applySiteSettings(siteData) {
  const subtitle = document.getElementById("hero-subtitle");
  const copyright = document.getElementById("copyright-line");

  if (subtitle && siteData.heroSubtitle) {
    subtitle.textContent = siteData.heroSubtitle;
  }

  if (copyright && siteData.copyright && copyright.children.length === 0) {
    copyright.textContent = siteData.copyright;
  }
}
