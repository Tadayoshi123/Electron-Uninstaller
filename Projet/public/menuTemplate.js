const { app, Menu, shell } = require("electron");
const { exec } = require("child_process");

// Menu template for the main window that should behave like geek unistaller

const menuTemplate = [
  {
    label: "Action",
    submenu: [
      {
        label: "Uninstall",
        click: () => {
          // Execute the function that will execute the uninstallation of the selected program
          console.log("Uninstall");
        },
      },
      {
        label: "Modify",
        click: () => {
          // Execute the function that will execute the modification of the selected program
          console.log("Modify");
        }
      },
      {
        label: "Installation Folder",
        click: () => {
// Execute the function that will open the installation folder of the selected program
          console.log("Installation Folder");
        }
      },
      {
        label: "Program Website",
        click: () => {
          // Execute the function that will execute the modification of the selected program
          console.log("Program Website");
        }
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Color Scheme",
        submenu: [
          {
            label: "Light Theme",
            click: () => {
              // Execute the function that will change the color scheme to light
              console.log("Light Theme");
            },
          },
          {
            label: "Dark Theme",
            click: () => {
              // Execute the function that will change the color scheme to dark
              console.log("Dark Theme");
            },
          },
        ]
      },
      {
        label: "Refresh",
        role: "reload",
        accelerator: "F5",
      },
    ],
  },
  {
    label: "Electron Uninstaller",
    submenu: [
      {
        label: "About",
        role: "about",
      },
      {
        label: "Quit",
        role: "quit",
      },
    ],
  },
];

const contextMenuTemplate = (app) => [
  {
    label: "Uninstall",
    click: () => {
      // Execute the function that will execute the uninstallation of the selected program
      if (app.values.UninstallString.value) {
        exec(app.values.UninstallString.value, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      }
      console.log("Uninstalling App ",app.values.DisplayName.value)
    },
  },
  {
    label: "Modify",
    click: () => {
      // Execute the function that will execute the modification of the selected program
      if (app.values.ModifyPath.value) {
        exec(app.values.ModifyPath.value, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
        console.log("Modifying App ",app.values.DisplayName.value)
      } else {
        console.log("No ModifyPath for ",app.values.DisplayName.value)
      }
    },
  },
  {
    label: "Installation Folder",
    click: () => {
      // Execute the function that will open the installation folder of the selected program
      shell.openExternal(app.values.InstallLocation.value);
      console.log("Installation Folder of ",app.values.DisplayName.value)
    },
  },
  {
    label: "Program Website",
    click: () => {
      shell.openExternal(app.values.URLInfoAbout.value);
      console.log("Program Website of ",app.values.DisplayName.value);
    },
  },
];

module.exports.mainMenu = Menu.buildFromTemplate(menuTemplate);
// module.exports.contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
module.exports.contextMenu = contextMenuTemplate;
