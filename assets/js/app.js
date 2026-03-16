import { loadAllData } from "./data-loader.js";
import { initScrollAnimations } from "./animations.js";
import { initStatsCounter } from "./stats-counter.js";
import {
  applySiteSettings,
  initMobileNav,
  initTestimonialSlider,
  renderClients,
  renderPortfolio,
  renderServices,
  renderTestimonials
} from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  initMobileNav();

  try {
    const { services, portfolio, clients, testimonials, site } = await loadAllData();

    applySiteSettings(site);
    renderServices(services);
    renderPortfolio(portfolio);
    renderClients(clients);
    renderTestimonials(testimonials);
    initTestimonialSlider(testimonials.length);

    initScrollAnimations();
    initStatsCounter();

    initEmailJs(site.emailjs || {});
    initContactForm(site.emailjs || {});
  } catch (error) {
    console.error("Initialization error:", error);
    const status = document.getElementById("form-status");
    if (status) {
      status.textContent = "Some dynamic content failed to load. Please refresh the page.";
    }
  }
});

function initEmailJs(emailConfig) {
  if (!window.emailjs || !emailConfig.publicKey || emailConfig.publicKey.includes("YOUR_")) {
    return;
  }

  window.emailjs.init({
    publicKey: emailConfig.publicKey
  });
}

function initContactForm(emailConfig) {
  const form = document.getElementById("contact-form");
  const sendBtn = document.getElementById("send-btn");
  const status = document.getElementById("form-status");

  if (!form || !sendBtn || !status) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('input[name="company"]');
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    status.textContent = "";

    const payload = {
      from_name: form.name.value,
      from_email: form.email.value,
      country: form.country.value,
      service: form.service.value,
      phone: form.phone.value,
      message: form.message.value
    };

    const serviceId = emailConfig.serviceId;
    const templateId = emailConfig.templateId;

    try {
      if (!window.emailjs || !serviceId || !templateId || serviceId.includes("YOUR_") || templateId.includes("YOUR_")) {
        await fakeSubmit();
      } else {
        await window.emailjs.send(serviceId, templateId, payload);
      }

      status.textContent = "Message sent successfully. We will contact you soon.";
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      status.textContent = "Failed to send. Please try again in a moment.";
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Message";
    }
  });
}

function fakeSubmit() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 900);
  });
}
