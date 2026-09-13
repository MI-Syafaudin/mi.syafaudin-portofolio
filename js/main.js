document.addEventListener('DOMContentLoaded', () => {
  // --- 1. THEME MANAGEMENT ---
  const themeToggleBtn = document.getElementById('theme-toggle') || document.querySelector('.theme-toggle-btn');
  const lightIcon = document.getElementById('theme-icon-light') || document.querySelector('.icon-sun');
  const darkIcon = document.getElementById('theme-icon-dark') || document.querySelector('.icon-moon');
  const root = document.documentElement;

  function updateIcons(isDark) {
    if (lightIcon && darkIcon) {
      if (isDark) {
        lightIcon.classList.remove('hidden');
        lightIcon.style.display = 'block';
        darkIcon.classList.add('hidden');
        darkIcon.style.display = 'none';
      } else {
        lightIcon.classList.add('hidden');
        lightIcon.style.display = 'none';
        darkIcon.classList.remove('hidden');
        darkIcon.style.display = 'block';
      }
    }
  }

  function updateGitHubChartTheme(isDark) {
    const chartImg = document.getElementById('github-chart-img');
    if (chartImg) {
      const accentColor = isDark ? '38bdf8' : '2563eb';
      chartImg.src = `https://ghchart.rshah.org/${accentColor}/MI-Syafaudin`;
    }
  }

  function applyTheme(isDark) {
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    updateIcons(isDark);
    updateGitHubChartTheme(isDark);
  }

  // Cek preferensi tersimpan di localStorage atau sistem OS
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialIsDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

  applyTheme(initialIsDark);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyDark = root.classList.contains('dark');
      const nextThemeIsDark = !isCurrentlyDark;
      localStorage.setItem('theme', nextThemeIsDark ? 'dark' : 'light');
      applyTheme(nextThemeIsDark);
    });
  }

  // --- 2. NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar') || document.getElementById('main-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('py-2', 'backdrop-blur-md');
        navbar.classList.remove('py-4');
      } else {
        navbar.classList.add('py-4');
        navbar.classList.remove('py-2', 'backdrop-blur-md');
      }
    }, { passive: true });
  }

  // --- 3. MOBILE MENU BEHAVIOR ---
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  let isMenuOpen = false;

  if (menuBtn && mobileMenu) {
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
  }

  // --- 4. GITHUB REPO COUNT API ---
  fetch('https://api.github.com/users/MI-Syafaudin')
    .then(res => {
      if (!res.ok) throw new Error('API limit reached or user not found');
      return res.json();
    })
    .then(data => {
      const repoElem = document.getElementById('gh-repos');
      if (repoElem && typeof data.public_repos === 'number') {
        repoElem.textContent = data.public_repos;
      }
    })
    .catch(() => {
      const repoElem = document.getElementById('gh-repos');
      if (repoElem && !repoElem.textContent.trim()) {
        repoElem.textContent = '2+';
      }
    });
});
