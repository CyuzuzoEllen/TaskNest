/* ================================================
   TaskNest – Utility Module
   ================================================ */

const Utils = (function () {
    'use strict';

    /**
     * Generates a unique ID for tasks.
     * @returns {string} 
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    /**
     * Formats a date string (YYYY-MM-DD) into a human-readable format.
     * @param {string} dateStr 
     * @returns {string} 
     */
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    /**
     * Checks if a date is in the past compared to today.
     * @param {string} dateStr 
     * @param {boolean} completed 
     * @returns {boolean} 
     */
    function isOverdue(dateStr, completed) {
        if (!dateStr || completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dateStr + 'T00:00:00');
        return due < today;
    }

    /**
     * Escapes HTML characters to prevent XSS.
     * @param {string} str 
     * @returns {string} 
     */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Public API
    return {
        generateId,
        formatDate,
        isOverdue,
        escapeHTML
    };
})();
