//
// aqua2.js
//
// A is a self-contained UI framework for the web, inspired by Apple's Aqua design language.
//

(function initializeAqua() {
  const aqua = document.createElement('style');
  aqua.textContent = `
:root {
  --aqua-color:              #0071e3;
  --graphite-color:          #888888;
  --aqua-foreground:         #1d1d1f;
  --aqua-foreground-muted:   rgba(0, 0, 0, 0.38);
  --aqua-background:         rgba(0, 0, 0, 0.07);
  --aqua-border:             rgba(0, 0, 0, 0.12);
  --aqua-surface-radius:           25px;
  --aqua-container-nested-inset:   14px;
  --aqua-floating-panel-nested-inset: 12px;
}

[data-theme="dark"] {
  --aqua-color:            #1a84ff;
  --graphite-color:        #666666;
  --aqua-foreground:       #f5f5f7;
  --aqua-foreground-muted: rgba(255, 255, 255, 0.32);
  --aqua-background:       rgba(255, 255, 255, 0.10);
  --aqua-border:           rgba(255, 255, 255, 0.14);
}

@property --thumb-left {
  syntax: '<length>';
  inherits: true;
  initial-value: 0px;
}

.aqua-button, .graphite-button, .aqua-button-circular, .graphite-button-circular, .aqua-button-square, .graphite-button-square, [class$="-focused"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.aqua-button, .graphite-button, [class$="-focused"]:not([class*="circular"]):not([class*="square"]) {
  padding: 7px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.aqua-button-circular, .graphite-button-circular, [class$="-focused"][class*="circular"] {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
}

.aqua-button-square, .graphite-button-square, [class$="-focused"][class*="square"] {
  width: 30px;
  height: 30px;
  border-radius: 0px;
  flex-shrink: 0;
}

.aqua-button, .graphite-button, .aqua-button-circular, .graphite-button-circular, .aqua-button-square, .graphite-button-square {
  background: var(--aqua-background);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.08) 100%);
  color: var(--aqua-foreground);
  border: 1px solid var(--aqua-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  transition: background 0.20s ease, background-image 0.20s ease, transform 0.14s ease;
}

.aqua-button:hover, .graphite-button:hover, .aqua-button-circular:hover, .graphite-button-circular:hover, .aqua-button-square:hover, .graphite-button-square:hover {
  background: color-mix(in srgb, var(--aqua-background) 80%, currentColor 20%);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.12) 100%);
}

.aqua-button:active, .aqua-button-circular:active, .aqua-button-square:active {
  transform: scale(0.96);
  background: var(--aqua-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.18) 100%);
  border-color: transparent;
  color: var(--aqua-foreground);
}

.graphite-button:active, .graphite-button-circular:active, .graphite-button-square:active {
  transform: scale(0.96);
  background: var(--graphite-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.14) 100%);
  border-color: transparent;
}

.aqua-toggle-button, .graphite-toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: default;
  text-decoration: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: var(--aqua-background);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.08) 100%);
  color: var(--aqua-foreground);
  border: 1px solid var(--aqua-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  transition: transform 0.14s ease;
}

.aqua-toggle-button:hover, .graphite-toggle-button:hover {
  background: color-mix(in srgb, var(--aqua-background) 80%, currentColor 20%);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.12) 100%);
}

.aqua-toggle-button:active, .graphite-toggle-button:active {
  transform: scale(0.96);
}

.aqua-toggle-button:active:not([aria-pressed="true"]) {
  background: var(--aqua-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.18) 100%);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.26);
}

.graphite-toggle-button:active:not([aria-pressed="true"]) {
  background: var(--graphite-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.14) 100%);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.22);
}

.aqua-toggle-button[aria-pressed="true"] {
  background: var(--aqua-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.18) 100%);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.26);
}

.graphite-toggle-button[aria-pressed="true"] {
  background: var(--graphite-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.14) 100%);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.22);
}

.aqua-toggle-button:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--aqua-color) 22%, transparent), 0 1px 4px rgba(0,0,0,0.10);
}

.graphite-toggle-button:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--graphite-color) 24%, transparent), 0 1px 4px rgba(0,0,0,0.10);
}

[class$="-focused"] {
  border: 1px solid transparent;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.14) 100%);
  transition: transform 0.12s ease;
}

[class$="-focused"]:active {
  transform: scale(0.96);
}

[class$="-focused"]:not([class*="graphite"]) {
  color: #ffffff;
  animation: aqua-pulse 1.2s ease-in-out infinite;
}

[class$="-focused"][class*="graphite"] {
  color: #ffffff;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.10) 100%);
  animation: graphite-pulse 1.2s ease-in-out infinite;
}

@keyframes aqua-pulse {
  0%, 100% {
    background-color: color-mix(in srgb, var(--aqua-color) 75%, white);  opacity: 0.92;
  } 50%  {
    background-color: color-mix(in srgb, var(--aqua-color) 75%, black);  opacity: 1;
  }
}

@keyframes graphite-pulse {
  0%, 100% {
    background-color: color-mix(in srgb, var(--graphite-color) 30%, transparent); opacity: 0.90;
  } 50% {
    background-color: color-mix(in srgb, var(--graphite-color) 70%, transparent); opacity: 1;
  }
}

[class*="aqua-button-circular"] svg, [class*="graphite-button-circular"] svg, [class*="aqua-button-square"] svg, [class*="graphite-button-square"] svg {
  width: 18px;
  height: 18px;
  overflow: visible;
  flex-shrink: 0;
}

.aqua-chip, .graphite-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  cursor: default;
  user-select: none;
  pointer-events: none;
  color: var(--aqua-foreground);
  background: color-mix(in srgb, var(--aqua-color) 14%, var(--aqua-background));
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.00) 56%, rgba(255,255,255,0.10) 100%);
  border: 1px solid color-mix(in srgb, var(--aqua-color) 28%, var(--aqua-border));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 3px rgba(0,0,0,0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  -webkit-tap-highlight-color: transparent;
}

.graphite-chip {
  background: color-mix(in srgb, var(--graphite-color) 16%, var(--aqua-background));
  border-color: color-mix(in srgb, var(--graphite-color) 32%, var(--aqua-border));
}

.aqua-container, .graphite-container {
  position: relative;
  display: block;
  width: 100%;
  padding: var(--aqua-container-nested-inset) 16px;
  border-radius: var(--aqua-surface-radius);
  border: 1px solid color-mix(in srgb, var(--aqua-border) 86%, rgba(255,255,255,0.34));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 100%),
    color-mix(in srgb, var(--aqua-color) 5%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.32), 0 8px 20px rgba(0,0,0,0.08);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  color: var(--aqua-foreground);
}

.graphite-container {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 100%),
    color-mix(in srgb, var(--graphite-color) 7%, transparent);
}

[data-theme="dark"] .aqua-container,
[data-theme="dark"] .graphite-container {
  border-color: color-mix(in srgb, var(--aqua-border) 82%, rgba(255,255,255,0.22));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%),
    color-mix(in srgb, var(--aqua-color) 6%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 26px rgba(0,0,0,0.34);
}

[data-theme="dark"] .graphite-container {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%),
    color-mix(in srgb, var(--graphite-color) 7%, transparent);
}

.aqua-container:has(.aqua-container),
.aqua-container:has(.graphite-container),
.aqua-container:has(.aqua-graph),
.aqua-container:has(.graphite-graph),
.graphite-container:has(.aqua-container),
.graphite-container:has(.graphite-container),
.graphite-container:has(.aqua-graph),
.graphite-container:has(.graphite-graph) {
  border-radius: calc(var(--aqua-surface-radius) + var(--aqua-container-nested-inset));
}

.aqua-container .aqua-container,
.aqua-container .graphite-container,
.aqua-container .aqua-graph,
.aqua-container .graphite-graph,
.graphite-container .aqua-container,
.graphite-container .graphite-container,
.graphite-container .aqua-graph,
.graphite-container .graphite-graph {
  border-radius: var(--aqua-surface-radius);
}

.aqua-container .aqua-container:has(.aqua-container),
.aqua-container .aqua-container:has(.graphite-container),
.aqua-container .aqua-container:has(.aqua-graph),
.aqua-container .aqua-container:has(.graphite-graph),
.aqua-container .graphite-container:has(.aqua-container),
.aqua-container .graphite-container:has(.graphite-container),
.aqua-container .graphite-container:has(.aqua-graph),
.aqua-container .graphite-container:has(.graphite-graph),
.graphite-container .aqua-container:has(.aqua-container),
.graphite-container .aqua-container:has(.graphite-container),
.graphite-container .aqua-container:has(.aqua-graph),
.graphite-container .aqua-container:has(.graphite-graph),
.graphite-container .graphite-container:has(.aqua-container),
.graphite-container .graphite-container:has(.graphite-container),
.graphite-container .graphite-container:has(.aqua-graph),
.graphite-container .graphite-container:has(.graphite-graph) {
  border-radius: calc(var(--aqua-surface-radius) + var(--aqua-container-nested-inset));
}

.aqua-container:has(.aqua-container .aqua-container),
.aqua-container:has(.aqua-container .graphite-container),
.aqua-container:has(.aqua-container .aqua-graph),
.aqua-container:has(.aqua-container .graphite-graph),
.aqua-container:has(.graphite-container .aqua-container),
.aqua-container:has(.graphite-container .graphite-container),
.aqua-container:has(.graphite-container .aqua-graph),
.aqua-container:has(.graphite-container .graphite-graph),
.graphite-container:has(.aqua-container .aqua-container),
.graphite-container:has(.aqua-container .graphite-container),
.graphite-container:has(.aqua-container .aqua-graph),
.graphite-container:has(.aqua-container .graphite-graph),
.graphite-container:has(.graphite-container .aqua-container),
.graphite-container:has(.graphite-container .graphite-container),
.graphite-container:has(.graphite-container .aqua-graph),
.graphite-container:has(.graphite-container .graphite-graph) {
  border-radius: calc(var(--aqua-surface-radius) + var(--aqua-container-nested-inset) * 2);
}

.aqua-floating-panel, .graphite-floating-panel {
  position: fixed;
  z-index: 240;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  box-sizing: border-box;
  width: min(100%, 320px);
  max-width: calc(100vw - 32px);
  max-height: min(72vh, calc(100dvh - 32px));
  padding: var(--aqua-floating-panel-nested-inset) 14px;
  overflow: auto;
  border-radius: var(--aqua-surface-radius);
  border: 1px solid color-mix(in srgb, var(--aqua-border) 62%, rgba(255,255,255,0.28));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.02) 100%),
    color-mix(in srgb, var(--aqua-color) 2.5%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.24), 0 14px 36px rgba(0,0,0,0.10);
  backdrop-filter: blur(24px) saturate(125%);
  -webkit-backdrop-filter: blur(24px) saturate(125%);
  color: var(--aqua-foreground);
  -webkit-overflow-scrolling: touch;
  transform-origin: bottom right;
  will-change: transform, opacity;
}

.aqua-floating-panel:not(.aqua-floating-panel--inline):not(.aqua-floating-panel-open):not(.aqua-floating-panel-closing),
.graphite-floating-panel:not(.aqua-floating-panel--inline):not(.aqua-floating-panel-open):not(.aqua-floating-panel-closing) {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: scale(0.92) translateY(16px);
}

.aqua-floating-panel.aqua-floating-panel-open:not(.aqua-floating-panel-closing),
.graphite-floating-panel.aqua-floating-panel-open:not(.aqua-floating-panel-closing) {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: scale(1) translateY(0);
  animation: aqua-floating-panel-open 0.38s cubic-bezier(0.22,0.72,0.18,1) both;
}

.aqua-floating-panel.aqua-floating-panel-closing,
.graphite-floating-panel.aqua-floating-panel-closing {
  opacity: 1;
  pointer-events: none;
  visibility: visible;
  animation: aqua-floating-panel-close 0.28s cubic-bezier(0.4,0,0.7,0.28) both;
}

@keyframes aqua-floating-panel-open {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(16px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes aqua-floating-panel-close {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.94) translateY(12px);
  }
}

.aqua-floating-panel[data-anchor="top-left"],
.graphite-floating-panel[data-anchor="top-left"] {
  transform-origin: top left;
}

.aqua-floating-panel[data-anchor="top-right"],
.graphite-floating-panel[data-anchor="top-right"] {
  transform-origin: top right;
}

.aqua-floating-panel[data-anchor="bottom-left"],
.graphite-floating-panel[data-anchor="bottom-left"] {
  transform-origin: bottom left;
}

.graphite-floating-panel {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.015) 100%),
    color-mix(in srgb, var(--graphite-color) 3%, transparent);
}

[data-theme="dark"] .aqua-floating-panel,
[data-theme="dark"] .graphite-floating-panel {
  border-color: color-mix(in srgb, var(--aqua-border) 58%, rgba(255,255,255,0.16));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%),
    color-mix(in srgb, var(--aqua-color) 3.5%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 16px 40px rgba(0,0,0,0.32);
}

[data-theme="dark"] .graphite-floating-panel {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.008) 100%),
    color-mix(in srgb, var(--graphite-color) 3.5%, transparent);
}

.aqua-floating-panel:has(.aqua-container),
.aqua-floating-panel:has(.graphite-container),
.graphite-floating-panel:has(.aqua-container),
.graphite-floating-panel:has(.graphite-container) {
  border-radius: calc(var(--aqua-surface-radius) + var(--aqua-floating-panel-nested-inset));
}

.aqua-floating-panel .aqua-container,
.aqua-floating-panel .graphite-container,
.graphite-floating-panel .aqua-container,
.graphite-floating-panel .graphite-container {
  border-radius: var(--aqua-surface-radius);
}

.aqua-floating-panel:has(.aqua-container .aqua-container),
.aqua-floating-panel:has(.aqua-container .graphite-container),
.aqua-floating-panel:has(.graphite-container .aqua-container),
.aqua-floating-panel:has(.graphite-container .graphite-container),
.graphite-floating-panel:has(.aqua-container .aqua-container),
.graphite-floating-panel:has(.aqua-container .graphite-container),
.graphite-floating-panel:has(.graphite-container .aqua-container),
.graphite-floating-panel:has(.graphite-container .graphite-container) {
  border-radius: calc(var(--aqua-surface-radius) + var(--aqua-floating-panel-nested-inset) + var(--aqua-container-nested-inset));
}

.aqua-floating-panel .aqua-container:has(.aqua-container),
.aqua-floating-panel .aqua-container:has(.graphite-container),
.aqua-floating-panel .graphite-container:has(.aqua-container),
.aqua-floating-panel .graphite-container:has(.graphite-container),
.graphite-floating-panel .aqua-container:has(.aqua-container),
.graphite-floating-panel .aqua-container:has(.graphite-container),
.graphite-floating-panel .graphite-container:has(.aqua-container),
.graphite-floating-panel .graphite-container:has(.graphite-container) {
  border-radius: calc(var(--aqua-surface-radius) + var(--aqua-container-nested-inset));
}

.aqua-floating-panel--inline,
.graphite-floating-panel.aqua-floating-panel--inline {
  position: relative;
  z-index: 0;
  width: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
}

.aqua-floating-panel:has(> .aqua-container:only-child),
.aqua-floating-panel:has(> .graphite-container:only-child),
.graphite-floating-panel:has(> .aqua-container:only-child),
.graphite-floating-panel:has(> .graphite-container:only-child) {
  gap: 0;
}

.aqua-floating-panel > .aqua-container,
.aqua-floating-panel > .graphite-container,
.graphite-floating-panel > .aqua-container,
.graphite-floating-panel > .graphite-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 16px 18px;
}

.aqua-floating-panel-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--aqua-foreground);
}

.aqua-floating-panel-body {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--aqua-foreground-muted);
}

.aqua-floating-panel-section {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--aqua-foreground);
}

.aqua-floating-panel-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.aqua-floating-panel .aqua-container,
.aqua-floating-panel .graphite-container,
.graphite-floating-panel .aqua-container,
.graphite-floating-panel .graphite-container {
  flex-shrink: 0;
}

.aqua-floating-control-panel-backdrop {
  position: fixed;
  inset: 0;
  z-index: 255;
  background: rgba(0,0,0,0.18);
  backdrop-filter: blur(5px) saturate(92%);
  -webkit-backdrop-filter: blur(5px) saturate(92%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.32s ease, visibility 0.32s ease;
}

.aqua-floating-control-panel-backdrop.aqua-floating-control-panel-backdrop-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.aqua-floating-control-panel,
.graphite-floating-control-panel {
  --aqua-control-panel-tab-size: 44px;
  --aqua-control-panel-radius: var(--aqua-surface-radius);
  --aqua-control-panel-morph-radius: 18px;
  position: fixed;
  z-index: 270;
  top: 50%;
  right: 0;
  display: flex;
  align-items: center;
  width: min(342px, calc(100vw - 18px));
  max-height: min(78vh, calc(100dvh - 32px));
  color: var(--aqua-foreground);
  transform: translate(calc(100% - var(--aqua-control-panel-tab-size)), -50%);
  transition: transform 0.56s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.aqua-floating-control-panel[data-side="left"],
.graphite-floating-control-panel[data-side="left"] {
  left: 0;
  right: auto;
  flex-direction: row-reverse;
  transform: translate(calc(-100% + var(--aqua-control-panel-tab-size)), -50%);
}

.aqua-floating-control-panel.aqua-floating-control-panel-open,
.graphite-floating-control-panel.aqua-floating-control-panel-open {
  transform: translate(-16px, -50%);
}

.aqua-floating-control-panel.aqua-floating-control-panel-closing,
.graphite-floating-control-panel.aqua-floating-control-panel-closing {
  transform: translate(calc(100% - var(--aqua-control-panel-tab-size)), -50%);
}

.aqua-floating-control-panel[data-side="left"].aqua-floating-control-panel-open,
.graphite-floating-control-panel[data-side="left"].aqua-floating-control-panel-open {
  transform: translate(16px, -50%);
}

.aqua-floating-control-panel[data-side="left"].aqua-floating-control-panel-closing,
.graphite-floating-control-panel[data-side="left"].aqua-floating-control-panel-closing {
  transform: translate(calc(-100% + var(--aqua-control-panel-tab-size)), -50%);
}

.aqua-floating-control-panel-tab {
  flex: 0 0 var(--aqua-control-panel-tab-size);
  width: var(--aqua-control-panel-tab-size);
  min-height: 64px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--aqua-border) 64%, rgba(255,255,255,0.30));
  border-right: 0;
  border-radius: 18px 0 0 18px;
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.035) 100%),
    color-mix(in srgb, var(--aqua-color) 8%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.30), -7px 10px 22px rgba(0,0,0,0.10);
  backdrop-filter: blur(18px) saturate(130%);
  -webkit-backdrop-filter: blur(18px) saturate(130%);
  color: var(--aqua-foreground);
  cursor: default;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  font-size: 0;
  letter-spacing: 0;
  transition:
    opacity 0.22s ease,
    transform 0.36s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.18s ease;
}

.aqua-floating-control-panel-tab::before {
  content: "";
  width: 11px;
  height: 11px;
  border-left: 2.5px solid currentColor;
  border-bottom: 2.5px solid currentColor;
  border-radius: 1px;
  transform: rotate(45deg);
}

.aqua-floating-control-panel[data-side="left"] .aqua-floating-control-panel-tab::before,
.graphite-floating-control-panel[data-side="left"] .aqua-floating-control-panel-tab::before {
  transform: rotate(225deg);
}

.aqua-floating-control-panel.aqua-floating-control-panel-open .aqua-floating-control-panel-tab,
.aqua-floating-control-panel.aqua-floating-control-panel-opening .aqua-floating-control-panel-tab,
.aqua-floating-control-panel.aqua-floating-control-panel-closing .aqua-floating-control-panel-tab,
.graphite-floating-control-panel.aqua-floating-control-panel-open .aqua-floating-control-panel-tab,
.graphite-floating-control-panel.aqua-floating-control-panel-opening .aqua-floating-control-panel-tab,
.graphite-floating-control-panel.aqua-floating-control-panel-closing .aqua-floating-control-panel-tab {
  opacity: 0;
  pointer-events: none;
  transform: translateX(18px) scale(0.72);
}

.aqua-floating-control-panel[data-side="left"].aqua-floating-control-panel-open .aqua-floating-control-panel-tab,
.aqua-floating-control-panel[data-side="left"].aqua-floating-control-panel-opening .aqua-floating-control-panel-tab,
.aqua-floating-control-panel[data-side="left"].aqua-floating-control-panel-closing .aqua-floating-control-panel-tab,
.graphite-floating-control-panel[data-side="left"].aqua-floating-control-panel-open .aqua-floating-control-panel-tab,
.graphite-floating-control-panel[data-side="left"].aqua-floating-control-panel-opening .aqua-floating-control-panel-tab,
.graphite-floating-control-panel[data-side="left"].aqua-floating-control-panel-closing .aqua-floating-control-panel-tab {
  transform: translateX(-18px) scale(0.72);
}

.aqua-floating-control-panel[data-side="left"] .aqua-floating-control-panel-tab,
.graphite-floating-control-panel[data-side="left"] .aqua-floating-control-panel-tab {
  border-right: 1px solid color-mix(in srgb, var(--aqua-border) 64%, rgba(255,255,255,0.30));
  border-left: 0;
  border-radius: 0 18px 18px 0;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.30), 7px 10px 22px rgba(0,0,0,0.10);
}

.aqua-floating-control-panel-tab:hover {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.055) 100%),
    color-mix(in srgb, var(--aqua-color) 12%, transparent);
}

.aqua-floating-control-panel-surface {
  flex: 1 1 auto;
  min-width: 0;
  max-height: inherit;
  overflow: auto;
  padding: 16px;
  border-radius: var(--aqua-control-panel-morph-radius);
  border: 1px solid color-mix(in srgb, var(--aqua-border) 62%, rgba(255,255,255,0.30));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.026) 100%),
    color-mix(in srgb, var(--aqua-color) 3.5%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 18px 46px rgba(0,0,0,0.18);
  backdrop-filter: blur(28px) saturate(140%);
  -webkit-backdrop-filter: blur(28px) saturate(140%);
  transform: translateX(10px) scale(0.985);
  transform-origin: right center;
  opacity: 0.88;
  filter: saturate(0.94) brightness(1.03);
  transition:
    border-radius 0.48s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.24s ease,
    opacity 0.24s ease,
    transform 0.48s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: border-radius, filter, opacity, transform;
  -webkit-overflow-scrolling: touch;
}

.aqua-floating-control-panel[data-side="left"] .aqua-floating-control-panel-surface,
.graphite-floating-control-panel[data-side="left"] .aqua-floating-control-panel-surface {
  transform-origin: left center;
  transform: translateX(-10px) scale(0.985);
}

.aqua-floating-control-panel.aqua-floating-control-panel-open .aqua-floating-control-panel-surface,
.graphite-floating-control-panel.aqua-floating-control-panel-open .aqua-floating-control-panel-surface {
  border-radius: var(--aqua-control-panel-radius);
  transform: translateX(0) scale(1);
  opacity: 1;
  filter: saturate(1) brightness(1);
}

.aqua-floating-control-panel[data-side="left"].aqua-floating-control-panel-opening .aqua-floating-control-panel-surface,
.graphite-floating-control-panel[data-side="left"].aqua-floating-control-panel-opening .aqua-floating-control-panel-surface {
  animation-name: aqua-floating-control-panel-surface-open-left;
}

.aqua-floating-control-panel[data-side="left"].aqua-floating-control-panel-closing .aqua-floating-control-panel-surface,
.graphite-floating-control-panel[data-side="left"].aqua-floating-control-panel-closing .aqua-floating-control-panel-surface {
  animation-name: aqua-floating-control-panel-surface-close-left;
}

.aqua-floating-control-panel.aqua-floating-control-panel-opening .aqua-floating-control-panel-surface,
.graphite-floating-control-panel.aqua-floating-control-panel-opening .aqua-floating-control-panel-surface {
  animation: aqua-floating-control-panel-surface-open 0.54s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.aqua-floating-control-panel.aqua-floating-control-panel-closing .aqua-floating-control-panel-surface,
.graphite-floating-control-panel.aqua-floating-control-panel-closing .aqua-floating-control-panel-surface {
  animation: aqua-floating-control-panel-surface-close 0.34s cubic-bezier(0.4,0,0.7,0.28) both;
}

@keyframes aqua-floating-control-panel-surface-open {
  0% {
    border-radius: var(--aqua-control-panel-morph-radius);
    transform: translateX(10px) scale(0.985);
    opacity: 0.88;
    filter: saturate(0.94) brightness(1.03);
  }
  58% {
    transform: translateX(-3px) scale(1.006);
  }
  100% {
    border-radius: var(--aqua-control-panel-radius);
    transform: translateX(0) scale(1);
    opacity: 1;
    filter: saturate(1) brightness(1);
  }
}

@keyframes aqua-floating-control-panel-surface-close {
  0% {
    border-radius: var(--aqua-control-panel-radius);
    transform: translateX(0) scale(1);
    opacity: 1;
    filter: saturate(1) brightness(1);
  }
  100% {
    border-radius: var(--aqua-control-panel-morph-radius);
    transform: translateX(10px) scale(0.985);
    opacity: 0.88;
    filter: saturate(0.94) brightness(1.03);
  }
}

@keyframes aqua-floating-control-panel-surface-open-left {
  0% {
    border-radius: var(--aqua-control-panel-morph-radius);
    transform: translateX(-10px) scale(0.985);
    opacity: 0.88;
    filter: saturate(0.94) brightness(1.03);
  }
  58% {
    transform: translateX(3px) scale(1.006);
  }
  100% {
    border-radius: var(--aqua-control-panel-radius);
    transform: translateX(0) scale(1);
    opacity: 1;
    filter: saturate(1) brightness(1);
  }
}

@keyframes aqua-floating-control-panel-surface-close-left {
  0% {
    border-radius: var(--aqua-control-panel-radius);
    transform: translateX(0) scale(1);
    opacity: 1;
    filter: saturate(1) brightness(1);
  }
  100% {
    border-radius: var(--aqua-control-panel-morph-radius);
    transform: translateX(-10px) scale(0.985);
    opacity: 0.88;
    filter: saturate(0.94) brightness(1.03);
  }
}

.graphite-floating-control-panel .aqua-floating-control-panel-tab {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 100%),
    color-mix(in srgb, var(--graphite-color) 9%, transparent);
}

.graphite-floating-control-panel .aqua-floating-control-panel-tab:hover {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 100%),
    color-mix(in srgb, var(--graphite-color) 13%, transparent);
}

.graphite-floating-control-panel .aqua-floating-control-panel-surface {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.02) 100%),
    color-mix(in srgb, var(--graphite-color) 4%, transparent);
}

[data-theme="dark"] .aqua-floating-control-panel-backdrop {
  background: rgba(0,0,0,0.34);
}

[data-theme="dark"] .aqua-floating-control-panel-tab {
  border-color: color-mix(in srgb, var(--aqua-border) 62%, rgba(255,255,255,0.18));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 100%),
    color-mix(in srgb, var(--aqua-color) 8%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), -7px 10px 22px rgba(0,0,0,0.30);
}

[data-theme="dark"] .aqua-floating-control-panel-surface {
  border-color: color-mix(in srgb, var(--aqua-border) 60%, rgba(255,255,255,0.16));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 100%),
    color-mix(in srgb, var(--aqua-color) 4%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 20px 52px rgba(0,0,0,0.42);
}

.aqua-tooltip, .graphite-tooltip {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 360;
  box-sizing: border-box;
  max-width: min(320px, calc(100vw - 16px));
  padding: 7px 10px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--aqua-border) 58%, rgba(255,255,255,0.34));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%),
    color-mix(in srgb, var(--aqua-color) 2.5%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), 0 10px 26px rgba(0,0,0,0.12);
  backdrop-filter: blur(18px) saturate(118%);
  -webkit-backdrop-filter: blur(18px) saturate(118%);
  color: var(--aqua-foreground);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: 0;
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(3px) scale(0.98);
  transition: opacity 0.14s ease, transform 0.18s cubic-bezier(0.22,0.72,0.18,1), visibility 0.14s ease;
}

.graphite-tooltip {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.02) 100%),
    color-mix(in srgb, var(--graphite-color) 3%, transparent);
}

[data-theme="dark"] .aqua-tooltip,
[data-theme="dark"] .graphite-tooltip {
  border-color: color-mix(in srgb, var(--aqua-border) 56%, rgba(255,255,255,0.18));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.012) 100%),
    color-mix(in srgb, var(--aqua-color) 3%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.11), 0 12px 30px rgba(0,0,0,0.34);
}

[data-theme="dark"] .graphite-tooltip {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%),
    color-mix(in srgb, var(--graphite-color) 3.5%, transparent);
}

.aqua-tooltip.aqua-tooltip-open,
.graphite-tooltip.aqua-tooltip-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.aqua-code-block, .graphite-code-block {
  display: block;
  width: 100%;
  max-height: 220px;
  overflow: auto;
  border-radius: var(--aqua-surface-radius);
  border: 1px solid color-mix(in srgb, var(--aqua-border) 86%, rgba(255,255,255,0.34));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%),
    color-mix(in srgb, var(--aqua-color) 5%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 8px 20px rgba(0,0,0,0.08);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  color: var(--aqua-foreground);
  font-family: "Monaco", "Menlo", "Consolas", "Lucida Console", monospace;
  font-size: 12px;
  line-height: 1.55;
  tab-size: 2;
}

.graphite-code-block {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.035) 100%),
    color-mix(in srgb, var(--graphite-color) 6%, transparent);
}

.aqua-code-block pre, .graphite-code-block pre {
  margin: 0;
  min-width: max-content;
  counter-reset: aqua-code-line;
}

.aqua-code-line {
  display: block;
  position: relative;
  min-height: 1.55em;
  padding: 0 16px 0 52px;
  white-space: pre;
  counter-increment: aqua-code-line;
}

.aqua-code-line:first-child {
  padding-top: 12px;
}

.aqua-code-line:last-child {
  padding-bottom: 12px;
}

.aqua-code-line::before {
  content: counter(aqua-code-line);
  position: absolute;
  left: 0;
  top: 0;
  width: 38px;
  padding-right: 10px;
  color: var(--aqua-foreground-muted);
  text-align: right;
  user-select: none;
}

.aqua-code-line:first-child::before {
  top: 12px;
}

[data-theme="dark"] .aqua-code-block,
[data-theme="dark"] .graphite-code-block {
  border-color: color-mix(in srgb, var(--aqua-border) 82%, rgba(255,255,255,0.22));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%),
    color-mix(in srgb, var(--aqua-color) 6%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 26px rgba(0,0,0,0.34);
}

[data-theme="dark"] .graphite-code-block {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%),
    color-mix(in srgb, var(--graphite-color) 7%, transparent);
}

.aqua-text-button-group {
  display: inline-flex;
  align-items: center;
  gap: 16px;
}

.aqua-text-button, .graphite-text-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--aqua-foreground-muted);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;
  cursor: default;
  text-decoration: none;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.16s ease, opacity 0.16s ease, transform 0.12s ease;
}

.aqua-text-button[aria-pressed="true"], .graphite-text-button[aria-pressed="true"] {
  color: #000000;
}

[data-theme="dark"] .aqua-text-button[aria-pressed="true"],
[data-theme="dark"] .graphite-text-button[aria-pressed="true"] {
  color: #ffffff;
}

.aqua-text-button:hover, .graphite-text-button:hover {
  color: color-mix(in srgb, var(--aqua-foreground) 72%, var(--aqua-foreground-muted));
}

.aqua-text-button:active, .graphite-text-button:active {
  color: var(--aqua-foreground);
  transform: scale(0.96);
}

.aqua-text-button[aria-pressed="true"]:hover,
.graphite-text-button[aria-pressed="true"]:hover,
.aqua-text-button[aria-pressed="true"]:active,
.graphite-text-button[aria-pressed="true"]:active {
  color: #000000;
}

[data-theme="dark"] .aqua-text-button[aria-pressed="true"]:hover,
[data-theme="dark"] .graphite-text-button[aria-pressed="true"]:hover,
[data-theme="dark"] .aqua-text-button[aria-pressed="true"]:active,
[data-theme="dark"] .graphite-text-button[aria-pressed="true"]:active {
  color: #ffffff;
}

.aqua-text-button:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--aqua-color) 22%, transparent);
}

.graphite-text-button:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--graphite-color) 24%, transparent);
}

.aqua-radio, .graphite-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: default;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.aqua-radio input[type="radio"], .graphite-radio input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.aqua-radio-control {
  position: relative;
  width: 20px;
  height: 20px;
  pointer-events: none;
  flex-shrink: 0;
}

.aqua-radio-control::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse 80% 55% at 50% 18%, rgba(255,255,255,0.45) 0%, transparent 70%), linear-gradient(to bottom, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.00) 58%, rgba(255,255,255,0.10) 100%), var(--aqua-background);
  border: 1.5px solid var(--aqua-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.20s ease, border-color 0.20s ease;
}

.aqua-radio-control::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  border-radius: 50%;
  background: transparent;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.22s cubic-bezier(0.34,1.5,0.64,1), opacity 0.18s ease;
}


.aqua-radio input[type="radio"]:checked + .aqua-radio-control::before {
  background: radial-gradient(ellipse 80% 55% at 50% 18%, rgba(255,255,255,0.40) 0%, transparent 68%), linear-gradient(to bottom, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 50%, rgba(255,255,255,0.18) 100%), var(--aqua-color);
  border-color: var(--aqua-color);
}

.graphite-radio input[type="radio"]:checked + .aqua-radio-control::before {
  background: radial-gradient(ellipse 80% 55% at 50% 18%, rgba(255,255,255,0.32) 0%, transparent 68%), linear-gradient(to bottom, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.00) 50%, rgba(255,255,255,0.14) 100%), var(--graphite-color);
  border-color: var(--graphite-color);
}

.aqua-radio input[type="radio"]:checked + .aqua-radio-control::after, .graphite-radio input[type="radio"]:checked + .aqua-radio-control::after {
  background: var(--aqua-foreground);
  transform: scale(1);
  opacity: 1;
}

.aqua-radio-label {
  font-size: 14px;
  font-weight: 400;
  color: var(--aqua-foreground);
  line-height: 1;
}

.aqua-checkbox, .graphite-checkbox, .aqua-checkbox-chip, .graphite-checkbox-chip {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  cursor: default;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.aqua-checkbox input[type="checkbox"], .graphite-checkbox input[type="checkbox"], .aqua-checkbox-chip input[type="checkbox"], .graphite-checkbox-chip input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.aqua-checkbox-control {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 5px;
  background: radial-gradient(ellipse 90% 60% at 50% 18%, rgba(255,255,255,0.40) 0%, transparent 68%), linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.10) 100%), var(--aqua-background);
  border: 1.5px solid var(--aqua-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.14);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.22s cubic-bezier(0.34,1.55,0.64,1);
  overflow: visible;
}

.aqua-checkbox-left, .aqua-checkbox-right {
  position: absolute;
  background: transparent;
  border-radius: 2px;
  transform-origin: left center;
  transition: none;
}

.aqua-checkbox-left  {
  width: 10px;
  height: 2.5px;
  bottom: 4px;
  left: 10px;
  transform: rotate(-135deg) scaleX(0);
}

.aqua-checkbox-right {
  width: 20px;
  height: 2.5px;
  bottom: 4px;
  left: 8.5px;
  transform: rotate(-45deg) scaleX(0);
}

.aqua-checkbox-control.settling {
  animation: checkbox-settle 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
}

.aqua-checkbox input[type="checkbox"]:checked + .aqua-checkbox-control, .aqua-checkbox-chip input[type="checkbox"]:checked + .aqua-checkbox-control {
  background: radial-gradient(ellipse 90% 60% at 50% 18%, rgba(255,255,255,0.36) 0%, transparent 66%), linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.16) 100%), var(--aqua-color);
  border-color: var(--aqua-color);
}


.graphite-checkbox input[type="checkbox"]:checked + .aqua-checkbox-control, .graphite-checkbox-chip input[type="checkbox"]:checked + .aqua-checkbox-control {
  background: radial-gradient(ellipse 90% 60% at 50% 18%, rgba(255,255,255,0.28) 0%, transparent 66%), linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.14) 100%), var(--graphite-color);
  border-color: var(--graphite-color);
}

.aqua-checkbox input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-left, .graphite-checkbox input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-left, .aqua-checkbox-chip input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-left, .graphite-checkbox-chip input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-left {
  background: var(--aqua-foreground);
  transform: rotate(-135deg) scaleX(1);
  transition: transform 0.14s ease 0s;
}

.aqua-checkbox input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-right, .graphite-checkbox input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-right, .aqua-checkbox-chip input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-right, .graphite-checkbox-chip input[type="checkbox"]:checked + .aqua-checkbox-control .aqua-checkbox-right {
  background: var(--aqua-foreground);
  transform: rotate(-45deg) scaleX(1);
  transition: transform 0.18s ease 0.08s;
}

.aqua-checkbox input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-left, .graphite-checkbox input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-left, .aqua-checkbox-chip input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-left, .graphite-checkbox-chip input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-left {
  transform: rotate(-135deg) scaleX(0);
  transition: transform 0.10s ease;
}

.aqua-checkbox input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-right, .graphite-checkbox input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-right, .aqua-checkbox-chip input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-right, .graphite-checkbox-chip input[type="checkbox"]:not(:checked) + .aqua-checkbox-control .aqua-checkbox-right {
  transform: rotate(-45deg) scaleX(0);
  transition: transform 0.10s ease;
}

@keyframes checkbox-settle {
  0% {
    transform: scale(1);
  } 40% {
    transform: scale(0.96);
  } 100% {
    transform: scale(1);
  }
}

.aqua-checkbox-label {
  font-size: 14px;
  font-weight: 400;
  color: var(--aqua-foreground);
  line-height: 1;
}

.aqua-checkbox-chip, .graphite-checkbox-chip {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 8px 12px;
  border-radius: var(--aqua-surface-radius);
  border: 1px solid color-mix(in srgb, var(--aqua-border) 85%, rgba(255,255,255,0.36));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.04) 100%),
    color-mix(in srgb, var(--aqua-color) 5%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 2px 10px rgba(0,0,0,0.08);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  cursor: default;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

.graphite-checkbox-chip {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.035) 100%),
    color-mix(in srgb, var(--graphite-color) 6%, transparent);
}

.aqua-checkbox-chip:has(input[type="checkbox"]:checked) {
  border-color: color-mix(in srgb, var(--aqua-color) 44%, var(--aqua-border));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 100%),
    color-mix(in srgb, var(--aqua-color) 13%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.34), 0 3px 12px color-mix(in srgb, var(--aqua-color) 22%, transparent);
}

.graphite-checkbox-chip:has(input[type="checkbox"]:checked) {
  border-color: color-mix(in srgb, var(--graphite-color) 50%, var(--aqua-border));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 100%),
    color-mix(in srgb, var(--graphite-color) 15%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 3px 12px color-mix(in srgb, var(--graphite-color) 24%, transparent);
}

.aqua-checkbox-chip.pressing, .graphite-checkbox-chip.pressing {
  transform: scale(0.975);
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.14), 0 1px 6px rgba(0,0,0,0.10);
}

[data-theme="dark"] .aqua-checkbox-chip,
[data-theme="dark"] .graphite-checkbox-chip {
  border-color: color-mix(in srgb, var(--aqua-border) 80%, rgba(255,255,255,0.22));
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 100%),
    color-mix(in srgb, var(--aqua-color) 6%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 3px 12px rgba(0,0,0,0.28);
}

[data-theme="dark"] .graphite-checkbox-chip {
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 100%),
    color-mix(in srgb, var(--graphite-color) 7%, transparent);
}

.aqua-graph, .graphite-graph {
  --aqua-graph-line: var(--aqua-color);
  position: relative;
  display: block;
  width: 100%;
  min-height: 132px;
  border-radius: var(--aqua-surface-radius);
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--aqua-border) 78%, rgba(255,255,255,0.40));
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 30px,
      color-mix(in srgb, var(--aqua-foreground) 10%, transparent) 31px,
      transparent 32px
    ),
    linear-gradient(to bottom, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.05) 100%),
    color-mix(in srgb, var(--aqua-color) 4%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.42), 0 8px 22px rgba(0,0,0,0.10);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
}

.aqua-interactive-graph,
.graphite-interactive-graph {
  cursor: crosshair;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.aqua-interactive-graph.is-dragging,
.graphite-interactive-graph.is-dragging {
  cursor: grabbing;
}

.graphite-graph {
  --aqua-graph-line: var(--graphite-color);
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 30px,
      color-mix(in srgb, var(--aqua-foreground) 10%, transparent) 31px,
      transparent 32px
    ),
    linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%),
    color-mix(in srgb, var(--graphite-color) 6%, transparent);
}

.aqua-graph svg, .graphite-graph svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.aqua-graph-area {
  fill: color-mix(in srgb, var(--aqua-graph-line) 12%, transparent);
}

.aqua-graph-line {
  fill: none;
  stroke: var(--aqua-graph-line);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 5px color-mix(in srgb, var(--aqua-graph-line) 58%, transparent));
}

.aqua-graph-hit {
  fill: transparent;
  pointer-events: all;
}

.aqua-graph-guide {
  stroke: color-mix(in srgb, var(--aqua-graph-line) 45%, transparent);
  stroke-width: 1;
  stroke-dasharray: 4 5;
  opacity: 0;
  transition: opacity 0.16s ease;
  pointer-events: none;
}

.aqua-graph-handle {
  position: absolute;
  z-index: 1;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--aqua-graph-line);
  border: 2px solid rgba(255,255,255,0.82);
  opacity: 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.18), 0 0 7px color-mix(in srgb, var(--aqua-graph-line) 42%, transparent);
  transform: translate(-50%, -50%);
  transition: opacity 0.16s ease;
  pointer-events: none;
}

.aqua-interactive-graph:hover .aqua-graph-guide,
.aqua-interactive-graph:focus-visible .aqua-graph-guide,
.aqua-interactive-graph.is-dragging .aqua-graph-guide,
.graphite-interactive-graph:hover .aqua-graph-guide,
.graphite-interactive-graph:focus-visible .aqua-graph-guide,
.graphite-interactive-graph.is-dragging .aqua-graph-guide,
.aqua-interactive-graph:hover .aqua-graph-handle,
.aqua-interactive-graph:focus-visible .aqua-graph-handle,
.aqua-interactive-graph.is-dragging .aqua-graph-handle,
.graphite-interactive-graph:hover .aqua-graph-handle,
.graphite-interactive-graph:focus-visible .aqua-graph-handle,
.graphite-interactive-graph.is-dragging .aqua-graph-handle {
  opacity: 1;
}

[data-theme="dark"] .aqua-graph,
[data-theme="dark"] .graphite-graph {
  border-color: color-mix(in srgb, var(--aqua-border) 82%, rgba(255,255,255,0.22));
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 30px,
      color-mix(in srgb, var(--aqua-foreground) 12%, transparent) 31px,
      transparent 32px
    ),
    linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 100%),
    color-mix(in srgb, var(--aqua-color) 6%, transparent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 26px rgba(0,0,0,0.34);
}

[data-theme="dark"] .graphite-graph {
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 30px,
      color-mix(in srgb, var(--aqua-foreground) 12%, transparent) 31px,
      transparent 32px
    ),
    linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 100%),
    color-mix(in srgb, var(--graphite-color) 7%, transparent);
}

.aqua-input-wrap {
  display: inline-block;
  position: relative;
  border-radius: 999px;
}

.aqua-input, .graphite-input {
  display: block;
  width: 100%;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 400;
  color: var(--aqua-foreground);
  background: var(--aqua-background);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.08) 100%);
  border: 1.5px solid var(--aqua-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  -webkit-appearance: none;
}

.aqua-input::placeholder, .graphite-input::placeholder {
  color: var(--aqua-foreground-muted);
}

.aqua-input:focus {
  border-color: var(--aqua-color);
  box-shadow: 0 0 0 3.5px color-mix(in srgb, var(--aqua-color) 50%, transparent), 0 1px 4px rgba(0,0,0,0.10);
}

.graphite-input:focus {
  border-color: var(--graphite-color);
  box-shadow: 0 0 0 3.5px color-mix(in srgb, var(--graphite-color) 38%, transparent), 0 1px 4px rgba(0,0,0,0.10);
}

[data-theme="light"] .aqua-input:focus, [data-theme="light"] .graphite-input:focus {
  background: rgba(255,255,255,0.72);
}

[data-theme="dark"] .aqua-input:focus, [data-theme="dark"] .graphite-input:focus {
  background: rgba(255,255,255,0.16);
}

.aqua-select {
  position: relative;
  display: inline-block;
  min-width: 160px;
}

.aqua-select-trigger {
  display: flex;
  align-items: stretch;
  border-radius: 999px;
  background: var(--aqua-background);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.08) 100%);
  border: 1.5px solid var(--aqua-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: default;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
  transform: translateZ(0);
  transition:
    border-color 0.18s ease,
    border-radius 0.42s cubic-bezier(0.16,1,0.3,1),
    background 0.24s ease,
    box-shadow 0.34s ease,
    opacity 0.18s ease,
    transform 0.34s cubic-bezier(0.16,1,0.3,1);
}

.aqua-select-value-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 8px 10px 8px 19px;
  min-width: 0;
}

.aqua-select-value {
  font-size: 14px;
  font-weight: 400;
  color: var(--aqua-foreground-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.18s;
  flex: 1;
}

.aqua-select-value.selected {
  color: var(--aqua-foreground);
}

.aqua-select-cap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  flex-shrink: 0;
  background: transparent;
  background-image: none;
  border-radius: 0 999px 999px 0;
  border-left: 0;
  transition:
    background 0.18s ease,
    border-radius 0.42s cubic-bezier(0.16,1,0.3,1),
    filter 0.24s ease;
}

.graphite-select .aqua-select-cap {
  background: transparent;
  background-image: none;
}

.aqua-select-cap svg {
  width: 13px;
  height: 18px;
  flex-shrink: 0;
}

.aqua-select-cap svg path {
  stroke: var(--aqua-color);
}

.graphite-select .aqua-select-cap svg path {
  stroke: var(--graphite-color);
}

.aqua-select.open {
  z-index: 300;
}

.aqua-select-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  min-width: 100%;
  --aqua-select-panel-radius: 16px;
  --aqua-select-panel-height: auto;
  --aqua-select-morph-radius: 72px;
  --aqua-select-collapsed-height: 38px;
  --aqua-select-translate-y: 0px;
  --aqua-select-inner-translate-y: 0px;
  background:
    linear-gradient(to bottom, rgba(255,255,255,0.90) 0%, rgba(244,250,255,0.84) 100%),
    color-mix(in srgb, var(--aqua-color) 10%, rgba(255,255,255,0.76));
  border: 1.5px solid rgba(255,255,255,0.74);
  border-radius: var(--aqua-select-morph-radius);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  box-shadow:
    0 18px 52px rgba(0,0,0,0.24),
    0 5px 16px rgba(0,0,0,0.12),
    0 1px 0 rgba(255,255,255,0.78) inset;
  box-sizing: border-box;
  overflow: hidden;
  height: var(--aqua-select-collapsed-height);
  opacity: 0;
  pointer-events: none;
  filter: saturate(0.92) brightness(1.03);
  transform: scaleX(0.985) translateY(var(--aqua-select-translate-y));
  transform-origin: top center;
  transition:
    opacity 0.12s ease,
    filter 0.20s ease;
  will-change: height, border-radius, transform, filter;
  z-index: 2147483647;
}

.aqua-select-panel-inner {
  transform: translateY(var(--aqua-select-inner-translate-y));
  will-change: transform;
}

[data-theme="dark"] .aqua-select-panel {
  background:
    linear-gradient(to bottom, rgba(45,55,72,0.94) 0%, rgba(18,26,38,0.90) 100%),
    color-mix(in srgb, var(--aqua-color) 12%, rgba(7,14,24,0.86));
  border-color: rgba(255,255,255,0.22);
  box-shadow:
    0 22px 54px rgba(0,0,0,0.44),
    0 4px 16px rgba(0,0,0,0.24),
    0 1px 0 rgba(255,255,255,0.12) inset;
}

.aqua-select-panel.aqua-select-panel-above {
  transform-origin: bottom center;
}

.aqua-select.open .aqua-select-panel,
.aqua-select-panel.aqua-select-panel-open {
  opacity: 1;
  pointer-events: auto;
  filter: saturate(1) brightness(1);
  height: var(--aqua-select-panel-height, auto);
  border-radius: var(--aqua-select-panel-radius);
  transform: scaleX(1) translateY(0);
}

.aqua-select.open .aqua-select-panel .aqua-select-panel-inner,
.aqua-select-panel.aqua-select-panel-open .aqua-select-panel-inner {
  transform: translateY(0);
}

.aqua-select-panel.aqua-select-panel-open {
  animation: aqua-select-panel-open 0.36s cubic-bezier(0.22,0.72,0.18,1) both;
}

.aqua-select-panel.aqua-select-panel-open .aqua-select-panel-inner {
  animation: aqua-select-inner-open 0.36s cubic-bezier(0.22,0.72,0.18,1) both;
}

.aqua-select-panel.aqua-select-panel-closing {
  opacity: 1;
  pointer-events: none;
  animation: aqua-select-panel-close 0.26s cubic-bezier(0.4,0,0.7,0.28) both;
}

.aqua-select-panel.aqua-select-panel-closing .aqua-select-panel-inner {
  animation: aqua-select-inner-close 0.26s cubic-bezier(0.4,0,0.7,0.28) both;
}

@keyframes aqua-select-panel-open {
  0% {
    height: var(--aqua-select-collapsed-height);
    border-radius: var(--aqua-select-morph-radius);
    transform: scaleX(0.985) translateY(var(--aqua-select-translate-y));
    filter: saturate(0.92) brightness(1.03);
  }
  100% {
    height: var(--aqua-select-panel-height);
    border-radius: var(--aqua-select-panel-radius);
    transform: scaleX(1) translateY(0);
    filter: saturate(1) brightness(1);
  }
}

@keyframes aqua-select-panel-close {
  0% {
    height: var(--aqua-select-panel-height);
    border-radius: var(--aqua-select-panel-radius);
    transform: scaleX(1) translateY(0);
    filter: saturate(1) brightness(1);
  }
  100% {
    height: var(--aqua-select-collapsed-height);
    border-radius: var(--aqua-select-morph-radius);
    transform: scaleX(0.985) translateY(var(--aqua-select-translate-y));
    filter: saturate(0.92) brightness(1.03);
  }
}

@keyframes aqua-select-inner-open {
  0% { transform: translateY(var(--aqua-select-inner-translate-y)); }
  100% { transform: translateY(0); }
}

@keyframes aqua-select-inner-close {
  0% { transform: translateY(0); }
  100% { transform: translateY(var(--aqua-select-inner-translate-y)); }
}

.aqua-select.open .aqua-select-trigger {
  border-color: color-mix(in srgb, var(--aqua-color) 45%, var(--aqua-border));
  border-radius: 18px 18px 10px 10px;
  opacity: 0;
  transform: scale(0.985);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--aqua-color) 18%, transparent),
    0 10px 24px color-mix(in srgb, var(--aqua-color) 20%, transparent),
    0 1px 4px rgba(0,0,0,0.10);
}

.aqua-select.closing .aqua-select-trigger {
  opacity: 0;
  transform: scale(0.985);
}

.graphite-select.open .aqua-select-trigger {
  border-color: color-mix(in srgb, var(--graphite-color) 45%, var(--aqua-border));
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--graphite-color) 18%, transparent),
    0 10px 24px color-mix(in srgb, var(--graphite-color) 20%, transparent),
    0 1px 4px rgba(0,0,0,0.10);
}

.aqua-select.open .aqua-select-cap {
  border-radius: 0 18px 10px 0;
  filter: brightness(1.08);
}

.aqua-select.open .aqua-select-cap svg {
  transform: rotate(180deg);
}

.aqua-select-cap svg {
  transition: transform 0.26s cubic-bezier(0.34,1.2,0.64,1);
}

.aqua-select-option {
  position: relative;
  z-index: 1;
  margin: 0 2px;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--aqua-foreground);
  cursor: default;
  opacity: 0;
  transform: translateY(-3px);
  transition:
    background 0.12s ease,
    color 0.18s ease,
    opacity 0.20s ease,
    transform 0.34s cubic-bezier(0.16,1,0.3,1);
  white-space: nowrap;
}

.aqua-select-panel-open .aqua-select-option,
.aqua-select-panel-closing .aqua-select-option {
  opacity: 1;
  transform: translateY(0);
}

.aqua-select-option:hover {
  background: color-mix(in srgb, var(--aqua-color) 12%, transparent);
}

.aqua-select-option.chosen {
  color: var(--aqua-color);
  font-weight: 400;
}

.aqua-select-option:first-child {
  padding-top: 10px;
  margin-top: 2px;
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}

.aqua-select-option:last-child {
  padding-bottom: 10px;
  margin-bottom: 2px;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}

.graphite-select .aqua-select-option:hover,
.aqua-select-panel.graphite-select-panel .aqua-select-option:hover {
  background: color-mix(in srgb, var(--graphite-color) 12%, transparent);
}

.graphite-select .aqua-select-option.chosen,
.aqua-select-panel.graphite-select-panel .aqua-select-option.chosen {
  color: var(--graphite-color);
  font-weight: 400;
}

.aqua-slider {
  display: block;
  width: 100%;
  padding: 8px 0;
  cursor: default;
  user-select: none;
}

.aqua-slider-track {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: var(--aqua-background);
  border: 1px solid var(--aqua-border);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: visible;
}

.aqua-slider.has-stops .aqua-slider-track::before {
  content: '';
  position: absolute;
  left: -1px;
  right: -1px;
  top: 50%;
  height: 14px;
  transform: translateY(-50%);
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent calc((100% / var(--aqua-slider-stops)) - 1px),
    color-mix(in srgb, var(--aqua-foreground) 24%, transparent) calc((100% / var(--aqua-slider-stops)) - 1px),
    color-mix(in srgb, var(--aqua-foreground) 24%, transparent) calc(100% / var(--aqua-slider-stops))
  );
}

.aqua-slider-fill {
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: -1px;
  border-radius: 999px;
  background: var(--aqua-color);
  background-image: radial-gradient(ellipse 80% 70% at 40% 20%, rgba(255,255,255,0.30) 0%, transparent 65%), linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.10) 100%);
  pointer-events: none;
  transition: width 0.34s cubic-bezier(0.34,1.26,0.64,1);
}

.graphite-slider .aqua-slider-fill {
  background: var(--graphite-color);
  background-image: radial-gradient(ellipse 80% 70% at 40% 20%, rgba(255,255,255,0.22) 0%, transparent 65%), linear-gradient(to bottom, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.08) 100%);
}

.aqua-slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.96);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0) 100%);
  box-shadow: 0 1px 6px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08);
  transition: left 0.34s cubic-bezier(0.34,1.26,0.64,1), opacity 0.16s ease, transform 0.18s ease;
  will-change: left, opacity;
  pointer-events: none;
}

[data-theme="dark"] .aqua-slider-thumb {
  box-shadow: 0 1px 8px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.12);
}

.aqua-slider.dragging .aqua-slider-thumb {
  opacity: 0.55;
  transform: translate(-50%, -50%) scale(1.18);
  transition: none;
}

.aqua-slider.dragging .aqua-slider-fill  {
    transition: none;
}

.aqua-progress, .aqua-progress-indeterminate {
  display: block;
  width: 100%;
  height: 16px;
  border-radius: 999px;
  background: var(--aqua-background);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.00) 60%, rgba(255,255,255,0.06) 100%);
  border: 1px solid var(--aqua-border);
  box-shadow: inset 0 1.5px 3px rgba(0,0,0,0.06);
  overflow: hidden;
  position: relative;
}

[data-theme="dark"] .aqua-progress, [data-theme="dark"] .aqua-progress-indeterminate {
  box-shadow: inset 0 1.5px 3px rgba(0,0,0,0.20);
}

.aqua-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 999px;
  min-width: 14px;
  background-color: var(--aqua-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.18) 38%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.12) 100%);
  transition: width 0.38s cubic-bezier(0.25,0.46,0.45,0.94);
  will-change: width;
  overflow: hidden;
}

.aqua-progress-fill::after {
  content: '';
  position: absolute;
  inset: -8px -8px -8px -38px;
  background-image: repeating-linear-gradient(90deg, transparent 0px, transparent 10px, color-mix(in srgb, var(--aqua-color) 70%, black 30%) 20px, transparent 30px);
  filter: blur(6px);
  transform: translate3d(0, 0, 0);
  will-change: transform;
  animation: rib-scroll 0.4s linear infinite;
}

.graphite-progress .aqua-progress-fill {
  background-color: var(--graphite-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.14) 38%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.10) 100%);
}

.graphite-progress .aqua-progress-fill::after {
  background-image: repeating-linear-gradient(90deg, transparent 0px, transparent 10px, color-mix(in srgb, var(--graphite-color) 60%, black 40%) 20px, transparent 30px);
  will-change: transform;
  animation: rib-scroll 0.4s linear infinite;
}

@keyframes rib-scroll {
  from {
    transform: translate3d(0, 0, 0);
  } to {
    transform: translate3d(30px, 0, 0);
  }
}

.aqua-progress-indeterminate {
  background-color: var(--aqua-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.14) 44%, rgba(255,255,255,0.00) 56%, rgba(255,255,255,0.10) 100%), repeating-linear-gradient(-135deg, var(--aqua-color) 0px, var(--aqua-color) 13px, rgba(255,255,255,0.48) 13px, rgba(255,255,255,0.48) 22px);
  background-size: 100% 100%, 31px 31px;
  animation: barber-scroll 0.65s linear infinite;
}

.aqua-progress-indeterminate.graphite-progress {
  background-color: var(--graphite-color);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.12) 44%, rgba(255,255,255,0.00) 56%, rgba(255,255,255,0.08) 100%), repeating-linear-gradient(-135deg, var(--graphite-color) 0px, var(--graphite-color) 13px, rgba(255,255,255,0.65) 13px, rgba(255,255,255,0.65) 22px);
  background-size: 100% 100%, 31px 31px;
}

@keyframes barber-scroll {
  from {
    background-position: 0% 0%, 0px 0px;
  } to {
    background-position: 0% 0%, 31px 0px;
  }
}

.aqua-scrollbar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  border-radius: 999px;
  background: var(--aqua-background);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.00) 60%, rgba(255,255,255,0.06) 100%);
  border: 1px solid var(--aqua-border);
  box-shadow: inset 0 1.5px 3px rgba(0,0,0,0.06);
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

[data-theme="dark"] .aqua-scrollbar {
  box-shadow: inset 0 1.5px 3px rgba(0,0,0,0.20);
}

.aqua-scrollbar-track {
  flex: 1;
  position: relative;
  height: 100%;
  overflow: hidden;
}

.aqua-scrollbar-thumb {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  border-radius: 999px;
  min-width: 20px;
  background-color: var(--aqua-color);
  background-image: radial-gradient(ellipse 90% 60% at 30% 20%, rgba(255,255,255,0.38) 0%, transparent 65%), linear-gradient(to bottom, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.16) 40%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.12) 100%);
  z-index: 1;
  overflow: hidden;
  transition: left 0.12s cubic-bezier(0.34,1.2,0.64,1), --thumb-left 0.12s cubic-bezier(0.34,1.2,0.64,1), opacity 0.14s ease;
}

.aqua-scrollbar-thumb::after {
  content: '';
  position: absolute;
  inset: -5px;
  background-image: repeating-linear-gradient(90deg, transparent 0px, transparent 10px, color-mix(in srgb, var(--aqua-color) 70%, black 30%) 20px, transparent 30px);
  background-size: 30px 100%;
  background-position: calc(5px - var(--thumb-left, 0px)) 0;
  filter: blur(4px);
}

.graphite-scrollbar .aqua-scrollbar-thumb { 
  background-color: var(--graphite-color);
}

.graphite-scrollbar .aqua-scrollbar-thumb::after {
  background-image: repeating-linear-gradient(90deg, transparent 0px, transparent 10px, color-mix(in srgb, var(--graphite-color) 82%, black 18%) 20px, transparent 30px);
  background-size: 30px 100%;
  background-position: calc(5px - var(--thumb-left, 0px)) 0;
}

.aqua-scrollbar-button {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  transition: background 0.12s ease;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

.aqua-scrollbar-button:hover {
  background: rgba(255,255,255,0.14);
}

.aqua-scrollbar-button:active {
  background: rgba(255,255,255,0.26);
}

.graphite-scrollbar .aqua-scrollbar-button:hover {
  background: rgba(0,0,0,0.08);
}

.graphite-scrollbar .aqua-scrollbar-button:active {
  background: rgba(0,0,0,0.18);
}

.aqua-scrollbar-button svg {
  width: 8px;
  height: 7px;
  flex-shrink: 0;
  color: inherit;
  fill: currentColor;
}

.aqua-scrollbar-previous {
  border-right: 1px solid var(--aqua-border);
}

.aqua-scrollbar-next {
  border-left: 1px solid var(--aqua-border);
}

.aqua-tabview-wrap {
  display: flex;
  padding: 12px 16px 14px;
  border-top: 1px solid var(--aqua-border);
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;
  min-width: 0;
}

.aqua-tabview-wrap::-webkit-scrollbar {
  display: none;
}

.aqua-tabview {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  background: var(--aqua-background);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 60%, rgba(255,255,255,0.04) 100%);
  border: 1px solid var(--aqua-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  user-select: none;
  touch-action: pan-y;
  flex-shrink: 0;
  margin: 0 auto;
}

[data-theme="dark"] .aqua-tabview {
  box-shadow: 0 1px 4px rgba(0,0,0,0.30);
}

.aqua-tabview-indicator {
  position: absolute;
  top: 4px;
  height: calc(100% - 8px);
  border-radius: 999px;
  background: rgba(225,229,238,0.95);
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.00) 55%, rgba(255,255,255,0.12) 100%);
  box-shadow: 0 1px 4px rgba(0,0,0,0.13);
  transition: left 0.34s cubic-bezier(0.34,1.26,0.64,1), width 0.34s cubic-bezier(0.34,1.26,0.64,1), opacity 0.16s ease;
  pointer-events: none;
  will-change: left, width, opacity;
}

[data-theme="dark"] .aqua-tabview-indicator {
  background: rgba(255,255,255,0.15);
  box-shadow: 0 1px 4px rgba(0,0,0,0.40);
}

.aqua-tabview-indicator.dragging {
  opacity: 0.55;
  transition: none;
}

.aqua-tabview-tab {
  position: relative;
  z-index: 1;
  padding: 6px 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--aqua-foreground-muted);
  cursor: default;
  white-space: nowrap;
  transition: color 0.22s ease;
  -webkit-tap-highlight-color: transparent;
}

.aqua-tabview-tab.active {
  color: var(--aqua-foreground);
}

.aqua-tabview-tab.disabled {
  color: color-mix(in srgb, var(--aqua-foreground-muted) 50%, transparent);
  pointer-events: none;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
}

.aqua-tabview-panes {
  position: relative;
  overflow: hidden;
}

.aqua-tabview-panes.height-animating {
  transition: height 0.38s cubic-bezier(0.34, 1.26, 0.64, 1);
}

.tab-pane.tab-pane-measure {
  position: absolute !important;
  visibility: hidden !important;
  display: block !important;
  pointer-events: none !important;
  left: -9999px !important;
  top: 0 !important;
  width: var(--tab-pane-measure-width, 100%) !important;
  height: auto !important;
}

.aqua-tabview-panes > .tab-pane {
  display: none;
}

.aqua-tabview-panes > .tab-pane.active {
  display: block;
}

.aqua-tabview-panes.is-animating > .tab-pane.tab-pane-out,
.aqua-tabview-panes.is-animating > .tab-pane.tab-pane-in {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  transition: transform 0.38s cubic-bezier(0.34, 1.26, 0.64, 1), opacity 0.34s ease;
  will-change: transform;
}

.aqua-tabview-panes.is-animating > .tab-pane.tab-pane-in {
  z-index: 2;
}

.aqua-tabview-panes.is-animating > .tab-pane.tab-pane-out {
  z-index: 1;
}

.tab-pane-enter-right {
  transform: translateX(100%);
  opacity: 0.92;
}

.tab-pane-enter-right.tab-pane-in-active {
  transform: translateX(0);
  opacity: 1;
}

.tab-pane-exit-left.tab-pane-out-active {
  transform: translateX(-100%);
  opacity: 0.88;
}

.tab-pane-enter-left {
  transform: translateX(-100%);
  opacity: 0.92;
}

.tab-pane-enter-left.tab-pane-in-active {
  transform: translateX(0);
  opacity: 1;
}

.tab-pane-exit-right.tab-pane-out-active {
  transform: translateX(100%);
  opacity: 0.88;
}

@media (prefers-reduced-motion: reduce) {
  .aqua-select-trigger,
  .aqua-select-cap,
  .aqua-select-cap svg,
  .aqua-select-panel,
  .aqua-select-panel::before {
    animation: none;
    transition: none;
  }

  .aqua-select-panel,
  .aqua-select-panel.aqua-select-panel-above {
    clip-path: none;
    transform: none;
  }

  .aqua-select-option {
    transition: none;
  }

  .aqua-tabview-panes.is-animating > .tab-pane.tab-pane-out,
  .aqua-tabview-panes.is-animating > .tab-pane.tab-pane-in {
    transition: none;
  }

  .aqua-tabview-panes.height-animating {
    transition: none;
  }

  .aqua-floating-panel:not(.aqua-floating-panel--inline),
  .graphite-floating-panel:not(.aqua-floating-panel--inline) {
    animation: none;
    transition: none;
  }
}

@media (max-width: 640px) {
  .aqua-tabview-wrap {
    padding-left: 16px;
    padding-right: 16px;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 16px;
  }
}

/* Firefox-specific glass fix */
@supports (-moz-appearance: none) {
  .aqua-select-panel::before {
    background-color: rgba(255, 255, 255, 0.72) !important;
    backdrop-filter: blur(30px) saturate(150%) !important;
  }

  [data-theme="dark"] .aqua-select-panel::before {
    background-color: rgba(34, 42, 56, 0.84) !important;
    backdrop-filter: blur(30px) saturate(130%) !important;
  }
}
  `;

  document.head.appendChild(aqua);
})();

