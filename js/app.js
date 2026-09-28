'use strict';

// =================================================================
// Hash 2026 — Interactive JavaScript (app.js)
// DOM manipulation, event handling, regex validation, browser storage, ES6+
// =================================================================

// --- REGEX PATTERNS ---
const PATTERNS = {
    name:     /^[A-Za-z][A-Za-z\s.'-]{1,49}$/,        // letters, spaces, dots, apostrophes, hyphens; 2–50 chars
    email:    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // standard email format
    mobile:   /^[6-9]\d{9}$/,                         // Indian mobile: starts 6-9, exactly 10 digits
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&._-]{6,30}$/ // 6–30 chars, upper+lower+digit
};

// =========================================================
// 1. WELCOME BANNER — sessionStorage greeting (ES6+)
// =========================================================
const WelcomeBanner = (() => {
    const init = () => {
        const banner = document.createElement('div');
        banner.className = 'welcome-banner';
        banner.id = 'welcomeBanner';
        document.body.appendChild(banner);

        let name = sessionStorage.getItem('hashVisitorName');

        if (!name) {
            name = prompt('Welcome to Hash 2026! What is your name?');
            if (name && name.trim()) {
                name = name.trim();
                sessionStorage.setItem('hashVisitorName', name);
            } else {
                name = null;
            }
        }

        if (name) {
            const time = new Date().getHours();
            const greeting = time < 12 ? 'Good morning' : time < 18 ? 'Good afternoon' : 'Good evening';
            banner.innerHTML = `
                <span>${greeting}, <strong>${name}</strong>! Welcome to Hash 2026.</span>
                <button class="close-welcome" onclick="document.getElementById('welcomeBanner').classList.remove('show')">&times;</button>
            `;
            banner.classList.add('show');
            setTimeout(() => banner.classList.remove('show'), 8000);
        }
    };

    return { init };
})();

