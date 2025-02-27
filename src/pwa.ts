import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onRegisteredSW(swScriptUrl) {
    console.log("SW registered:", swScriptUrl);
  },
  onOfflineReady() {
    console.log("PWA application ready to work offline");
  },
});

export { updateSW };