function aquaTabView(tabView) {
  const prefix = tabView.dataset.contentPrefix;
  const tabIndicator = tabView.querySelector('.aqua-tabview-indicator');
  const activeTabs = Array.from(tabView.querySelectorAll('.aqua-tabview-tab:not(.disabled)'));
  const allTabs = Array.from(tabView.querySelectorAll('.aqua-tabview-tab'));
  const wrap = tabView.closest('.aqua-tabview-wrap');
  const paneDuration = 380;

  function getPane(tab) {
    if (!prefix || !tab?.dataset.tab)
      return null;

    return document.getElementById(prefix + '-' + tab.dataset.tab);
  }

  function ensurePaneContainer() {
    if (!prefix)
      return null;

    const panes = allTabs.map(t => getPane(t)).filter(Boolean);
    if (!panes.length)
      return null;

    const parent = panes[0].parentElement;
    if (parent.classList.contains('aqua-tabview-panes'))
      return parent;

    const container = document.createElement('div');
    container.className = 'aqua-tabview-panes';
    parent.insertBefore(container, panes[0]);
    panes.forEach(pane => container.appendChild(pane));
    return container;
  }

  const paneContainer = ensurePaneContainer();
  let committedTab = activeTabs.find(t => t.classList.contains('active')) || activeTabs[0];
  let animatingToTab = null;
  let paneAnimationId = 0;
  let heightReleaseId = 0;
  let paneFinishTimer = null;

  const paneMotionClasses = [
    'tab-pane-out',
    'tab-pane-out-active',
    'tab-pane-in',
    'tab-pane-in-active',
    'tab-pane-exit-left',
    'tab-pane-exit-right',
    'tab-pane-enter-right',
    'tab-pane-enter-left',
  ];

  function clearPaneMotionClasses(pane) {
    pane.classList.remove(...paneMotionClasses);
  }

  function isPaneAnimating() {
    return Boolean(paneContainer?.classList.contains('is-animating'));
  }

  function abortPaneAnimations() {
    paneAnimationId++;
    heightReleaseId++;

    if (paneFinishTimer) {
      clearTimeout(paneFinishTimer);
      paneFinishTimer = null;
    }
  }

  function resetPaneMotion() {
    if (!paneContainer)
      return;

    paneContainer.classList.remove('is-animating');

    allTabs.forEach(t => {
      const pane = getPane(t);
      if (pane)
        clearPaneMotionClasses(pane);
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function measurePaneHeight(pane) {
    if (!pane)
      return 0;

    const width = paneContainer?.clientWidth || pane.clientWidth;
    const clone = pane.cloneNode(true);
    clone.classList.add('tab-pane-measure');
    clone.classList.remove('active', ...paneMotionClasses);
    if (width > 0)
      clone.style.setProperty('--tab-pane-measure-width', `${width}px`);

    document.body.appendChild(clone);
    const height = clone.scrollHeight;
    clone.remove();
    return Math.max(height, 1);
  }

  function beginHeightTransition(targetHeight, fallbackFrom = 0) {
    if (!paneContainer)
      return;

    heightReleaseId++;
    const fromHeight = Math.max(
      paneContainer.getBoundingClientRect().height,
      fallbackFrom,
      1
    );
    const toHeight = Math.max(targetHeight, 1);

    paneContainer.classList.add('height-animating');
    paneContainer.style.height = `${fromHeight}px`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        paneContainer.style.height = `${toHeight}px`;
      });
    });
  }

  function releaseHeightTransition() {
    if (!paneContainer)
      return;

    const releaseId = ++heightReleaseId;

    const done = () => {
      if (releaseId !== heightReleaseId)
        return;

      const lockedHeight = Math.max(paneContainer.scrollHeight, 1);
      paneContainer.style.height = `${lockedHeight}px`;

      requestAnimationFrame(() => {
        if (releaseId !== heightReleaseId)
          return;

        paneContainer.classList.remove('height-animating');

        requestAnimationFrame(() => {
          if (releaseId !== heightReleaseId)
            return;

          paneContainer.style.height = '';
        });
      });
    };

    if (!paneContainer.classList.contains('height-animating')) {
      requestAnimationFrame(done);
      return;
    }

    paneContainer.addEventListener('transitionend', e => {
      if (e.target === paneContainer && e.propertyName === 'height')
        done();
    }, { once: true });

    setTimeout(done, paneDuration + 80);
  }

  function moveIndicator(tab, animate) {
    tabIndicator.style.transition = animate ? '' : 'none';
    tabIndicator.style.left = tab.offsetLeft + 'px';
    tabIndicator.style.width = tab.offsetWidth + 'px';
  }

  function scrollToTab(tab) {
    if (!wrap || tabView.scrollWidth <= wrap.clientWidth)
      return;

    const scrollDistance = tab.offsetLeft + tab.offsetWidth / 2 - wrap.clientWidth / 2;
    wrap.scrollTo({ left: Math.max(0, scrollDistance), behavior: 'smooth' });
  }

  function setTabHeaders(tab) {
    allTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  }

  function setPanesInstant(tab) {
    if (!prefix)
      return;

    allTabs.forEach(t => {
      const pane = getPane(t);
      if (!pane)
        return;

      pane.classList.remove('active');
      clearPaneMotionClasses(pane);
    });

    const pane = getPane(tab);
    if (pane)
      pane.classList.add('active');
  }

  function trackPaneHeight(nextPane) {
    const update = () => {
      if (!paneContainer?.classList.contains("height-animating")) return;
      paneContainer.style.height = `${measurePaneHeight(nextPane)}px`;
    };

    const observer = new ResizeObserver(() => requestAnimationFrame(update));
    observer.observe(nextPane);

    requestAnimationFrame(() => requestAnimationFrame(update));

    return () => observer.disconnect();
  }

  function animatePaneTransition(prevPane, nextPane, forward, targetTab, onDone) {
    const animationId = paneAnimationId;
    animatingToTab = targetTab;
    const exitClass = forward ? 'tab-pane-exit-left' : 'tab-pane-exit-right';
    const enterClass = forward ? 'tab-pane-enter-right' : 'tab-pane-enter-left';

    allTabs.forEach(t => {
      const pane = getPane(t);
      if (!pane || pane === prevPane || pane === nextPane)
        return;

      pane.classList.remove('active');
      clearPaneMotionClasses(pane);
    });

    const targetHeight = measurePaneHeight(nextPane);
    const fromHeight = Math.max(paneContainer.getBoundingClientRect().height, prevPane.offsetHeight, 1);
    beginHeightTransition(targetHeight, fromHeight);

    const untrackHeight = trackPaneHeight(nextPane);

    paneContainer.classList.add('is-animating');

    clearPaneMotionClasses(prevPane);
    clearPaneMotionClasses(nextPane);
    prevPane.classList.remove('active');
    nextPane.classList.remove('active');
    prevPane.classList.add('tab-pane-out', exitClass);
    nextPane.classList.add('tab-pane-in', enterClass);
    void paneContainer.offsetHeight;
    prevPane.classList.add('tab-pane-out-active');
    nextPane.classList.add('tab-pane-in-active');

    let finished = false;
    const finish = () => {
      if (finished || animationId !== paneAnimationId)
        return;

      untrackHeight?.();

      finished = true;
      paneFinishTimer = null;
      animatingToTab = null;

      setPanesInstant(targetTab);
      paneContainer.classList.remove('is-animating');
      committedTab = targetTab;

      requestAnimationFrame(() => {
        releaseHeightTransition();
      });
      onDone?.();
    };

    nextPane.addEventListener('transitionend', e => {
      if (e.target === nextPane && e.propertyName === 'transform')
        finish();
    }, { once: true });

    paneFinishTimer = setTimeout(finish, paneDuration + 60);
  }

  function switchTab(tab, skipAnimation) {
    if (!activeTabs.includes(tab))
      return;

    if (tab === committedTab && !isPaneAnimating() && getPane(tab)?.classList.contains('active')) {
      setTabHeaders(tab);
      moveIndicator(tab, !skipAnimation);
      scrollToTab(tab);
      return;
    }

    const inFlightTarget = isPaneAnimating() ? animatingToTab : null;
    abortPaneAnimations();
    resetPaneMotion();

    const prevTab = inFlightTarget ?? committedTab;
    const prevPane = getPane(prevTab);
    const nextPane = getPane(tab);
    const forward = activeTabs.indexOf(tab) >= activeTabs.indexOf(prevTab);

    setPanesInstant(prevTab);
    setTabHeaders(tab);

    const sharedContentId = tabView.getAttribute('data-shared-pane-content');
    if (sharedContentId && nextPane) {
      const sharedElement = document.getElementById(sharedContentId);
      if (sharedElement && sharedElement.parentNode !== nextPane) {
        nextPane.appendChild(sharedElement);
      }
    }

    tabView.dispatchEvent(new CustomEvent("aqua:tabview:beforechange", {
      detail: {
        previousTab: prevTab,
        nextTab: tab,
        previousPane: prevPane,
        nextPane,
        direction: forward ? "forward" : "backward"
      }
    }));

    const canAnimate = !skipAnimation
      && paneContainer
      && prevPane
      && nextPane
      && prevPane !== nextPane
      && !prefersReducedMotion();

    moveIndicator(tab, !skipAnimation);
    scrollToTab(tab);

    if (canAnimate) {
      animatePaneTransition(prevPane, nextPane, forward, tab, () => {
        requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
      });
      return;
    }

    if (!skipAnimation && paneContainer && nextPane && !prefersReducedMotion()) {
      const fromHeight = Math.max(paneContainer.getBoundingClientRect().height, prevPane?.offsetHeight || 0, 1);
      beginHeightTransition(measurePaneHeight(nextPane), fromHeight);
      setPanesInstant(tab);
      committedTab = tab;
      animatingToTab = null;
      releaseHeightTransition();
    } else {
      setPanesInstant(tab);
      committedTab = tab;
      animatingToTab = null;
    }

    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }

  let isDragging = false;
  let pointerDown = false;
  let dragStarted = false;
  let startX = 0;
  let startY = 0;
  let pressedTab = null;
  const dragThreshold = 5;

  function getTabAt(clientX) {
    let bestTab = activeTabs[0], bestDistance = Infinity;

    activeTabs.forEach(t => {
      const rect = t.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(clientX - center);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestTab = t;
      }
    });

    return bestTab;
  }

  function tabFromEvent(e) {
    const tab = e.target.closest('.aqua-tabview-tab');
    return tab && !tab.classList.contains('disabled') ? tab : null;
  }

  let draggingScrollFrame = null;
  const edgeZone = 80;

  function stopDraggingScroll() {
    if (draggingScrollFrame) {
      cancelAnimationFrame(draggingScrollFrame);
      draggingScrollFrame = null;
    }
  }

  function startDraggingScroll(cursorX)  {
    if (!wrap)
      return;

    stopDraggingScroll();

    const boundingRect = wrap.getBoundingClientRect();
    const zoneWidth = Math.min(edgeZone, boundingRect.width * 0.20);
    const leftEdge = boundingRect.left + zoneWidth;
    const rightEdge = boundingRect.right - zoneWidth;

    let speed = 0;
    if (cursorX < leftEdge)
      speed = -(1 - (cursorX - boundingRect.left) / zoneWidth);
    else if (cursorX > rightEdge)
      speed = (1 - (boundingRect.right - cursorX) / zoneWidth);

    speed = Math.max(-1, Math.min(1, speed));
    if (Math.abs(speed) < 0.04)
      return;

    const maxSpeed = 12;
    const pixelsToScroll = speed * maxSpeed;

    function tick() {
      wrap.scrollLeft += pixelsToScroll;
      draggingScrollFrame = requestAnimationFrame(tick);
    }
    draggingScrollFrame = requestAnimationFrame(tick);
  }

  function onPointerDown(e) {
    if (e.button !== 0)
      return;

    const tab = tabFromEvent(e);
    if (e.target.closest('.aqua-tabview-tab')?.classList.contains('disabled'))
      return;

    pointerDown = true;
    dragStarted = false;
    isDragging = false;
    startX = e.clientX;
    startY = e.clientY;
    pressedTab = tab;
    tabView.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!pointerDown)
      return;

    if (!dragStarted) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) < dragThreshold)
        return;

      dragStarted = true;
      isDragging = true;
      tabIndicator.classList.add('dragging');
    }

    const boundingRect = tabView.getBoundingClientRect();
    const indicatorWidth = parseFloat(tabIndicator.style.width || '0');
    const relativeX = (e.clientX - boundingRect.left);
    const maxLeft = tabView.scrollWidth - indicatorWidth;
    tabIndicator.style.left = Math.max(0, Math.min(relativeX - indicatorWidth / 2, maxLeft)) + 'px';
    const nearestTab = getTabAt(e.clientX);
    allTabs.forEach(t => t.classList.remove('active'));
    nearestTab.classList.add('active');
    startDraggingScroll(e.clientX);
  }

  function onPointerUp(e) {
    if (!pointerDown)
      return;

    pointerDown = false;
    tabView.releasePointerCapture(e.pointerId);

    if (dragStarted) {
      isDragging = false;
      dragStarted = false;
      stopDraggingScroll();
      tabIndicator.classList.remove('dragging');
      switchTab(getTabAt(e.clientX), false);
    } else {
      switchTab(pressedTab || getTabAt(e.clientX), false);
    }

    pressedTab = null;
  }

  tabView.addEventListener('pointerdown', onPointerDown);
  tabView.addEventListener('pointermove', onPointerMove);
  tabView.addEventListener('pointerup', onPointerUp);
  tabView.addEventListener('pointercancel', onPointerUp);

  function initializeTab() {
    const activeTab = tabView.querySelector('.aqua-tabview-tab.active');

    if (!activeTab)
      return;

    moveIndicator(activeTab, false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        tabIndicator.style.transition = '';
      })
    );
  }

  return initializeTab;
}

