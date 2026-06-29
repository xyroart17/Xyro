import { gsap } from "gsap";
import { createEnvelopeMorph, animateButtonMorph } from "./EnvelopeMorph.ts";
import { injectPaperPlane, animateFoldingSequence } from "./PaperPlane.ts";
import { animatePlaneFlight } from "./PlaneMotion.ts";
import { getActiveCommissionsText, addCommissionsInteractions } from "./commissionsAnimation.ts";
import { addSuccessTransition } from "./SuccessTransition.ts";

export interface MessageTimelineOptions {
    submitBtn: HTMLButtonElement;
    formSuccess: HTMLElement;
    contactForm: HTMLFormElement;
    formWrapper: HTMLElement;
    onUnlock: () => void;
}

/**
 * Master timeline builder — orchestrates all decoupled animation modules in one sequence.
 */
export function createMessageTimeline(options: MessageTimelineOptions) {
    const { submitBtn, formSuccess, contactForm, formWrapper, onUnlock } = options;

    const rectBtn = submitBtn.getBoundingClientRect();

    // 1. Setup Envelope Morph container and base elements
    const morphElements = createEnvelopeMorph(submitBtn);
    const { cloneContainer } = morphElements;

    // 2. Inject paper plane paths and shadow overlays
    const planeElements = injectPaperPlane(cloneContainer, rectBtn);

    // Calculate dynamic flight targets based on Commissions Open text position
    const commissionsText = getActiveCommissionsText();
    let targetX = window.innerWidth > 768 ? -320 : -180;
    let targetY = -120;

    if (commissionsText) {
        const rectComm = commissionsText.getBoundingClientRect();
        const planeCenterX = rectBtn.left + rectBtn.width / 2;
        const planeCenterY = rectBtn.top + rectBtn.height / 2;
        const commCenterX = rectComm.left + 8; // align with green pulse dot
        const commCenterY = rectComm.top + rectComm.height / 2;

        targetX = commCenterX - planeCenterX;
        targetY = commCenterY - planeCenterY;
    }

    // 3. Construct master GSAP timeline
    const tl = gsap.timeline();

    // Hide original submit button immediately at start of sequence
    tl.set(submitBtn, { opacity: 0, pointerEvents: "none" }, 0);

    // Step A: Button morph (t=0s to 0.35s)
    animateButtonMorph(tl, morphElements, rectBtn);

    // Step B: Folding sequence (t=0.35s to 0.80s)
    animateFoldingSequence(tl, morphElements, planeElements, rectBtn);

    // Step C: Plane formation, takeoff, flight & landing (t=0.80s to 2.95s)
    animatePlaneFlight(tl, cloneContainer, planeElements, rectBtn, targetX, targetY);

    // Step D: Commissions Open text landing interactions (t=2.95s to 3.25s)
    if (commissionsText) {
        addCommissionsInteractions(tl, commissionsText, cloneContainer, planeElements.planeGroup);
    } else {
        // Fallback dissolve if text is not found
        tl.to(planeElements.planeGroup, {
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 0.25,
            ease: "power2.out"
        }, 2.95);
        tl.to(cloneContainer, {
            opacity: 0,
            duration: 0.15
        }, 3.10);
    }

    // Step E: Success card transition (t=3.25s to 3.55s)
    addSuccessTransition(tl, formWrapper, contactForm, formSuccess, submitBtn, cloneContainer, onUnlock);

    return { timeline: tl, cloneContainer };
}
