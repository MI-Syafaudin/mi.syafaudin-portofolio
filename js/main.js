document.addEventListener('DOMContentLoaded', () => {
  // --- THEME MANAGEMENT ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const lightIcon = document.getElementById('theme-icon-light');
  const darkIcon = document.getElementById('theme-icon-dark');
  const root = document.documentElement;

  function updateIcons(isDark) {
    if (isDark) {
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    } else {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
  }

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    root.classList.add('dark');
    updateIcons(true);
  } else {
    root.classList.remove('dark');
    updateIcons(false);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = root.classList.contains('dark');
    if (isCurrentlyDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      updateIcons(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updateIcons(true);
    }
  });

  // --- NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('py-2', 'backdrop-blur-md');
      navbar.classList.remove('py-4');
    } else {
      navbar.classList.add('py-4');
      navbar.classList.remove('py-2', 'backdrop-blur-md');
    }
  }, { passive: true });

  // --- MOBILE MENU BEHAVIOR ---
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  let isMenuOpen = false;

  menuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    menuBtn.setAttribute('aria-expanded', isMenuOpen);

    if (isMenuOpen) {
      mobileMenu.classList.remove('hidden');
      if (window.gsap) {
        gsap.to(mobileMenu, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
      } else {
        mobileMenu.classList.remove('opacity-0');
      }
    } else {
      if (window.gsap) {
        gsap.to(mobileMenu, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => mobileMenu.classList.add('hidden')
        });
      } else {
        mobileMenu.classList.add('hidden', 'opacity-0');
      }
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden', 'opacity-0');
    });
  });
});
