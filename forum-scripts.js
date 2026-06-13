/* ═══════════════════════════════════════════════════════════════
   Modern Bond — Community Forum (Supabase)
   Setup: paste your project's URL + anon public key below.
   Find them at: Supabase Dashboard → Project Settings → API
═══════════════════════════════════════════════════════════════ */
const SUPABASE_URL      = 'https://sxaizfjhwaslqokrqrvj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YWl6Zmpod2FzbHFva3JxcnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyODY1NzIsImV4cCI6MjA5Njg2MjU3Mn0.xMRrBcYXqJzm_aKpRwQRjml0SaynyFeBhnGTP4Uzj7c'; // anon public key — safe to expose in the browser

const CONFIGURED = SUPABASE_URL.startsWith('https://');
const sb = CONFIGURED ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let currentUser = null;     // supabase auth user
let currentProfile = null;  // row from profiles table

/* ── Helpers ──────────────────────────────────────────────────── */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);   if (m < 60)  return m + 'm ago';
  const h = Math.floor(m / 60);   if (h < 24)  return h + 'h ago';
  const d = Math.floor(h / 24);   if (d < 30)  return d + 'd ago';
  const mo = Math.floor(d / 30);  if (mo < 12) return mo + 'mo ago';
  return Math.floor(mo / 12) + 'y ago';
}

function flash(el, msg, ok = false) {
  if (!el) return;
  el.textContent = msg;
  el.className = 'forum-msg ' + (ok ? 'forum-msg-ok' : 'forum-msg-err');
  el.style.display = msg ? 'block' : 'none';
}

function notConfiguredBanner() {
  const host = $('#forum-feed') || $('#thread-view') || $('#account-view');
  if (!host) return;
  host.innerHTML = `
    <div class="forum-setup-notice">
      <h3>⚡ Almost there — connect Supabase</h3>
      <p>The community runs on a free Supabase database. To switch it on:</p>
      <ol>
        <li>Create a free project at <strong>supabase.com</strong></li>
        <li>Run <strong>supabase/schema.sql</strong> in the SQL Editor</li>
        <li>Paste your Project URL + anon key at the top of <strong>forum-scripts.js</strong></li>
      </ol>
    </div>`;
}

/* ── Auth state → nav ─────────────────────────────────────────── */
async function refreshAuth() {
  if (!sb) return;
  const { data: { user } } = await sb.auth.getUser();
  currentUser = user;
  if (user) {
    const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
    currentProfile = data;
  } else {
    currentProfile = null;
  }
  updateNav();
}

function updateNav() {
  const joinBtn = $('.nav-cta .btn-pink');
  if (!joinBtn) return;
  if (currentProfile) {
    joinBtn.textContent = '@' + currentProfile.username;
    joinBtn.setAttribute('href', 'account.html');
  } else {
    joinBtn.textContent = 'Join Now';
    joinBtn.setAttribute('href', 'account.html');
  }
}

/* Pre-fill Snipcart checkout email with the logged-in user's email */
document.addEventListener('snipcart.ready', async () => {
  try {
    if (!sb) return;
    const { data: { user } } = await sb.auth.getUser();
    if (user && user.email) {
      await window.Snipcart.api.cart.update({ email: user.email });
    }
  } catch (e) { /* cart not open yet — harmless */ }
});

