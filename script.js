// Professional Hero Slideshow with Logo Modal and Gallery

let currentSlideIndex = 0;
let slideInterval;
let isTransitioning = false;
let slides = [];

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
let galleryImageSources = [];
let galleryCurrentIndex = 0;

function cacheGalleryImages() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryImageSources = Array.from(galleryItems).map(img => img.getAttribute('src'));
}

function openImageModal(imageSrc, imageTitle) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    if (!galleryImageSources || galleryImageSources.length === 0) {
        cacheGalleryImages();
    }
    const idx = galleryImageSources.indexOf(imageSrc);
    if (idx >= 0) galleryCurrentIndex = idx;
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = imageTitle || '';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function showGalleryImageByIndex(index) {
    if (!galleryImageSources || galleryImageSources.length === 0) return;
    if (index < 0) index = galleryImageSources.length - 1;
    if (index >= galleryImageSources.length) index = 0;
    galleryCurrentIndex = index;
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = galleryImageSources[galleryCurrentIndex];
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
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLogoModal();
            closeImageModal();
        } else if (e.key === 'ArrowRight') {
            nextGalleryImage();
        } else if (e.key === 'ArrowLeft') {
            prevGalleryImage();
        }
    });
}

// Setup gallery events
function setupGalleryEvents() {
    // Gallery items are handled by onclick attributes in HTML
    console.log('Gallery events setup complete');
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
    }, 1500); // Match CSS transition time
}

// Start automatic slideshow (changes every 4 seconds)
function startSlideshow() {
    stopSlideshow();
    console.log('Starting slideshow...');
    slideInterval = setInterval(() => {
        if (!isTransitioning && slides && slides.length > 0) {
            nextSlide();
        }
    }, 4000); // 4 seconds
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
        heroSlideshow.addEventListener('mouseenter', function() {
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

// Debug function
function debugSlideshow() {
    console.log('Current slide:', currentSlideIndex);
    console.log('Total slides:', slides.length);
    console.log('Is transitioning:', isTransitioning);
    console.log('Interval active:', slideInterval !== null);
}
