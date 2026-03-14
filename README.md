# Frontend - Task Management Dashboard

A premium, highly interactive React dashboard for managing tasks with advanced filtering, real-time feedback, and secure state management.

## 🏗 Architecture
- **Framework**: React (Vite)
- **Styling**: Modern Vanilla CSS
- **Icons**: Lucide React
- **State Management**: React Context API (AuthContext)
- **Utilities**: Custom `fetchApi` logic for secure, encrypted communication.

## 🚀 Key Features & Additional Implementations

### Dashboard Experience
- **Interactive List**: High-performance task list with clean status badges and priority indicators.
- **Micro-Animations**: Uses scaling and color transitions for a premium, tactile feel.
- **Quick Complete**: A custom toggle button that allows marking tasks as done without opening a modal.
- **Overdue Highlighting**: Tasks past their due date automatically flash **red** with a warning icon.

### Functional Pages
- **Activity Hub**: Visualized stats for task distribution (Status & Priority).
- **Preferences**: A robust page to manage user profile details and reset passwords.
- **Authentication**: Fully functional Login/Register flows with error handling.

### Search & Productivity
- **Real-time Search**: Instant filtering as you type.
- **Complex Filters**: Combine status, priority, and sort orders seamlessly.
- **Pagination**: Minimalist chevrons with a page counter (8 items per page).

---

## ⚙️ Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Client**:
   ```bash
   npm run dev
   ```

---

## 🎨 Design System
- **Font**: Inter / Roboto (via Google Fonts).
- **Color Palette**: 
    - Primary Blue: `#2563eb`
    - Success Green: `#16a34a`
    - Danger Red: `#ef4444`
    - Warning Amber: `#d97706`
- **Glassmorphism**: Subtle shadows and borders used for a premium, modern aesthetic.
