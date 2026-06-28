/**
 * Centralized navigation script for the StudioA4 homepage.
 * Handles IntersectionObserver active state tracking, smooth scrolling,
 * and the floating CTA visibility toggles.
 */
document.addEventListener("astro:page-load", () => {
    // --- 1. ACTIVE SECTION HIGHLIGHTING (IntersectionObserver) ---
    const navLinks = document.querySelectorAll(".nav-links a");
    const mobileLinks = document.querySelectorAll(".mobile-menu a");

    const highlightActiveNav = (activeId) => {
        // Remove active class from all links
        navLinks.forEach((link) => link.classList.remove("active"));
        mobileLinks.forEach((link) => link.classList.remove("active"));

        if (!activeId) return;

        // Add active class to corresponding links
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href && (href === `#${activeId}` || href.endsWith(`#${activeId}`))) {
                link.classList.add("active");
            }
        });
        mobileLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href && (href === `#${activeId}` || href.endsWith(`#${activeId}`))) {
                link.classList.add("active");
            }
        });
    };

    const navObserverOptions = {
        root: null,
        rootMargin: "-30% 0px -50% 0px", // Focus detection zone in the middle of viewport
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        // Track the current topmost intersecting section
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                // Normalize "work" section mapping
                const sectionKey = id === "selected-projects" ? "work" : id;
                highlightActiveNav(sectionKey);
            }
        });
    }, navObserverOptions);

    // Watch all main sections
    const targetSectionIds = ["home", "work", "services", "about", "testimonials", "contact"];
    targetSectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section) navObserver.observe(section);
    });

    // --- 2. FLOATING CTA VISIBILITY OBSERVER ---
    const homeSection = document.getElementById("home");
    const contactSection = document.getElementById("contact");
    const floatingCta = document.getElementById("floatingCTA");

    if (floatingCta) {
        let isHomeIntersecting = true; // default true initially
        let isContactIntersecting = false;

        const updateFloatingCtaVisibility = () => {
            // Invisible when viewing the Hero OR when on the project form
            if (isHomeIntersecting || isContactIntersecting) {
                floatingCta.classList.remove("visible");
            } else {
                floatingCta.classList.add("visible");
            }
        };

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute("id");
                if (id === "home") {
                    isHomeIntersecting = entry.isIntersecting;
                } else if (id === "contact") {
                    isContactIntersecting = entry.isIntersecting;
                }
            });
            updateFloatingCtaVisibility();
        }, {
            threshold: 0.01 // Trigger instantly as soon as boundary is touched
        });

        if (homeSection) ctaObserver.observe(homeSection);
        if (contactSection) ctaObserver.observe(contactSection);
        
        // Initial run
        updateFloatingCtaVisibility();
    }

    // --- 3. CENTRALIZED SMOOTH SCROLLING INTERCEPTOR ---
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        // Check if click targets a hash on the current page
        const hasHash = href.includes("#");
        const isLocalPath = href.startsWith("#") || 
                           (href.startsWith("/#") && window.location.pathname === "/") ||
                           href.startsWith(window.location.origin + "/#");

        if (hasHash && isLocalPath) {
            const hash = href.substring(href.indexOf("#"));
            const target = document.querySelector(hash);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                
                // Update history hash silently without page jumps
                history.pushState(null, "", hash);
            }
        }
    });
});
