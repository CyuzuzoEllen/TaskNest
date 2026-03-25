# 🪺 TaskNest – Daily Task Manager

> **Organize your day, achieve your goals.**

TaskNest is a clean, modern daily task manager web app built with vanilla HTML, CSS, and JavaScript. It helps you create, track, and manage your daily tasks with an intuitive and responsive interface — no frameworks, no build tools, just open and go.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## ✨ Features

| Feature | Description |
|---|---|
| **📝 Add Tasks** | Create tasks with a title (required), optional description, and optional due date |
| **✅ Complete Tasks** | Mark tasks as completed with a single click — completed tasks are visually distinguished |
| **🗑️ Delete Tasks** | Remove tasks you no longer need with a smooth fade-out animation |
| **🔍 Filter Tasks** | View *All*, *Completed*, or *Pending* tasks using the filter bar |
| **📊 Live Stats** | A stats dashboard shows total, completed, and pending counts with animated counters |
| **💾 Persistent Storage** | All tasks are saved to `localStorage` — your data survives page refreshes and browser restarts |
| **⏰ Overdue Detection** | Past-due tasks are automatically highlighted so nothing slips through the cracks |
| **📱 Responsive Design** | Fully responsive layout that works beautifully on desktop, tablet, and mobile |

---

## 🚀 Getting Started

### Prerequisites

All you need is a modern web browser (Chrome, Firefox, Edge, Safari, etc.).

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/TaskNest.git
   cd TaskNest
   ```

2. **Open the app**

   Simply open `index.html` in your browser:

   ```bash
   # macOS
   open index.html

   # Windows
   start index.html

   # Linux
   xdg-open index.html
   ```

   Or drag and drop the `index.html` file into any browser window.

That's it — no installations, no dependencies, no build step! 🎉

---

## 📁 Project Structure

```
TaskNest/
├── index.html          # Main HTML page (app shell & semantic markup)
├── css/
│   └── style.css       # Complete design system & responsive styles
├── js/
│   └── app.js          # Application logic (CRUD, filtering, storage)
└── README.md           # Project documentation
```

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Structure** | HTML5 | Semantic markup with accessibility attributes (`aria-label`, `role`, etc.) |
| **Styling** | CSS3 | Custom properties (design tokens), CSS Grid, Flexbox, keyframe animations |
| **Logic** | Vanilla JavaScript (ES6+) | IIFE module pattern, DOM manipulation, `localStorage` API |
| **Typography** | [Inter](https://fonts.google.com/specimen/Inter) | Loaded via Google Fonts for a modern, readable interface |

---

## 🎨 Design Highlights

- **Soft blue & white color palette** — calming, professional, easy on the eyes
- **CSS custom properties** — a centralized design token system for colors, spacing, typography, shadows, and radii
- **Micro-animations** — fade/slide-in on load, hover lift effects, animated stat counters, shake on validation error, and smooth card removal
- **Sticky header** with a gradient background
- **Pill-style filter buttons** with active-state highlighting
- **Colored left border accents** on task cards (blue for pending, green for completed)
- **Overdue badge** in red for past-due tasks
- **Mobile-first responsive** breakpoint at 640px

---

## 🧩 How It Works

1. **Adding a Task** — Fill in the title (required), an optional description, and an optional due date, then click **Add Task**. The new task appears at the top of the list.
2. **Completing a Task** — Click the circular checkbox on the left side of a task card. The card fades slightly, the title gets a strikethrough, and the border turns green.
3. **Deleting a Task** — Click the trash icon on the right side of a task card. The card animates out before being removed.
4. **Filtering** — Use the **All / Completed / Pending** pill buttons to narrow the list. The empty state message updates contextually.
5. **Stats** — The stats bar at the top updates in real time with smooth animated counters.

---

## 🔧 Customization

### Changing Colors

Edit the CSS custom properties in `:root` inside `css/style.css`:

```css
:root {
  --color-primary:       #4A90D9;  /* Main brand color */
  --color-primary-dark:  #3671B5;  /* Darker variant for gradients */
  --color-primary-light: #EAF2FB;  /* Light variant for backgrounds */
  --color-bg:            #F0F4F8;  /* Page background */
  --color-surface:       #FFFFFF;  /* Card/surface background */
  /* ... more tokens available */
}
```

### Changing the Font

Swap the Google Fonts `<link>` in `index.html` and update `--font-family` in the CSS.

---

## 🌐 Browser Support

| Browser | Supported |
|---|---|
| Chrome 80+ | ✅ |
| Firefox 75+ | ✅ |
| Edge 80+ | ✅ |
| Safari 13+ | ✅ |
| Mobile browsers | ✅ |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Inter](https://rsms.me/inter/) typeface by Rasmus Andersson
- SVG icons are inline, inspired by [Feather Icons](https://feathericons.com/)

---

<p align="center">
  Made with ❤️ &nbsp;by <strong>TaskNest</strong><br/>
  <em>Stay organized, stay productive.</em>
</p>
