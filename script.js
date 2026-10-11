document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Mobile Menu Toggle & Navigation
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);

        // Close on clicking outside the drawer
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });

        // Close when clicking any nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // ==========================================
    // 2. Navbar Scroll Effect
    // ==========================================
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ==========================================
    // 3. Active Nav Link on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const updateActiveLink = () => {
        let current = '';
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ==========================================
    // 4. Gallery Category Filtering
    // ==========================================
    const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    const galleryCountEl = document.getElementById('gallery-count');

    const filterGallery = (category) => {
        let visibleCount = 0;

        galleryItems.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            if (category === 'all' || itemCat === category) {
                item.style.display = '';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (galleryCountEl && category === 'all') {
            galleryCountEl.textContent = visibleCount;
        }
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');
            filterGallery(category);
        });
    });

    // ==========================================
    // 5. Interactive Lightbox Modal
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentVisibleItems = [];
    let currentIndex = 0;

    const getVisibleGalleryItems = () => {
        return Array.from(galleryItems).filter(item => item.style.display !== 'none');
    };

    const openLightbox = (index) => {
        currentVisibleItems = getVisibleGalleryItems();
        if (currentVisibleItems.length === 0) return;

        currentIndex = (index + currentVisibleItems.length) % currentVisibleItems.length;
        const currentItem = currentVisibleItems[currentIndex];
        const src = currentItem.getAttribute('data-src') || currentItem.querySelector('img').src;
        const title = currentItem.getAttribute('data-title') || currentItem.querySelector('img').alt || 'Manjaly Dental Care';

        lightboxImg.src = src;
        lightboxCaption.textContent = title;
        lightboxCounter.textContent = `${currentIndex + 1} of ${currentVisibleItems.length}`;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const nextImage = () => {
        if (currentVisibleItems.length <= 1) return;
        openLightbox(currentIndex + 1);
    };

    const prevImage = () => {
        if (currentVisibleItems.length <= 1) return;
        openLightbox(currentIndex - 1);
    };

    // Attach click handlers to all gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            currentVisibleItems = getVisibleGalleryItems();
            const idx = currentVisibleItems.indexOf(item);
            openLightbox(idx >= 0 ? idx : 0);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch Swipe support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
            if (diff < 0) {
                nextImage(); // Swiped left
            } else {
                prevImage(); // Swiped right
            }
        }
    };
});
