document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP is loaded locally
  if (typeof gsap === 'undefined') {
    console.warn('GSAP local library not detected.');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Accessibility: Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return; // Skip complex transform/scale animations
  }

  // --- 1. HERO ENTRANCE ANIMATIONS ---
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .from('#navbar nav', {
      y: -30,
      opacity: 0,
      duration: 0.8
    })
    .from('.hero-tag', {
      opacity: 0,
      y: 10,
      duration: 0.4
    }, '-=0.3')
    .from('.hero-title', {
      opacity: 0,
      y: 25,
      duration: 0.7
    }, '-=0.2')
    .from('.hero-roles p', {
      opacity: 0,
      x: -15,
      stagger: 0.12,
      duration: 0.5
    }, '-=0.3')
    .from('.hero-desc', {
      opacity: 0,
      y: 15,
      duration: 0.6
    }, '-=0.3')
    .from('.hero-cta a', {
      opacity: 0,
      y: 15,
      stagger: 0.15,
      duration: 0.5
    }, '-=0.3')
    .from('.hero-avatar-wrap', {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power2.out"
    }, '-=0.8');

  // Subtle Parallax Hover for Avatar
  const avatarWrap = document.querySelector('.hero-avatar-wrap');
  if (avatarWrap) {
    avatarWrap.addEventListener('mousemove', (e) => {
      const rect = avatarWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to('.hero-avatar', {
        x: x * 10,
        y: y * 10,
        duration: 0.4,
        ease: "power1.out"
      });
    });

    avatarWrap.addEventListener('mouseleave', () => {
      gsap.to('.hero-avatar', {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    });
  }

  // --- 2. SCROLL TRIGGERED SECTIONS ---
  if (typeof ScrollTrigger !== 'undefined') {
    // Section Title Reveals
    gsap.utils.toArray('.reveal-header').forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out"
      });
    });

    // Timeline Steps Reveal
    gsap.utils.toArray('.timeline-step').forEach((step) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    // Skill Groups Stagger
    gsap.from('.skill-group', {
      scrollTrigger: {
        trigger: '#skills',
        start: "top 75%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out"
    });

    // Project Cards Stagger
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '#projects',
        start: "top 75%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: "power2.out"
    });
  }
});
