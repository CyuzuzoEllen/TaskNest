/* ================================================
   TaskNest – Application Logic
   ================================================ */

(function () {
  'use strict';

  // ---- Auth Guard ----
  if (!Auth.requireAuth()) return;

  // ---- Constants ----
  const STORAGE_KEY = Auth.getStorageKey();
  const currentUser = Auth.getCurrentUser();

  // ---- DOM References ----
  const taskForm = document.getElementById('task-form');
  const titleInput = document.getElementById('task-title');
  const descInput = document.getElementById('task-desc');
  const dateInput = document.getElementById('task-date');
  const titleError = document.getElementById('title-error');
  const taskListEl = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const statTotal = document.getElementById('stat-total');
  const statCompleted = document.getElementById('stat-completed');
  const statPending = document.getElementById('stat-pending');
  const filterBtns = document.querySelectorAll('.btn--filter');
  const welcomeHeading = document.getElementById('welcome-banner')
    ?.querySelector('.welcome__heading');

  // ---- Header User Info ----
  const headerAvatar = document.getElementById('header-avatar');
  const headerUsername = document.getElementById('header-username');
  const logoutBtn = document.getElementById('logout-btn');

  if (headerAvatar) headerAvatar.textContent = currentUser.charAt(0);
  if (headerUsername) headerUsername.textContent = currentUser;
  if (welcomeHeading) welcomeHeading.textContent = 'Welcome, ' + currentUser + '!';
  if (logoutBtn) logoutBtn.addEventListener('click', () => Auth.logout());

  // ---- State ----
  let tasks = [];
  let currentFilter = 'all';

  // ---- Local Storage ----
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch {
      tasks = [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // ---- Unique ID ----
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ---- Date Helpers ----
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function isOverdue(dateStr, completed) {
    if (!dateStr || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr + 'T00:00:00');
    return due < today;
  }

  // ---- CRUD ----
  function addTask(title, description, dueDate) {
    const task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();
  }

  function deleteTask(id) {
    // Animate out first
    const card = document.querySelector(`.task-card[data-id="${id}"]`);
    if (card) {
      card.classList.add('removing');
      card.addEventListener('animationend', () => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
      }, { once: true });
    } else {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
      updateStats();
    }
  }

  function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      updateStats();
    }
  }

  // ---- Rendering ----
  function getFilteredTasks() {
    switch (currentFilter) {
      case 'completed': return tasks.filter(t => t.completed);
      case 'pending': return tasks.filter(t => !t.completed);
      default: return tasks;
    }
  }

  function createTaskCard(task) {
    const overdue = isOverdue(task.dueDate, task.completed);
    const card = document.createElement('article');
    card.className = `task-card${task.completed ? ' completed' : ''}`;
    card.dataset.id = task.id;

    card.innerHTML = `
      <button class="task-card__check" aria-label="${task.completed ? 'Mark as pending' : 'Mark as completed'}" data-action="toggle" data-id="${task.id}">
        <svg class="task-card__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
      <div class="task-card__body">
        <h3 class="task-card__title">${escapeHTML(task.title)}</h3>
        ${task.description ? `<p class="task-card__desc">${escapeHTML(task.description)}</p>` : ''}
        <div class="task-card__meta">
          ${task.dueDate ? `
            <span class="task-card__date${overdue ? ' overdue' : ''}">
              <svg class="task-card__date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              ${overdue ? 'Overdue · ' : ''}${formatDate(task.dueDate)}
            </span>
          ` : ''}
        </div>
      </div>
      <div class="task-card__actions">
        <button class="btn btn--icon" aria-label="Delete task" data-action="delete" data-id="${task.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    `;

    return card;
  }

  function renderTasks() {
    const filtered = getFilteredTasks();

    // Remove existing task cards (keep empty state element)
    const existingCards = taskListEl.querySelectorAll('.task-card');
    existingCards.forEach(c => c.remove());

    if (filtered.length === 0) {
      emptyState.style.display = '';
      // Update empty state message based on filter
      const emptyP = emptyState.querySelector('p');
      if (tasks.length === 0) {
        emptyP.textContent = 'No tasks yet. Add one above to get started!';
      } else if (currentFilter === 'completed') {
        emptyP.textContent = 'No completed tasks yet. Keep working!';
      } else if (currentFilter === 'pending') {
        emptyP.textContent = 'All tasks are completed. Great job!';
      }
    } else {
      emptyState.style.display = 'none';
      filtered.forEach((task, i) => {
        const card = createTaskCard(task);
        card.style.animationDelay = `${i * 0.05}s`;
        taskListEl.appendChild(card);
      });
    }
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    animateCounter(statTotal, total);
    animateCounter(statCompleted, completed);
    animateCounter(statPending, pending);
  }

  function animateCounter(el, target) {
    const current = parseInt(el.textContent, 10) || 0;
    if (current === target) return;

    const duration = 300;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(current + (target - current) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // ---- Utility ----
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Event Handlers ----
  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();

    if (!title) {
      titleInput.classList.add('error');
      titleError.classList.add('visible');
      titleInput.focus();
      return;
    }

    titleInput.classList.remove('error');
    titleError.classList.remove('visible');

    addTask(title, descInput.value, dateInput.value);

    taskForm.reset();
    titleInput.focus();
  });

  titleInput.addEventListener('input', function () {
    if (this.value.trim()) {
      this.classList.remove('error');
      titleError.classList.remove('visible');
    }
  });

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderTasks();
    });
  });

  // Task actions via event delegation
  taskListEl.addEventListener('click', function (e) {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const id = actionBtn.dataset.id;

    if (action === 'toggle') toggleComplete(id);
    if (action === 'delete') deleteTask(id);
  });

  // ---- Init ----
  function init() {
    loadTasks();
    renderTasks();
    updateStats();

    // Set default date input to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  init();
})();
