const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");
const revealNodes = document.querySelectorAll(".reveal");
const parallaxNode = document.querySelector("[data-parallax]");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (parallaxNode && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const updateParallax = () => {
    const rect = parallaxNode.getBoundingClientRect();
    const shift = (window.innerHeight - rect.top) * 0.02;
    parallaxNode.style.transform = `translateY(${Math.max(-4, Math.min(18, shift))}px)`;
  };

  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", updateParallax);
}

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !interest || !message) {
      formStatus.textContent = "Please complete the required fields before continuing.";
      return;
    }

    const subject = encodeURIComponent(`Sunny Honey Grove inquiry: ${interest}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Company: ${company || "Not provided"}`,
        `Email: ${email}`,
        `Interest: ${interest}`,
        "",
        "Project details:",
        message,
      ].join("\n")
    );

    window.location.href = `mailto:hello@sunnyhoneygrove.com?subject=${subject}&body=${body}`;
    formStatus.textContent = "Your email draft is ready to send in your mail app.";
    form.reset();
  });
}
