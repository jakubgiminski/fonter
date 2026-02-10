# AGENTS.md — Fonter

## Project Overview

Fonter is a React 19 + TypeScript + Vite single-page application for testing Google Font pairings in realistic content layouts. No backend — browser-only.

## Build / Lint / Test Commands

```bash
# Install dependencies
npm install

# Development server (Vite with Google Fonts proxy)
npm run dev

# Type-check and build for production
npm run build          # runs: tsc -b && vite build

# Lint (ESLint 9 flat config)
npm run lint           # runs: eslint .

# Preview production build
npm run preview
```

There is no test framework configured. No test files exist. If tests are added later (likely Vitest given the Vite setup), update this section.

## Tech Stack

- **Language:** TypeScript ~5.9.3 (strict mode, `verbatimModuleSyntax`)
- **Framework:** React 19.2
- **Bundler:** Vite 7
- **Linting:** ESLint 9 (flat config) with typescript-eslint, react-hooks, react-refresh plugins
- **Formatting:** No Prettier — conventions enforced by habit (see below)
- **Package manager:** npm (lockfile committed)
- **Module system:** ESM (`"type": "module"`)

## Project Structure

```
src/
├── data/           # Data modules (fonts catalog, content snippets)
│   ├── content.ts
│   └── fonts.ts
├── hooks/          # Custom React hooks
│   └── useFontMatch.ts
├── prototypes/     # Feature components with co-located CSS
│   ├── FontMatch.tsx
│   └── fontMatch.css
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Global styles
spec/               # Product spec / design docs (markdown)
public/             # Static assets (screenshots, vite.svg)
```

## TypeScript Configuration

Strict mode is enabled with additional checks:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedSideEffectImports: true`
- `erasableSyntaxOnly: true`
- `verbatimModuleSyntax: true` — requires explicit `type` keyword on type-only imports

## Code Style Guidelines

### Never Add Comments

Do not add comments to the code. The codebase is intentionally comment-free. Write self-documenting code through clear naming instead. The only exceptions are brief notes inside `catch` blocks explaining why an error is swallowed.

### Control Flow

Always prefer multiple single `if` statements with early returns instead of `if-else-if-else` chains:

```ts
// Correct
function process(input: string | null): Result | null {
  if (!input) return null;
  if (input.length > MAX) return null;
  return doWork(input);
}

// Wrong
function process(input: string | null): Result | null {
  if (!input) {
    return null;
  } else if (input.length > MAX) {
    return null;
  } else {
    return doWork(input);
  }
}
```

### Imports

- Use **named imports** by default. Default imports only for React component modules.
- Use the inline `type` keyword for type-only imports mixed with value imports: `import { type Foo, bar } from "..."`
- Use standalone `import type { Foo }` when the entire import is types-only.
- **Ordering:** external libraries first, then local modules, then CSS/side-effect imports last.
- **Double quotes** for all import paths.
- **Relative paths** only — no path aliases configured.
- No barrel/index files. Import directly from source files.

### Formatting

- **2-space indentation**
- **Semicolons:** always
- **Double quotes** for strings in all application code
- **Trailing commas** on multi-line constructs
- JSX string props use double quotes: `className="foo"`

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `FontMatch.tsx` |
| Hook files | camelCase with `use` prefix `.ts` | `useFontMatch.ts` |
| Data/utility files | camelCase `.ts` | `fonts.ts`, `content.ts` |
| CSS files | camelCase `.css` | `fontMatch.css` |
| Directories | camelCase | `hooks/`, `prototypes/` |
| Local variables | camelCase | `normalizedQuery` |
| Module-level config constants | UPPER_SNAKE_CASE | `FONT_FACE_WAIT_TIMEOUT_MS` |
| Exported runtime constants | camelCase | `defaultFontPool`, `layoutOptions` |
| Functions | camelCase | `shuffleArray`, `loadFont` |
| React components | PascalCase | `FontSelect`, `LockButton` |
| Types & interfaces | PascalCase, no `I` prefix | `FontEntry`, `PairEngine` |
| Props interfaces | PascalCase with `Props` suffix | `FontSelectProps` |

### Types vs Interfaces

- Use `interface` for object shapes, contracts, and props.
- Use `type` for unions, aliases, tuples, and derived types (`keyof typeof`, `(typeof x)[number]`).
- Use `satisfies` for compile-time validation without widening.
- Use type predicates for narrowing in `.filter()`: `.filter((v): v is Foo => Boolean(v))`

### Functions

- **`function` declarations** for React components and utility/helper functions.
- **Arrow functions** only for callbacks, event handlers, and `useCallback`/`useMemo` bodies.
- Never use arrow functions to define components or top-level utilities.

### Async Patterns

- Always use `async`/`await` — no `.then()` chains.
- Prefix fire-and-forget async calls with `void`: `void shuffle();`
- Use `Promise.all` for parallel loading, `Promise.race` for timeouts.

### Error Handling

- `try/catch` with bare `catch {}` (no error parameter) for non-critical I/O failures (localStorage, network fetches). Add a brief comment explaining why the error is ignored.
- Return `null` for "not found" — do not throw for expected missing data.
- Reserve `throw` for true invariant violations.
- No Result/Either types. No error boundary components (yet).

### Exports

- `export default` for React components (one component per file).
- Named exports for everything else: types, interfaces, hooks, functions, constants.

### Architecture Patterns

- **Custom hooks as state machines:** encapsulate all state and side effects; return a typed state interface. Components are pure presentation.
- **Closure-based factories** over classes: e.g., `createPairEngine(fonts)` returns a `PairEngine` interface backed by closure state.
- **Ref-based mutable state** (`useRef`) for values accessed across async boundaries without triggering re-renders.
- **Prefetching:** eagerly load the next item in the background so user actions feel instant.
- No classes, no DI containers, no state management libraries, no context providers beyond `StrictMode`.
