# UI maintenance

- Read DESIGN.md before UI changes. Preserve brand configuration, localized copy and content.
- Reuse the Tailwind theme and src/app/design-tokens.css for values; add new shared tokens there and document them in DESIGN.md.
- Reuse src/app/ui-primitives.css and common components for repeated UI states. Extract repeated markup/behavior into components, rather than calling code duplication a design token.
- Tags use TagControl. Header/footer text links use ui-nav-link. Standard link focus uses ui-focus-ring.
- Verify changed states in the browser at mobile/tablet/desktop widths and in both themes. Preserve visible keyboard focus, semantic link/button behavior and reduced-motion preferences.
- StyleGallery is a maintainer reference, not a package dependency.

## Completion cleanup

- After implementation, check unused files/imports/exports and duplicated logic. Confirm Next.js route entries, dynamic imports and optional configured features before removing code.
- Remove genuinely unused code; consolidate repeated behavior into an existing primitive or helper. Do not rewrite brand settings, localized copy, or content to satisfy cleanup tools.
- TypeScript noUnusedLocals/noUnusedParameters are build gates. Complete lint/tests/build and browser verification after cleanup.

## Browser automation

- Prefer Aside CLI (`aside`, or the executable path provided by the user) for browser tasks. Read aside guide before first use and aside guide repl before direct DOM/screenshot control.
- Preserve the existing profile/settings and default Guard permissions. Fall back to another browser tool only if Aside is unavailable, fails, or lacks the needed capability, and explain the fallback.
