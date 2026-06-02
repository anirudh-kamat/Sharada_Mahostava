// Professional Hero Slideshow with Logo Modal and Gallery

let currentSlideIndex = 0;
let slideInterval;
let isTransitioning = false;
let slides = [];
let hoverPauseArmed = false; // avoid pausing on initial page load when cursor is already over slideshow

// Initialize slideshow when page loads
document.addEventListener('DOMContentLoaded', function() {
    // If this page was reloaded and it's not the homepage, redirect to homepage
    try {
        const navEntry = (performance && performance.getEntriesByType) ? performance.getEntriesByType('navigation')[0] : null;
        const isReload = navEntry ? (navEntry.type === 'reload') : (performance && performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD);
        const path = window.location.pathname || '';
        if (isReload && !path.endsWith('index.html') && path !== '/') {
            window.location.replace('index.html');
            return; // Prevent running the rest of the scripts on this page
        }
    } catch (_) {}
    
    // Get slides after DOM is loaded
    slides = document.querySelectorAll('.slide');
    
    // Initialize first slide
    showSlide(0);
    
    // Start automatic slideshow
    startSlideshow();
    
    // Setup navigation
    setupNavigation();
    
    // Setup hover events
    setupHoverEvents();

    // Progressive enhancements (non-breaking)
    try {
        // Lazy-load non-hero images
        document.querySelectorAll('img').forEach((img) => {
            const isHero = img.classList.contains('contact-hero-image') || img.classList.contains('logo-image');
            if (!isHero && !img.loading) img.loading = 'lazy';
        });
    } catch (_) {}

    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Setup touch events
    setupTouchEvents();
    
    // Setup dropdown functionality
    setupDropdownMenu();
    
    // Setup modal functionality
    setupModalEvents();
    
    // Apply lazy loading to gallery images to speed up first paint
    applyLazyLoadingToGallery();

    // Instant jump for tabs (no smooth scroll lag)
    document.querySelectorAll('.tab-link[data-instant="true"]').forEach(a => {
        a.addEventListener('click', function(e){
            const id = this.getAttribute('href');
            if (id && id.startsWith('#')) {
                e.preventDefault();
                document.querySelectorAll('.gallery-tabs .tab-link').forEach(l=>l.classList.remove('is-active'));
                this.classList.add('is-active');
                const el = document.querySelector(id);
                if (el) {
                    el.setAttribute('tabindex','-1');
                    el.focus({ preventScroll: true });
                    window.location.hash = id.substring(1);
                }
            }
        });
    });

    // Initialize YouTube embeds safely with current origin
    initializeYouTubeEmbeds();

    // Skip loading YouTube API since we're using a local video for the featured slot
});

// Gallery Image Modal with carousel support
let galleryMediaSources = [];
let galleryMediaTypes = []; // 'image' | 'video'
let galleryCurrentIndex = 0;

function cacheGalleryImages() {
    const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-item video');
    galleryMediaSources = [];
    galleryMediaTypes = [];
    galleryItems.forEach(el => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'img' || tag === 'video') {
            const src = el.getAttribute('src');
            if (src) {
                galleryMediaSources.push(src);
                galleryMediaTypes.push(tag === 'img' ? 'image' : 'video');
            }
        }
    });
}

function openImageModal(imageSrc, imageTitle) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    if (!galleryMediaSources || galleryMediaSources.length === 0) {
        cacheGalleryImages();
    }
    const idx = galleryMediaSources.indexOf(imageSrc);
    if (idx >= 0) galleryCurrentIndex = idx;

    openMediaByIndex(galleryCurrentIndex, imageTitle);
}