/* ── ACCOUNT PAGE ─────────────────────────────────────────────── */
async function initAccount() {
  const view = $('#account-view');
  if (!view) return;

  const authBox    = $('#auth-box');
  const profileBox = $('#profile-box');

  if (currentUser && currentProfile) {
    authBox.style.display = 'none';
    profileBox.style.display = 'block';
    $('#profile-username').textContent = '@' + currentProfile.username;
    $('#profile-email').textContent = currentUser.email;
    $('#profile-joined').textContent = new Date(currentProfile.created_at)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return;
  }

  authBox.style.display = 'block';
  profileBox.style.display = 'none';

  // Tab switching
  $$('.auth-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $('#signup-form').style.display = tab.dataset.tab === 'signup' ? 'flex' : 'none';
    $('#login-form').style.display  = tab.dataset.tab === 'login'  ? 'flex' : 'none';
  }));

  $('#signup-form').addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('#signup-msg');
    const username = $('#signup-username').value.trim();
    const email    = $('#signup-email').value.trim();
    const password = $('#signup-password').value;
    if (username.length < 3) return flash(msg, 'Username must be at least 3 characters.');
    flash(msg, 'Creating your account…', true);
    const { data, error } = await sb.auth.signUp({
      email, password,
      options: { data: { username } }
    });
    if (error) return flash(msg, error.message);
    if (data.user && !data.session) {
      return flash(msg, 'Check your email to confirm your account, then log in here.', true);
    }
    window.location.href = 'community.html';
  });

  $('#login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('#login-msg');
    flash(msg, 'Logging in…', true);
    const { error } = await sb.auth.signInWithPassword({
      email: $('#login-email').value.trim(),
      password: $('#login-password').value
    });
    if (error) return flash(msg, error.message);
    window.location.href = 'community.html';
  });
}

async function logout() {
  if (sb) await sb.auth.signOut();
  window.location.href = 'index.html';
}

/* ── COMMUNITY FEED PAGE ──────────────────────────────────────── */
let feedCategory = 'all';
let feedSort = 'hot';

async function initFeed() {
  const view = $('#forum-feed');
  if (!view) return;

  // Category tabs
  const { data: cats } = await sb.from('categories').select('*').order('id');
  const tabBar = $('#category-tabs');
  tabBar.innerHTML = `<button class="cat-tab active" data-slug="all">All</button>` +
    (cats || []).map(c => `<button class="cat-tab" data-slug="${esc(c.slug)}" data-id="${c.id}" title="${esc(c.description || '')}">${esc(c.name)}</button>`).join('');
  $$('.cat-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    feedCategory = tab.dataset.slug;
    loadFeed();
  }));

  // Sort toggle
  $$('.sort-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    feedSort = btn.dataset.sort;
    loadFeed();
  }));

  // Composer
  const composerBtn = $('#new-post-btn');
  composerBtn.addEventListener('click', () => {
    if (!currentUser) { window.location.href = 'account.html'; return; }
    $('#composer').style.display = $('#composer').style.display === 'block' ? 'none' : 'block';
  });
  const catSelect = $('#composer-category');
  catSelect.innerHTML = (cats || []).map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  $('#composer-form').addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('#composer-msg');
    const title = $('#composer-title').value.trim();
    const body  = $('#composer-body').value.trim();
    if (title.length < 3) return flash(msg, 'Give your post a title (3+ characters).');
    if (!body) return flash(msg, 'Write something in the body.');
    flash(msg, 'Posting…', true);
    const { error } = await sb.from('posts').insert({
      author: currentUser.id,
      category_id: Number(catSelect.value),
      title, body
    });
    if (error) return flash(msg, error.message);
    $('#composer-form').reset();
    $('#composer').style.display = 'none';
    flash(msg, '');
    loadFeed();
  });

  loadFeed();
}

async function loadFeed() {
  const list = $('#post-list');
  list.innerHTML = `<div class="forum-loading">Loading the conversation…</div>`;

  let q = sb.from('post_feed').select('*');
  if (feedCategory !== 'all') q = q.eq('category_slug', feedCategory);
  q = feedSort === 'new'
    ? q.order('created_at', { ascending: false })
    : q.order('score', { ascending: false }).order('created_at', { ascending: false });
  const { data: posts, error } = await q.limit(50);

  if (error) { list.innerHTML = `<div class="forum-loading">Couldn't load posts: ${esc(error.message)}</div>`; return; }
  if (!posts || !posts.length) {
    list.innerHTML = `<div class="forum-empty">No posts here yet. <strong>Be the first to start the conversation.</strong></div>`;
    return;
  }

  const myVotes = await getMyVotes(posts.map(p => p.id));
  list.innerHTML = posts.map(p => postRowHTML(p, myVotes[p.id])).join('');
  bindVoteButtons(list);
}

