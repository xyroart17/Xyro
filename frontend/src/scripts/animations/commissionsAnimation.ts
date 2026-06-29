import { gsap } from "gsap";

/**
 * Returns the Commissions Open text element.
 */
export function getActiveCommissionsText(): HTMLElement | null {
    return document.getElementById("commissionsOpenText");
}

/**
 * Animates a tactile bounce and highlight on the Commissions Open text.
 */
export function bounceCommissionsText(el: HTMLElement, duration = 0.5): gsap.core.Tween {
    return gsap.fromTo(el,
        { scale: 1, filter: "drop-shadow(0 0 0 rgba(34, 197, 94, 0))" },
        {
            scale: 1.15,
            filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))",
            duration: duration / 2,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
        }
    );
}

/**
 * Appends Commissions Open text reactions and plane collapse to the timeline.
 */
export function addCommissionsInteractions(
    tl: gsap.core.Timeline,
    commissionsText: HTMLElement,
    cloneContainer: HTMLElement,
    planeGroup: SVGGraphicsElement
) {
    // Plane dissolves and shrinks into the text (t = 2.95s)
    tl.to(planeGroup, {
        x: "-=12", // translates forward leftward into the text
        y: "+=4",
        scale: 0,
        transformOrigin: "0% 50%", // nose-centered scale-to-zero collapse
        duration: 0.30,
        ease: "power2.out"
    }, 2.95);

    // Fade out clone container
    tl.to(cloneContainer, {
        opacity: 0,
        duration: 0.15
    }, 3.10);

    // Trigger Commissions Open text feedback
    tl.add(() => {
        bounceCommissionsText(commissionsText);
    }, 3.10);
}
