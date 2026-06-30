import { createMessageTimeline } from "./MessageTimeline.ts";

/**
 * AnimationController — Binds DOM contact form lifecycle events to the master GSAP timeline orchestrator.
 */
export function initAnimationController() {
    const contactForm = document.getElementById("contactForm") as HTMLFormElement | null;
    const formSuccess = document.getElementById("formSuccess") as HTMLElement | null;
    const submitBtn = contactForm?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

    if (!contactForm || !formSuccess || !submitBtn) return;

    const formWrapper = contactForm.closest(".contact-form-wrapper") as HTMLElement | null;

    if (!formWrapper) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let activeTimeline: any = null;
    let activeClone: HTMLElement | null = null;
    let backendErrorMessage = "";

    // 1. Form submit has started
    contactForm.addEventListener("form-submit-start", () => {
        backendErrorMessage = "";

        // Immediately lock scrolling and interaction
        document.body.classList.add("interaction-locked");
        toggleFormInputs(contactForm, true);
        submitBtn.setAttribute("disabled", "true");

        // Tactile depressed state and morph button text
        submitBtn.classList.add("btn-submit-depressed");
        setTimeout(() => {
            submitBtn.classList.remove("btn-submit-depressed");
            submitBtn.classList.add("btn-submit-loading", "glow-reduced");
            const submitSpan = submitBtn.querySelector("span");
            if (submitSpan) submitSpan.style.display = "none";
            submitBtn.childNodes[0].textContent = "Sending...";
        }, 100);
    });

    // 2. Form submission succeeded (run GSAP sequence)
    contactForm.addEventListener("form-submit-success", () => {
        if (prefersReducedMotion) {
            showSuccessState();
            return;
        }

        const result = createMessageTimeline({
            submitBtn,
            formSuccess,
            contactForm,
            formWrapper,
            onUnlock: () => {
                document.body.classList.remove("interaction-locked");
            }
        });

        activeTimeline = result.timeline;
        activeClone = result.cloneContainer;

        activeTimeline.play();
    });

    // 3. Form submission failed (revert form)
    contactForm.addEventListener("form-submit-error", (e: any) => {
        backendErrorMessage = e.detail?.error || "We couldn't deliver your message right now.";
        console.error("Submit error event received:", backendErrorMessage);

        cleanupFailure();
    });

    function toggleFormInputs(form: HTMLFormElement, disable: boolean) {
        const inputs = form.querySelectorAll("input:not([type='hidden']), textarea, button");
        inputs.forEach(el => {
            if (disable) {
                el.setAttribute("disabled", "true");
            } else {
                el.removeAttribute("disabled");
            }
        });
    }

    function showSuccessState() {
        formWrapper!.style.transition = "opacity 0.3s ease";
        formWrapper!.style.opacity = "1";
        contactForm!.style.display = "none";
        formSuccess!.style.display = "block";
        formSuccess!.offsetHeight; // reflow
        formSuccess!.classList.add("animate-success");
        formSuccess!.setAttribute("tabindex", "-1");
        formSuccess!.focus();

        document.body.classList.remove("interaction-locked");

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

        // Auto-reset form after 30 seconds to allow new submissions
        setTimeout(() => {
            formSuccess!.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            formSuccess!.style.opacity = "0";
            formSuccess!.style.transform = "translateY(-10px)";
            
            setTimeout(() => {
                formSuccess!.style.display = "none";
                formSuccess!.classList.remove("animate-success");
                formSuccess!.style.opacity = "";
                formSuccess!.style.transform = "";
                
                contactForm!.reset();
                contactForm!.style.display = "block";
                contactForm!.style.opacity = "0";
                contactForm!.style.transition = "opacity 0.5s ease";
                contactForm!.offsetHeight; // force reflow
                contactForm!.style.opacity = "1";

                toggleFormInputs(contactForm!, false);
                submitBtn!.style.opacity = "";
                submitBtn!.style.pointerEvents = "";
                submitBtn!.removeAttribute("disabled");
                submitBtn!.classList.remove("btn-submit-loading", "glow-reduced");
                const submitSpan = submitBtn!.querySelector("span") as HTMLElement | null;
                if (submitSpan) submitSpan.style.display = "";
                submitBtn!.childNodes[0].textContent = "Send Message";
            }, 500);
        }, 30000);
    }

    function cleanupFailure() {
        if (activeTimeline) {
            activeTimeline.kill();
            activeTimeline = null;
        }

        if (activeClone) {
            activeClone.remove();
            activeClone = null;
        }

        document.body.classList.remove("interaction-locked");
        submitBtn!.classList.remove("btn-submit-loading", "glow-reduced");
        submitBtn!.removeAttribute("disabled");
        const submitSpan = submitBtn!.querySelector("span") as HTMLElement | null;
        if (submitSpan) submitSpan.style.display = "";
        submitBtn!.childNodes[0].textContent = "Send Message";
        toggleFormInputs(contactForm!, false);

        formWrapper!.style.opacity = "1";

        // Revert form visibility in case the success transition already ran or started
        contactForm!.style.display = "block";
        contactForm!.style.opacity = "";
        formSuccess!.style.display = "none";
        formSuccess!.classList.remove("animate-success");

        // Restore submit button visibility and interaction
        submitBtn!.style.opacity = "";
        submitBtn!.style.pointerEvents = "";

        showErrorFeedback(backendErrorMessage);
    }

    function showErrorFeedback(message: string) {
        let errorCard = document.getElementById("formErrorCard");
        if (!errorCard) {
            errorCard = document.createElement("div");
            errorCard.id = "formErrorCard";
            errorCard.className = "form-error-card";
            contactForm!.parentNode!.insertBefore(errorCard, contactForm!.nextSibling);
        }

        let formattedMsg = message.trim();
        if (formattedMsg && !/[.!?]$/.test(formattedMsg)) {
            formattedMsg += ".";
        }

        errorCard.innerHTML = `
            <h4>Delivery Failed</h4>
            <p>${formattedMsg} Please try again in a moment.</p>
            <button type="button" class="btn-retry" id="btnFormRetry">Retry</button>
        `;
        errorCard.style.display = "block";
        errorCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

        document.getElementById("btnFormRetry")?.addEventListener("click", () => {
            const card = document.getElementById("formErrorCard");
            if (card) card.style.display = "none";
            submitBtn!.removeAttribute("disabled");
            contactForm!.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        });
    }
}
