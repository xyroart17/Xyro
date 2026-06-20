// MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

if (mobileLinks) {
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// BULLETPROOF SCROLL REVEAL (Triggers instantly on enter)
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.02, // Triggers immediately when 2% of the element enters screen
    rootMargin: '0px 0px -10px 0px' 
});

revealEls.forEach(el => revealObserver.observe(el));

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// PARALLAX ORB ON MOUSE MOVE
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 60;
    const y = (e.clientY - window.innerHeight / 2) / 60;
    if (orb1) orb1.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
    if (orb2) orb2.style.transform = `translate(${-x * 14}px, ${-y * 14}px)`;
});

// ACTIVE NAV LINK ON SCROLL
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinksAll.forEach(link => {
        if(link.getAttribute('href') === '#' + current) {
            link.style.color = '#ff4d4d';
        } else {
            link.style.color = '#fff';
        }
    });
});