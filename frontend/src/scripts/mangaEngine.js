/**
 * StudioA4 Featured Manga Redirection Engine
 * Redirects the user to the dedicated manga reader page on card click.
 */

export function initMangaEngine() {
    const cards = document.querySelectorAll(".manga-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const slug = card.getAttribute("data-slug");
            if (slug) {
                window.location.href = `/manga/${slug}`;
            }
        });
    });
}