function openMediaByIndex(index, title) {
    if (!galleryMediaSources || galleryMediaSources.length === 0) return;
    if (index < 0) index = galleryMediaSources.length - 1;
    if (index >= galleryMediaSources.length) index = 0;
    galleryCurrentIndex = index;

    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');

    // Close both first
    if (imageModal) imageModal.style.display = 'none';
    if (videoModal) videoModal.style.display = 'none';
    // Ensure any playing video is stopped when we navigate away
    if (modalVideo) {
        try { modalVideo.pause(); } catch (_) {}
        modalVideo.currentTime = 0;
    }

    const src = galleryMediaSources[galleryCurrentIndex];
    const type = galleryMediaTypes[galleryCurrentIndex];
    if (type === 'video' && videoModal && modalVideo) {
        if (modalVideo.getAttribute('src') !== src) modalVideo.src = src;
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        try { modalVideo.play(); } catch (_) {}
    } else if (imageModal && modalImage) {
        modalImage.src = src;
        modalImage.alt = title || '';
        // Rotate certain portrait images in modal by 270deg
        if (src && (src.indexOf('D14') !== -1 ||
                    src.indexOf('A12') !== -1 ||
                    src.indexOf('A15') !== -1 ||
                    src.indexOf('A16') !== -1 ||
                    src.indexOf('A18') !== -1 ||
                    src.indexOf('A19') !== -1 ||
                    src.indexOf('A20') !== -1 ||
                    src.indexOf('A21') !== -1)) {
            modalImage.style.setProperty('transform', 'rotate(270deg)', 'important');
            modalImage.style.setProperty('object-fit', 'cover', 'important');
            modalImage.style.setProperty('display', 'block', 'important');
            modalImage.style.setProperty('width', '100%', 'important');
            modalImage.style.setProperty('height', '100%', 'important');
            modalImage.style.setProperty('background', 'transparent', 'important');
            modalImage.style.setProperty('margin', '0', 'important');
            modalImage.style.setProperty('padding', '0', 'important');
        } else {
            modalImage.style.removeProperty('transform');
            modalImage.style.removeProperty('background');
        }
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function nextGalleryImage() {
    openMediaByIndex(galleryCurrentIndex + 1);
}

function prevGalleryImage() {
    openMediaByIndex(galleryCurrentIndex - 1);
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Setup modal event listeners
function setupModalEvents() {
    const imageModal = document.getElementById('imageModal');
    const videoModal = document.getElementById('videoModal');

    // Close image modal when clicking outside
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    // Close video modal when clicking outside
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

}

// Video modal helpers
function openVideoModal(videoSrc) {
    if (!galleryMediaSources || galleryMediaSources.length === 0) {
        cacheGalleryImages();
    }
    const idx = galleryMediaSources.indexOf(videoSrc);
    if (idx >= 0) galleryCurrentIndex = idx;
    openMediaByIndex(galleryCurrentIndex);
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    if (modal) modal.style.display = 'none';
    if (video) {
        try { video.pause(); } catch (_) {}
        video.currentTime = 0;
    }
    document.body.style.overflow = 'auto';
}

// Add native lazy-loading and async decoding to all gallery images
function applyLazyLoadingToGallery() {
    const images = document.querySelectorAll('.gallery-image');
    images.forEach((img, index) => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        // The very first image in a section can keep default priority
        if (index > 2 && !img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
        // Add width/height hints if missing to reduce layout shift
        if (!img.getAttribute('width')) img.setAttribute('width', '600');
        if (!img.getAttribute('height')) img.setAttribute('height', '400');
    });
}

// Initialize YouTube iframes with origin param to avoid config errors
function initializeYouTubeEmbeds() {
    try {
        const origin = window.location.origin;
        document.querySelectorAll('.yt-embed').forEach(iframe => {
            const videoId = iframe.getAttribute('data-video-id');
            if (!videoId) return;
            const params = [
                'rel=0',
                'modestbranding=1',
                'playsinline=1',
                'enablejsapi=1',
                'origin=' + encodeURIComponent(origin)
            ].join('&');
            const src = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?' + params;
            if (iframe.getAttribute('src') !== src) iframe.setAttribute('src', src);
        });
    } catch (_) { /* no-op */ }
}

// Setup dropdown menu functionality
function setupDropdownMenu() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Handle click events
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
        
        // Handle dropdown link clicks
        const dropdownLinks = dropdown.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // Allow navigation for internal pages (gallery/contact). Prevent only for placeholders.
                if (!href || href === '#') {
                    e.preventDefault();
                }
                
                // Remove active class from all nav links
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Add active class to clicked dropdown link
                this.classList.add('active');
                
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        // Keep menu open on mobile; only the toggle should close it
        if (isMobile) return;
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Show specific slide with clean transitions
function showSlide(index) {
    if (isTransitioning || !slides || slides.length === 0) return;
    
    isTransitioning = true;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    currentSlideIndex = index;
    
    // Reset transition flag after animation
    setTimeout(() => {
        isTransitioning = false;
    }, 900); // Match CSS transition time (~0.8s)
}

// Start automatic slideshow (changes every 4 seconds)
function startSlideshow() {
    stopSlideshow();
    slideInterval = setInterval(() => {
        if (!isTransitioning && slides && slides.length > 0) {
            nextSlide();
        }
    }, 3000); // 3 seconds per user request
}

// Stop automatic slideshow
function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Next slide
function nextSlide() {
    if (!slides || slides.length === 0) return;
    
    let nextIndex = currentSlideIndex + 1;
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    showSlide(nextIndex);
}

// Previous slide
function prevSlide() {
    if (!slides || slides.length === 0) return;
    
    let prevIndex = currentSlideIndex - 1;
    if (prevIndex < 0) {
        prevIndex = slides.length - 1;
    }
    showSlide(prevIndex);
}

// Change slide (direction: -1 for previous, 1 for next)
function changeSlide(direction) {
    if (isTransitioning || !slides || slides.length === 0) return;
    
    stopSlideshow();
    
    if (direction === 1) {
        nextSlide();
    } else {
        prevSlide();
    }
    
    // Restart automatic slideshow after 3 seconds
    setTimeout(() => {
        startSlideshow();
    }, 3000);
}

// Setup navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for external links
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
        });
    });
}