const tabViews = document.querySelectorAll('.aqua-tabview');
const tabs = [];
tabViews.forEach(tab => tabs.push(aquaTabView(tab)));

function initializeTabs() {
  tabs.forEach(tab => tab && tab());
}

if (document.fonts?.ready)
  document.fonts.ready.then(initializeTabs);
else
  window.addEventListener('load', initializeTabs);

window.addEventListener('resize', () => {
  tabViews.forEach(tabView => {
    const activeTab = tabView.querySelector('.aqua-tabview-tab.active');
    const tabIndicator = tabView.querySelector('.aqua-tabview-indicator');

    if (!activeTab || !tabIndicator)
      return;

    tabIndicator.style.left = activeTab.offsetLeft + 'px';
    tabIndicator.style.width = activeTab.offsetWidth + 'px';
  });
});

const aquaSelectInstances = [];

document.querySelectorAll('.aqua-select').forEach(selector => {
  const trigger = selector.querySelector('.aqua-select-trigger');
  const panel = selector.querySelector('.aqua-select-panel');
  const value = trigger?.querySelector('.aqua-select-value');
  const options = panel?.querySelectorAll('.aqua-select-option');

  if (!trigger || !panel || !value || !options?.length)
    return;

  let inner = panel.querySelector('.aqua-select-panel-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'aqua-select-panel-inner';
    const children = Array.from(panel.childNodes);
    children.forEach(node => inner.appendChild(node));
    panel.appendChild(inner);
  }

  panel.classList.toggle('graphite-select-panel', selector.classList.contains('graphite-select'));
  let closeTimer = null;

  const finishClose = () => {
    window.clearTimeout(closeTimer);
    panel.classList.remove('aqua-select-panel-closing');
    selector.classList.remove('closing');
  };

  const computeChosenOffset = (option, triggerHeight, panelHeight) => {
    if (!option)
      return 0;

    const desired = option.offsetTop + option.offsetHeight / 2 - triggerHeight / 2;
    return Math.max(0, Math.min(desired, Math.max(0, panelHeight - triggerHeight)));
  };

  const applyMorphVars = (translateY, innerTranslateY, triggerHeight, panelHeight) => {
    panel.style.setProperty('--aqua-select-translate-y', translateY + 'px');
    panel.style.setProperty('--aqua-select-inner-translate-y', innerTranslateY + 'px');
    panel.style.setProperty('--aqua-select-collapsed-height', triggerHeight + 'px');
    panel.style.setProperty('--aqua-select-panel-height', panelHeight + 'px');
  };

  const positionPanel = () => {
    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 8;
    const width = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      window.innerWidth - width - viewportPadding
    );

    panel.style.setProperty('--aqua-select-panel-height', 'auto');
    const panelHeight = Math.max(panel.scrollHeight, rect.height);

    const chosenOption = panel.querySelector('.aqua-select-option.chosen');
    const desiredOffset = computeChosenOffset(chosenOption, rect.height, panelHeight);

    const morphTop = rect.top - desiredOffset;
    const morphFitsBelow =
      morphTop >= viewportPadding &&
      morphTop + panelHeight <= window.innerHeight - viewportPadding;

    let top;
    let translateY;
    let innerTranslateY;
    let shouldOpenAbove = false;

    if (desiredOffset > 0 && morphFitsBelow) {
      top = morphTop;
      translateY = desiredOffset;
      innerTranslateY = -desiredOffset;
    } else {
      const wouldOverflowBelow = rect.top + panelHeight > window.innerHeight - viewportPadding;
      const fitsAbove = rect.bottom - panelHeight >= viewportPadding;

      if (wouldOverflowBelow && fitsAbove) {
        shouldOpenAbove = true;
        top = rect.bottom - panelHeight;
        translateY = panelHeight - rect.height;
        innerTranslateY = -(panelHeight - rect.height);
      } else {
        top = Math.max(
          viewportPadding,
          Math.min(rect.top, window.innerHeight - panelHeight - viewportPadding)
        );
        translateY = rect.top - top;
        innerTranslateY = -(rect.top - top);
      }
    }

    panel.style.position = 'fixed';
    panel.style.left = left + 'px';
    panel.style.right = 'auto';
    panel.style.top = top + 'px';
    panel.style.width = width + 'px';
    panel.style.minWidth = width + 'px';
    panel.style.maxWidth = 'calc(100vw - ' + viewportPadding * 2 + 'px)';
    panel.style.zIndex = '2147483647';
    panel.style.transformOrigin = shouldOpenAbove ? 'bottom center' : 'top center';
    applyMorphVars(translateY, innerTranslateY, rect.height, panelHeight);
    panel.classList.toggle('aqua-select-panel-above', shouldOpenAbove);
  };

  const close = selectedOption => {
    if (panel.classList.contains('aqua-select-panel-closing'))
      return;
    if (!selector.classList.contains('open') && !panel.classList.contains('aqua-select-panel-open'))
      return;

    window.clearTimeout(closeTimer);

    if (selectedOption) {
      const triggerRect = trigger.getBoundingClientRect();
      const panelHeight = panel.offsetHeight || panel.scrollHeight;
      const currentTop = parseFloat(panel.style.top);
      const translateY = Number.isFinite(currentTop) ? triggerRect.top - currentTop : 0;
      const newOffset = computeChosenOffset(selectedOption, triggerRect.height, panelHeight);
      applyMorphVars(translateY, -newOffset, triggerRect.height, panelHeight);
    }

    selector.classList.remove('open');
    selector.classList.add('closing');
    panel.classList.remove('aqua-select-panel-open');
    panel.classList.add('aqua-select-panel-closing');
    trigger.setAttribute('aria-expanded', 'false');

    closeTimer = window.setTimeout(finishClose, 420);
  };

  const open = () => {
    aquaSelectInstances.forEach(instance => {
      if (instance.selector !== selector)
        instance.close();
    });
    window.clearTimeout(closeTimer);
    selector.classList.remove('closing');
    panel.classList.remove('aqua-select-panel-closing');
    document.body.appendChild(panel);
    positionPanel();
    panel.getBoundingClientRect();
    selector.classList.add('open');
    panel.classList.add('aqua-select-panel-open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  panel.addEventListener('animationend', e => {
    if (e.target !== panel || e.animationName !== 'aqua-select-panel-close')
      return;

    finishClose();
  });

  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    selector.classList.contains('open') ? close() : open();
  });

  options.forEach(option => {
    option.addEventListener('click', e => {
      e.stopPropagation();
      aquaSelectInstances.forEach(instance => {
        if (instance.selector !== selector)
          instance.close();
      });
      options.forEach(choice => choice.classList.remove('chosen'));
      option.classList.add('chosen');
      value.textContent = option.textContent;
      value.classList.add('selected');
      close(option);
    });
  });

  aquaSelectInstances.push({ selector, close, positionPanel });
});