// =========================================================
// 2. FORM VALIDATION — regex-based, field-wise errors
// =========================================================
const FormValidator = (() => {
    const getErrorElement = (input) =>
        input.form.querySelector(`.field-error[data-field-error="${input.id}"]`);

    const showFieldError = (input, message) => {
        input.classList.add('field-invalid');
        input.classList.remove('field-valid');
        const errEl = getErrorElement(input);
        if (errEl) {
            errEl.textContent = message;
            errEl.classList.add('show');
        }
    };

    const showFieldValid = (input) => {
        input.classList.remove('field-invalid');
        input.classList.add('field-valid');
        const errEl = getErrorElement(input);
        if (errEl) errEl.classList.remove('show');
    };

    const validateField = (input, pattern, errorMsg) => {
        const value = input.value.trim();
        if (!value) {
            showFieldError(input, 'This field is required.');
            return false;
        }
        if (pattern && !pattern.test(value)) {
            showFieldError(input, errorMsg);
            return false;
        }
        showFieldValid(input);
        return true;
    };

    const init = () => {
        const regForm = document.getElementById('registerForm');
        const loginForm = document.querySelector('.login-panel form');
        const forms = [regForm, loginForm].filter(Boolean);

        forms.forEach(form => {
            form.querySelectorAll('input[required], select[required]').forEach(field => {
                if (field.type === 'radio' && field.id !== 'male') return;

                const errSpan = document.createElement('div');
                errSpan.className = 'field-error';
                errSpan.dataset.fieldError = field.id;
                errSpan.id = `${field.id}Error`;
                errSpan.setAttribute('role', 'alert');
                field.setAttribute('aria-describedby', errSpan.id);

                const anchor = field.type === 'radio'
                    ? field.closest('.radio-group')
                    : field.closest('.field-control-row') || field;
                anchor.insertAdjacentElement('afterend', errSpan);
            });
        });

        const nameInput = document.getElementById('username');
        const emailInput = document.getElementById('useremail');
        const mobileInput = document.getElementById('whatsapp');
        const loginEmail = document.getElementById('loginEmail');
        const loginPass = document.getElementById('loginPass');

        [
            [nameInput, PATTERNS.name, 'Enter a valid name (2–50 letters, spaces allowed).'],
            [emailInput, PATTERNS.email, 'Enter a valid email address.'],
            [mobileInput, PATTERNS.mobile, 'Enter a valid 10-digit Indian mobile number.'],
            [loginEmail, PATTERNS.email, 'Enter a valid email address.'],
            [loginPass, PATTERNS.password, 'Password needs 6+ chars with upper, lower & digit.']
        ].forEach(([input, pattern, message]) => {
            if (input) input.addEventListener('blur', () => validateField(input, pattern, message));
        });

        if (regForm) regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let allValid = true;

            if (nameInput) {
                if (!validateField(nameInput, PATTERNS.name, 'Enter a valid name (2–50 letters, spaces allowed).')) allValid = false;
            }
            if (emailInput) {
                if (!validateField(emailInput, PATTERNS.email, 'Enter a valid email address.')) allValid = false;
            }
            if (mobileInput) {
                if (!validateField(mobileInput, PATTERNS.mobile, 'Enter a valid 10-digit Indian mobile number.')) allValid = false;
            }

            const collegeInput = document.getElementById('college');
            if (collegeInput) {
                if (!collegeInput.value.trim()) {
                    showFieldError(collegeInput, 'Please enter your college name.');
                    allValid = false;
                } else {
                    showFieldValid(collegeInput);
                }
            }

            const dobInput = document.getElementById('dob');
            if (dobInput) {
                if (!dobInput.value) {
                    showFieldError(dobInput, 'Please select your date of birth.');
                    allValid = false;
                } else {
                    showFieldValid(dobInput);
                }
            }

            const branchSelect = document.getElementById('branch');
            if (branchSelect) {
                if (!branchSelect.value) {
                    showFieldError(branchSelect, 'Please choose your branch.');
                    allValid = false;
                } else {
                    showFieldValid(branchSelect);
                }
            }

            const genderInput = regForm.querySelector('input[name="gender"]');
            if (genderInput) {
                if (!regForm.querySelector('input[name="gender"]:checked')) {
                    showFieldError(genderInput, 'Please select your gender.');
                    allValid = false;
                } else {
                    showFieldValid(genderInput);
                }
            }

            const idCardInput = document.getElementById('idcard');
            if (idCardInput) {
                if (!idCardInput.files.length) {
                    showFieldError(idCardInput, 'Please upload your college ID.');
                    allValid = false;
                } else {
                    showFieldValid(idCardInput);
                }
            }

            if (allValid) {
                const events = [...regForm.querySelectorAll('input[name="events"]:checked')].map(cb => cb.value);
                const participant = {
                    id: Date.now(),
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    mobile: mobileInput.value.trim(),
                    college: collegeInput.value.trim(),
                    gender: regForm.querySelector('input[name="gender"]:checked').value,
                    branch: branchSelect.value,
                    events: events.join(', ') || 'none'
                };

                Participants.add(participant);
                Participants.render();

                const successMsg = document.getElementById('formSuccess');
                if (successMsg) {
                    successMsg.classList.add('show');
                    setTimeout(() => successMsg.classList.remove('show'), 4000);
                }
                regForm.reset();
                regForm.querySelectorAll('.field-valid').forEach(el => el.classList.remove('field-valid'));
            }
        });

        if (loginForm) loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            if (loginEmail && !validateField(loginEmail, PATTERNS.email, 'Enter a valid email address.')) valid = false;
            if (loginPass && !validateField(loginPass, PATTERNS.password, 'Password needs 6+ chars with upper, lower & digit.')) valid = false;
            if (valid) {
                alert('Login successful! (Demo only)');
                loginForm.reset();
                loginForm.querySelectorAll('.field-valid').forEach(el => el.classList.remove('field-valid'));
            }
        });
    };

    return { init };
})();

