export interface NavItem {
    label: string;
    hash: string;
    isCTA?: boolean;
}

export const navItems: NavItem[] = [
    { label: "Work", hash: "work" },
    { label: "Expertise", hash: "services" },
    { label: "About", hash: "about" },
    { label: "Testimonials", hash: "testimonials" },
    { label: "Start a Project", hash: "contact", isCTA: true }
];

/**
 * Gets the href for a navigation item based on whether the current page is the homepage.
 */
export function getHref(item: NavItem, isHomepage: boolean): string {
    return isHomepage ? `#${item.hash}` : `/#${item.hash}`;
}