document.addEventListener('click', () => {
  aquaSelectInstances.forEach(instance => instance.close());
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    aquaSelectInstances.forEach(instance => instance.close());
});

window.addEventListener('resize', () => {
  aquaSelectInstances.forEach(instance => {
    if (instance.selector.classList.contains('open'))
      instance.positionPanel();
  });
});

window.addEventListener('scroll', () => {
  aquaSelectInstances.forEach(instance => {
    if (instance.selector.classList.contains('open'))
      instance.positionPanel();
  });
}, true);

document.querySelectorAll('.aqua-slider').forEach(slider => {
  const track = slider.querySelector('.aqua-slider-track');
  const fill = slider.querySelector('.aqua-slider-fill');
  const thumb = slider.querySelector('.aqua-slider-thumb');
  const min = parseFloat(slider.dataset.min ?? 0);
  const max = parseFloat(slider.dataset.max ?? 100);
  const parsedSteps = parseInt(slider.dataset.steps ?? '0', 10);
  const steps = Number.isFinite(parsedSteps) && parsedSteps >= 2 ? parsedSteps : 0;
  let value = parseFloat(slider.dataset.value ?? 50);

  function clamp(value) {
    return Math.max(min, Math.min(max, value));
  }

  function normalize(value) {
    return (clamp(value) - min) / (max - min);
  }

  function quantizeFraction(fraction) {
    if (!steps)
      return fraction;

    const stops = steps - 1;
    return Math.round(fraction * stops) / stops;
  }

  function applyFraction(fraction, animate) {
    const snappedFraction = quantizeFraction(fraction);
    const percentage = snappedFraction * 100;

    if (!animate) {
      fill.style.transition = 'none';
      thumb.style.transition = 'none';
    } else {
      fill.style.transition = '';
      thumb.style.transition = '';
    }

    fill.style.width = `calc(${percentage}% + 1px)`;
    thumb.style.left = `${percentage}%`;
    value = min + snappedFraction * (max - min);
    slider.dataset.value = Math.round(value);
  }

  function pointerFraction(clientX) {
    const boundingRect = track.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - boundingRect.left) / boundingRect.width));
  }

  applyFraction(normalize(value), false);
  if (steps) {
    slider.classList.add('has-stops');
    slider.style.setProperty('--aqua-slider-stops', String(steps - 1));
  }
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      fill.style.transition = '';
      thumb.style.transition = '';
    })
  );

  let isDragging = false;

  function onPointerDown(e) {
    isDragging = true;
    slider.classList.add('dragging');
    slider.setPointerCapture(e.pointerId);
    applyFraction(pointerFraction(e.clientX), true);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging)
      return;

    applyFraction(pointerFraction(e.clientX), false);
  }

  function onPointerUp(e) {
    if (!isDragging)
      return;

    isDragging = false;
    slider.classList.remove('dragging');
    applyFraction(pointerFraction(e.clientX), true);
  }

  slider.addEventListener('pointerdown', onPointerDown);
  slider.addEventListener('pointermove', onPointerMove);
  slider.addEventListener('pointerup', onPointerUp);
  slider.addEventListener('pointercancel', onPointerUp);
});

