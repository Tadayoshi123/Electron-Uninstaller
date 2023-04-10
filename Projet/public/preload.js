// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
  contextBridge.exposeInMainWorld("apps", {
    sendAppContextMenu : (app) => {
      ipcRenderer.send("send-app", app);
    },
    requestInstalledApps: () => {
      ipcRenderer.send("get-installed-apps");
    },
    getInstalledApps: (setState) => {
      ipcRenderer.on("installed-apps", (event, data) => {
        // console.log(data);
        setState(oldState => {
          const isPresent = oldState.find(app => app.values.DisplayName.value === data.values.DisplayName.value);
          if (isPresent) {
            return oldState;
          } else {
          return [...oldState, data]}
        });
      });
    },
    
  });
});
