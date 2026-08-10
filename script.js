function switchDay(dayId, btnElement) {
    document.querySelectorAll('.schedule-table').forEach(table => table.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(dayId).classList.add('active');
    btnElement.classList.add('active');
}

function slideForm(type) {
    const track = document.getElementById('formTrack');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (type === 'register') {
        track.classList.add('show-register');
        registerBtn.classList.add('active-btn');
        loginBtn.classList.remove('active-btn');
    } else {
        track.classList.remove('show-register');
        loginBtn.classList.add('active-btn');
        registerBtn.classList.remove('active-btn');
    }
}

function toggleSidebar() {
    if (window.innerWidth > 768) {
        document.body.classList.toggle('sidebar-collapsed');
        document.body.classList.remove('sidebar-open');
    } else {
        document.body.classList.toggle('sidebar-open');
        document.body.classList.remove('sidebar-collapsed');
    }
}

function closeSidebar() {
    document.body.classList.remove('sidebar-open');
    document.body.classList.add('sidebar-collapsed');
}

document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggleBtn');
    const menuOverlay = document.getElementById('menuOverlay');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeSidebar);
    }
});
