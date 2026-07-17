# Jelly effect

The current bubble is the **Button**. Its approved feel is saved as
`buttonJellyConfig` in `src/interaction.ts`:

- pointer gain: `0.01635` leading-edge px per pointer px
- spring tension: `1200`
- spring friction: `70`
- rear follow: `0.375`
- cross-axis compression: `1.08×` the elongation
- press scale: `1.1`

Future components should keep this preset unchanged and create their own strength:

```ts
const chipJellyConfig = createJellyConfig({
  drag: 0.02,
  tension: 600,
  friction: 38,
});
```

The shared effect uses a linear, button-relative tether, a spring-filtered pointer,
and one rotated ellipse whose major axis grows while its cross-axis compresses.
