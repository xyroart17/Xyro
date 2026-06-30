/**
 * Xyro Vertical Manga Reader Client Engine
 * Implements high-performance intersection-based lazy loading, prefetching,
 * real-time page counter, auto-hiding top/bottom bars, and navigation shortcuts.
 */

export function initMangaReader(pageCount) {
    let currentPage = 1;
    const header = document.querySelector(".reader-header");
    const controls = document.querySelector(".reader-controls");
    const headerCounter = document.querySelector(".reader-header-counter");
    const controlsCounter = document.querySelector(".reader-controls-counter");
    const prevBtn = document.getElementById("readerBtnPrev");
    const nextBtn = document.getElementById("readerBtnNext");

    // Elements for page observing
    const pageWrappers = document.querySelectorAll(".manga-page-wrapper");
    if (!pageWrappers.length) return;

    // Active state tracker
    let isScrollingTimeout = null;
    let lastScrollY = window.scrollY;

    // Spacing select toggles
    const spacingSelect = document.getElementById("spacingSelect");
    const readerContent = document.querySelector(".reader-content");
    const handleSpacingChange = (e) => {
        const val = e.target.value;
        readerContent.className = `reader-content gap-${val}`;
    };
    if (spacingSelect && readerContent) {
        spacingSelect.addEventListener("change", handleSpacingChange);
    }

    // Settings Dropdown Panel toggle
    const settingsBtn = document.querySelector(".reader-settings-btn");
    const dropdown = document.querySelector(".settings-dropdown");
    const handleSettingsClick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("active");
    };
    const handleDocumentClick = () => {
        dropdown.classList.remove("active");
    };
    const handleDropdownClick = (e) => {
        e.stopPropagation();
    };

    if (settingsBtn && dropdown) {
        settingsBtn.addEventListener("click", handleSettingsClick);
        document.addEventListener("click", handleDocumentClick);
        dropdown.addEventListener("click", handleDropdownClick);
    }

    // --- LAZY LOADING & PREFETCHING OBSERVER ---
    const loadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const wrapper = entry.target;
                loadPageImage(wrapper);

                // Prefetch the next 3 pages
                const pageNum = parseInt(wrapper.dataset.pageNumber, 10);
                for (let i = 1; i <= 3; i++) {
                    const nextWrapper = document.querySelector(`.manga-page-wrapper[data-page-number="${pageNum + i}"]`);
                    if (nextWrapper) {
                        loadPageImage(nextWrapper);
                    }
                }
                // Prefetch the previous page
                const prevWrapper = document.querySelector(`.manga-page-wrapper[data-page-number="${pageNum - 1}"]`);
                if (prevWrapper) {
                    loadPageImage(prevWrapper);
                }
            }
        });
    }, {
        rootMargin: "120% 0px 120% 0px" // Load well ahead of viewport
    });

    pageWrappers.forEach(wrapper => loadObserver.observe(wrapper));

    function loadPageImage(wrapper) {
        const img = wrapper.querySelector(".manga-page-img");
        if (img && !img.src) {
            img.src = wrapper.dataset.src;
            img.onload = () => {
                img.classList.add("loaded");
                const skeleton = wrapper.querySelector(".page-loader-skeleton");
                if (skeleton) {
                    skeleton.style.opacity = "0";
                    setTimeout(() => skeleton.remove(), 400);
                }
            };
        }
    }

    // --- PAGE VIEW COUNTER OBSERVER ---
    const visiblePages = new Map();
    const viewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const pageNum = parseInt(entry.target.dataset.pageNumber, 10);
            if (entry.isIntersecting) {
                visiblePages.set(pageNum, entry.intersectionRatio);
            } else {
                visiblePages.delete(pageNum);
            }
        });

        if (visiblePages.size > 0) {
            let activePage = currentPage;
            let maxRatio = -1;
            visiblePages.forEach((ratio, pageNum) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    activePage = pageNum;
                }
            });
            updateActivePage(activePage);
        }
    }, {
        threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-20% 0px -20% 0px" // Target core reading center
    });

    pageWrappers.forEach(wrapper => viewObserver.observe(wrapper));

    function updateActivePage(pageNum) {
        currentPage = pageNum;
        const pageText = `${currentPage} / ${pageCount}`;

        if (headerCounter) headerCounter.innerText = pageText;
        if (controlsCounter) controlsCounter.innerText = pageText;

        // Toggle state disabled
        if (prevBtn) {
            prevBtn.classList.toggle("disabled", currentPage === 1);
            prevBtn.disabled = currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.classList.toggle("disabled", currentPage === pageCount);
            nextBtn.disabled = currentPage === pageCount;
        }
    }

    // --- AUTO-HIDE TOP & BOTTOM NAVIGATION BAR ON SCROLL ---
    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Sticky Header Auto-hide
        if (header) {
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                header.classList.add("hidden");
            } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
                header.classList.remove("hidden");
            }
        }
        lastScrollY = currentScrollY;

        // Floating Controls Hide while scrolling, Reappear 250ms after scroll stops
        if (controls) {
            controls.classList.add("hidden");
            clearTimeout(isScrollingTimeout);
            isScrollingTimeout = setTimeout(() => {
                controls.classList.remove("hidden");
            }, 250);
        }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- NAVIGATION CONTROLS CLICK SCROLLS ---
    function scrollToPage(pageNum) {
        const targetWrapper = document.querySelector(`.manga-page-wrapper[data-page-number="${pageNum}"]`);
        if (targetWrapper) {
            targetWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const handlePrevClick = () => {
        if (currentPage > 1) scrollToPage(currentPage - 1);
    };

    const handleNextClick = () => {
        if (currentPage < pageCount) scrollToPage(currentPage + 1);
    };

    prevBtn?.addEventListener("click", handlePrevClick);
    nextBtn?.addEventListener("click", handleNextClick);

    // --- KEYBOARD SHORTCUTS ---
    const handleKeydown = (e) => {
        const viewportHeight = window.innerHeight;
        
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                window.scrollBy({ top: 120, behavior: "smooth" });
                break;
            case "ArrowUp":
                e.preventDefault();
                window.scrollBy({ top: -120, behavior: "smooth" });
                break;
            case "Space":
                e.preventDefault();
                if (e.shiftKey) {
                    window.scrollBy({ top: -viewportHeight * 0.8, behavior: "smooth" });
                } else {
                    window.scrollBy({ top: viewportHeight * 0.8, behavior: "smooth" });
                }
                break;
            case "PageDown":
                e.preventDefault();
                window.scrollBy({ top: viewportHeight * 0.9, behavior: "smooth" });
                break;
            case "PageUp":
                e.preventDefault();
                window.scrollBy({ top: -viewportHeight * 0.9, behavior: "smooth" });
                break;
            case "Home":
                e.preventDefault();
                scrollToPage(1);
                break;
            case "End":
                e.preventDefault();
                scrollToPage(pageCount);
                break;
            default:
                break;
        }
    };
    window.addEventListener("keydown", handleKeydown);

    // --- WORK IN PROGRESS COLLAPSE TOGGLE ---
    const toggleWipBtn = document.getElementById("toggleWipBtn");
    const wipSection = document.getElementById("wipSection");
    const handleWipToggle = () => {
        const isExpanded = wipSection.classList.contains("expanded");
        if (isExpanded) {
            wipSection.classList.remove("expanded");
            toggleWipBtn.innerHTML = "Show WIP";
            toggleWipBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            wipSection.classList.add("expanded");
            toggleWipBtn.innerHTML = "Hide WIP";
            setTimeout(() => {
                wipSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 150);
        }
    };
    if (toggleWipBtn && wipSection) {
        toggleWipBtn.addEventListener("click", handleWipToggle);
    }

    return () => {
        if (spacingSelect && readerContent) {
            spacingSelect.removeEventListener("change", handleSpacingChange);
        }
        if (settingsBtn && dropdown) {
            settingsBtn.removeEventListener("click", handleSettingsClick);
            document.removeEventListener("click", handleDocumentClick);
            dropdown.removeEventListener("click", handleDropdownClick);
        }
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("keydown", handleKeydown);
        prevBtn?.removeEventListener("click", handlePrevClick);
        nextBtn?.removeEventListener("click", handleNextClick);
        if (toggleWipBtn && wipSection) {
            toggleWipBtn.removeEventListener("click", handleWipToggle);
        }
        loadObserver.disconnect();
        viewObserver.disconnect();
        clearTimeout(isScrollingTimeout);
    };
}
