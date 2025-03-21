import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  outDir: 'dist',
  manifest: {
    name: 'Scambuzzer',
    version: '1.0.0',
    description: 'Scambuzzer is a browser extension that helps you avoid scams and phishing attacks.',
    permissions: ["storage", "activeTab", "scripting", "tabs","contextMenus"],
    host_permissions: ["<all_urls>","https://mail.google.com/*","https://nilai-a779.nillion.network/*"],
    action: {
      default_popup: "popup/index.html",
    },
    web_accessible_resources: [
      {
        resources: ["contracts/index.html"],
        matches: ["<all_urls>"],
      },
    ],
    background: {
      service_worker: "background.ts",
      type: "module",
    },  
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
