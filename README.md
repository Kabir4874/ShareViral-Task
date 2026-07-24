# Task Manager — React Native

A clean, production-ready, offline-first Task Manager built with **React Native**, **Expo SDK 56**, **TypeScript**, **Zustand**, and **Supabase**.

---

## 📋 Features

- **Task Management**: Create, edit, complete/reopen, and delete tasks.
- **Categories**: Browse and organize tasks by custom categories with color badges.
- **Local-Only Starred Flag**: Mark tasks as starred per-device without overwriting server data.
- **Offline-First & Local Caching**: Renders immediately from local storage cache (`MMKV` with robust fallbacks) and syncs with Supabase in the background.
- **Filter & Sort**: Filter by category and status (`open` / `done`), sort by due date or created date — decoupled cleanly outside the render tree via custom hooks.
- **300ms Debounced Search**: Fast, responsive title search without lag or unnecessary re-renders.
- **Sync Status UI**: Live offline banner, last synced timestamp, and background refresh loading indicators.

---

## 🛠️ Tech Stack

- **Framework**: Expo SDK 56 / React Native 0.85
- **Language**: TypeScript
- **State Management**: Zustand 5
- **Local Storage**: `react-native-mmkv` (with memory & `localStorage` fallback)
- **Backend / Database**: Supabase (PostgreSQL with RLS)
- **Navigation**: React Navigation v7 (Native Stack & Bottom Tabs)
- **Styling**: NativeWind (Tailwind CSS v3)
- **Quality & Git Hooks**: Husky 9 + lint-staged (ESLint & Prettier)
- **Testing**: Jest 29, `@testing-library/react-native`

---

## 🚀 Setup & Execution

### 1. Prerequisites

- Node.js (>= 18)
- npm (or yarn / pnpm)
- Expo Go app on iOS/Android (or iOS Simulator / Android Emulator)

### 2. Environment Setup

Create `.env` in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Or manually create `.env` with the following environment variables:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key_here
```

### 3. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start -c

# 3. Run automated tests
npm test
```

### 4. Code Quality & Husky Git Hooks

This repository uses **Husky** (`v9.1.7`) paired with `lint-staged` to enforce code quality automatically on every git commit:

- **Automatic Setup**: Running `npm install` automatically triggers the `prepare` script (`husky`), initializing git hooks in `.husky/`.
- **Pre-commit Checks**: On git commit, `lint-staged` automatically formats code with Prettier and checks for lint errors with ESLint across staged JS/TS files.

---

## 🗄️ Backend Schema & Seed Data Notes

The backend uses **Supabase** (PostgreSQL). Database schema and seed data SQL files are located in the `supabase/` directory.

### Table Schema (`supabase/schema.sql`)

- **`categories`**: `id` (PRIMARY KEY), `name`, `color`, `badge_bg`, `badge_text`, `created_at`
- **`tasks`**: `id` (PRIMARY KEY), `title`, `description`, `category_id` (FOREIGN KEY -> categories.id), `status` (`open` | `done`), `due_date`, `is_starred` (BOOLEAN), `created_at`
- **Row Level Security (RLS)**: Enabled with public SELECT, INSERT, UPDATE, and DELETE policies for anonymous client access.
- **Indexes**: Created on `category_id`, `status`, and `due_date` for fast querying.

### Seed Data (`supabase/seed.sql`)

Populates the database with **4 categories** (_Work_, _Personal_, _Health_, _Shopping_) and **10 sample tasks** across various statuses and due dates.

### How to Apply Schema & Seed Data to Supabase

#### Option A: Supabase Dashboard SQL Editor

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor** on the left menu.
3. Copy and run `supabase/schema.sql` to create tables, indexes, and RLS security policies.
4. Copy and run `supabase/seed.sql` to insert the initial categories and tasks.

#### Option B: Supabase CLI

If using the Supabase CLI linked to your project:

```bash
npx supabase db query --linked -f supabase/schema.sql
npx supabase db query --linked -f supabase/seed.sql
```

---

## 💾 Local Storage Choice & Reasoning

We chose **`react-native-mmkv`** as the primary local storage engine. MMKV is a high-performance key-value storage framework originally developed by WeChat, written in C++ with zero-bridge overhead via NitroModules. It operates synchronously and is up to 30x faster than standard `AsyncStorage`. For environments where native C++ TurboModules are omitted (such as Expo Go or Web), our `storage.ts` adapter includes a safe, automatic fallback to `window.localStorage` and in-memory storage maps, ensuring zero crashes across all execution environments.

---

## 🐻 State Management Choice & Reasoning

