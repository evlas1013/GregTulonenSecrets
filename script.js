let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;
let searchResults = [];
let searchIndex = 0;

const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function moveSlide(direction) {
  currentSlide += direction;
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }
  updateCarousel();
  updateURL();
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
}

function handleTouchEnd() {
  const swipeDistance = touchStartX - touchEndX;
  if (swipeDistance > 100) {
    moveSlide(1);
  } else if (swipeDistance < -100) {
    moveSlide(-1);
  }
}

function updateCarousel() {
  const carousel = document.querySelector('.carousel');
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function updateURL() {
  const newURL = new URL(window.location);
  newURL.searchParams.set('slide', currentSlide);
  window.history.replaceState(null, '', newURL);
}

function getSlideFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const slideIndex = urlParams.get('slide');
  if (slideIndex !== null) {
    const parsedSlideIndex = parseInt(slideIndex, 10);
    if (!isNaN(parsedSlideIndex) && parsedSlideIndex >= 0 && parsedSlideIndex < totalSlides) {
      currentSlide = parsedSlideIndex;
    } else {
      currentSlide = 0;
    }
  }
  updateCarousel();
}

function searchSlides() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (!searchTerm) return;
  
  searchResults = [];
  slides.forEach((slide, index) => {
    const slideText = slide.innerText.toLowerCase();
    if (slideText.includes(searchTerm)) {
      searchResults.push(index);
    }
  });
  
  if (searchResults.length > 0) {
    searchIndex = 0;
    navigateToSearchResult();
  }
}

function navigateToSearchResult(direction = 0) {
  if (searchResults.length === 0) return;
  
  searchIndex += direction;
  if (searchIndex < 0) {
    searchIndex = searchResults.length - 1;
  } else if (searchIndex >= searchResults.length) {
    searchIndex = 0;
  }
  
  currentSlide = searchResults[searchIndex];
  updateCarousel();
  updateURL();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  highlightText(slides[currentSlide], document.getElementById('searchInput').value);
}

function highlightText(slide, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  slide.innerHTML = slide.innerHTML.replace(/<\/?mark>/g, '');
  slide.innerHTML = slide.innerHTML.replace(regex, '<mark>$1</mark>');
}

document.addEventListener('DOMContentLoaded', () => {
  getSlideFromURL();
  
  const searchButton = document.getElementById('searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', searchSlides);
  }

  const nextSearchButton = document.getElementById('nextSearchButton');
  if (nextSearchButton) {
    nextSearchButton.addEventListener('click', () => navigateToSearchResult(1));
  }

  const prevSearchButton = document.getElementById('prevSearchButton');
  if (prevSearchButton) {
    prevSearchButton.addEventListener('click', () => navigateToSearchResult(-1));
  }
});

const carousel = document.querySelector('.carousel');
carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
carousel.addEventListener('touchend', handleTouchEnd);
