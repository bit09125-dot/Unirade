// API helper for communicating with backend
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const api = (() => {
    const base = '';
    let token = localStorage.getItem('token');
    function setToken(t) { token = t; localStorage.setItem('token', t); }
    async function request(path, options = {}) {
        options.headers = options.headers || {};
        if (token) options.headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(base + path, options);
        const json = await res.json().catch(()=>({}));
        if (!res.ok) throw json;
        return json;
    }
    return { request, setToken, getToken:()=>token };
})();

let currentUser = null;
async function loadCurrentUser() {
    if (!currentUser) {
        try { currentUser = await api.request('/api/auth/me'); }
        catch(e){ console.error('Failed to load current user', e); }
    }
    return currentUser;
}

function requireAuth() {
    if (!api.getToken()) {
        const allowed = ['login.html','register.html','index.html'];
        const page = window.location.pathname.split('/').pop();
        if (!allowed.includes(page)) {
            window.location.href = 'login.html';
        }
    }
}

// run auth check on each page
requireAuth();

// handle login
if (loginForm) {
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const data = await api.request('/api/auth/login', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({email,password})
            });
            api.setToken(data.token);
            window.location.href = 'dashboard.html';
        } catch(err) {
            alert(err.error || 'Login failed');
        }
    });
}

// handle register
if (registerForm) {
    registerForm.addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email.endsWith('@uoeld.ac.ke')) {
            alert('Please use your uoeld.ac.ke university email address (e.g. bit09125@uoeld.ac.ke)');
            return;
        }
        const data = {
            email,
            password: document.getElementById('password')?.value || '123456',
            firstName: document.getElementById('name').value.split(' ')[0] || '',
            lastName: document.getElementById('name').value.split(' ').slice(1).join(' ') || '',
            university: 'UOE',
            course: document.getElementById('course').value,
            yearOfStudy: parseInt(document.getElementById('year').value,10)
        };
        try {
            await api.request('/api/auth/register', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(data)
            });
            alert('Registration successful! Please verify your email before logging in.');
            window.location.href = 'login.html';
        } catch(err) {
            alert(err.error || 'Registration failed');
        }
    });
}

// ---------- Discover swipe cards ----------
const cardStack = document.getElementById('cardStack');
let profiles = [
    {name:'Alice', age:20, course:'CS', year:2, interests:'Hiking', bio:'Love mountains', img:'https://via.placeholder.com/300x400?text=Alice', university:'UOE'},
    {name:'Bob', age:22, course:'Math', year:3, interests:'Music', bio:'Guitarist', img:'https://via.placeholder.com/300x400?text=Bob', university:'UOE'},
    {name:'Carol', age:21, course:'CS', year:1, interests:'Cooking', bio:'Foodie', img:'https://via.placeholder.com/300x400?text=Carol', university:'UOE'}
];

// API-backed match functions
async function getMatches();
async function getMatches() {
    try {
        return await api.request('/api/matches/my-matches');
    } catch (e) {
        console.error('Error fetching matches', e);
        return [];
    }
}

// when user swipes right we call like endpoint
async function likeProfile(profile) {
    try {
        const res = await api.request('/api/matches/like', {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ likedId: profile.id })
        });
        if (res.isMatch) {
            addNotification(`You matched with ${profile.first_name || profile.name}!`);
        }
    } catch(err) {
        console.error('Like error', err);
    }
}

async function skipProfile(profile) {
    try {
        await api.request('/api/matches/skip', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ skippedId: profile.id })
        });
    } catch(err) {
        console.error('Skip error', err);
    }
}

// theme toggle helpers
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌓';
}
function loadTheme() {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') {
        document.body.classList.add('dark-mode');
    }
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
    if (btn) btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌓';
}
loadTheme();

// clear token when navigating to login page
document.querySelectorAll('a[href="login.html"]').forEach(a => {
    a.addEventListener('click', () => {
        localStorage.removeItem('token');
    });
});