We chose **Zustand** for state management. Zustand provides a lightweight, unopinionated, hook-based store with zero boilerplate compared to Redux Toolkit. It allows atomic selectors so components only re-render when their specific slice of state changes. Zustand integrates effortlessly with custom persistence services (`cacheService.ts`), enabling seamless offline-first store initialization, background revalidation, and UI status flags (`isSyncing`, `isOffline`, `lastSyncedAt`).

---

## 🎨 Styling Choice & Reasoning (NativeWind)

We chose **NativeWind** (Tailwind CSS for React Native) for component styling. NativeWind brings Tailwind CSS v3 utility classes directly to React Native components via standard `className` props. It compiles Tailwind utility styles directly into native React Native `StyleSheet` objects at build time, ensuring zero runtime styling overhead. This approach keeps UI code declarative, maintains consistent design tokens (colors, spacing, typography, rounded corners), and eliminates repetitive `StyleSheet.create` boilerplate across screens.

---

## ⭐ Local-Only "Starred" Preservation Logic

Requirement **4.3** specifies that the `isStarred` flag is per-device and must never be overwritten when background refreshes fetch fresh data from the server.

### How It Works:

1. When a user stars or unstars a task, `cacheService.setTaskStarredLocally(taskId, isStarred)` persists the state in a dedicated local device map (`local_starred_map`).
2. When `fetchInitialData()` or `refreshData()` pulls fresh tasks from Supabase, `mergeRemoteTasksWithLocalStarred(remoteTasks, currentLocalTasks)` merges the data:

```typescript
const mergeRemoteTasksWithLocalStarred = (
  remoteTasks: Task[],
  currentLocalTasks: Task[]
): Task[] => {
  const localStarredMap = cacheService.getLocalStarredMap();
  const currentTaskMap = new Map(currentLocalTasks.map((t) => [t.id, t]));

  return remoteTasks.map((remoteTask) => {
    // 1. Check persistent local storage first
    if (Object.prototype.hasOwnProperty.call(localStarredMap, remoteTask.id)) {
      return { ...remoteTask, isStarred: localStarredMap[remoteTask.id] };
    }
    // 2. Fall back to current memory state
    const existingLocal = currentTaskMap.get(remoteTask.id);
    if (existingLocal !== undefined) {
      return { ...remoteTask, isStarred: existingLocal.isStarred };
    }
    return remoteTask;
  });
};
```

This guarantees local star preferences are 100% preserved regardless of remote database refreshes.

---

## 🧪 Testing Approach

We implemented **4 unit test suites** (10 passing tests) using **Jest** and **React Native Testing Library**:

1. **`__tests__/useFilteredTasks.test.ts`** _(Load-Bearing Requirement 4.4)_: Tests category/status filtering, title search, and sorting (by due date or creation date) outside the render tree.
2. **`__tests__/localStarredMerge.test.ts`** _(Load-Bearing Requirement 4.3)_: Tests that background remote data sync preserves local-only starred states.
3. **`__tests__/useDebounce.test.ts`** _(Technical Requirement 5)_: Tests 300ms search input debouncing behavior across timer ticks.
4. **`__tests__/TaskCard.test.tsx`**: Tests component rendering, status badge formatting, and callback interactions.

Run tests:

```bash
npm test
```

---

## ⚠️ Known Limitations

- **No Offline Mutation Queue**: Per Section 8 (Out of Scope), offline write queuing and conflict resolution are excluded. If an edit/delete occurs while offline, an alert is shown to the user and the local cache remains untouched.
- **Client-side Pagination**: FlatList renders the dataset with windowing optimizations (`keyExtractor`, `React.memo`), but server-side cursor pagination is omitted.

---

## 💡 What I Would Do Differently With Another Day

1. **TanStack Query (React Query)**: Integrate `@tanstack/react-query` for automated cache invalidation, window focus refetching, and optimistic updates with automatic rollback.
2. **SQLite / WatermelonDB**: Swap key-value MMKV for SQLite/WatermelonDB to support fast SQL queries and indexed filtering directly at the database layer for 10,000+ task lists.
3. **Micro-animations**: Add `react-native-reanimated` layout transitions for task completion checks and card dismissal swipe gestures.

---

## 🤖 AI Usage

- **Scaffolding & Boilerplate**: Used AI assistance for generating initial TypeScript interface skeletons, Expo navigation config boilerplate, and Jest test runner mocks.
- **Written from Scratch**: Core offline-first architecture, MMKV fallback storage adapter, local-only starred merge algorithm, Zustand sync state machine, and custom filter/sort hook implementation were hand-crafted and verified manually.
