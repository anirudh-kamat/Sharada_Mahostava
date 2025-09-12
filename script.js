// Professional Hero Slideshow with Logo Modal and Gallery

let currentSlideIndex = 0;
let slideInterval;
let isTransitioning = false;
let slides = [];
let hoverPauseArmed = false; // avoid pausing on initial page load when cursor is already over slideshow

// Initialize slideshow when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing slideshow with logo modal and gallery...');
    
    // Get slides after DOM is loaded
    slides = document.querySelectorAll('.slide');
    console.log('Found slides:', slides.length);
    
    // Initialize first slide
    showSlide(0);
    
    // Start automatic slideshow
    startSlideshow();
    
    // Setup navigation
    setupNavigation();
    
    // Setup live button
    setupLiveButton();
    
    // Setup hover events
    setupHoverEvents();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Setup touch events
    setupTouchEvents();
    
    // Setup dropdown functionality
    setupDropdownMenu();
    
    // Setup modal functionality
    setupModalEvents();
    
    // Setup gallery functionality
    setupGalleryEvents();

    // Apply lazy loading to gallery images to speed up first paint
    applyLazyLoadingToGallery();
});

// Logo Modal Functions
function openLogoModal() {
    const modal = document.getElementById('logoModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLogoModal() {
    const modal = document.getElementById('logoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

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

function showGalleryImageByIndex(index) {
    openMediaByIndex(index);
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
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function nextGalleryImage() {
    showGalleryImageByIndex(galleryCurrentIndex + 1);
}

function prevGalleryImage() {
    showGalleryImageByIndex(galleryCurrentIndex - 1);
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Setup modal event listeners
function setupModalEvents() {
    const logoModal = document.getElementById('logoModal');
    const imageModal = document.getElementById('imageModal');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    // Close logo modal when clicking outside
    if (logoModal) {
        logoModal.addEventListener('click', function(e) {
            if (e.target === logoModal) {
                closeLogoModal();
            }
        });
    }
    
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
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLogoModal();
            closeImageModal();
            closeVideoModal();
        } else if (e.key === 'ArrowRight') {
            nextGalleryImage();
        } else if (e.key === 'ArrowLeft') {
            prevGalleryImage();
        }
    });
}

// Video modal helpers
function openVideoModal(videoSrc) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
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

// Setup gallery events
function setupGalleryEvents() {
    // Gallery items are handled by onclick attributes in HTML
    console.log('Gallery events setup complete');
}

// Add native lazy-loading and async decoding to all gallery images
function applyLazyLoadingToGallery() {
    const images = document.querySelectorAll('.gallery-image');
    images.forEach((img, index) => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        // The very first image in a section can keep default priority
        if (index > 2 && !img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
    });
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
                
                // Close dropdown
                dropdown.classList.remove('active');
                
                console.log('Dropdown link clicked:', this.textContent);
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
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
    console.log('Starting slideshow...');
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
        console.log('Slideshow stopped');
    }
}

// Next slide
function nextSlide() {
    if (!slides || slides.length === 0) return;
    
    let nextIndex = currentSlideIndex + 1;
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    console.log('Next slide:', nextIndex);
    showSlide(nextIndex);
}

// Previous slide
function prevSlide() {
    if (!slides || slides.length === 0) return;
    
    let prevIndex = currentSlideIndex - 1;
    if (prevIndex < 0) {
        prevIndex = slides.length - 1;
    }
    console.log('Previous slide:', prevIndex);
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
            
            console.log('Navigation clicked:', this.textContent);
        });
    });
}

// Setup live button functionality
function setupLiveButton() {
    const liveBtn = document.querySelector('.live-btn');
    
    if (liveBtn) {
        liveBtn.addEventListener('click', function() {
            alert('Live streaming feature coming soon!');
        });
    }
}

// Setup hover events
function setupHoverEvents() {
    const heroSlideshow = document.querySelector('.hero-slideshow');
    
    if (heroSlideshow) {
        // Arm hover pause shortly after load to prevent immediate pause on refresh
        setTimeout(() => { hoverPauseArmed = true; }, 800);
        heroSlideshow.addEventListener('mouseenter', function() {
            if (!hoverPauseArmed) return;
            console.log('Mouse entered slideshow - pausing');
            stopSlideshow();
        });
        
        heroSlideshow.addEventListener('mouseleave', function() {
            console.log('Mouse left slideshow - resuming');
            startSlideshow();
        });
    }
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
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

// Make functions globally available
window.changeSlide = changeSlide;
window.openLogoModal = openLogoModal;
window.closeLogoModal = closeLogoModal;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.nextGalleryImage = nextGalleryImage;
window.prevGalleryImage = prevGalleryImage;
window.toggleNav = toggleNav;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

// Debug function
function debugSlideshow() {
    console.log('Current slide:', currentSlideIndex);
    console.log('Total slides:', slides.length);
    console.log('Is transitioning:', isTransitioning);
    console.log('Interval active:', slideInterval !== null);
}