// notifications
function getNotifications() {
    const str = localStorage.getItem('notifications');
    return str ? JSON.parse(str) : [];
}
function saveNotifications(arr) {
    localStorage.setItem('notifications', JSON.stringify(arr));
}
function addNotification(text) {
    const arr = getNotifications();
    arr.unshift({text, time:Date.now()});
    if (arr.length>50) arr.pop();
    saveNotifications(arr);
    populateNotifications();
}
function populateNotifications() {
    const listEl = document.getElementById('notifList');
    if (!listEl) return;
    const arr = getNotifications();
    listEl.innerHTML = '';
    arr.forEach(n=>{
        const li = document.createElement('li');
        li.textContent = n.text;
        listEl.appendChild(li);
    });
}
populateNotifications();

// admin button interactions
function setupAdminActions() {
    const userList = document.getElementById('userList');
    if (!userList) return;
    userList.addEventListener('click', e=>{
        if (e.target.tagName === 'BUTTON') {
            const action = e.target.className;
            const email = e.target.parentNode.firstChild.textContent.trim();
            alert(`Admin action: ${action} on ${email}`);
        }
    });
}
setupAdminActions();

function renderCards(list) {
    if (!cardStack) return;
    cardStack.innerHTML = '';
    list.slice().reverse().forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.profile_photo_url || p.img}" alt="${p.first_name || p.name}" style="width:100%;height:60%;object-fit:cover;border-radius:8px;" />
            <h3>${p.first_name || p.name}, ${p.age}</h3>
            <p>${p.course} (Year ${p.year})</p>
            <p>${p.interests}</p>
            <p>${p.bio}</p>
        `;
        let offset = 0;
        card.addEventListener('mousedown', startDrag);
        card.addEventListener('touchstart', startDrag);
        function startDrag(e) {
            e.preventDefault();
            const startX = e.clientX || e.touches[0].clientX;
            function onMove(ev) {
                const x = (ev.clientX || ev.touches[0].clientX) - startX;
                card.style.transform = `translateX(${x}px) rotate(${x/10}deg)`;
                offset = x;
            }
            function onUp() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('mouseup', onUp);
                document.removeEventListener('touchend', onUp);
                if (offset > 100) {
                    likeProfile(p);
                    card.remove();
                } else if (offset < -100) {
                    skipProfile(p);
                    card.remove();
                } else {
                    card.style.transform = '';
                }
            }
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove);
            document.addEventListener('mouseup', onUp);
            document.addEventListener('touchend', onUp);
        }
        cardStack.appendChild(card);
    });
}

if (cardStack) {
    // fetch suggestions from backend
    (async function(){
        try {
            const suggestions = await api.request('/api/matches/suggestions');
            profiles = suggestions;
            renderCards(profiles);
        } catch(e){
            console.error('failed to load suggestions', e);
        }
    })();
    // filter handlers
    const ageInput = document.getElementById('ageFilter');
    const courseInput = document.getElementById('courseFilter');
    const yearInput = document.getElementById('yearFilter');
    const intInput = document.getElementById('interestsFilter');
    const searchInput = document.getElementById('searchInput');
    [ageInput, courseInput, yearInput, intInput, searchInput].forEach(el=>{
        if(el) el.addEventListener('input', applyFilters);
    });
}

function applyFilters() {
    let ageInput = document.getElementById('ageFilter');
    let courseInput = document.getElementById('courseFilter');
    let yearInput = document.getElementById('yearFilter');
    let intInput = document.getElementById('interestsFilter');
    let searchInput = document.getElementById('searchInput');
    let filtered = profiles.filter(p => {
        let ok=true;
        if (ageInput && ageInput.value) ok = ok && p.age <= ageInput.value;
        if (courseInput && courseInput.value) ok = ok && p.course.toLowerCase().includes(courseInput.value.toLowerCase());
        if (yearInput && yearInput.value) ok = ok && p.year == yearInput.value;
        if (intInput && intInput.value) ok = ok && p.interests.toLowerCase().includes(intInput.value.toLowerCase());
        if (searchInput && searchInput.value) ok = ok && p.name.toLowerCase().includes(searchInput.value.toLowerCase());
        return ok;
    });
    renderCards(filtered);
}

// ---------- Chat functionality ----------
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

if (messageForm) {
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get('matchId');
    if (!matchId) {
        messageForm.style.display = 'none';
        return;
    }
    let receiverId = null;
    async function loadMessages() {
        try {
            const msgs = await api.request(`/api/messages/match/${matchId}`);
            const me = await loadCurrentUser();
            msgs.forEach(m=> {
                const sender = m.sender_id === me.id ? 'You' : 'Match';
                addMessage(sender, m.content);
            });
            // compute receiver id as other user
            const matches = await getMatches();
            const matchRec = matches.find(m=> m.match_id == matchId);
            if (matchRec) {
                receiverId = matchRec.id;
            }
        } catch(e){ console.error(e); }
    }
    loadMessages();
    messageForm.addEventListener('submit', async e=>{
        e.preventDefault();
        if (!messageInput.value.trim()) return;
        try {
            await api.request('/api/messages/send', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ matchId, receiverId, content: messageInput.value })
            });
            addMessage('You', messageInput.value);
            messageInput.value='';
        } catch(err){ console.error(err); }
    });
}

// populate profile page from backend
async function populateProfile() {
    try {
        const user = await api.request('/api/auth/me');
        const pic = document.getElementById('profilePic');
        const nameEl = document.getElementById('profileName');
        const ageEl = document.getElementById('profileAge');
        const courseEl = document.getElementById('profileCourse');
        const yearEl = document.getElementById('profileYear');
        const intEl = document.getElementById('profileInterests');
        if (pic && user.profile_photo_url) pic.src = user.profile_photo_url;
        if (nameEl) nameEl.textContent = `${user.first_name || ''} ${user.last_name || ''}`;
        if (ageEl) ageEl.textContent = user.age || '';
        if (courseEl) courseEl.textContent = user.course || '';
        if (yearEl) yearEl.textContent = user.year_of_study || '';
        if (intEl) intEl.textContent = user.interests || '';
    } catch(e){
        console.error('Failed to load profile',e);
    }
}

populateProfile();

// floating hearts in hero
function spawnHearts() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    for (let i=0;i<20;i++){
        const heart = document.createElement('div');
        heart.className='heart';
        heart.style.left = Math.random()*100 + '%';
        heart.style.animationDelay = Math.random()*4 + 's';
        heart.style.opacity = Math.random()*0.5 + 0.5;
        hero.appendChild(heart);
        setTimeout(()=>heart.remove(),5000);
    }
}
setInterval(spawnHearts,2000);

// populate matches on dashboard with API
async function populateMatches() {
    const listEl = document.getElementById('matchesList');
    if (!listEl) return;
    const matches = await getMatches();
    listEl.innerHTML = '';
    matches.forEach(m=>{
        const li = document.createElement('li');
        li.innerHTML = `${m.first_name || m.name} (${m.course}, Year ${m.year}) <a href="chat.html?matchId=${m.match_id}">Chat</a>`;
        listEl.appendChild(li);
    });
}
populateMatches();

function addMessage(sender, text) {
    if (!messagesDiv) return;
    const msg = document.createElement('div');
    msg.className = 'message ' + (sender === 'You' ? 'you' : 'match');
    // image support
    if (text.startsWith('img:')) {
        const url = text.slice(4).trim();
        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '200px';
        msg.appendChild(img);
    } else {
        msg.textContent = text;
    }
    if (sender !== 'You') {
        addNotification(`New message from ${sender}`);
    }
    // emoji reaction on click
    msg.addEventListener('click', () => {
        const reaction = prompt('Add emoji reaction:');
        if (reaction) {
            msg.textContent += ` ${reaction}`;
        }
    });
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

