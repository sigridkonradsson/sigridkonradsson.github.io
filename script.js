/* ==========================================================================
   SIGRID KONRADSSON — PORTFOLIO
   SCRIPT.JS

   Innehåll (sök på rubrikerna för att hitta rätt del):
   1. DATALAYER / GTM-TRACKING   <- viktigast om du bara ska ändra en sak
   2. NAVIGATION (scroll-bakgrund + mobilmeny)
   3. SCROLL REVEAL
   4. ÅRTAL I FOOTER
   ========================================================================== */

/* ==========================================================================
   1. DATALAYER / GTM-TRACKING
   ==========================================================================
   Alla element som ska mätas har ett attribut i HTML:

     data-track="namn-pa-handelsen"
     data-track-text="Valfri, mer läsbar text (visas i GTM/GA4-rapporter)"

   Varje klick på ett sådant element skickar ett event till dataLayer:

     window.dataLayer.push({
       event: "portfolio_click",
       link_name: "...",   // värdet från data-track
       link_type: "...",   // "internal-anchor" / "internal-page" / "outbound" / "email"
       link_text: "...",   // synlig länktext, eller data-track-text om satt
       page_section: "..." // vilken sektion (id) klicket skedde i
     });

   I Google Tag Manager skapar du sedan:
   - En "Custom Event"-trigger som lyssnar på eventnamnet "portfolio_click"
   - En GA4-eventtag som läser ut link_name / link_type / link_text / page_section
     som eventparametrar via Data Layer Variables.

   Vill du lägga till fler mätpunkter senare: lägg bara till
   data-track="..." på valfritt element, så plockas det upp automatiskt
   av koden nedan — du behöver INTE skriva ny JS för varje nytt klick.
   ========================================================================== */

(function () {
  window.dataLayer = window.dataLayer || [];

  // Avgör vilken typ av länk det är, för renare rapportering i GTM/GA4.
  function getLinkType(el) {
    const href = el.getAttribute("href") || "";

    if (el.tagName === "BUTTON") return "interaction";
    if (href.startsWith("mailto:")) return "email";
    if (href.startsWith("http")) return "outbound";
    if (href.startsWith("#")) return "internal-anchor";
    return "internal-page";
  }

  // Hittar vilken <section id="..."> klicket skedde inom, för page_section.
  function getSection(el) {
    const section = el.closest("section[id], header[id]");
    return section ? section.id : "unknown";
  }

  function handleTrackedClick(event) {
    const el = event.target.closest("[data-track]");
    if (!el) return;

    const payload = {
      event: "portfolio_click",
      link_name: el.getAttribute("data-track"),
      link_type: getLinkType(el),
      link_text: el.getAttribute("data-track-text") || el.textContent.trim(),
      page_section: getSection(el),
    };

    window.dataLayer.push(payload);

    // Ta bort raden nedan i produktion om du inte vill se loggar i konsolen.
    console.log("dataLayer.push:", payload);
  }

  document.addEventListener("click", handleTrackedClick);
})();

/* ==========================================================================
   2. NAVIGATION
   ========================================================================== */
(function () {
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (!nav) return;

  // Byt bakgrund på nav när man scrollat en bit ner på sidan.
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobilmeny (hamburgare) — visas endast under 900px, se style.css punkt 14.
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Stäng menyn automatiskt när man klickar en länk i den.
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();

/* ==========================================================================
   3. SCROLL REVEAL
   Element med klassen .reveal blir dolda via CSS (clip-path + opacity)
   och avslöjas sofistikerat när de scrollas in i vy, med IntersectionObserver.
   ========================================================================== */
(function () {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  // Om webbläsaren saknar stöd: visa allt direkt istället för att gömma det.
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ==========================================================================
   4. ÅRTAL I FOOTER
   Uppdaterar automatiskt © -årtalet i footern, så du slipper göra det manuellt.
   ========================================================================== */
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();window.dataLayer = window.dataLayer || [];

window.dataLayer.push({
  event: "portfolio_loaded",
  page_name: document.title
});