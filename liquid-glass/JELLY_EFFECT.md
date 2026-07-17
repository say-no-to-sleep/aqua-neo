# Jelly effect

The current bubble is the **Button**. Its approved feel is saved as
`buttonJellyConfig` in `src/interaction.ts`:

- drag: `8`
- spring tension: `720`
- spring friction: `46`
- rear follow: `0.2`
- press scale: `1.1`

Future components should keep this preset unchanged and create their own strength:

```ts
const chipJellyConfig = createJellyConfig({
  drag: 14,
  tension: 600,
  friction: 38,
});
```

The shared effect uses an unbounded logarithmic tether, a spring-filtered pointer,
and one rotated ellipse whose major axis grows with pull distance.
