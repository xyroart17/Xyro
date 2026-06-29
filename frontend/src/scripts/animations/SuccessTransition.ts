import { gsap } from "gsap";

/**
 * Appends success card transitions and input release steps to the master timeline.
 */
export function addSuccessTransition(
    tl: gsap.core.Timeline,
    formWrapper: HTMLElement,
    contactForm: HTMLFormElement,
    formSuccess: HTMLElement,
    submitBtn: HTMLButtonElement,
    cloneContainer: HTMLElement,
    onUnlock: () => void
) {
    // Fade in success card right after plane dissolves (t = 3.25s)
    tl.add(() => {
        formWrapper.style.transition = "opacity 0.3s ease";
        formWrapper.style.opacity = "1";
        contactForm.style.display = "none";
        formSuccess.style.display = "block";
        formSuccess.offsetHeight; // trigger reflow
        formSuccess.classList.add("animate-success");
        formSuccess.setAttribute("tabindex", "-1");
        formSuccess.focus();

        cloneContainer.remove();
        submitBtn.style.opacity = "";
        submitBtn.style.pointerEvents = "";
    }, 3.25);

    // Unlock interaction after success card animation completes (t = 3.55s)
    tl.add(() => {
        onUnlock();
    }, 3.55);
}