// Setup hover events
function setupHoverEvents() {
    const heroSlideshow = document.querySelector('.hero-slideshow');
    
    if (heroSlideshow) {
        // Arm hover pause shortly after load to prevent immediate pause on refresh
        setTimeout(() => { hoverPauseArmed = true; }, 800);
        heroSlideshow.addEventListener('mouseenter', function() {
            if (!hoverPauseArmed) return;
            stopSlideshow();
        });
        
        heroSlideshow.addEventListener('mouseleave', function() {
            startSlideshow();
        });
    }
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const imageModal = document.getElementById('imageModal');
        const videoModal = document.getElementById('videoModal');
        const modalOpen = (imageModal && imageModal.style.display === 'block') ||
                          (videoModal && videoModal.style.display === 'block');
        if (modalOpen) {
            if (e.key === 'ArrowRight') nextGalleryImage();
            else if (e.key === 'ArrowLeft') prevGalleryImage();
            else if (e.key === 'Escape') { closeImageModal(); closeVideoModal(); }
        } else {
            if (e.key === 'ArrowLeft') changeSlide(-1);
            else if (e.key === 'ArrowRight') changeSlide(1);
        }
    });
}

// Setup touch events for mobile
function setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSlideshow = document.querySelector('.hero-slideshow');
    
    if (heroSlideshow) {
        heroSlideshow.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        heroSlideshow.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                changeSlide(1);
            } else {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
}

// Mobile nav toggle
function toggleNav() {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('open');
}

// Close mobile nav when clicking outside (mobile only)
document.addEventListener('click', function(e) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;
    
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // If navbar is open and click is outside nav elements, close it
    if (navbar && navbar.classList.contains('open')) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navbar.classList.remove('open');
        }
    }
});

// Make functions globally available
window.changeSlide = changeSlide;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.nextGalleryImage = nextGalleryImage;
window.prevGalleryImage = prevGalleryImage;
window.toggleNav = toggleNav;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
  