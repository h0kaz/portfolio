gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true
});

const lenis = new Lenis({
    duration: 1,
    smoothWheel: true,
    smoothTouch: true,
    touchMultiplier: 1.5
});

// Upgraded GSAP + Lenis rendering loop using requestAnimationFrame directly
lenis.on('scroll', ScrollTrigger.update);

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
ScrollTrigger.refresh();

// Cache frequent selectors
const magneticWraps = document.querySelectorAll('.magnetic-wrap');
const counters = document.querySelectorAll('.counter');

// Magnetic Button Effect Optimization
magneticWraps.forEach(wrap => {
    const btn = wrap.querySelector('.magnetic-btn');
    if (!btn) return;
    const inFooter = !!wrap.closest('footer#contact');
    const isPrimaryFooterCta = btn.classList.contains('magnetic-primary');
    if (inFooter && !isPrimaryFooterCta) return;

    const maxMove = 12;
    const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power2.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power2.out" });

    wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        xTo(x * maxMove);
        yTo(y * maxMove);
    });

    wrap.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Hero Animations
gsap.to('.hero-float', {
    y: -20,
    rotation: 8,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
});

// Hero Chart Animation Setup (Bar Growth & Counter)
gsap.to('.chart-bar', {
    scaleY: 1,
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.5
});

const heroCounter = document.querySelector('.hero-counter');
if(heroCounter) {
    gsap.to(heroCounter, {
        innerHTML: 30,
        duration: 2,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        delay: 0.5,
        onUpdate: function() {
            heroCounter.innerHTML = Math.round(this.targets()[0].innerHTML);
        }
    });
}

// Scroll Indicator Fade Out (Optimized to translate/opacity)
gsap.to('.hero-scroll', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '150px top',
        scrub: true
    },
    opacity: 0,
    y: -20,
    ease: "none"
});

// Simplified DOM Queries & Batched Animations
ScrollTrigger.batch('.slide-up', {
    start: "top 85%",
    onEnter: (batch) => gsap.fromTo(batch,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1, overwrite: true }
    ),
    onLeaveBack: (batch) => gsap.to(batch, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        overwrite: true
    })
});

gsap.from('.reveal-text', {
    scrollTrigger: {
        trigger: '.about-text',
        start: "top 75%",
    },
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power2.out"
});

gsap.from('.skill-card', {
    scrollTrigger: {
        trigger: '#expertise',
        start: "top 70%",
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.2)"
});

gsap.from('.tool-card', {
    scrollTrigger: {
        trigger: '#tools',
        start: "top 75%",
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.2)"
});

gsap.from('.cert-card', {
    scrollTrigger: {
        trigger: '#certifications',
        start: "top 75%",
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
});

// Education Section Animation
ScrollTrigger.batch('.edu-item', {
    start: "top 85%",
    once: true,
    onEnter: (batch) => gsap.from(batch, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        overwrite: true
    })
});

gsap.utils.toArray('.timeline-item').forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
        },
        x: item.classList.contains('md:pl-16') ? 50 : -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

counters.forEach(counter => {
    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        once: true,
        onEnter: () => {
            const target = +counter.getAttribute('data-target');
            const duration = 2;

            gsap.to(counter, {
                innerHTML: target,
                duration: duration,
                ease: "power2.out",
                snap: { innerHTML: 1 },
                onUpdate: function() {
                    counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                }
            });
        }
    });
});

// Modals Setup
const setupModal = (modalId, openSelectors, closeSelectors) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const content = modal.querySelector('.modal-content');
    const bg = modal.querySelector('.modal-bg');
    const openBtns = document.querySelectorAll(openSelectors);
    const closeBtns = modal.querySelectorAll(closeSelectors);

    const openModal = (e) => {
        e.preventDefault();
        lenis.stop();
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hidden');
        modal.classList.remove('pointer-events-none');

        gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.fromTo(content, 
            { scale: 0.95, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)', delay: 0.05 }
        );
    };

    const closeModal = (e) => {
        if (e) e.preventDefault();
        lenis.start();
        document.body.style.overflow = '';

        gsap.to(modal, { 
            opacity: 0, 
            duration: 0.3, 
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.add('pointer-events-none');
                modal.classList.add('hidden');
            }
        });
        gsap.to(content, { scale: 0.95, duration: 0.3, ease: 'power2.in' });
    };

    openBtns.forEach(btn => btn.addEventListener('click', openModal));
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    bg.addEventListener('click', closeModal);

    return closeModal;
};

const closeContactFunc = setupModal('contact-modal', '.open-contact-btn', '.close-contact-btn');
setupModal('cert-modal', '.open-cert-preview', '.close-cert-btn');

const shopifyTrack = document.getElementById('shopify-track');
const shopifyPrev = document.getElementById('shopify-prev');
const shopifyNext = document.getElementById('shopify-next');
const shopifyDots = document.querySelectorAll('.shopify-dot');

if (shopifyTrack && shopifyPrev && shopifyNext) {
    const shopifyCards = Array.from(shopifyTrack.querySelectorAll('[data-shopify-card]'));
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;

    const getScrollAmount = () => Math.min(460, Math.max(260, shopifyTrack.clientWidth * 0.85));

    const setActiveDot = () => {
        if (!shopifyCards.length || !shopifyDots.length) return;
        const centerPoint = shopifyTrack.scrollLeft + (shopifyTrack.clientWidth / 2);
        let closestIndex = 0;
        let closestDistance = Infinity;

        shopifyCards.forEach((card, idx) => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const distance = Math.abs(cardCenter - centerPoint);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = idx;
            }
        });

        shopifyDots.forEach((dot, idx) => {
            dot.classList.toggle('bg-accent', idx === closestIndex);
            dot.classList.toggle('bg-border', idx !== closestIndex);
        });
    };

    const scrollToCard = (index) => {
        const card = shopifyCards[index];
        if (!card) return;
        const left = card.offsetLeft - ((shopifyTrack.clientWidth - card.offsetWidth) / 2);
        shopifyTrack.scrollTo({ left, behavior: 'smooth' });
    };

    shopifyPrev.addEventListener('click', () => {
        shopifyTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    shopifyNext.addEventListener('click', () => {
        shopifyTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    shopifyDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => scrollToCard(idx));
    });

    shopifyTrack.addEventListener('scroll', setActiveDot, { passive: true });

    if (window.innerWidth > 768) {
        shopifyTrack.addEventListener('mousedown', (event) => {
            isDragging = true;
            dragStartX = event.pageX;
            dragStartScrollLeft = shopifyTrack.scrollLeft;
            shopifyTrack.classList.add('cursor-grabbing');
            shopifyTrack.classList.remove('cursor-grab');
        });

        shopifyTrack.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
            event.preventDefault();
            const walk = (event.pageX - dragStartX) * 1.2;
            shopifyTrack.scrollLeft = dragStartScrollLeft - walk;
        });

        const stopDragging = () => {
            isDragging = false;
            shopifyTrack.classList.remove('cursor-grabbing');
            shopifyTrack.classList.add('cursor-grab');
        };

        shopifyTrack.addEventListener('mouseup', stopDragging);
        shopifyTrack.addEventListener('mouseleave', stopDragging);
    }

    setActiveDot();
}
