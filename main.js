// Müzik çalar ve diğer etkileşimler için ana JavaScript kodu
class LuxuryPortfolio {
    constructor() {
        this.isPlaying = false;
        this.currentTrack = 0;
        this.volume = 0.5;
        this.audioContext = null;
        this.analyser = null;
        this.tracks = [
            {
                title: "Ortaçağ Melodisi",
                file: "Assets/images/music/medieval-music.mp3",
                duration: "3:45"
            }
        ];
        
        this.audio = new Audio();
        this.audio.loop = true; // Loop özelliği
        this.init();
    }
    
    // Başlatma fonksiyonu
    init() {
        this.setupScrollAnimations();
        this.setupSmoothScroll();
        this.setupMusicPlayer();
        this.setupSocialLinks();
        this.setupAudioAnalyser();
    }
    
    // Audio Analyser'ı kurdum
    setupAudioAnalyser() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.audioSource = this.audioContext.createMediaElementSource(this.audio);
            
            this.analyser.fftSize = 256;
            this.audioSource.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        } catch (error) {
            console.log('Audio analyser başlatılamadı:', error);
        }
    }
    
    // Müzik çalar bileşenini kurdum
    setupMusicPlayer() {
        this.playPauseBtn = document.getElementById('playPause');
        this.nextTrackBtn = document.getElementById('nextTrack');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.musicTitle = document.querySelector('.music-title');
        this.musicTime = document.querySelector('.music-time');
        this.musicBox = document.querySelector('.music-box');
        
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateTime();
        });
        
        this.audio.addEventListener('ended', () => {
            // Loop olduğu için ended event'i kullanmayacağız
        });
        
        this.audio.addEventListener('error', (e) => {
            console.log('Müzik yüklenirken hata:', e);
            this.musicTitle.textContent = "Müzik Yüklenemedi";
        });
        
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (this.nextTrackBtn) {
            this.nextTrackBtn.addEventListener('click', () => this.nextTrack());
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
            this.volumeSlider.value = this.volume * 100;
        }
        
        this.loadTrack();
    }
    
    // Mevcut parçayı yükledim
    loadTrack() {
        const track = this.tracks[this.currentTrack];
        this.audio.src = track.file;
        this.audio.volume = this.volume;
        this.updateTrackInfo();
        
        // Müziği önceden yükle
        this.audio.load();
    }
    
    // Oynat/Duraklat fonksiyonu
    togglePlay() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.playPauseBtn.querySelector('i').classList.remove('fa-pause');
            this.playPauseBtn.querySelector('i').classList.add('fa-play');
            this.musicBox.classList.remove('music-playing');
            this.stopVisualizer();
        } else {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.playPauseBtn.querySelector('i').classList.remove('fa-play');
                this.playPauseBtn.querySelector('i').classList.add('fa-pause');
                this.musicBox.classList.add('music-playing');
                this.startVisualizer();
            }).catch(error => {
                console.log('Müzik çalınamadı:', error);
                // Hata mesajını kullanıcıya gösterme, sadece console'a yaz
            });
        }
    }
    
    // Sonraki parçaya geçme fonksiyonu
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack();
        if (this.isPlaying) {
            this.audio.play();
        }
    }
    
    // Ses seviyesini ayarlama fonksiyonu
    setVolume(value) {
        this.volume = value / 100;
        this.audio.volume = this.volume;
    }
    
    // Parça bilgilerini güncelleme fonksiyonu
    updateTrackInfo() {
        if (this.musicTitle) {
            const track = this.tracks[this.currentTrack];
            this.musicTitle.textContent = track.title;
        }
    }
    
    // Parça süresini güncelleme fonksiyonu
    updateDuration() {
        if (this.musicTime && !isNaN(this.audio.duration)) {
            const duration = this.formatTime(this.audio.duration);
            this.musicTime.textContent = `0:00 / ${duration}`;
        }
    }
    
    // Parça zamanını güncelleme fonksiyonu
    updateTime() {
        if (this.musicTime && !isNaN(this.audio.duration)) {
            const current = this.formatTime(this.audio.currentTime);
            const duration = this.formatTime(this.audio.duration);
            this.musicTime.textContent = `${current} / ${duration}`;
        }
    }
    
    // Zaman formatlama fonksiyonu
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }
    
    // Görselleştiriciyi başlatma fonksiyonu
    startVisualizer() {
        if (!this.analyser) return;
        
        this.visualizerInterval = setInterval(() => {
            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const height = (average / 256) * 15 + 2;
            
            this.createVisualizerBar(height);
        }, 100);
    }
    
    // Görselleştiriciyi durdurma fonksiyonu
    stopVisualizer() {
        if (this.visualizerInterval) {
            clearInterval(this.visualizerInterval);
        }
    }
    
    // Görselleştirici çubuğu oluşturma fonksiyonu
    createVisualizerBar(height) {
        const bar = document.createElement('div');
        bar.style.cssText = `
            position: absolute;
            bottom: 0;
            width: 2px;
            height: ${height}px;
            background: linear-gradient(to top, var(--burgundy), var(--light-burgundy));
            opacity: 0.6;
            border-radius: 1px 1px 0 0;
            transition: height 0.1s ease;
        `;
        
        const left = Math.random() * 100;
        bar.style.left = `${left}%`;
        
        this.musicBox.appendChild(bar);
        
        setTimeout(() => {
            if (bar.parentNode) {
                bar.parentNode.removeChild(bar);
            }
        }, 400);
    }
    
    // Sosyal medya linkleri için etkileşimleri kurdum
    setupSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link-main');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const icon = link.querySelector('i');
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            });
            
            link.addEventListener('mouseleave', () => {
                const icon = link.querySelector('i');
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    // Kaydırma animasyonlarını kurdum
    setupScrollAnimations() {
        const sections = document.querySelectorAll('section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Yumuşak kaydırma fonksiyonu
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    new LuxuryPortfolio();
    document.querySelector('#hero').classList.add('active');
});