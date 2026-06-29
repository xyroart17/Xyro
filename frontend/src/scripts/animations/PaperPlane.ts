import { gsap } from "gsap";
import type { MorphElements } from "./EnvelopeMorph.ts";

export interface PlaneElements {
    planeGroup: SVGGraphicsElement;
    paperPlaneShadow: HTMLElement;
    paperPlaneTrail: HTMLElement;
}

/**
 * Injects the paper airplane vector paths and shadow elements into the morph container.
 */
export function injectPaperPlane(cloneContainer: HTMLElement, rectBtn: DOMRect): PlaneElements {
    const morphWrapper = cloneContainer.querySelector(".morph-wrapper") as HTMLElement;
    const svgEl = cloneContainer.querySelector("svg") as SVGSVGElement;
    
    const planeW = 50;
    const planeH = 17;
    const planeX = (rectBtn.width - planeW) / 2;
    const planeY = (rectBtn.height - planeH) / 2;
    const planeXCorrected = planeX - (72.008 * 0.047);
    
    const planeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    planeGroup.id = "plane-group";
    planeGroup.setAttribute("style", "opacity: 0; transform-origin: 50% 50%; will-change: opacity, transform, filter;");
    planeGroup.setAttribute("transform", `translate(${planeXCorrected}, ${planeY}) scale(0.047)`);
    planeGroup.innerHTML = `
        <!-- Left Wing / Main Body -->
        <polygon points="72.008,0 274.113,140.173 274.113,301.804 390.796,221.102 601.682,367.302 1131.53,0.223" fill="#ffffff" stroke="#d4d4d4" stroke-width="1.5" />
        <!-- Underbody Fold -->
        <polygon points="1131.53,0.223 274.113,140.173 274.113,301.804 390.796,221.102" fill="#e2e2e2" stroke="#d4d4d4" stroke-width="1.5" />
    `;
    svgEl.appendChild(planeGroup);
    
    const shadowDiv = document.createElement("div");
    shadowDiv.className = "paper-plane-shadow";
    shadowDiv.setAttribute("style", `position: absolute; left: ${planeX}px; top: ${planeY + 18}px; width: ${planeW}px; height: 3px; background: rgba(0, 0, 0, 0.35); border-radius: 50%; filter: blur(3.5px); opacity: 0; pointer-events: none; transform: scale(0.6); will-change: transform, opacity, filter;`);
    morphWrapper.appendChild(shadowDiv);
    
    const trailDiv = document.createElement("div");
    trailDiv.className = "paper-plane-trail";
    trailDiv.setAttribute("style", `position: absolute; left: ${planeX + planeW}px; top: ${planeY + planeH / 2}px; width: 0px; height: 2px; background: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.45)); transform-origin: left center; transform: translateY(-50%); opacity: 0; pointer-events: none; will-change: width, opacity;`);
    morphWrapper.appendChild(trailDiv);
    
    return {
        planeGroup,
        paperPlaneShadow: shadowDiv,
        paperPlaneTrail: trailDiv
    };
}

/**
 * Appends envelope closing, multi-stage folding, and plane formation to the master timeline.
 */
export function animateFoldingSequence(
    tl: gsap.core.Timeline,
    morphElements: MorphElements,
    planeElements: PlaneElements,
    rectBtn: DOMRect
) {
    const envW = 64;
    const envH = 46;
    const envX = (rectBtn.width - envW) / 2;
    const envY = (rectBtn.height - envH) / 2;
    
    // 1. Envelope closes top flap (250ms, t=0.35s to 0.60s)
    tl.to(morphElements.envelopeFlap, {
        attr: {
            points: `${envX},${envY} ${envX + envW},${envY} ${envX + envW / 2},${envY + envH - 2}`
        },
        duration: 0.25,
        ease: "power1.inOut"
    }, 0.35);
    
    // 2. Bottom & Side creases tighten (300ms, t=0.50s to 0.80s)
    tl.to([morphElements.morphBg, morphElements.envelopeGroup], {
        scale: 0.94,
        transformOrigin: "center center",
        duration: 0.30,
        ease: "power2.inOut"
    }, 0.50);
    
    // 3. Transform into paper airplane (250ms, t=0.80s to 1.05s)
    tl.to([morphElements.envelopeGroup, morphElements.morphBg], {
        opacity: 0,
        scale: 0.8,
        duration: 0.15,
        ease: "power2.in"
    }, 0.80);
    
    tl.to(planeElements.planeGroup, {
        opacity: 1,
        scaleX: -0.047,
        scaleY: 0.047,
        duration: 0.25,
        ease: "back.out(1.5)"
    }, 0.80);
}
