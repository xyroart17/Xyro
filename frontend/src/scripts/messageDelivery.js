/**
 * StudioA4 — Message Delivery Experience Coordinator
 * Optimistic UI submission flow, form cloning, and responsive flight targeting.
 */
document.addEventListener("astro:page-load", () => {
    const contactForm = document.getElementById("contactForm");
    const formSuccess = document.getElementById("formSuccess");
    const submitBtn = contactForm?.querySelector('button[type="submit"]');

    if (!contactForm || !formSuccess || !submitBtn) return;

    // --- MAILBOX DOM REFERENCES ---
    const mailboxes = document.querySelectorAll(".nav-mailbox");

    // Show mailbox when the user starts typing
    const formFields = contactForm.querySelectorAll("input:not([type='hidden']), textarea");
    const revealMailboxes = () => {
        mailboxes.forEach(box => box.classList.add("visible-mailbox"));
    };
    formFields.forEach(field => {
        field.addEventListener("input", revealMailboxes);
    });

    // --- STATE VARIABLES FOR OPTIMISTIC UI ---
    let backendStatus = "pending"; // "pending", "success", "error"
    let backendErrorMessage = "";
    let animationCompleted = false;
    let activeCloneContainer = null;

    // --- ACCESSIBILITY CHECK ---
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- ERROR CARD CONTAINER ---
    let errorCard = document.getElementById("formErrorCard");

    // --- Life-cycle Event Listeners ---
    contactForm.addEventListener("form-submit-start", () => {
        // Reset states
        backendStatus = "pending";
        backendErrorMessage = "";
        animationCompleted = false;
        if (errorCard) errorCard.style.display = "none";

        // 1. Disable scrolling and interaction
        document.body.classList.add("interaction-locked");

        // 2. Tactile button click depress & Show button loading state
        submitBtn.classList.add("btn-submit-depressed");
        setTimeout(() => {
            submitBtn.classList.remove("btn-submit-depressed");
        }, 150);

        submitBtn.classList.add("btn-submit-loading");
        const submitSpan = submitBtn.querySelector("span");
        if (submitSpan) submitSpan.style.display = "none";
        submitBtn.childNodes[0].textContent = "Delivering...";
        
        // Disable inputs
        toggleFormInputs(contactForm, true);

        // 3. OPTIMISTIC UI: Wait 500ms (shimmer effect) then start flight immediately
        setTimeout(() => {
            if (prefersReducedMotion) {
                // Instantly wait for fetch to complete under reduced motion setting
                checkStatusAndTransition();
            } else {
                runOrigamiAndFlightAnimation();
            }
        }, 500);
    });

    contactForm.addEventListener("form-submit-success", () => {
        backendStatus = "success";
        console.log("Submit success event received.");

        // If animation or reduced-motion is already completed, transition to success card immediately
        if (animationCompleted || prefersReducedMotion) {
            checkStatusAndTransition();
        }
    });

    contactForm.addEventListener("form-submit-error", (e) => {
        backendStatus = "error";
        backendErrorMessage = e.detail?.error || "We couldn't deliver your message right now.";
        console.error("Submit error event received:", backendErrorMessage);

        // If animation is already done, clean up immediately
        if (animationCompleted || prefersReducedMotion) {
            cleanupFailure();
        }
    });

    // --- Helper Functions ---

    function toggleFormInputs(form, disable) {
        const inputs = form.querySelectorAll("input:not([type='hidden']), textarea, button");
        inputs.forEach(el => {
            if (disable) {
                el.setAttribute("disabled", "true");
            } else {
                el.removeAttribute("disabled");
            }
        });
    }

    function checkStatusAndTransition() {
        if (backendStatus === "success") {
            fadeOutFormAndShowSuccess();
        } else if (backendStatus === "error") {
            cleanupFailure();
        } else {
            // Still pending: wait a bit longer, showing a soft waiting loop
            console.log("Fetch still pending at animation end. Waiting...");
            setTimeout(checkStatusAndTransition, 200);
        }
    }

    function cleanupFailure() {
        // Release interaction locks
        document.body.classList.remove("interaction-locked");
        submitBtn.classList.remove("btn-submit-loading");
        const submitSpan = submitBtn.querySelector("span");
        if (submitSpan) submitSpan.style.display = "";
        submitBtn.childNodes[0].textContent = "Send Message";
        toggleFormInputs(contactForm, false);

        // Remove clone if exists
        if (activeCloneContainer) {
            activeCloneContainer.remove();
            activeCloneContainer = null;
        }

        // Restore original form opacity
        const formWrapper = contactForm.closest(".contact-form-wrapper");
        if (formWrapper) formWrapper.style.opacity = "1";

        // Show error block
        showErrorFeedback(backendErrorMessage);
    }

    function showErrorFeedback(message) {
        if (!errorCard) {
            errorCard = document.createElement("div");
            errorCard.id = "formErrorCard";
            errorCard.className = "form-error-card";
            contactForm.parentNode.insertBefore(errorCard, contactForm.nextSibling);
        }

        errorCard.innerHTML = `
            <h4>Delivery Failed</h4>
            <p>${message} Please try again in a moment.</p>
            <button type="button" class="btn-retry" id="btnFormRetry">Retry</button>
        `;
        errorCard.style.display = "block";
        errorCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

        document.getElementById("btnFormRetry")?.addEventListener("click", () => {
            errorCard.style.display = "none";
            submitBtn.removeAttribute("disabled");
            // Trigger submit event natively
            contactForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        });
    }

    function runOrigamiAndFlightAnimation() {
        // Detect visible mailbox (Desktop navbar or Mobile header target)
        let mailbox = document.getElementById("navMailbox");
        if (window.innerWidth <= 768) {
            mailbox = document.getElementById("navMailboxMobile");
        }

        const formWrapper = contactForm.closest(".contact-form-wrapper");

        if (!mailbox || !formWrapper) {
            fadeOutFormAndShowSuccess();
            return;
        }

        // Get positional dimensions
        const rectForm = formWrapper.getBoundingClientRect();
        const rectMailbox = mailbox.getBoundingClientRect();

        // 1. Create origami clone container
        const cloneContainer = document.createElement("div");
        cloneContainer.className = "origami-clone-container";
        cloneContainer.style.top = `${rectForm.top}px`;
        cloneContainer.style.left = `${rectForm.left}px`;
        cloneContainer.style.width = `${rectForm.width}px`;
        cloneContainer.style.height = `${rectForm.height}px`;

        // 2. Clone the actual form HTML content to replicate what user filled
        const clonedForm = formWrapper.cloneNode(true);
        // Strip ids to avoid DOM duplicates
        clonedForm.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

        // Copy user typed input values manually (cloneNode doesn't clone input values)
        const originalFields = formWrapper.querySelectorAll("input, textarea");
        const clonedFields = clonedForm.querySelectorAll("input, textarea");
        originalFields.forEach((field, index) => {
            if (clonedFields[index]) {
                clonedFields[index].value = field.value;
            }
        });

        // 3. Assemble clone hierarchy (incorporating the cloned form and the plane target)
        cloneContainer.innerHTML = `
            <div class="origami-paper">
                <div class="origami-cloned-content" style="width: 100%; height: 100%; overflow: hidden; border-radius: inherit;">
                    <!-- Insert cloned form here -->
                </div>
                <div class="origami-plane-wrapper">
                    <svg viewBox="0 0 1131.53 379.304" xml:space="preserve" class="paper-plane-svg">
                        <polygon fill="#D8D8D8" points="72.008,0 274.113,140.173 274.113,301.804 390.796,221.102 601.682,367.302 1131.53,0.223" />
                        <polygon fill="#C4C4C3" points="1131.53,0.223 274.113,140.173 274.113,301.804 390.796,221.102" />
                    </svg>
                    <!-- Jet-stream motion trail -->
                    <div class="paper-plane-trail"></div>
                </div>
            </div>
        `;

        cloneContainer.querySelector(".origami-cloned-content").appendChild(clonedForm);
        document.body.appendChild(cloneContainer);
        activeCloneContainer = cloneContainer;

        // Hide original form
        formWrapper.style.transition = "opacity 0.2s ease";
        formWrapper.style.opacity = "0.02";

        const paper = cloneContainer.querySelector(".origami-paper");

        // --- STEPPED OPTIMISTIC 3D FOLDS (Form collapses inwards) ---
        setTimeout(() => paper.classList.add("fold-step-1"), 50);
        setTimeout(() => paper.classList.add("fold-step-2"), 450);
        setTimeout(() => paper.classList.add("fold-step-3"), 850);
        setTimeout(() => paper.classList.add("morph-plane"), 1250);
        
        // Lift-off: hover and tilt before acceleration
        setTimeout(() => paper.classList.add("lift-off"), 1550);

        // --- FLIGHT MECHANICS ---
        setTimeout(() => {
            if (backendStatus === "error") {
                cleanupFailure();
                return;
            }

            const rectPlane = cloneContainer.getBoundingClientRect();

            // Calculate destination offsets
            const targetX = rectMailbox.left + rectMailbox.width / 2 - (rectPlane.left + rectPlane.width / 2);
            const targetY = rectMailbox.top + rectMailbox.height / 2 - (rectPlane.top + rectPlane.height / 2);

            cloneContainer.style.setProperty("--target-x", `${targetX}px`);
            cloneContainer.style.setProperty("--target-y", `${targetY}px`);

            // Snappy, premium fixed speed (1.1s)
            const flightDuration = 1.1;
            cloneContainer.style.setProperty("--fly-duration", `${flightDuration}s`);

            // Start hardware-accelerated flight translation
            cloneContainer.classList.add("flying");

            // Open Mailbox door right before plane lands
            setTimeout(() => {
                if (backendStatus !== "error") mailbox.classList.add("open-door");
            }, (flightDuration * 1000) - 200);

            // Land in Mailbox
            setTimeout(() => {
                if (backendStatus === "error") {
                    cleanupFailure();
                    return;
                }

                // Hide flight clone
                cloneContainer.style.opacity = "0";

                // Close door, bounce, and light mailbox
                mailbox.classList.remove("open-door");
                mailbox.classList.add("bounce-box", "active-glow");

                setTimeout(() => cloneContainer.remove(), 400);

                setTimeout(() => {
                    mailbox.classList.remove("bounce-box", "active-glow");
                }, 1200);

                // Flight animation ends: wait for server confirmation and transition
                animationCompleted = true;
                checkStatusAndTransition();

            }, flightDuration * 1000);

        }, 1950);
    }

    function fadeOutFormAndShowSuccess() {
        const formWrapper = contactForm.closest(".contact-form-wrapper");
        if (formWrapper) {
            // Restore wrapper opacity so success card inside it is visible
            formWrapper.style.transition = "opacity 0.3s ease";
            formWrapper.style.opacity = "1";

            // Hide the actual form elements
            contactForm.style.display = "none";

            // Show Success card
            formSuccess.style.opacity = "0";
            formSuccess.style.transform = "translateY(10px)";
            formSuccess.style.display = "block";

            formSuccess.offsetHeight; // trigger reflow

            formSuccess.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            formSuccess.style.opacity = "1";
            formSuccess.style.transform = "translateY(0)";

            // Release interactions
            document.body.classList.remove("interaction-locked");
            formSuccess.setAttribute("tabindex", "-1");
            formSuccess.focus();

            // Set up Discord Copy Button on success card
            const discordSuccessBtn = document.getElementById("discordSuccessBtn");
            if (discordSuccessBtn) {
                discordSuccessBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText("xyro.3d").then(() => {
                        discordSuccessBtn.textContent = "xyro.3d (Copied!)";
                        discordSuccessBtn.style.color = "#22c55e";
                        setTimeout(() => {
                            discordSuccessBtn.textContent = "Discord";
                            discordSuccessBtn.style.color = "";
                        }, 2500);
                    }).catch(err => {
                        console.error("Could not copy Discord username: ", err);
                        discordSuccessBtn.textContent = "xyro.3d";
                    });
                });
            }

            // Hide the mailbox target again after 4.5 seconds
            setTimeout(() => {
                mailboxes.forEach(box => box.classList.remove("visible-mailbox"));
            }, 4500);
        } else {
            contactForm.style.display = "none";
            formSuccess.style.display = "block";
            document.body.classList.remove("interaction-locked");

            // Set up Discord Copy Button on success card (fallback branch)
            const discordSuccessBtn = document.getElementById("discordSuccessBtn");
            if (discordSuccessBtn) {
                discordSuccessBtn.addEventListener("click", () => {
                    navigator.clipboard.writeText("xyro.3d").then(() => {
                        discordSuccessBtn.textContent = "xyro.3d (Copied!)";
                        discordSuccessBtn.style.color = "#22c55e";
                        setTimeout(() => {
                            discordSuccessBtn.textContent = "Discord";
                            discordSuccessBtn.style.color = "";
                        }, 2500);
                    }).catch(err => {
                        console.error("Could not copy Discord username: ", err);
                        discordSuccessBtn.textContent = "xyro.3d";
                    });
                });
            }

            setTimeout(() => {
                mailboxes.forEach(box => box.classList.remove("visible-mailbox"));
            }, 4500);
        }
    }
});
