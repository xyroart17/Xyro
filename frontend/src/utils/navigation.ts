export interface NavItem {
    label: string;
    hash: string;
    isCTA?: boolean;
}

export const navItems: NavItem[] = [
    { label: "Vault", hash: "work" },
    { label: "Gacha", hash: "gacha" },
    { label: "Pricing", hash: "deal" },
    { label: "Book a slot", hash: "contact", isCTA: true }
];

/**
 * Gets the href for a navigation item based on whether the current page is the homepage.
 */
export function getHref(item: NavItem, isHomepage: boolean): string {
    return isHomepage ? `#${item.hash}` : `/#${item.hash}`;
}
