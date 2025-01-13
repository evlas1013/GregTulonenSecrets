let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function moveSlide(direction) {
  currentSlide += direction;
  // Ensure currentSlide stays within valid bounds
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1; // Loop to last slide
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0; // Loop to first slide
  }
  updateCarousel();
  updateURL();
}

function updateCarousel() {
  const carousel = document.querySelector('.carousel');
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function updateURL() {
  // Update the query parameter in the URL to reflect the current slide
  const newURL = new URL(window.location);
  newURL.searchParams.set('slide', currentSlide); // Set the slide query parameter
  window.history.replaceState(null, '', newURL); // Update the URL without reloading the page
}

function getSlideFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const slideIndex = urlParams.get('slide');

  // Check if a valid slide index is present in the URL
  if (slideIndex !== null) {
    const parsedSlideIndex = parseInt(slideIndex, 10);
    // Only set currentSlide if the value is within bounds
    if (!isNaN(parsedSlideIndex) && parsedSlideIndex >= 0 && parsedSlideIndex < totalSlides) {
      currentSlide = parsedSlideIndex;
    } else {
      currentSlide = 0; // Fallback to first slide if invalid
    }
  }
  updateCarousel();
}

// Initialize the carousel based on URL parameters
getSlideFromURL();