document.querySelectorAll('.aqua-interactive-graph, .graphite-interactive-graph').forEach(graph => {
  const svg = graph.querySelector('svg');

  if (!svg)
    return;

  let area = svg.querySelector('.aqua-graph-area');
  let line = svg.querySelector('.aqua-graph-line');
  let hit = svg.querySelector('.aqua-graph-hit');
  let guide = svg.querySelector('.aqua-graph-guide');
  let handle = graph.querySelector(':scope > .aqua-graph-handle');

  svg.querySelectorAll('.aqua-graph-handle').forEach(legacyHandle => legacyHandle.remove());

  if (!area) {
    area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.classList.add('aqua-graph-area');
    svg.appendChild(area);
  }

  if (!line) {
    line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.classList.add('aqua-graph-line');
    svg.appendChild(line);
  }

  if (!hit) {
    hit = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hit.classList.add('aqua-graph-hit');
    hit.setAttribute('x', '0');
    hit.setAttribute('y', '0');
    hit.setAttribute('width', '320');
    hit.setAttribute('height', '132');
    svg.appendChild(hit);
  }

  if (!guide) {
    guide = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    guide.classList.add('aqua-graph-guide');
    guide.setAttribute('y1', '0');
    guide.setAttribute('y2', '132');
    svg.appendChild(guide);
  }

  if (!handle) {
    handle = document.createElement('span');
    handle.classList.add('aqua-graph-handle');
    graph.appendChild(handle);
  }

  const width = 320;
  const height = 132;
  const bottom = height;
  const values = (graph.dataset.values || '66,22,66,110,66,22,66,110,66')
    .split(',')
    .map(value => Math.max(10, Math.min(height - 10, parseFloat(value))))
    .filter(Number.isFinite);

  if (values.length < 3)
    values.splice(0, values.length, 66, 22, 66, 110, 66, 22, 66, 110, 66);

  const points = values.map((y, index) => ({
    x: (index / (values.length - 1)) * width,
    y
  }));

  function pathFromPoints(points) {
    const segments = [`M${points[0].x} ${points[0].y}`];

    for (let index = 0; index < points.length - 1; index++) {
      const previous = points[index - 1] || points[index];
      const current = points[index];
      const next = points[index + 1];
      const afterNext = points[index + 2] || next;
      const controlOneX = current.x + (next.x - previous.x) / 6;
      const controlOneY = current.y + (next.y - previous.y) / 6;
      const controlTwoX = next.x - (afterNext.x - current.x) / 6;
      const controlTwoY = next.y - (afterNext.y - current.y) / 6;

      segments.push(`C${controlOneX} ${controlOneY} ${controlTwoX} ${controlTwoY} ${next.x} ${next.y}`);
    }

    return segments.join(' ');
  }

  function render(activeIndex = Math.floor(points.length / 2)) {
    const d = pathFromPoints(points);
    line.setAttribute('d', d);
    area.setAttribute('d', `${d} L${width} ${bottom} L0 ${bottom} Z`);
    guide.setAttribute('x1', points[activeIndex].x);
    guide.setAttribute('x2', points[activeIndex].x);
    handle.style.left = `${(points[activeIndex].x / width) * 100}%`;
    handle.style.top = `${(points[activeIndex].y / height) * 100}%`;
    graph.dataset.values = points.map(point => Math.round(point.y)).join(',');
    graph.setAttribute('aria-valuenow', String(Math.round(((height - points[activeIndex].y) / height) * 100)));
  }

  function pointerPoint(e) {
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(width, ((e.clientX - rect.left) / rect.width) * width)),
      y: Math.max(10, Math.min(height - 10, ((e.clientY - rect.top) / rect.height) * height))
    };
  }

  function updateFromPointer(e) {
    const pointer = pointerPoint(e);
    const nearestIndex = Math.round((pointer.x / width) * (points.length - 1));
    keyboardIndex = nearestIndex;

    points[nearestIndex].y = pointer.y;

    const previous = points[nearestIndex - 1];
    const next = points[nearestIndex + 1];
    if (previous)
      previous.y = previous.y * 0.82 + pointer.y * 0.18;
    if (next)
      next.y = next.y * 0.82 + pointer.y * 0.18;

    render(nearestIndex);
  }

  let isDragging = false;
  let keyboardIndex = Math.floor(points.length / 2);

  graph.setAttribute('tabindex', graph.getAttribute('tabindex') || '0');
  graph.setAttribute('role', graph.getAttribute('role') || 'slider');
  graph.setAttribute('aria-valuemin', '0');
  graph.setAttribute('aria-valuemax', '100');

  function onPointerDown(e) {
    isDragging = true;
    graph.classList.add('is-dragging');
    graph.setPointerCapture(e.pointerId);
    updateFromPointer(e);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging)
      return;

    updateFromPointer(e);
  }

  function onPointerUp(e) {
    if (!isDragging)
      return;

    isDragging = false;
    graph.classList.remove('is-dragging');
    if (graph.hasPointerCapture(e.pointerId))
      graph.releasePointerCapture(e.pointerId);
    updateFromPointer(e);
  }

  graph.addEventListener('pointerdown', onPointerDown);
  graph.addEventListener('pointermove', onPointerMove);
  graph.addEventListener('pointerup', onPointerUp);
  graph.addEventListener('pointercancel', onPointerUp);

  graph.addEventListener('keydown', e => {
    const step = e.shiftKey ? 12 : 6;

    if (e.key === 'ArrowLeft') {
      keyboardIndex = Math.max(0, keyboardIndex - 1);
    } else if (e.key === 'ArrowRight') {
      keyboardIndex = Math.min(points.length - 1, keyboardIndex + 1);
    } else if (e.key === 'ArrowUp') {
      points[keyboardIndex].y = Math.max(10, points[keyboardIndex].y - step);
    } else if (e.key === 'ArrowDown') {
      points[keyboardIndex].y = Math.min(height - 10, points[keyboardIndex].y + step);
    } else {
      return;
    }

    render(keyboardIndex);
    e.preventDefault();
  });

  render();
});