// =========================================================
// 3. PARTICIPANTS — array of objects, localStorage, CRUD
// =========================================================
const Participants = (() => {
    let list = [];
    let editId = null;

    const load = () => {
        const data = localStorage.getItem('hashParticipants');
        list = data ? JSON.parse(data) : [];
    };

    const save = () => {
        localStorage.setItem('hashParticipants', JSON.stringify(list));
    };

    const add = (participant) => {
        list.push(participant);
        save();
    };

    const remove = (id) => {
        list = list.filter(p => p.id !== id);
        save();
        render();
    };

    const edit = (id) => {
        const p = list.find(p => p.id === id);
        if (!p) return;
        editId = id;
        document.getElementById('editName').value = p.name;
        document.getElementById('editEmail').value = p.email;
        document.getElementById('editMobile').value = p.mobile;
        document.getElementById('editCollege').value = p.college;
        document.getElementById('editModal').classList.add('open');
    };

    const saveEdit = () => {
        const p = list.find(p => p.id === editId);
        if (!p) return;
        p.name = document.getElementById('editName').value.trim();
        p.email = document.getElementById('editEmail').value.trim();
        p.mobile = document.getElementById('editMobile').value.trim();
        p.college = document.getElementById('editCollege').value.trim();
        save();
        render();
        document.getElementById('editModal').classList.remove('open');
        editId = null;
    };

    const clearAll = () => {
        if (list.length === 0) return;
        if (confirm('Remove all registered participants?')) {
            list = [];
            save();
            render();
        }
    };

    const search = (query) => {
        const filtered = list.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.email.toLowerCase().includes(query.toLowerCase()) ||
            p.college.toLowerCase().includes(query.toLowerCase())
        );
        renderList(filtered);
    };

    const renderList = (data) => {
        const container = document.getElementById('participantList');
        if (!container) return;

        if (data.length === 0) {
            container.innerHTML = '<div class="empty-state">No participants found.</div>';
        } else {
            container.innerHTML = data.map(p => `
                <div class="participant-card">
                    <div class="participant-info">
                        <span class="pname">${p.name}</span>
                        <span class="pdetail">${p.email} | ${p.mobile}</span>
                        <span class="pdetail">${p.college} | Events: ${p.events}</span>
                    </div>
                    <div class="participant-actions">
                        <button class="btn-sm" onclick="Participants.edit(${p.id})">Edit</button>
                        <button class="btn-sm btn-danger" onclick="Participants.remove(${p.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        const countEl = document.getElementById('participantCount');
        if (countEl) countEl.textContent = `Total: ${list.length}`;
    };

    const render = () => {
        renderList(list);
    };

    const init = () => {
        load();
        render();

        const searchBox = document.getElementById('participantSearch');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => search(e.target.value));
        }

        const clearBtn = document.getElementById('clearAllBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAll);
        }

        const editSaveBtn = document.getElementById('editSaveBtn');
        if (editSaveBtn) {
            editSaveBtn.addEventListener('click', saveEdit);
        }

        const editCancelBtn = document.getElementById('editCancelBtn');
        if (editCancelBtn) {
            editCancelBtn.addEventListener('click', () => {
                document.getElementById('editModal').classList.remove('open');
                editId = null;
            });
        }

        const editModal = document.getElementById('editModal');
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) {
                    editModal.classList.remove('open');
                    editId = null;
                }
            });
        }
    };

    return { init, add, remove, edit, render };
})();

// =========================================================
// 4. TASK MANAGER — add, complete, delete, localStorage
// =========================================================
const TaskManager = (() => {
    let tasks = [];

    const load = () => {
        const data = localStorage.getItem('hashTasks');
        tasks = data ? JSON.parse(data) : [];
    };

    const save = () => {
        localStorage.setItem('hashTasks', JSON.stringify(tasks));
    };

    const add = () => {
        const input = document.getElementById('taskInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        tasks.push({ id: Date.now(), text, completed: false });
        save();
        render();
        input.value = '';
    };

    const toggle = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            save();
            render();
        }
    };

    const remove = (id) => {
        tasks = tasks.filter(t => t.id !== id);
        save();
        render();
    };

    const render = () => {
        const container = document.getElementById('taskList');
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No tasks yet. Add one above.</div>';
            return;
        }

        container.innerHTML = tasks.map(t => `
            <div class="task-item ${t.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="TaskManager.toggle(${t.id})">
                <span class="task-text">${t.text}</span>
                <button class="task-delete" onclick="TaskManager.remove(${t.id})">&times;</button>
            </div>
        `).join('');
    };

    const init = () => {
        load();
        render();

        const addBtn = document.getElementById('taskAddBtn');
        if (addBtn) {
            addBtn.addEventListener('click', add);
        }

        const input = document.getElementById('taskInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') add();
            });
        }
    };

    return { init, add, toggle, remove };
})();

// =========================================================
// 5. GALLERY LIGHTBOX — navigate, keyboard, slideshow
// =========================================================
const Gallery = (() => {
    let images = [];
    let currentIndex = 0;
    let slideshowTimer = null;

    const collectImages = () => {
        const items = document.querySelectorAll('.gallery-item img');
        images = [...items].map(img => ({
            src: img.src,
            alt: img.alt,
            caption: img.parentElement.querySelector('.gallery-item-caption')?.textContent || ''
        }));
    };

    const show = (index) => {
        if (images.length === 0) return;
        currentIndex = (index + images.length) % images.length;
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        const caption = document.getElementById('lightboxCaption');
        if (!lightbox || !img) return;
        img.src = images[currentIndex].src;
        img.alt = images[currentIndex].alt;
        if (caption) caption.textContent = images[currentIndex].caption;
        lightbox.classList.add('open');
    };

    const next = () => show(currentIndex + 1);
    const prev = () => show(currentIndex - 1);
    const close = () => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) lightbox.classList.remove('open');
        stopSlideshow();
    };

    const startSlideshow = () => {
        if (slideshowTimer) return;
        show(0);
        slideshowTimer = setInterval(next, 3000);
        const stopBtn = document.getElementById('slideshowStop');
        const startBtn = document.getElementById('slideshowStart');
        if (stopBtn) stopBtn.style.display = 'inline-block';
        if (startBtn) startBtn.style.display = 'none';
    };

    const stopSlideshow = () => {
        if (slideshowTimer) {
            clearInterval(slideshowTimer);
            slideshowTimer = null;
        }
        const stopBtn = document.getElementById('slideshowStop');
        const startBtn = document.getElementById('slideshowStart');
        if (stopBtn) stopBtn.style.display = 'none';
        if (startBtn) startBtn.style.display = 'inline-block';
    };

    const init = () => {
        collectImages();
        if (images.length === 0) return;

        // Attach click handlers to gallery items
        document.querySelectorAll('.gallery-item').forEach((item, i) => {
            item.addEventListener('click', () => show(i));
        });

        // Lightbox controls
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    close();
                }
            });
        }

        const prevBtn = document.getElementById('lightboxPrev');
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

        const nextBtn = document.getElementById('lightboxNext');
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

        const startBtn = document.getElementById('slideshowStart');
        if (startBtn) startBtn.addEventListener('click', startSlideshow);

        const stopBtn = document.getElementById('slideshowStop');
        if (stopBtn) stopBtn.addEventListener('click', stopSlideshow);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lb = document.getElementById('lightbox');
            if (!lb || !lb.classList.contains('open')) return;
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'Escape') close();
        });
    };

    return { init };
})();

// =========================================================
// 6. PROSHOW COUNTDOWN TIMER
// =========================================================
const Countdown = (() => {
    const target = new Date('2026-10-14T18:30:00').getTime();

    const update = () => {
        const now = Date.now();
        const diff = target - now;

        const daysEl = document.getElementById('cdDays');
        const hoursEl = document.getElementById('cdHours');
        const minsEl = document.getElementById('cdMins');
        const secsEl = document.getElementById('cdSecs');

        if (!daysEl) return;

        if (diff <= 0) {
            daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
    };

    const init = () => {
        if (!document.getElementById('cdDays')) return;
        update();
        setInterval(update, 1000);
    };

    return { init };
})();

// =========================================================
// INIT — run all modules after DOM loads
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    WelcomeBanner.init();
    FormValidator.init();
    Participants.init();
    TaskManager.init();
    Gallery.init();
    Countdown.init();
});

// Expose for inline onclick handlers
window.Participants = Participants;
window.TaskManager = TaskManager;
