const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const newsletterForm = document.querySelector("#newsletter-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");
const revealNodes = document.querySelectorAll(".reveal");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove("open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    siteNav.classList.add("open");
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  menuToggle.addEventListener("click", () => {
    if (siteNav.classList.contains("open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      !(target instanceof Node) ||
      siteNav.contains(target) ||
      menuToggle.contains(target)
    ) {
      return;
    }

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
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
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

if (newsletterForm && formStatus) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(newsletterForm);
    const email = String(data.get("email") || "").trim();

    if (!email) {
      formStatus.textContent = "Please add your email address.";
      return;
    }

    const subject = encodeURIComponent("Sunny Honey Grove newsletter signup");
    const body = encodeURIComponent(
      [
        "Please add this email to Sunny Honey Grove updates:",
        "",
        email,
      ].join("\n")
    );

    window.location.href = `mailto:info@sunnyhoneygrove.com?subject=${subject}&body=${body}`;
    formStatus.textContent = "Your email draft is ready to send.";
    newsletterForm.reset();
  });
}