function postRowHTML(p, myVote) {
  return `
  <article class="post-row" data-id="${p.id}">
    <div class="vote-col">
      <button class="vote-btn vote-up ${myVote === 1 ? 'voted' : ''}" data-id="${p.id}" data-value="1" aria-label="Upvote">▲</button>
      <span class="vote-score">${p.score}</span>
      <button class="vote-btn vote-down ${myVote === -1 ? 'voted' : ''}" data-id="${p.id}" data-value="-1" aria-label="Downvote">▼</button>
    </div>
    <a class="post-main" href="thread.html?id=${p.id}">
      <div class="post-meta">
        <span class="post-cat">${esc(p.category_name)}</span>
        <span>@${esc(p.username)}</span> · <span>${timeAgo(p.created_at)}</span>
      </div>
      <h3 class="post-title">${esc(p.title)}</h3>
      <div class="post-snippet">${esc(p.body.slice(0, 180))}${p.body.length > 180 ? '…' : ''}</div>
      <div class="post-foot">💬 ${p.comment_count} ${p.comment_count === 1 ? 'comment' : 'comments'}</div>
    </a>
  </article>`;
}

/* ── Voting ───────────────────────────────────────────────────── */
async function getMyVotes(postIds) {
  if (!currentUser || !postIds.length) return {};
  const { data } = await sb.from('votes').select('post_id,value')
    .eq('user_id', currentUser.id).in('post_id', postIds);
  const map = {};
  (data || []).forEach(v => { map[v.post_id] = v.value; });
  return map;
}

function bindVoteButtons(root) {
  $$('.vote-btn', root).forEach(btn => btn.addEventListener('click', async e => {
    e.preventDefault();
    if (!currentUser) { window.location.href = 'account.html'; return; }
    const postId = btn.dataset.id;
    const value  = Number(btn.dataset.value);
    const col    = btn.closest('.vote-col');
    const upBtn  = $('.vote-up', col), downBtn = $('.vote-down', col);
    const scoreEl = $('.vote-score', col);
    const hadVote = btn.classList.contains('voted');
    let delta;
    if (hadVote) {
      await sb.from('votes').delete().eq('user_id', currentUser.id).eq('post_id', postId);
      btn.classList.remove('voted');
      delta = -value;
    } else {
      const other = value === 1 ? downBtn : upBtn;
      const hadOther = other.classList.contains('voted');
      await sb.from('votes').upsert({ user_id: currentUser.id, post_id: postId, value });
      other.classList.remove('voted');
      btn.classList.add('voted');
      delta = hadOther ? value * 2 : value;
    }
    scoreEl.textContent = Number(scoreEl.textContent) + delta;
  }));
}

