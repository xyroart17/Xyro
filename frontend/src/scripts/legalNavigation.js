/**
 * Legal Center — Navigation & Interaction Script
 * Handles scroll spy, deep links, FAQ toggles, and back navigation.
 */
document.addEventListener("astro:page-load", () => {
    // --- SCROLL SPY ---
    const sections = document.querySelectorAll(".legal-section");
    const sidebarLinks = document.querySelectorAll(".legal-sidebar-nav a");
    const mobileLinks = document.querySelectorAll(".legal-mobile-nav a");

    if (sections.length === 0) return;

    const allNavLinks = [...sidebarLinks, ...mobileLinks];

    function setActiveLink(id) {
        allNavLinks.forEach((link) => {
            if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                setActiveLink(id);
                // Silently update hash without scroll jump
                history.replaceState(null, "", "#" + id);
            }
        });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // --- DEEP LINK SUPPORT ---
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            // Small delay to let the page render first
            setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        }
    }

    // --- REVEAL ON SCROLL ---
    const revealEls = document.querySelectorAll(".legal-reveal");
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.05 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    // --- FAQ TOGGLES ---
    const faqItems = document.querySelectorAll(".legal-faq-item");
    faqItems.forEach((item) => {
        const btn = item.querySelector(".legal-faq-question");
        if (!btn) return;
        btn.addEventListener("click", () => {
            // Close other open items
            faqItems.forEach((other) => {
                if (other !== item) other.classList.remove("open");
            });
            item.classList.toggle("open");
        });
        // Keyboard support
        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // --- BACK LINK ---
    const backLink = document.getElementById("legalBackLink");
    if (backLink) {
        backLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/#contact";
        });
    }

    // --- NAVBAR SCROLL (transparent → opaque) ---
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuLinks = document.querySelectorAll(".mobile-link");

    hamburger?.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileMenu?.classList.toggle("active");
    });
    mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger?.classList.remove("active");
            mobileMenu?.classList.remove("active");
        });
    });
});
