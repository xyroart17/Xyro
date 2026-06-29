import { initAnimationController } from "./AnimationController.ts";

/**
 * MessagePlane — Decoupled bootstrap entry point for the form submission animation layer.
 */
document.addEventListener("astro:page-load", () => {
    initAnimationController();
});
