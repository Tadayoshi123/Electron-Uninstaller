import { useEffect, useState } from "react";
import {
  AppTable,
  AppTableHeader,
  AppTableData,
  AppTableRow,
  AppIcon,
} from "../styled-components/appTable";

// L'objectif est de récupérer la liste des applications isntallées sur l'ordinateur et de les afficher dans un tableau.

const AppTableComponent = () => {
  const [regAppList, setRegAppList] = useState([]);
  const [currentApp, setCurrentApp] = useState({});

  const requestInstalledApps = () => {
    window.apps.requestInstalledApps();
    window.apps.getInstalledApps(setRegAppList);
    // console.log(regAppList)
  };

  useEffect(() => {
    requestInstalledApps();
  }, []);

  useEffect(() => {
    if (currentApp === {}) return;
    // console.log("🚀 ~ file: index.js:34 ~ AppTableComponent ~ currentApp:", currentApp)

    window.apps.sendAppContextMenu(currentApp);
  }, [currentApp]);

  // useEffect(() => {
  //   // console.log(regAppList);
  // }, [regAppList]);

  const handleClick = (e, app) => {
    if (e.type === "click") {
      console.log("Left click");
    } else if (e.type === "contextmenu") {
      console.log("Right click");
      // console.log(app);
      setCurrentApp(app);
    }
  };

  return (
    <AppTable>
      <AppTableHeader>Program Name</AppTableHeader>
      {/* <AppTableHeader>Size</AppTableHeader>
      <AppTableHeader>Date Install</AppTableHeader> */}
      <tbody id="tableBody">
        {regAppList.map((app) => (
          <AppTableRow
            key={app.DisplayName}
            onClick={handleClick}
            onContextMenu={(e) => handleClick(e, app)}
          >
            <AppTableData>
              {app.values.DisplayIcon ? (
                !app.values.DisplayIcon.value.includes(".exe") ? (
                  <AppIcon
                    src={`safe-file://${app.values.DisplayIcon.value}`}
                  />
                ) : null
              ) : null}
              {/* <img src={`safe-file://${app.values.DisplayIcon.value}`} alt="icon" /> */}
              {app.values.DisplayName.value}
            </AppTableData>
            {/* <AppTableData>{app.size}</AppTableData>
            <AppTableData>{app.dateInstall}</AppTableData> */}
          </AppTableRow>
        ))}
      </tbody>
    </AppTable>
  );
};

export default AppTableComponent;