function aquaProgressIndicator(progressIndicator) {
  const fill = progressIndicator.querySelector('.aqua-progress-fill');

  if (!fill)
    return;

  function setValue(value) {
    const percentage = Math.max(0, Math.min(100, value));
    fill.style.width = percentage + '%';
    progressIndicator.dataset.value = Math.round(percentage);
  }

  setValue(parseFloat(progressIndicator.dataset.value ?? 50));
}

document.querySelectorAll('.aqua-progress').forEach(aquaProgressIndicator);

function aquaFloatingPanel(panel) {
  if (panel.classList.contains('aqua-floating-panel--inline'))
    return;

  const panelId = panel.id;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toggles() {
    if (!panelId)
      return [];

    return Array.from(document.querySelectorAll(`[data-aqua-floating-panel-toggle="${panelId}"]`));
  }

  function isOpen() {
    return panel.classList.contains('aqua-floating-panel-open');
  }

  function syncToggles(open) {
    toggles().forEach(button => {
      button.setAttribute('aria-pressed', open ? 'true' : 'false');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setHiddenState(open) {
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open)
      panel.removeAttribute('inert');
    else
      panel.setAttribute('inert', '');
  }

  function finishClose() {
    panel.classList.remove('aqua-floating-panel-closing');
    setHiddenState(false);
    syncToggles(false);
  }

  function show() {
    if (isOpen())
      return;

    panel.classList.remove('aqua-floating-panel-closing');
    panel.classList.add('aqua-floating-panel-open');
    setHiddenState(true);
    syncToggles(true);
  }

  function hide() {
    if (!isOpen() && !panel.classList.contains('aqua-floating-panel-closing'))
      return;

    if (prefersReducedMotion()) {
      panel.classList.remove('aqua-floating-panel-open', 'aqua-floating-panel-closing');
      finishClose();
      return;
    }

    panel.classList.remove('aqua-floating-panel-open');
    panel.classList.add('aqua-floating-panel-closing');
    syncToggles(false);
  }

  panel.addEventListener('animationend', e => {
    if (e.target !== panel || e.animationName !== 'aqua-floating-panel-close')
      return;

    finishClose();
  });

  toggles().forEach(button => {
    button.addEventListener('click', () => {
      if (isOpen())
        hide();
      else
        show();
    });
  });

  panel.querySelectorAll('[data-aqua-floating-panel-dismiss]').forEach(button => {
    button.addEventListener('click', hide);
  });

  if (panel.classList.contains('aqua-floating-panel-open')) {
    setHiddenState(true);
    syncToggles(true);
  } else {
    finishClose();
  }
}

document.querySelectorAll('.aqua-floating-panel:not(.aqua-floating-panel--inline), .graphite-floating-panel:not(.aqua-floating-panel--inline)').forEach(aquaFloatingPanel);

const aquaFloatingControlPanels = [];

function aquaFloatingControlPanel(panel) {
  const trigger = panel.querySelector('[data-aqua-floating-control-panel-toggle], .aqua-floating-control-panel-tab');
  const surface = panel.querySelector('.aqua-floating-control-panel-surface');
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const backdrop = document.createElement('div');
  let lastFocus = null;

  if (!trigger || !surface)
    return;

  if (panel.parentElement !== document.body)
    document.body.appendChild(panel);

  backdrop.className = 'aqua-floating-control-panel-backdrop';
  document.body.appendChild(backdrop);
  trigger.setAttribute('aria-expanded', panel.classList.contains('aqua-floating-control-panel-open') ? 'true' : 'false');

  if (!surface.id)
    surface.id = panel.id ? `${panel.id}-surface` : `aqua-floating-control-panel-${aquaFloatingControlPanels.length + 1}`;

  trigger.setAttribute('aria-controls', surface.id);

  function isOpen() {
    return panel.classList.contains('aqua-floating-control-panel-open');
  }

  function firstFocusable() {
    return surface.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  }

  function setSurfaceHidden(hidden) {
    surface.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    if (hidden)
      surface.setAttribute('inert', '');
    else
      surface.removeAttribute('inert');
  }

  function sync(open) {
    panel.classList.toggle('aqua-floating-control-panel-open', open);
    backdrop.classList.toggle('aqua-floating-control-panel-backdrop-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    setSurfaceHidden(!open);
  }

  function finishClose() {
    panel.classList.remove('aqua-floating-control-panel-closing');
    backdrop.classList.remove('aqua-floating-control-panel-backdrop-open');
    trigger.setAttribute('aria-expanded', 'false');
    setSurfaceHidden(true);
  }

  function show() {
    if (isOpen())
      return;

    aquaFloatingControlPanels.forEach(instance => {
      if (instance.panel !== panel)
        instance.hide();
    });

    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    panel.classList.remove('aqua-floating-control-panel-closing');
    sync(true);

    if (!prefersReducedMotion())
      panel.classList.add('aqua-floating-control-panel-opening');

    if (!prefersReducedMotion())
      window.setTimeout(() => firstFocusable()?.focus({ preventScroll: true }), 160);
    else
      firstFocusable()?.focus({ preventScroll: true });
  }

  function hide() {
    if (!isOpen())
      return;

    panel.classList.remove('aqua-floating-control-panel-opening');

    if (prefersReducedMotion()) {
      panel.classList.remove('aqua-floating-control-panel-open', 'aqua-floating-control-panel-closing');
      finishClose();
    } else {
      panel.classList.remove('aqua-floating-control-panel-open');
      panel.classList.add('aqua-floating-control-panel-closing');
      trigger.setAttribute('aria-expanded', 'false');
      setSurfaceHidden(true);
    }

    if (lastFocus && document.contains(lastFocus))
      lastFocus.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', () => {
    isOpen() ? hide() : show();
  });

  backdrop.addEventListener('click', hide);
  surface.querySelectorAll('[data-aqua-floating-control-panel-dismiss]').forEach(button => {
    button.addEventListener('click', hide);
  });

  surface.addEventListener('animationend', e => {
    if (e.target !== surface)
      return;

    if (e.animationName === 'aqua-floating-control-panel-surface-open') {
      panel.classList.remove('aqua-floating-control-panel-opening');
    } else if (e.animationName === 'aqua-floating-control-panel-surface-close') {
      finishClose();
    }
  });

  sync(isOpen());
  aquaFloatingControlPanels.push({ panel, hide });
}

document.querySelectorAll('.aqua-floating-control-panel, .graphite-floating-control-panel').forEach(aquaFloatingControlPanel);

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape')
    return;

  aquaFloatingControlPanels.forEach(instance => instance.hide());
});

