import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import type { PlaneElements } from "./PaperPlane.ts";

gsap.registerPlugin(MotionPathPlugin);

/**
 * Appends takeoff anticipation and slower flight arcing leftward to the master timeline.
 */
export function animatePlaneFlight(
    tl: gsap.core.Timeline,
    cloneContainer: HTMLElement,
    planeElements: PlaneElements,
    rectBtn: DOMRect,
    targetX: number,
    targetY: number
) {
    const planeW = 50;
    const planeH = 17;
    const planeX = (rectBtn.width - planeW) / 2;
    // Offset correction for paper plane wing coordinate starting at X=72.008
    const planeXCorrected = planeX - (72.008 * 0.047);
    
    // 1. Step 5: Anticipation (100ms, t=1.05s to 1.15s)
    tl.to(planeElements.planeGroup, {
        x: planeXCorrected + 8, // pull back rightward since plane faces left
        scaleX: -0.042,
        scaleY: 0.042,
        duration: 0.10,
        ease: "power1.inOut"
    }, 1.05);
    
    // 2. Step 6 & 7: Flight Path (1.80s total: Takeoff + Majestic Zig-Zag Arc, t=1.15s to 2.95s)
    tl.to(cloneContainer, {
        motionPath: {
            path: [
                { x: 0, y: 0 },
                { x: targetX * 0.15, y: -45 },
                { x: targetX * 0.32, y: targetY - 145 }, // climbs above target Y level
                { x: targetX * 0.50, y: targetY - 110 }, // local center dip (zig-zag)
                { x: targetX * 0.68, y: targetY - 145 }, // second rise (zig-zag)
                { x: targetX * 0.85, y: targetY - 45 },
                { x: targetX, y: targetY }
            ],
            curviness: 0.35 // Creates elegant, slightly rounded curves at the zig-zag joints
        },
        duration: 1.80,
        ease: "power2.inOut" // Slow start, quick acceleration (peak), smooth deceleration
    }, 1.15);
    
    // Scale plane down by 10% mid-flight to create depth, preserving horizontal mirror
    tl.to(planeElements.planeGroup, {
        keyframes: [
            { scaleX: -0.038, scaleY: 0.038, duration: 0.90, ease: "power2.out" },
            { scaleX: -0.047, scaleY: 0.047, duration: 0.90, ease: "power2.in" }
        ],
        duration: 1.80
    }, 1.15);
    
    // Custom banking rotation (tilts up on climb, flat/down on dip, tilts up on second rise, down on descent)
    tl.to(planeElements.planeGroup, {
        keyframes: [
            { rotate: -22, duration: 0.45, ease: "power2.out" },
            { rotate: 10, duration: 0.45, ease: "power1.inOut" },
            { rotate: -12, duration: 0.45, ease: "power1.inOut" },
            { rotate: 22, duration: 0.45, ease: "power2.in" }
        ],
        duration: 1.80,
        ease: "none"
    }, 1.15);
    
    // Motion Blur (blur filter only at mid-flight peak velocity)
    tl.to(planeElements.planeGroup, {
        keyframes: [
            { filter: "blur(0.5px)", duration: 0.40 },
            { filter: "blur(2px)", duration: 1.00 },
            { filter: "blur(0.5px)", duration: 0.25 },
            { filter: "blur(0px)", duration: 0.15 }
        ],
        duration: 1.80,
        ease: "none"
    }, 1.15);
    
    // Jet shadow tracking (matches horizontal translation with plane)
    tl.to(planeElements.paperPlaneShadow, {
        x: targetX,
        duration: 1.80,
        ease: "power2.inOut"
    }, 1.15);

    // Jet shadow vertical scale, opacity and blur keyframes (synchronized with zig-zag height)
    tl.to(planeElements.paperPlaneShadow, {
        keyframes: [
            { scale: 0.9, opacity: 0.25, filter: "blur(4px)", duration: 0.30, ease: "power1.out" },
            { scale: 1.3, opacity: 0.04, filter: "blur(9px)", duration: 0.30, ease: "power1.inOut" },
            { scale: 1.1, opacity: 0.08, filter: "blur(6px)", duration: 0.30, ease: "power1.inOut" },
            { scale: 1.3, opacity: 0.04, filter: "blur(9px)", duration: 0.30, ease: "power1.inOut" },
            { scale: 0.9, opacity: 0.25, filter: "blur(4px)", duration: 0.30, ease: "power1.in" },
            { scale: 0.2, opacity: 0.5, filter: "blur(1.5px)", duration: 0.30, ease: "power2.in" }
        ],
        duration: 1.80
    }, 1.15);
    
    // Jet stream trail stretching
    tl.to(planeElements.paperPlaneTrail, {
        keyframes: [
            { width: 45, opacity: 1, duration: 0.30 },
            { width: 75, opacity: 0.7, duration: 1.20 },
            { width: 0, opacity: 0, duration: 0.30 }
        ],
        duration: 1.80,
        ease: "power2.out"
    }, 1.15);
}
