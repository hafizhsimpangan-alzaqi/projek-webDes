const sidebar = document.getElementById("sidebar")
function toggleSidebar() {
    sidebar.classList.toggle('show-toggle')
}


function goToHome(){
    window.location.href = "../html/landingpage.html"
}
function goToAbout(){
    window.location.href = "../html/about.html"
}
function goToCourse(){
    window.location.href = "../html/courses.html"
}
function goToContact(){
    window.location.href = "../html/contact.html"
}