const aquaTooltipState = new WeakMap();
const aquaTooltipOpen = new Set();

function ensureTooltipFor(trigger) {
  const existing = aquaTooltipState.get(trigger);
  if (existing)
    return existing;

  const className = trigger.dataset.aquaTooltipClass || '';
  const isGraphite = className.includes('graphite') || trigger.classList.contains('graphite-tooltip-source');
  const tooltip = document.createElement('div');
  tooltip.className = isGraphite ? 'graphite-tooltip' : 'aqua-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.id = trigger.id ? `${trigger.id}-tooltip` : `aqua-tooltip-${Math.random().toString(36).slice(2, 9)}`;
  document.body.appendChild(tooltip);

  const state = {
    tooltip,
    mode: trigger.dataset.aquaTooltipMode === 'follow' ? 'follow' : 'anchor',
    pointerX: 0,
    pointerY: 0,
    frame: null
  };

  aquaTooltipState.set(trigger, state);
  return state;
}

function positionTooltip(trigger, state) {
  const tooltip = state.tooltip;
  const margin = 10;
  const pointerOffset = 14;
  const rect = trigger.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  let left;
  let top;

  if (state.mode === 'follow') {
    left = state.pointerX + pointerOffset;
    top = state.pointerY + pointerOffset;
  } else {
    left = rect.left + (rect.width - tipRect.width) / 2;
    top = rect.top - tipRect.height - pointerOffset;
  }

  if (left + tipRect.width > window.innerWidth - margin)
    left = window.innerWidth - tipRect.width - margin;
  if (left < margin)
    left = margin;
  if (top + tipRect.height > window.innerHeight - margin)
    top = window.innerHeight - tipRect.height - margin;
  if (top < margin)
    top = rect.bottom + pointerOffset;
  if (top + tipRect.height > window.innerHeight - margin)
    top = window.innerHeight - tipRect.height - margin;

  tooltip.style.left = Math.round(left) + 'px';
  tooltip.style.top = Math.round(top) + 'px';
}

