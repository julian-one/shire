# Rules

## Svelte

- Never use `{@html}` or `$effect`.
- Keep components next to the route that uses them. Move one to `src/lib/components` only when more than one area uses it.

## TypeScript

- Never declare generic types or functions. The only exception is `Countable<T>` in `src/lib/types/database.ts`.
- Never use decorators or inheritance (`extends`).
- Never use `null`. Use `undefined` and optional properties (`name?: Type`). The only exception is where Engine JSON or a library option needs `null` (e.g. axios `paramsSerializer.indexes`). Convert it to `undefined` right there.
- Put constants, enums, and types that more than one module uses in `src/lib/types/`. A type or constant used by a single module lives in that module.
- Never use regular expressions. Use plain string methods instead.

## Locality of Behavior

- Inline, repeated code beats small helpers. Never extract a helper for code used once or twice.
- Once the same code appears three or four times, ask before making a helper.
- Use `try`/`catch` instead of chained handlers like `.catch(() => undefined)`.

## Readability

- Never chained ternaries.
- Prefer three plain lines over one clever line.
- Pull intermediate results into well-named variables instead of nesting expressions inline.
- No `&&`/`||` side effects, or dense one-liners.
- Always use `{}` blocks for `if`, `for`, arrow functions, and the like. Never put them on one line.

## ESLint

- Never change `eslint.config.js` or add `eslint-disable` comments. Fix the code instead.

## Responsiveness

- Every view must work on phone, tablet, and desktop.
- Build mobile-first: phone is unprefixed, tablet is `md:`, desktop is `lg:`.
- Use only Tailwind and daisyUI responsive classes. No custom media queries.

## Consistency

- Use a daisyUI component (`btn`, `card`, `menu`, etc.) before raw Tailwind utilities.
- Use daisyUI color tokens (`primary`, `base-100`, etc.), never hard-coded colors.
- No custom classes, `<style>` blocks, or arbitrary values (`w-[137px]`). Global CSS is only for theme config and fonts.
- When the same classes repeat, extract a Svelte component instead of a custom class.
