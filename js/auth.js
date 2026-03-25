/* ================================================
   TaskNest – Authentication Module
   ================================================ */

const Auth = (function () {
    'use strict';

    const USERS_KEY = 'tasknest_users';
    const SESSION_KEY = 'tasknest_session';

    // ---- Crypto Helper ----
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ---- User Storage ----
    function getUsers() {
        try {
            const raw = localStorage.getItem(USERS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // ---- Auth Actions ----
    async function signup(username, password) {
        const users = getUsers();
        const normalizedUsername = username.trim().toLowerCase();

        if (!normalizedUsername) {
            return { success: false, message: 'Please enter a username.' };
        }
        if (normalizedUsername.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters.' };
        }
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters.' };
        }
        if (users[normalizedUsername]) {
            return { success: false, message: 'This username is already taken.' };
        }

        const hashed = await hashPassword(password);
        users[normalizedUsername] = {
            passwordHash: hashed,
            createdAt: new Date().toISOString()
        };

        saveUsers(users);
        sessionStorage.setItem(SESSION_KEY, normalizedUsername);

        return { success: true, message: 'Account created successfully!' };
    }

    async function login(username, password) {
        const users = getUsers();
        const normalizedUsername = username.trim().toLowerCase();

        if (!normalizedUsername || !password) {
            return { success: false, message: 'Please enter both username and password.' };
        }

        const user = users[normalizedUsername];
        if (!user) {
            return { success: false, message: 'Invalid username or password.' };
        }

        const hashed = await hashPassword(password);
        if (hashed !== user.passwordHash) {
            return { success: false, message: 'Invalid username or password.' };
        }

        sessionStorage.setItem(SESSION_KEY, normalizedUsername);
        return { success: true, message: 'Login successful!' };
    }

    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
    }

    function getCurrentUser() {
        return sessionStorage.getItem(SESSION_KEY);
    }

    function requireAuth() {
        if (!getCurrentUser()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    function getStorageKey() {
        const user = getCurrentUser();
        return user ? 'tasknest_tasks_' + user : 'tasknest_tasks';
    }

    // ---- Public API ----
    return {
        signup,
        login,
        logout,
        getCurrentUser,
        requireAuth,
        getStorageKey
    };
})();
