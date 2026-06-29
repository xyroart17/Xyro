import { gsap } from "gsap";

/**
 * Detects and returns the active mailbox element based on screen width.
 */
export function getActiveMailbox(): HTMLElement | null {
    let mailbox = document.getElementById("navMailbox");
    if (window.innerWidth <= 768) {
        mailbox = document.getElementById("navMailboxMobile");
    }
    return mailbox;
}

/**
 * Animates opening the mailbox lid.
 */
export function openMailboxLid(mailbox: HTMLElement, duration = 0.3): gsap.core.Tween {
    const door = mailbox.querySelector(".mailbox-door");
    return gsap.to(door, {
        rotateX: 100,
        y: 1,
        transformOrigin: "bottom center",
        duration: duration,
        ease: "power2.out"
    });
}

/**
 * Animates closing the mailbox lid.
 */
export function closeMailboxLid(mailbox: HTMLElement, duration = 0.35): gsap.core.Tween {
    const door = mailbox.querySelector(".mailbox-door");
    return gsap.to(door, {
        rotateX: 0,
        y: 0,
        transformOrigin: "bottom center",
        duration: duration,
        ease: "back.out(1.15)"
    });
}

/**
 * Triggers a premium physical bounce on the mailbox icon.
 */
export function bounceMailbox(mailbox: HTMLElement, duration = 0.45): gsap.core.Tween {
    const svg = mailbox.querySelector(".mailbox-svg");
    return gsap.fromTo(svg, 
        { scale: 1, y: 0 },
        { 
            scale: 1.15, 
            y: -3, 
            duration: duration / 2, 
            yoyo: true, 
            repeat: 1, 
            ease: "power2.out" 
        }
    );
}

/**
 * Animates the mailbox active glow effect.
 */
export function triggerMailboxGlow(mailbox: HTMLElement, duration = 0.25): gsap.core.Tween {
    return gsap.to(mailbox, {
        color: "#ff4d4d",
        filter: "drop-shadow(0 0 10px #ff4d4d)",
        duration: duration,
        ease: "power2.out"
    });
}

/**
 * Fades out the mailbox active glow effect.
 */
export function fadeMailboxGlow(mailbox: HTMLElement, duration = 0.4): gsap.core.Tween {
    return gsap.to(mailbox, {
        color: "",
        filter: "",
        duration: duration,
        ease: "power2.in"
    });
}