function showTooltip(trigger) {
  const text = trigger.dataset.aquaTooltip;

  if (!text)
    return;

  const state = ensureTooltipFor(trigger);
  state.tooltip.textContent = text;
  positionTooltip(trigger, state);
  state.tooltip.classList.add('aqua-tooltip-open');
  trigger.setAttribute('aria-describedby', state.tooltip.id);
  aquaTooltipOpen.add(trigger);
}

function hideTooltip(trigger) {
  const state = aquaTooltipState.get(trigger);

  if (!state)
    return;

  state.tooltip.classList.remove('aqua-tooltip-open');
  trigger.removeAttribute('aria-describedby');
  aquaTooltipOpen.delete(trigger);
}

document.querySelectorAll('[data-aqua-tooltip]').forEach(trigger => {
  trigger.addEventListener('pointerenter', e => {
    const state = ensureTooltipFor(trigger);
    state.pointerX = e.clientX;
    state.pointerY = e.clientY;
    showTooltip(trigger);
  });

  trigger.addEventListener('pointermove', e => {
    const state = aquaTooltipState.get(trigger);
    if (!state || state.mode !== 'follow' || !aquaTooltipOpen.has(trigger))
      return;

    state.pointerX = e.clientX;
    state.pointerY = e.clientY;

    if (state.frame)
      cancelAnimationFrame(state.frame);

    state.frame = requestAnimationFrame(() => {
      state.frame = null;
      positionTooltip(trigger, state);
    });
  });

  trigger.addEventListener('pointerleave', () => hideTooltip(trigger));
  trigger.addEventListener('focus', () => showTooltip(trigger));
  trigger.addEventListener('blur', () => hideTooltip(trigger));
});

window.addEventListener('scroll', () => {
  aquaTooltipOpen.forEach(trigger => {
    const state = aquaTooltipState.get(trigger);
    if (state)
      positionTooltip(trigger, state);
  });
}, true);

window.addEventListener('resize', () => {
  aquaTooltipOpen.forEach(trigger => {
    const state = aquaTooltipState.get(trigger);
    if (state)
      positionTooltip(trigger, state);
  });
});

document.querySelectorAll('.aqua-toggle-button, .graphite-toggle-button').forEach(button => {
  if (button.hasAttribute('data-aqua-floating-panel-toggle'))
    return;

  if (!button.hasAttribute('aria-pressed'))
    button.setAttribute('aria-pressed', 'false');

  button.addEventListener('click', () => {
    const isPressed = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', isPressed ? 'false' : 'true');
  });
});

document.querySelectorAll('.aqua-text-button-group').forEach(group => {
  const buttons = Array.from(group.querySelectorAll('.aqua-text-button, .graphite-text-button'));
  if (!buttons.length)
    return;

  const selectButton = selectedButton => {
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', button === selectedButton ? 'true' : 'false');
    });
  };

  const initiallyPressed = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
  selectButton(initiallyPressed || buttons[0]);

  buttons.forEach(button => {
    button.addEventListener('click', () => selectButton(button));
  });
});

document.querySelectorAll('.aqua-checkbox input[type="checkbox"], .graphite-checkbox input[type="checkbox"], .aqua-checkbox-chip input[type="checkbox"], .graphite-checkbox-chip input[type="checkbox"]').forEach(input => {
  const control = input.nextElementSibling;
  if (!control?.classList.contains('aqua-checkbox-control'))
    return;
  const chip = input.closest('.aqua-checkbox-chip, .graphite-checkbox-chip');

  input.addEventListener('change', () => {
    control.classList.remove('settling');
    void control.offsetWidth;
    control.classList.add('settling');
  });

  control.addEventListener('animationend', e => {
    if (e.animationName === 'checkbox-settle')
      control.classList.remove('settling');
  });
});

document.querySelectorAll('.aqua-checkbox-chip, .graphite-checkbox-chip').forEach(chip => {
  const release = () => {
    chip.classList.remove('pressing');
  };

  chip.addEventListener('pointerdown', e => {
    if (e.button !== 0)
      return;

    chip.classList.add('pressing');
  });

  chip.addEventListener('pointerup', release);
  chip.addEventListener('pointercancel', release);
  chip.addEventListener('pointerleave', e => {
    if (e.buttons === 1)
      release();
  });
});

document.querySelectorAll('.aqua-scrollbar').forEach(scrollbar => {
  const track = scrollbar.querySelector('.aqua-scrollbar-track');
  const thumb = scrollbar.querySelector('.aqua-scrollbar-thumb');
  const previous = scrollbar.querySelector('.aqua-scrollbar-previous');
  const next = scrollbar.querySelector('.aqua-scrollbar-next');

  if (!track || !thumb)
    return;

  const thumbSize = parseFloat(scrollbar.dataset.thumbSize ?? 30);
  let currentValue = Math.max(0, Math.min(100, parseFloat(scrollbar.dataset.value ?? 0)));

  function applyValue(value, animate) {
    currentValue = Math.max(0, Math.min(100, value));
    const trackWidth = track.getBoundingClientRect().width;
    const thumbWidth = (thumbSize / 100) * trackWidth;
    const maxLeft = trackWidth - thumbWidth - 4;
    const leftPixels = 2 + (currentValue / 100) * maxLeft;

    if (!animate) {
      thumb.style.transition = 'none';
      requestAnimationFrame(() => {
        thumb.style.transition = '';
      });
    }

    thumb.style.left = leftPixels + 'px';
    thumb.style.setProperty('--thumb-left', leftPixels + 'px');
    thumb.style.width = thumbWidth + 'px';
    scrollbar.dataset.value = Math.round(currentValue);
  }

  requestAnimationFrame(() => applyValue(currentValue, false));

  track.addEventListener('pointerdown', e => {
    if (e.target === thumb || thumb.contains(e.target))
      return;

    const boundingRect = track.getBoundingClientRect();
    const thumbWidth = (thumbSize / 100) * boundingRect.width;
    const clientX = e.clientX - boundingRect.left - thumbWidth / 2;
    const maxLeft = boundingRect.width - thumbWidth - 4;
    applyValue((clientX / maxLeft) * 100, true);
    e.preventDefault();
  });

  let isDragging = false, dragX = 0, dragStartValue = 0;
  thumb.addEventListener('pointerdown', e => {
    isDragging = true;
    dragX = e.clientX;
    dragStartValue = currentValue;
    thumb.setPointerCapture(e.pointerId);
    scrollbar.classList.add('dragging');
    e.stopPropagation();
    e.preventDefault();
  });

  thumb.addEventListener('pointermove', e => {
    if (!isDragging)
      return;

    const trackWidth = track.getBoundingClientRect().width;
    const thumbWidth = (thumbSize / 100) * trackWidth;
    const maxLeft = trackWidth - thumbWidth - 4;
    const deltaX = e.clientX - dragX;
    applyValue(dragStartValue + (deltaX / maxLeft) * 100, false);
  });

  const stopDraggingScroll = () => {
    isDragging = false;
    scrollbar.classList.remove('dragging');
  };

  thumb.addEventListener('pointerup', stopDraggingScroll);
  thumb.addEventListener('pointercancel', stopDraggingScroll);

  const step = 5;

  function startScrolling(direction) {
    applyValue(currentValue + direction * step, true);
    let timer = setTimeout(function repeat() {
      applyValue(currentValue + direction * step, false);
      timer = setTimeout(repeat, 40);
    }, 300);

    const stopScrolling = () => {
      clearTimeout(timer);
      document.removeEventListener('pointerup', stopScrolling);
    }

    document.addEventListener('pointerup', stopScrolling);
  }

  if (previous)
    previous.addEventListener('pointerdown', e => {
      startScrolling(-1);
      e.preventDefault();
    });
  
  if (next)
    next.addEventListener('pointerdown', e => {
      startScrolling(+1);
      e.preventDefault();
    });

  window.addEventListener('resize', () => applyValue(currentValue, false), { passive: true });
});
