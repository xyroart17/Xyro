import { gsap } from "gsap";

export interface MorphElements {
    cloneContainer: HTMLElement;
    morphBg: SVGRectElement;
    envelopeGroup: SVGGraphicsElement;
    envelopeFlap: SVGPolygonElement;
}

/**
 * Creates and appends the morph SVG structure matching the submit button dimensions.
 */
export function createEnvelopeMorph(submitBtn: HTMLButtonElement): MorphElements {
    const rectBtn = submitBtn.getBoundingClientRect();
    
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
    
    cloneContainer.innerHTML = `
        <div class="morph-wrapper" style="width: 100%; height: 100%; position: relative; transform-style: preserve-3d; will-change: transform;">
            <svg width="100%" height="100%" viewBox="0 0 ${rectBtn.width} ${rectBtn.height}" style="overflow: visible; position: absolute; inset: 0; transform-style: preserve-3d;">
                <!-- Morphing background rect -->
                <rect id="morph-bg" x="0" y="0" width="${rectBtn.width}" height="${rectBtn.height}" rx="${rectBtn.height / 2}" ry="${rectBtn.height / 2}" fill="#ff4d4d" style="will-change: transform, fill, stroke, width, height, x, y;" />
                
                <!-- Stationery envelope folds -->
                <g id="envelope-group" style="opacity: 0; transform-origin: center; will-change: opacity, transform;">
                    <polygon id="envelope-flap" points="${envX},${envY} ${envX + envW},${envY} ${envX + envW / 2},${envY + 20}" fill="#fcfcfc" stroke="#d4d4d4" stroke-width="1" style="will-change: points;" />
                    <path id="envelope-body" d="M ${envX},${envY + envH} L ${envX + envW / 2},${envY + 24} L ${envX + envW},${envY + envH}" fill="none" stroke="#d4d4d4" stroke-width="1" />
                </g>
            </svg>
        </div>
    `;
    
    document.body.appendChild(cloneContainer);
    
    const morphBg = cloneContainer.querySelector("#morph-bg") as SVGRectElement;
    const envelopeGroup = cloneContainer.querySelector("#envelope-group") as SVGGraphicsElement;
    const envelopeFlap = cloneContainer.querySelector("#envelope-flap") as SVGPolygonElement;
    
    return { cloneContainer, morphBg, envelopeGroup, envelopeFlap };
}

/**
 * Appends the button-to-envelope morph animations to the master timeline.
 */
export function animateButtonMorph(tl: gsap.core.Timeline, elements: MorphElements, rectBtn: DOMRect) {
    const envW = 64;
    const envH = 46;
    const envX = (rectBtn.width - envW) / 2;
    const envY = (rectBtn.height - envH) / 2;
    
    tl.to(elements.morphBg, {
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
    
    tl.to(elements.envelopeGroup, {
        opacity: 1,
        duration: 0.2
    }, 0.15);
}
