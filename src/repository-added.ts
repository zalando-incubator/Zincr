import { Context } from "probot";
import { AppConfig } from "./config/app";
import LicenseTask from "./tasks/license";
import { ILicenseConfig } from "./interfaces/config/ilicenseconfig";
import { StatusEnum } from "./interfaces/StatusEnum";

async function repositoryAdded(context: Context) {
  
  if(
      context.payload.action === 'added' &&  
      context.payload.repositories_added.length > 0
      ){

    var installs = context.payload.repositories_added;
    
    for(const install of installs){
      
      const repo = {owner: install.full_name.split("/")[0], repo: install.name};
      
      // as we run the initial install, we do not have access to the configuration, so we use the repo license to determine compliance
      const repo_data = await context.github.repos.get({...repo});
      const licfg : ILicenseConfig = { 
                    onNolicense: StatusEnum.Warning, 
                    onNotFound: StatusEnum.Success, 
                    baseLicense: repo_data.data.license.spdx_id,
                    enabled: true
                  };
                  
      const licenseTask = new LicenseTask(AppConfig, licfg, repo);
      licenseTask.description = "Dependencies found in the current codebase";

      await licenseTask.run(context);
      const issueBody = licenseTask.render( {includeHeader: false, includeDescription: true, addCheckBox: true });

      await context.github.issues.create({ ...repo, title: "Dependencies", body: issueBody });
    }
  } 
}

export { repositoryAdded }