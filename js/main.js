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

  // --- 5. CERTIFICATE POPUP MODAL LOGIC ---
  const certModal = document.getElementById('cert-modal');
  const certModalCard = document.getElementById('cert-modal-card');
  const certModalOverlay = document.getElementById('cert-modal-overlay');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalDismiss = document.getElementById('cert-modal-dismiss-btn');
  const certGallery = document.getElementById('cert-modal-gallery');
  const certTitle = document.getElementById('cert-modal-title');
  const certIssuer = document.getElementById('cert-modal-issuer');
  const certDesc = document.getElementById('cert-modal-desc');
  const certLink = document.getElementById('cert-modal-link');

  const openCertButtons = document.querySelectorAll('.open-cert-btn');

  function openModal(btn) {
    if (!certModal) return;

    const title = btn.getAttribute('data-cert-title') || 'Certificate Preview';
    const issuer = btn.getAttribute('data-cert-issuer') || '';
    const desc = btn.getAttribute('data-cert-desc') || '';
    const link = btn.getAttribute('data-cert-link') || '';
    const imagesStr = btn.getAttribute('data-cert-images') || '';
    const images = imagesStr.split(',').map(s => s.trim()).filter(Boolean);

    certTitle.textContent = title;
    certIssuer.textContent = issuer;
    certDesc.textContent = desc;

    // Handle link verifikasi eksternal (misal: Credly / Badgr)
    if (certLink) {
      if (link && link.trim() !== '') {
        certLink.href = link;
        certLink.classList.remove('hidden');
        certLink.classList.add('inline-flex');
      } else {
        certLink.href = '#';
        certLink.classList.add('hidden');
        certLink.classList.remove('inline-flex');
      }
    }

    certGallery.innerHTML = '';

    if (images.length === 2) {
      certGallery.className = 'my-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center';
    } else {
      certGallery.className = 'my-6 grid grid-cols-1 gap-4 items-center justify-center';
    }

    if (images.length === 0) {
      const fallback = document.createElement('div');
      fallback.className = 'neu-pressed p-8 rounded-2xl text-center text-xs font-mono text-slate-400 w-full';
      fallback.textContent = 'Preview gambar sertifikat belum tersedia.';
      certGallery.appendChild(fallback);
    } else {
      images.forEach((imgSrc, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'neu-pressed p-2 sm:p-3 rounded-2xl overflow-hidden bg-slate-200/50 dark:bg-slate-900/50 flex items-center justify-center';
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `${title} - Gambar ${idx + 1}`;
        img.className = 'w-full h-auto max-h-[50vh] object-contain rounded-xl transition duration-300 hover:scale-[1.02]';
        img.loading = 'lazy';
        img.onerror = function() {
          this.onerror = null;
          this.parentElement.innerHTML = `<span class="p-4 text-xs font-mono text-slate-400">File tidak ditemukan: ${imgSrc}</span>`;
        };
        
        wrapper.appendChild(img);
        certGallery.appendChild(wrapper);
      });
    }

    certModal.classList.remove('hidden');
    certModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    if (window.gsap) {
      gsap.fromTo(certModal, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(certModalCard, 
        { scale: 0.92, y: 20, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
      );
    }
  }

  function closeModal() {
    if (!certModal) return;

    if (window.gsap) {
      gsap.to(certModalCard, {
        scale: 0.94,
        y: 10,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      });
      gsap.to(certModal, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          certModal.classList.add('hidden');
          certModal.classList.remove('flex');
          document.body.style.overflow = '';
        }
      });
    } else {
      certModal.classList.add('hidden');
      certModal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  openCertButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn);
    });
  });

  if (certModalClose) certModalClose.addEventListener('click', closeModal);
  if (certModalDismiss) certModalDismiss.addEventListener('click', closeModal);
  if (certModalOverlay) certModalOverlay.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && !certModal.classList.contains('hidden')) {
      closeModal();
    }
  });
});
