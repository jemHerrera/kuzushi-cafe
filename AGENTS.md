# AGENTS.md

## Component Guidance

- All UI components should prioritize using shadcn components from `src/components/ui` before introducing custom primitives.
- When shadcn does not already provide the needed primitive, prefer adding the matching shadcn component before hand-rolling behavior.
- Custom Kuzushi components should compose shadcn primitives and keep app-specific styling, copy, and data mapping in `src/components/kuzushi-ui`.
- For modal UI, use shadcn `Dialog` for normal forms and overlays. Use shadcn `AlertDialog` only for destructive or interruptive confirmation flows.
- Never create unit tests.
