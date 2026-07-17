import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    glsl({
      warnDuplicatedImports: true,
      removeDuplicatedImports: true,
    }),
  ],
});
