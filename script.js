document.addEventListener('DOMContentLoaded', function() {
  const animatedBackground = document.getElementById('animated-background');

  function playVideo() {
      animatedBackground.style.display = 'block';
      animatedBackground.play();
      animatedBackground.onended = function() {
          setTimeout(() => {
              animatedBackground.currentTime = 0; // Reset video to start
              playVideo();
          }, 30000); // Stay at the last frame for 30 seconds
      };
  }

  // Play the video once when the page loads
  playVideo();
});

const navE1 = document.querySelector('.nav');
const hamburgerE1 = document.querySelector('.hamburger');

hamburgerE1.addEventListener('click', () => {
navE1.classList.toggle("nav--open");
hamburgerE1.classList.toggle("hamburger--open");
});

navE1.addEventListener('click', () => {
  navE1.classList.remove("nav--open");
  hamburgerE1.classList.remove("hamburger--open");
});