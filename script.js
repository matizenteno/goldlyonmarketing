/* =======================================================
   GOLD LYON AGENCY — SCRIPT
   Interactividad y animaciones
======================================================= */

/* ============ Preloader ============ */
window.addEventListener('load', () => {
    const pre = document.querySelector('.preloader');
    if (!pre) return;
    setTimeout(() => pre.classList.add('hidden'), 600);
});

/* ============ Navbar al hacer scroll ============ */
const navbar = document.querySelector('.navbar');
const handleNavScroll = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
};
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ============ Menú móvil ============ */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    // Cerrar menú al hacer click en cualquier link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

/* ============ Contador animado de stats ============ */
const animateCounter = (el, target) => {
    const duration = 2000;
    const startTime = performance.now();

    const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const num = entry.target;
            const target = parseInt(num.dataset.target, 10);
            animateCounter(num, target);
            statsObserver.unobserve(num);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(n => statsObserver.observe(n));

/* ============ Reveal on scroll ============ */
const revealTargets = document.querySelectorAll(
    '.service-card, .process-step, .feature, .testimonial, .section-header, .contact-info, .contact-form'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Pequeño stagger si el target tiene hermanos del mismo tipo
            const parent = entry.target.parentElement;
            const siblings = parent ? [...parent.children].filter(c => c.classList.contains('reveal')) : [];
            const index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.max(index, 0) * 0.1}s`;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

/* ============ Formulario de contacto ============ */
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validación simple
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderBottomColor = '#ff6b6b';
                valid = false;
            } else {
                field.style.borderBottomColor = '';
            }
        });

        if (!valid) return;

        // Aquí puedes integrar con EmailJS, Formspree, tu backend, etc.
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            alert('¡Gracias por tu mensaje! Te contactaremos en menos de 24 horas.');
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 800);
    });
}