/* ── THREAD PAGE ──────────────────────────────────────────────── */
async function initThread() {
  const view = $('#thread-view');
  if (!view) return;
  const postId = new URLSearchParams(location.search).get('id');
  if (!postId) { view.innerHTML = '<div class="forum-loading">Post not found.</div>'; return; }

  const { data: p, error } = await sb.from('post_feed').select('*').eq('id', postId).single();
  if (error || !p) { view.innerHTML = '<div class="forum-loading">Post not found.</div>'; return; }

  document.title = p.title + ' — Community | Modern Bond';
  const myVotes = await getMyVotes([p.id]);

  $('#thread-post').innerHTML = `
    <article class="post-row post-row-full" data-id="${p.id}">
      <div class="vote-col">
        <button class="vote-btn vote-up ${myVotes[p.id] === 1 ? 'voted' : ''}" data-id="${p.id}" data-value="1" aria-label="Upvote">▲</button>
        <span class="vote-score">${p.score}</span>
        <button class="vote-btn vote-down ${myVotes[p.id] === -1 ? 'voted' : ''}" data-id="${p.id}" data-value="-1" aria-label="Downvote">▼</button>
      </div>
      <div class="post-main">
        <div class="post-meta">
          <span class="post-cat">${esc(p.category_name)}</span>
          <span>@${esc(p.username)}</span> · <span>${timeAgo(p.created_at)}</span>
        </div>
        <h1 class="thread-title">${esc(p.title)}</h1>
        <div class="thread-body">${esc(p.body).replace(/\n/g, '<br/>')}</div>
      </div>
    </article>`;
  bindVoteButtons($('#thread-post'));

  // Reply box (top-level)
  const replyForm = $('#reply-form');
  replyForm.addEventListener('submit', e => submitComment(e, postId, null, $('#reply-body'), $('#reply-msg')));

  loadComments(postId);
}

async function loadComments(postId) {
  const host = $('#comment-tree');
  const { data: comments, error } = await sb.from('comments')
    .select('*, profiles(username)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) { host.innerHTML = `<div class="forum-loading">${esc(error.message)}</div>`; return; }

  $('#comment-count').textContent = (comments || []).length;
  if (!comments || !comments.length) {
    host.innerHTML = `<div class="forum-empty">No comments yet — say something real.</div>`;
    return;
  }

  // Build tree
  const byParent = {};
  comments.forEach(c => {
    const key = c.parent_id || 'root';
    (byParent[key] = byParent[key] || []).push(c);
  });

  const renderBranch = (parentKey, depth) =>
    (byParent[parentKey] || []).map(c => `
      <div class="comment ${depth > 0 ? 'comment-nested' : ''}" data-id="${c.id}">
        <div class="comment-meta"><span class="comment-author">@${esc(c.profiles?.username || 'member')}</span> · ${timeAgo(c.created_at)}</div>
        <div class="comment-body">${esc(c.body).replace(/\n/g, '<br/>')}</div>
        <button class="comment-reply-btn" data-id="${c.id}">Reply</button>
        <div class="comment-reply-slot"></div>
        ${depth < 6 ? renderBranch(c.id, depth + 1) : ''}
      </div>`).join('');

  host.innerHTML = renderBranch('root', 0);

  $$('.comment-reply-btn', host).forEach(btn => btn.addEventListener('click', () => {
    if (!currentUser) { window.location.href = 'account.html'; return; }
    const slot = btn.nextElementSibling;
    if (slot.innerHTML) { slot.innerHTML = ''; return; }
    slot.innerHTML = `
      <form class="inline-reply">
        <textarea rows="3" placeholder="Write a reply…" required></textarea>
        <div class="forum-msg" style="display:none;"></div>
        <button type="submit" class="btn-pink btn-small">Reply</button>
      </form>`;
    $('form', slot).addEventListener('submit', e =>
      submitComment(e, postId, btn.dataset.id, $('textarea', slot), $('.forum-msg', slot)));
  }));
}

async function submitComment(e, postId, parentId, bodyEl, msgEl) {
  e.preventDefault();
  if (!currentUser) { window.location.href = 'account.html'; return; }
  const body = bodyEl.value.trim();
  if (!body) return flash(msgEl, 'Write something first.');
  flash(msgEl, 'Posting…', true);
  const { error } = await sb.from('comments').insert({
    post_id: postId, parent_id: parentId, author: currentUser.id, body
  });
  if (error) return flash(msgEl, error.message);
  bodyEl.value = '';
  flash(msgEl, '');
  loadComments(postId);
}

/* ── Boot ─────────────────────────────────────────────────────── */
(async function boot() {
  if (!CONFIGURED) { notConfiguredBanner(); return; }
  await refreshAuth();
  initAccount();
  initFeed();
  initThread();
  const logoutBtn = $('#logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
})();
