// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, ipcMain, Menu } = require("electron");
const path = require("path");
const url = require("url");
const { mainMenu, contextMenu } = require("./menuTemplate");
const regedit = require("regedit");

Menu.setApplicationMenu(mainMenu);

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  ipcMain.on("get-installed-apps", async (event) => {
    await regedit.list(
      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall",
      function (err, resultList) {
        if (err) {
          console.log(err);
        } else {
          resultList[
            "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall"
          ].keys.forEach(function (key) {
            regedit.list(
              "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\" +
                key,
              function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  // console.log(result['HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\' + key].values['DisplayName'].value);
                  // event.reply('installed-apps', result['HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\' + key]);
                  const temp =
                    result[
                      "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\" +
                        key
                    ];
                  // console.log(temp);
                  // apps.push(temp);
                  if (temp.values["DisplayName"]) {
                    event.reply("installed-apps", temp);
                  }
                  // return result[
                  //   "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\" +
                  //     key
                  // ];
                }
              }
            );
          });
        }
      }
    );
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  // OK laisse moi reflechir deux sec, mdrrr j'ai deux eleve en meme temps plus un troisieme mdrr mais tkt je fais toi puis eux
 // on peux discord ?
  // mainWindow.webContents.on("context-menu", () => {
  //   contextMenu.popup(mainWindow.webContents);
  // });




  ipcMain.on("send-app" , (event,app) => {
    // console.log("🚀 ~ file: menuTemplate.js:98 ~ ipcMain.on ~ event:", event)
    // console.log(app);
    const newMenu = contextMenu(app);
    const menuCont = Menu.buildFromTemplate(newMenu);
    menuCont.popup(mainWindow.webContents);
    // console.log("🚀 ~ file: electron.js:106 ~ ipcMain.on ~ newMenu:", newMenu)

  })

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

/* Here is the explanation for the code above:
1. First, the protocol is registered using the registerFileProtocol method.
2. The callback function is invoked with a URL that is provided as a parameter.
3. The URL is then used to load the file that is available on the local machine. */
// Register a custom protocol for loading local files.
const localFileProtocol = () => {
  const protocolName = "safe-file";
  // https://www.electronjs.org/fr/docs/latest/api/protocol#protocolregisterfileprotocolscheme-handler
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, "");
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });
};

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
  localFileProtocol();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
