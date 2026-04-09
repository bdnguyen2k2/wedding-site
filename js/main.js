// js/main.js — Wedding Landing Page Logic (v3 — fixed envelope + invitation section)
document.addEventListener('DOMContentLoaded', () => {

  /* ========== 1. URL PARAM — Guest Name & ID ========== */
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get('guest') || '';
  const guestId = params.get('id') || `GUEST-${Date.now()}`;
  // Map guest name into ALL relevant elements
  if (guestName) {
    document.getElementById('guest-name-letter').textContent = guestName;
    const invGuestEl = document.getElementById('invitation-guest-name');
    if (invGuestEl) invGuestEl.textContent = guestName;
  }

  /* ========== 2. PETALS ========== */
  const petalsContainer = document.getElementById('petals-bg');
  const petalColors = ['#fd79a8', '#e84393', '#fab1a0', '#ffeaa7', '#fce4ec', '#f8bbd0'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 7) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    const size = 8 + Math.random() * 14;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
    petalsContainer.appendChild(p);
  }

  /* ========== 3. ENVELOPE OPENING — fixed z-index + 3s pause ========== */
  const overlay = document.getElementById('envelope-overlay');
  const envelope = document.getElementById('envelope');
  const envelopeFlap = document.getElementById('envelope-flap');
  const openBtn = document.getElementById('open-btn');
  const mainContent = document.getElementById('main-content');
  const musicToggle = document.getElementById('music-toggle');

  // Auto-open envelop logic after 1s
  setTimeout(() => {
    // Step 1: Mở nắp thiệp
    envelope.classList.add('flap-open');

    // Bắn pháo hoa/tim
    setTimeout(() => {
      createFireworks();
    }, 1000);

    // Step 2: Rút thư ra phía sau vỏ trước (z-index thấp)
    setTimeout(() => {
      envelope.classList.add('letter-slide-up');
    }, 1000);

    // Step 3: Sau khi rút ra khỏi vùng che của mặt trước, chỉnh z-index đè lên trên và phóng to về giữa
    setTimeout(() => {
      envelope.classList.add('letter-zoom');
    }, 2000);

    // Step 4: Đọc thư chữ to rõ ràng trong 3s -> sau đó đóng overlay, vào page chính
    setTimeout(() => {
      overlay.classList.add('opened');
      mainContent.classList.remove('main-hidden');
      musicToggle.classList.add('visible');
      startFloatingHearts();
      createHeroSparkles();
      initScrollReveal();
      playMusic();
    }, 4500);

    // Dọn dẹp DOM
    setTimeout(() => overlay.remove(), 7000);
  }, 1000);

  // Fireworks Animation during opening
  function createFireworks() {
    const fwContainer = document.createElement('div');
    fwContainer.style.position = 'absolute';
    fwContainer.style.inset = '0';
    fwContainer.style.pointerEvents = 'none';
    fwContainer.style.zIndex = '50';
    envelope.parentElement.appendChild(fwContainer);

    const particles = ['✨', '💖', '🎇', '🌸', '🎉'];
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
      particle.style.position = 'absolute';
      particle.style.left = '50%';
      particle.style.top = '40%';
      particle.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
      particle.style.opacity = '1';

      // Random trajectory (outward and upward bias)
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 250 + 100;
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius - 150;

      fwContainer.appendChild(particle);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 360}deg) scale(${Math.random() + 0.5})`;
          particle.style.opacity = '0';
        });
      });
    }

    setTimeout(() => {
      fwContainer.remove();
    }, 2000);
  }

  /* ========== 4. BACKGROUND MUSIC ========== */
  const bgMusic = document.getElementById('bg-music');
  const musicIcon = document.getElementById('music-icon');
  let isPlaying = false;

  function playMusic() {
    const promise = bgMusic.play();
    if (promise !== undefined) {
      promise.then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.textContent = '🎵';
      }).catch(() => {
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicIcon.textContent = '🔇';
      });
    }
  }

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.classList.remove('playing');
      musicIcon.textContent = '🔇';
    } else {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.textContent = '🎵';
      });
    }
  });

  /* ========== 5. FLOATING HEARTS ========== */
  function startFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['♥', '♡', '❤', '💕', '💗'];
    setInterval(() => {
      const el = document.createElement('span');
      el.className = 'f-heart';
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.fontSize = (.6 + Math.random() * 1.2) + 'rem';
      el.style.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      el.style.animationDuration = (7 + Math.random() * 9) + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), 16000);
    }, 1000);
  }

  /* ========== 5b. HERO SPARKLES ========== */
  function createHeroSparkles() {
    const container = document.getElementById('hero-sparkles');
    if (!container) return;
    const sparkleColors = ['#d4a04a', '#f0d48a', '#fd79a8', '#ffeaa7', '#ffffff'];
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      const size = 2 + Math.random() * 5;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
      s.style.animationDuration = (1.5 + Math.random() * 3) + 's';
      s.style.animationDelay = (Math.random() * 4) + 's';
      container.appendChild(s);
    }
  }

  /* ========== 6. SCROLL REVEAL — staggered ========== */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-child');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ========== 7. ALBUM LIGHTBOX ========== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.album-cell').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      }
    });
  });
  lightboxClose.addEventListener('click', () => lightbox.style.display = 'none');
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });

  /* ========== 8. RSVP ========== */
  // const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyH9Uj2dqRN5eyIxBCkj8VUT33xPRBbJsB6JiRciK33yQUkrq1QBiQq7xGtOWy7gluN/exec';

  // function showToast(msg) {
  //   const toast = document.getElementById('toast');
  //   toast.textContent = msg;
  //   toast.classList.add('show');
  //   setTimeout(() => toast.classList.remove('show'), 4000);
  // }

  // document.querySelectorAll('.rsvp-btn').forEach(btn => {
  //   btn.addEventListener('click', async () => {
  //     const attendance = btn.dataset.response; // "Tham dự" or "Không tham dự"
  //     const name = guestName || 'Khách mời';

  //     document.querySelectorAll('.rsvp-btn').forEach(b => {
  //       b.disabled = true;
  //       b.style.opacity = '0.6';
  //     });

  //     try {
  //       const payload = {
  //         key: "wedding2026",
  //         id: guestId,
  //         name: name,
  //         confirm: attendance,
  //         message: ""
  //       };

  //       const response = await fetch(APPS_SCRIPT_URL, {
  //         method: 'POST',
  //         // Sử dụng text/plain để tránh preflight request (CORS error) trên trình duyệt
  //         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  //         body: JSON.stringify(payload)
  //       });

  //       const data = await response.json();
  //       const resultEl = document.getElementById('rsvp-result');
  //       resultEl.style.display = 'block';

  //       if (data.status === "exists") {
  //         resultEl.innerHTML = '💡 Hệ thống đã ghi nhận phản hồi của <strong>' + name + '</strong> từ trước rồi nhé. Xin cảm ơn!';
  //       } else if (data.status === "success") {
  //         if (attendance === 'Tham dự') {
  //           resultEl.innerHTML = '🎉 Cảm ơn <strong>' + name + '</strong>! Chúng tôi rất vui khi bạn tham dự.';
  //         } else {
  //           resultEl.innerHTML = '😢 Rất tiếc! Hy vọng lần sau sẽ gặp bạn, <strong>' + name + '</strong>.';
  //         }
  //       } else {
  //         throw new Error("Lỗi API server");
  //       }

  //       showToast('Đã ghi nhận phản hồi của bạn!');
  //     } catch (err) {
  //       console.error('RSVP Error:', err);
  //       showToast('Có lỗi kết nối, vui lòng thử lại!');
  //       document.querySelectorAll('.rsvp-btn').forEach(b => {
  //         b.disabled = false;
  //         b.style.opacity = '1';
  //       });
  //     }
  //   });
  // });

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywu_MIvXwCirWlZH7suMs9gJrdUPsPkXiyTOUmBDnI4TNP_pAaBI8ekd6SJDwGHhrh/exec';

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  function setButtonsDisabled(disabled) {
    document.querySelectorAll('.rsvp-btn').forEach(btn => {
      btn.disabled = disabled;
      btn.style.opacity = disabled ? '0.6' : '1';
    });
  }

  async function submitRSVP(attendance) {
    const name = guestName || 'Khách mời';

    const payload = {
      key: "wedding2026",
      id: guestId,
      name: name,
      confirm: attendance,
      message: ""
    };

    try {
      // const response = await fetch(APPS_SCRIPT_URL, {
      //   method: 'POST',
      //   body: new URLSearchParams(payload) // ✅ FIX CHÍNH
      // });

      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          key: "wedding2026",
          id: guestId,
          name: guestName || "Khách mời",
          confirm: attendance,
          message: ""
        })
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Response không phải JSON:", text);
        throw new Error("Invalid response");
      }

      renderResult(data, name, attendance);
      showToast('Đã ghi nhận phản hồi của bạn!');

    } catch (err) {
      console.error('RSVP Error:', err);
      showToast('Có lỗi kết nối, vui lòng thử lại!');
      setButtonsDisabled(false);
    }
  }

  function renderResult(data, name, attendance) {
    const resultEl = document.getElementById('rsvp-result');
    resultEl.style.display = 'block';

    if (data.status === "exists") {
      resultEl.innerHTML = `💡 Hệ thống đã ghi nhận phản hồi của <strong>${name}</strong> rồi nhé. Xin cảm ơn!`;
    }
    else if (data.status === "success") {
      resultEl.innerHTML = attendance === 'Tham dự'
        ? `🎉 Cảm ơn <strong>${name}</strong>! Chúng tôi rất vui khi bạn tham dự.`
        : `😢 Rất tiếc! Hy vọng lần sau sẽ gặp bạn, <strong>${name}</strong>.`;
    }
    else {
      throw new Error("Lỗi API server");
    }
  }

  document.querySelectorAll('.rsvp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const attendance = btn.dataset.response;
      setButtonsDisabled(true);
      submitRSVP(attendance);
    });
  });

});
