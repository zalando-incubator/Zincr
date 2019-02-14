import { IAppConfig } from "../interfaces/config/iappconfig";
import { ITaskConfig } from "../interfaces/config/itaskconfig";
import { TaskConfig } from "./tasks";
import { Context } from "probot";

let AppConfig : IAppConfig= {
  appname:  "zincr",
  checkname:  "Zincr-bot",
  configfile: ".zincr.yml",
  zapprfile: "../.zappr.yml",
  tasksdirectory: "./tasks/"
};

async function getTasksConfig(context : Context) : Promise<ITaskConfig> {
    var config = await context.config(AppConfig.configfile);
    
    if(config)
      return {TaskConfig, ...config};
    
    var zapprConfig = await context.config(AppConfig.zapprfile);
    
    if(zapprConfig)
      return {TaskConfig, ...zapprConfig};

    return TaskConfig;
}

export { AppConfig, getTasksConfig };
