// DOMcontentloaded event listener for animated background 
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

// DOMcontentloaded event listener hamburger(mobile menu)
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const navE1 = document.querySelector('.nav');
  const hamburgerE1 = document.querySelector('.hamburger');
  const mediaQuery = window.matchMedia('(max-width: 650px)');

  const isHeaderSticky = () => {
      return header.getBoundingClientRect().top === 0;
  };

  const toggleHamburgerVisibility = () => {
      if (isHeaderSticky() && mediaQuery.matches) {
          hamburgerE1.classList.add('visible');
          hamburgerE1.style.pointerEvents = 'auto'; // Enable interaction
      } else {
          hamburgerE1.classList.remove('visible');
          hamburgerE1.style.pointerEvents = 'none'; // Disable interaction
          navE1.classList.remove("nav--open"); // Automatically close nav
          hamburgerE1.classList.remove("hamburger--open"); // Automatically close hamburger
      }
  };

  // Check visibility on scroll and media query change
  window.addEventListener('scroll', toggleHamburgerVisibility);
  mediaQuery.addEventListener('change', toggleHamburgerVisibility);
  // Initial check
  toggleHamburgerVisibility();

  hamburgerE1.addEventListener('click', () => {
      if (isHeaderSticky()) {
          console.log('Hamburger clicked while header is sticky');
          navE1.classList.toggle("nav--open");
          hamburgerE1.classList.toggle("hamburger--open");
      } else {
          console.log('Hamburger clicked while header is not sticky');
      }
  });

  navE1.addEventListener('click', () => {
      if (isHeaderSticky()) {
          console.log('Nav clicked while header is sticky');
          navE1.classList.remove("nav--open");
          hamburgerE1.classList.remove("hamburger--open");
      } else {
          console.log('Nav clicked while header is not sticky');
      }
  });
});

// typing effect
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var i = 0;
    var txt = 'Your one stop site to know everything about multiplexers.'; /* The text */
    var speed = 50; /* The speed/duration of the effect in milliseconds */

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("subtitle").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }

    typeWriter();
  }, 1000); // 1 second delay
});
