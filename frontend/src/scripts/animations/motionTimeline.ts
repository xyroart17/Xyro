import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { openMailboxLid, closeMailboxLid, bounceMailbox, triggerMailboxGlow, fadeMailboxGlow } from "./mailboxAnimation.ts";

gsap.registerPlugin(MotionPathPlugin);

export interface MotionTimelineOptions {
    submitBtn: HTMLButtonElement;
    mailbox: HTMLElement;
    formSuccess: HTMLElement;
    contactForm: HTMLFormElement;
    formWrapper: HTMLElement;
    onUnlock: () => void;
}

export function createMotionTimeline(options: MotionTimelineOptions): {
    timeline: gsap.core.Timeline;
    cloneContainer: HTMLElement;
} {
    const { submitBtn, mailbox, formSuccess, contactForm, formWrapper, onUnlock } = options;

    const rectBtn = submitBtn.getBoundingClientRect();
    const rectMailbox = mailbox.getBoundingClientRect();

    // 1. Create morph clone container matching the button position and size
    const cloneContainer = document.createElement("div");
    cloneContainer.className = "origami-clone-container";
    cloneContainer.style.position = "fixed";
    cloneContainer.style.zIndex = "10000";
    cloneContainer.style.top = `${rectBtn.top}px`;
    cloneContainer.style.left = `${rectBtn.left}px`;
    cloneContainer.style.width = `${rectBtn.width}px`;
    cloneContainer.style.height = `${rectBtn.height}px`;
    cloneContainer.style.pointerEvents = "none";

    const envW = 64;
    const envH = 46;
    const envX = (rectBtn.width - envW) / 2;
    const envY = (rectBtn.height - envH) / 2;

    const planeW = 50;
    const planeH = 17;
    const planeX = (rectBtn.width - planeW) / 2;
    const planeY = (rectBtn.height - planeH) / 2;
    // Offset correction for paper plane wing coordinate starting at X=72.008
    const planeXCorrected = planeX - (72.008 * 0.047);

    // 2. Assemble SVGs (Button morph background, envelope parts, and final plane)
    cloneContainer.innerHTML = `
        <div class="morph-wrapper" style="width: 100%; height: 100%; position: relative; transform-style: preserve-3d; will-change: transform;">
            <svg width="100%" height="100%" viewBox="0 0 ${rectBtn.width} ${rectBtn.height}" style="overflow: visible; position: absolute; inset: 0; transform-style: preserve-3d;">
                <!-- Morphing Background (Red Pill -> White Paper Rect) -->
                <rect id="morph-bg" x="0" y="0" width="${rectBtn.width}" height="${rectBtn.height}" rx="${rectBtn.height / 2}" ry="${rectBtn.height / 2}" fill="#ff4d4d" stroke="none" stroke-width="0" style="will-change: transform, fill, stroke, width, height, x, y;" />
                
                <!-- Custom Premium Envelope folds -->
                <g id="envelope-group" style="opacity: 0; transform-origin: center; will-change: opacity, transform;">
                    <polygon id="envelope-flap" points="${envX},${envY} ${envX + envW},${envY} ${envX + envW / 2},${envY + 20}" fill="none" stroke="#d4d4d4" stroke-width="1.2" style="will-change: points;" />
                    <path id="envelope-body" d="M ${envX},${envY + envH} L ${envX + envW / 2},${envY + 24} L ${envX + envW},${envY + envH}" fill="none" stroke="#d4d4d4" stroke-width="1.2" />
                </g>

                <!-- Custom Premium Geometric Paper Airplane -->
                <g id="plane-group" style="opacity: 0; transform-origin: 50% 50%; will-change: opacity, transform, filter;" transform="translate(${planeXCorrected}, ${planeY}) scale(0.047)">
                    <!-- Left Wing / Main Body -->
                    <polygon points="72.008,0 274.113,140.173 274.113,301.804 390.796,221.102 601.682,367.302 1131.53,0.223" fill="#ffffff" stroke="#d4d4d4" stroke-width="1.5" />
                    <!-- Underbody Fold -->
                    <polygon points="1131.53,0.223 274.113,140.173 274.113,301.804 390.796,221.102" fill="#e0e0e0" stroke="#d4d4d4" stroke-width="1.5" />
                </g>
            </svg>
            <!-- Subtle Shadow below paper plane -->
            <div class="paper-plane-shadow" style="position: absolute; left: ${planeX}px; top: ${planeY + 18}px; width: ${planeW}px; height: 3px; background: rgba(0, 0, 0, 0.35); border-radius: 50%; filter: blur(3.5px); opacity: 0; pointer-events: none; transform: scale(0.6); will-change: transform, opacity, filter;"></div>
            <!-- Jet-stream motion trail -->
            <div class="paper-plane-trail" style="position: absolute; left: ${planeX}px; top: ${planeY + planeH / 2}px; width: 0px; height: 2px; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.45)); transform-origin: right center; transform: translateY(-50%); opacity: 0; pointer-events: none; will-change: width, opacity;"></div>
        </div>
    `;

    document.body.appendChild(cloneContainer);

    // Hide original button text/arrow (we keep layout space, just hide visually)
    submitBtn.style.opacity = "0.02";
    submitBtn.style.pointerEvents = "none";

    const morphWrapper = cloneContainer.querySelector(".morph-wrapper") as HTMLElement;
    const morphBg = cloneContainer.querySelector("#morph-bg") as SVGRectElement;
    const envelopeGroup = cloneContainer.querySelector("#envelope-group") as SVGGraphicsElement;
    const envelopeFlap = cloneContainer.querySelector("#envelope-flap") as SVGPolygonElement;
    const planeGroup = cloneContainer.querySelector("#plane-group") as SVGGraphicsElement;
    const paperPlaneShadow = cloneContainer.querySelector(".paper-plane-shadow") as HTMLElement;
    const paperPlaneTrail = cloneContainer.querySelector(".paper-plane-trail") as HTMLElement;

    // Calculate dynamic flight offsets (relative to center of plane inside outer viewBox)
    const planeCenterX = rectBtn.left + rectBtn.width / 2;
    const planeCenterY = rectBtn.top + rectBtn.height / 2;
    const mailboxCenterX = rectMailbox.left + rectMailbox.width / 2;
    const mailboxCenterY = rectMailbox.top + rectMailbox.height / 2;

    const targetX = mailboxCenterX - planeCenterX;
    const targetY = mailboxCenterY - planeCenterY;

    const tl = gsap.timeline();

    // Set perspective for 3D realism
    gsap.set(morphWrapper, { transformPerspective: 1200 });

    // ==========================================
    // STEP 1: BUTTON MORPH (350ms)
    // ==========================================
    tl.to(morphBg, {
        attr: {
            width: envW,
            height: envH,
            x: envX,
            y: envY,
            rx: 4,
            ry: 4
        },
        fill: "#ffffff",
        stroke: "rgba(0,0,0,0.15)",
        strokeWidth: 1,
        duration: 0.35,
        ease: "power2.inOut"
    }, 0);

    tl.to(envelopeGroup, {
        opacity: 1,
        duration: 0.2
    }, 0.15);

    // ==========================================
    // STEP 2 & 3: ENVELOPE FOLD (250ms)
    // ==========================================
    // Close top flap down to bottom-ish point of envelope
    tl.to(envelopeFlap, {
        attr: {
            points: `${envX},${envY} ${envX + envW},${envY} ${envX + envW / 2},${envY + envH - 2}`
        },
        duration: 0.2,
        ease: "power1.inOut"
    }, 0.35);

    // Compress envelope slightly to create tightening feel
    tl.to([morphBg, envelopeGroup], {
        scale: 0.94,
        transformOrigin: "center center",
        duration: 0.15,
        ease: "power2.inOut"
    }, 0.45);

    // ==========================================
    // STEP 4: PLANE FORMATION (250ms)
    // ==========================================
    // Cross-fade envelope elements to the paper plane group
    tl.to([envelopeGroup, morphBg], {
        opacity: 0,
        scale: 0.8,
        duration: 0.15,
        ease: "power2.in"
    }, 0.6);

    tl.to(planeGroup, {
        opacity: 1,
        scale: 0.047,
        duration: 0.25,
        ease: "back.out(1.5)"
    }, 0.6);

    // ==========================================
    // STEP 5: ANTICIPATION (100ms)
    // ==========================================
    // Plane bends and pulls back slightly before launch
    tl.to(planeGroup, {
        x: planeXCorrected - 8,
        scaleX: 0.042,
        scaleY: 0.042,
        duration: 0.1,
        ease: "power1.inOut"
    }, 0.85);

    // ==========================================
    // STEP 6 & 7: FLIGHT DYNAMICS (0.9s - constant speed, highly visible glide path)
    // ==========================================
    // Dynamically calculated flight path (soaring parabolic arc trajectory)
    tl.to(cloneContainer, {
        motionPath: {
            path: [
                { x: 0, y: 0 },
                { x: targetX * 0.20, y: targetY * 0.10 - 110 },
                { x: targetX * 0.50, y: targetY * 0.30 - 190 }, // high apex of the arc
                { x: targetX * 0.80, y: targetY * 0.70 - 90 },
                { x: targetX, y: targetY }
            ],
            curviness: 1.5
        },
        duration: 0.9,
        ease: "none" // Travels with constant, uniform speed throughout the journey
    }, 0.95);

    // Scale plane down by 10% (from 0.047 to 0.042) to create depth
    tl.to(planeGroup, {
        scale: 0.042,
        duration: 0.9,
        ease: "none"
    }, 0.95);

    // Banking (gentle banking of max 15 degrees)
    tl.to(planeGroup, {
        keyframes: [
            { rotate: -15, duration: 0.15 },
            { rotate: -5, duration: 0.30 },
            { rotate: 8, duration: 0.30 },
            { rotate: 12, duration: 0.15 }
        ],
        duration: 0.9,
        ease: "none"
    }, 0.95);

    // Motion Blur (blur filter only at mid-flight peak velocity)
    tl.to(planeGroup, {
        keyframes: [
            { filter: "blur(0.5px)", duration: 0.2 },
            { filter: "blur(2px)", duration: 0.5 },
            { filter: "blur(0.5px)", duration: 0.1 },
            { filter: "blur(0px)", duration: 0.1 }
        ],
        duration: 0.9,
        ease: "none"
    }, 0.95);

    // Jet shadow tracking
    tl.to(paperPlaneShadow, {
        opacity: 0.35,
        duration: 0.1
    }, 0.95);
    tl.to(paperPlaneShadow, {
        keyframes: [
            { scale: 1.1, x: targetX * 0.5, y: targetY * 0.5 + 50, opacity: 0.08, filter: "blur(7px)", duration: 0.45 },
            { scale: 0.2, x: targetX, y: targetY + 5, opacity: 0.5, filter: "blur(1.5px)", duration: 0.45 }
        ],
        duration: 0.9,
        ease: "none"
    }, 0.95);

    // Jet stream trail stretching
    tl.to(paperPlaneTrail, {
        keyframes: [
            { width: 45, opacity: 1, duration: 0.15 },
            { width: 75, opacity: 0.7, duration: 0.60 },
            { width: 0, opacity: 0, duration: 0.15 }
        ],
        duration: 0.9,
        ease: "power2.out"
    }, 0.95);

    // ==========================================
    // STEP 8: MAILBOX ANIMATION (350ms total)
    // ==========================================
    // Open lid 120ms before landing (landing is at t = 1.85s)
    tl.add(() => {
        openMailboxLid(mailbox);
    }, 1.73);

    // Plane enters and vanish
    tl.to(cloneContainer, {
        opacity: 0,
        duration: 0.08
    }, 1.85);

    tl.add(() => {
        closeMailboxLid(mailbox);
        bounceMailbox(mailbox);
    }, 1.85);

    // Wait 150ms pause, trigger active red glow
    tl.add(() => {
        triggerMailboxGlow(mailbox);
    }, 2.0);

    // Glow active duration 250ms, then fade out glow
    tl.add(() => {
        fadeMailboxGlow(mailbox);
    }, 2.25);

    // ==========================================
    // STEP 9: SUCCESS CARD TRANSITION (300ms)
    // ==========================================
    // Fade in success card after 150ms pause (t = 2.25s)
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
    }, 2.25);

    // Unlock interaction after success card animation (t = 2.5s)
    tl.add(() => {
        onUnlock();
    }, 2.5);

    return { timeline: tl, cloneContainer };
}
