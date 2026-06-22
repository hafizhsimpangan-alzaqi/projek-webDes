// js/main.js

const sidebar = document.getElementById("sidebar")
function toggleSidebar() {
    sidebar.classList.toggle('show-toggle')
}


function goToHome() {
    window.location.href = "/"
}
function goToAbout() {
    window.location.href = "/about"
}
function goToCourse() {
    window.location.href = "/courses-page"
}
function goToContact() {
    window.location.href = "/contact"
}
function goToLogin() {
    window.location.href = "/login"
}
function goToDashboard(){
    window.location.href = "/dashboard"
}

document.addEventListener("DOMContentLoaded", () => {

    /* === SUB-SISTEM A: ENGINE ANIMASI INTERSECTION OBSERVER (MY-AOS) === */
    const animatedElements = document.querySelectorAll('[data-my-aos]');
    
    if (animatedElements.length > 0) {
        const observerOptions = {
            root: document.querySelector('main'), // Mengunci target scroll internal main Paduka
            rootMargin: "0px",
            threshold: 0.15 
        };

        const aosObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const customDuration = element.getAttribute('data-my-aos-duration');
                    if (customDuration) {
                        element.style.transitionDuration = `${customDuration}ms`;
                    }
                    element.classList.add('aos-animate');
                    observer.unobserve(element); 
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => aosObserver.observe(el));
    }


    /* === SUB-SISTEM B: INTERAKSI LIVE DRAWER SIDEBAR (MOBILE SIDES VIEW) === */
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {
        // Event Klik: Menarik laci menu dari -100% menjadi 0 di kiri
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle("active-drawer");
        });

        // UX Lock: Klik sembarang area kosong luar otomatis melipat laci kembali
        document.addEventListener("click", (e) => {
            if (!mobileMenu.contains(e.target) && e.target !== menuToggle) {
                mobileMenu.classList.remove("active-drawer");
            }
        });
    }


    /* === SUB-SISTEM C: INTERAKSI DROPDOWN LOGIN AVATAR (PROFIL KANAN ATAS) === */
    const profileTrigger = document.getElementById("profileTrigger");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileTrigger && profileDropdown) {
        // FUNGSI BERSIH: Hanya ada satu Event Listener murni tanpa shadowing ganda
        profileTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle("show");
        });

        // UX Lock: Klik area luar otomatis melipat kembali boks login melayang
        document.addEventListener("click", (e) => {
            if (!profileDropdown.contains(e.target) && e.target !== profileTrigger) {
                profileDropdown.classList.remove("show");
            }
        });
    }
});