document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: document.querySelector('.scroll-container'),
    rootMargin: '0px',
    threshold: 0.25
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach((el) => observer.observe(el));

  
  const modal = document.getElementById('rsvp-modal');
  const openModalBtn = document.getElementById('open-modal');
  const closeModalBtn = document.getElementById('close-modal');


  if(openModalBtn) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.hidden = false;
    });
  }

  if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.hidden = true;
    });
  }

  if(modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.hidden = true;
      }
    });
  }


  const rsvpForm = document.getElementById('rsvp-form');
  const submitBtn = document.getElementById('submit-rsvp');
  const msgError = document.getElementById('form-error');
  const msgSuccess = document.getElementById('form-success');
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvmg_E-RClt_0G4zu-HrjER9ZMEXOthjpQZGS7gTcASCEQSo2MCEsdAoH20O9ulZIz_g/exec";

  if(rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      msgError.hidden = true;
      msgSuccess.hidden = true;

      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.8";

      const payload = {
        nombre: document.getElementById('guest-name').value,
        acompanantes: document.getElementById('num-guests').value,
        telefono: document.getElementById('guest-phone').value
      };

      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        msgSuccess.hidden = false;
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        rsvpForm.reset();

        setTimeout(() => {
          modal.hidden = true;
          msgSuccess.hidden = true;
        }, 3000);
      })
      .catch((error) => {
        msgError.hidden = false;
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        console.error('Error:', error);
      });
    });
  }

  // 4. Lógica del Reproductor de Música (Blindada contra elementos nulos)
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const scrollContainer = document.querySelector('.scroll-container');
  let isPlaying = false;
  let hasInteracted = false;

  if (bgMusic && musicBtn) {
    function playWithFade() {
      bgMusic.volume = 0;
      bgMusic.play().then(() => {
        let vol = 0;
        const fadeInterval = setInterval(() => {
          if (vol < 0.4) {
            vol += 0.05;
            bgMusic.volume = vol;
          } else {
            clearInterval(fadeInterval);
          }
        }, 200);
        musicBtn.classList.add('playing');
        isPlaying = true;
      }).catch(err => console.log("Bloqueado por políticas del navegador", err));
    }

    function toggleMusic() {
      if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
      } else {
        playWithFade();
      }
      isPlaying = !isPlaying;
    }

    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      hasInteracted = true;
      toggleMusic();
    });

    const autoPlayMusic = () => {
      if (!hasInteracted && !isPlaying) {
        playWithFade();
        hasInteracted = true;
      }
      document.removeEventListener('click', autoPlayMusic);
      document.removeEventListener('touchstart', autoPlayMusic);
      document.removeEventListener('wheel', autoPlayMusic);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', autoPlayMusic);
      }
    };
    
    // Escuchamos múltiples eventos globales para asegurar el primer movimiento
    document.addEventListener('click', autoPlayMusic);
    document.addEventListener('touchstart', autoPlayMusic);
    document.addEventListener('wheel', autoPlayMusic);
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', autoPlayMusic);
    }
  }
});
