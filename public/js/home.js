// NAVBAR
const navEl = document.querySelector('.navbar');
     window.addEventListener('scroll', () => {
        if (window.scrollY >= 20 ){
            navEl.classList.add('navbar-scrolled');
        } else if (window.scrollY < 20){
            navEl.classList.remove('navbar-scrolled');
        }
    });

//FADE
window.addEventListener('scroll', function () {
    const fadeTextElements = document.querySelectorAll('.fade-text');
    const windowHeight = window.innerHeight;
  
    fadeTextElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      if (elementPosition < windowHeight) {
          element.style.opacity = '1'; // Set opacity to 100% if in view
      }
  });
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        $('#imgDisplay').attr('src', e.target.result).width(150).height(200);
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }
