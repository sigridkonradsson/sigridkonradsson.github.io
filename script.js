/* ==========================================================================
   SIGRID KONRADSSON — PORTFOLIO
   SCRIPT.JS

   Innehåll:
   1. DATALAYER / GTM-TRACKING
   2. NAVIGATION
   3. SCROLL REVEAL
   4. ÅRTAL I FOOTER
   ========================================================================== */


/* ==========================================================================
   1. DATALAYER / GTM-TRACKING
   ========================================================================== */

(function () {

  // Säkerställer att dataLayer finns.
  window.dataLayer = window.dataLayer || [];


  /* --------------------------------------------------------------------------
     EVENT 1: portfolio_loaded
     Skickas varje gång portfoliosidan laddas.
     -------------------------------------------------------------------------- */

  window.dataLayer.push({
    event: "portfolio_loaded",
    page_name: document.title
  });


  // Avgör vilken typ av länk användaren klickar på.
  function getLinkType(el) {
    const href = el.getAttribute("href") || "";

    if (el.tagName === "BUTTON") return "interaction";
    if (href.startsWith("mailto:")) return "email";
    if (href.startsWith("http")) return "outbound";
    if (href.startsWith("#")) return "internal-anchor";

    return "internal-page";
  }


  // Tar reda på vilken sektion klicket sker i.
  function getSection(el) {
    const section = el.closest("section[id], header[id]");

    return section ? section.id : "unknown";
  }


  // Körs när användaren klickar på något med data-track.
  function handleTrackedClick(event) {

    const el = event.target.closest("[data-track]");

    if (!el) return;


    const linkName = el.getAttribute("data-track");
    const linkText =
      el.getAttribute("data-track-text") || el.textContent.trim();
    const linkType = getLinkType(el);
    const pageSection = getSection(el);


    /* ------------------------------------------------------------------------
       EVENT 2: portfolio_click

       Det generella eventet.
       Skickas vid ALLA klick på element som har data-track.
       ------------------------------------------------------------------------ */

    const payload = {
      event: "portfolio_click",
      link_name: linkName,
      link_type: linkType,
      link_text: linkText,
      page_section: pageSection
    };

    window.dataLayer.push(payload);

    console.log("dataLayer.push:", payload);


    /* ------------------------------------------------------------------------
       EVENT 3: project_click

       Skickas när någon klickar på ett projekt.
       Exempel:
       project-growth
       project-gtm
       project-ai
       project-campaign
       ------------------------------------------------------------------------ */

    if (linkName.startsWith("project-")) {

      const projectPayload = {
        event: "project_click",
        project_name: linkName,
        project_text: linkText,
        page_section: pageSection
      };

      window.dataLayer.push(projectPayload);

      console.log("dataLayer.push:", projectPayload);
    }


    /* ------------------------------------------------------------------------
       EVENT 4: tool_click

       Skickas när någon klickar på ett verktyg.
       Just nu: Content Idea Validator.
       ------------------------------------------------------------------------ */

    if (linkName.startsWith("tool-")) {

      const toolPayload = {
        event: "tool_click",
        tool_name: linkName,
        tool_text: linkText,
        page_section: pageSection
      };

      window.dataLayer.push(toolPayload);

      console.log("dataLayer.push:", toolPayload);
    }


    /* ------------------------------------------------------------------------
       EVENT 5: contact_click

       Skickas när någon klickar på:
       Mail
       LinkedIn
       Instagram
       ------------------------------------------------------------------------ */

    if (linkName.startsWith("contact-")) {

      const contactPayload = {
        event: "contact_click",
        contact_method: linkName,
        contact_text: linkText,
        link_type: linkType,
        page_section: pageSection
      };

      window.dataLayer.push(contactPayload);

      console.log("dataLayer.push:", contactPayload);
    }

  }


  // Lyssnar efter klick på sidan.
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


  // Byt bakgrund på nav när man scrollat ner.
  function onScroll() {

    if (window.scrollY > 40) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }

  }

  window.addEventListener("scroll", onScroll, { passive: true });

  onScroll();


  // Mobilmeny.
  if (toggle && links) {

    toggle.addEventListener("click", function () {

      const isOpen = nav.classList.toggle("is-open");

      toggle.setAttribute("aria-expanded", String(isOpen));

    });


    // Stäng mobilmenyn när en länk klickas.
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
   ========================================================================== */

(function () {

  const revealEls = document.querySelectorAll(".reveal");

  if (!revealEls.length) return;


  // Om webbläsaren inte stödjer IntersectionObserver:
  // visa allt direkt.
  if (!("IntersectionObserver" in window)) {

    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });

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

    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px"
    }

  );


  revealEls.forEach(function (el) {

    observer.observe(el);

  });

})();



/* ==========================================================================
   4. ÅRTAL I FOOTER
   ========================================================================== */

(function () {

  const yearEl = document.getElementById("year");

  if (yearEl) {

    yearEl.textContent = new Date().getFullYear();

  }

})();