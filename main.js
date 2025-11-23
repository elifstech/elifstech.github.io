document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBİL MENÜ VE NAVİGASYON ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger) { // Hamburger menü varsa
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // Linke tıklandığında menüyü kapat
    navLinks.forEach(n => n.addEventListener("click", () => {
        if (hamburger) {
            hamburger.classList.remove("active");
        }
        navMenu.classList.remove("active");
    }));

    // --- 2. NAVBAR SCROLL EFEKTİ ---
    // Sayfa aşağı kaydırıldığında navbar ın arkasını koyulaştır
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 3. SCROLL ANİMASYONLARI ---
    // Metinler ve kartlar ekrana girdiğinde yukarı doğru süzülerek geliyor
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-card');
    
    const revealObserverOptions = {
        threshold: 0.15, // Öğenin %15'i göründüğünde tetikle
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Bir kere çalışsın
            }
        });
    }, revealObserverOptions); 
    revealElements.forEach(el => revealObserver.observe(el));


    // --- 4. YETENEK ÇUBUKLARI ---
    // HTML'de sınıf ismini 'progress-line-fill' yapmıştım, burada onu seçiyorum
    const skillLines = document.querySelectorAll('.progress-line-fill'); // Tüm yetenek çubuklarını seç
    
    const skillObserverOptions = { threshold: 0.5 }; // Yetenek çubuğunun yarısı göründüğünde tetikle

    const skillObserver = new IntersectionObserver((entries, observer) => { // Gözlemci fonksiyonu
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Eğer çubuk görünüyorsa
                const line = entry.target;
                const targetWidth = line.getAttribute('data-target'); // Hedef genişliği al
                line.style.width = targetWidth; // Genişliği data-target değerine eşitle
                observer.unobserve(line);
            }
        });
    }, skillObserverOptions);

    skillLines.forEach(line => skillObserver.observe(line)); // Her bir yetenek çubuğunu gözlemle


    // --- 5. SMOOTH SCROLL (YUMUŞAK GEÇİŞ) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { // Tüm iç bağlantıları seç
        anchor.addEventListener('click', function (e) { // Tıklama olayı
            e.preventDefault(); // Varsayılan davranışı engelle
            const targetId = this.getAttribute('href'); // Hedef ID'yi al
            const targetDoc = document.querySelector(targetId); // Hedef elementi seç
            
            if (targetDoc) {
                // Navbar yüksekliğini hesaba katarak kaydırma 
                const headerOffset = 80;
                const elementPosition = targetDoc.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({ // Pencereyi kaydır
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 6. İLETİŞİM FORMU SİMÜLASYONU (AKTİF ÇALIŞMIYOR) ---
    const contactForm = document.getElementById('contact-form'); // Formu seç
    
    if (contactForm) { // Form varsa
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button'); // Butonu seç
            const originalText = btn.innerText;
            
            // Yükleniyor durumu
            btn.innerHTML = '<i class="fas fa-feather-alt fa-spin"></i> Parşömen Mühürleniyor...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                // Başarı durumu
                alert('Mesajınız kuzgun ile yola çıktı! En kısa sürede size dönüş yapılacaktır. 🦅');
                
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 2000); // 2 saniye bekle
        });
    }
});