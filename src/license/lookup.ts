import { Context } from "probot";

import { LicenseLookup } from "license-lookup"
import { StatusEnum } from "../interfaces/StatusEnum";
import { LicenseTypes, FindCompatible } from "../config/licensetypes";
import { ILicenseConfig } from "../interfaces/config/ilicenseconfig";
import { IResult } from "../interfaces/iresult";
import { IResultSummary } from "../interfaces/iresultsummary";
import { ILicenseTypes } from "../interfaces/config/ilicensetypes";
import { PullRequestsGetResponse } from "@octokit/rest";
import { IDependency } from "license-lookup/lib/interfaces/IDependency";


export default class Lookup {
  
  result = new Array<IResult>();
  private _summary : IResultSummary | null = null;
  private _config : ILicenseConfig;
  private _onlyNew : boolean = true;
  private _context : Context;

  constructor(config: ILicenseConfig, context: Context,  onlyNew : boolean = true) {
    this._onlyNew = onlyNew;
    this._config = config;
    this._context = context;

    this._config.exclude = this._buildConfig(config.exclude, LicenseTypes);

    if(this._config.baseLicense){
      this._config.onlyAllow = FindCompatible(this._config.baseLicense);
    }else{
      this._config.onlyAllow = this._buildConfig(config.onlyAllow, LicenseTypes);
    }
  }
  
  private _buildConfig(licenses: Array<string> | undefined, licenseTypes: ILicenseTypes){
    
    if(licenses){
        for (const group of Object.keys(licenseTypes)) {
          var groupIndex = licenses.indexOf(group);
          if(groupIndex >= 0){
            licenses.splice(groupIndex, 1);
            licenses.push(...licenseTypes[group.toString()])
          }
        }
    }
    
    return licenses; 
  }

  private _licenseBanned(license : string | undefined){
    if(!license){
      return StatusEnum.Warning; 
    }

    if(!this._config){
      return StatusEnum.Warning; 
    }

    if(this._config.exclude && this._config.exclude.length>0 && this._config.exclude.indexOf(license)>=0){
      return StatusEnum.Failure;
    }

    if(this._config.onlyAllow && this._config.onlyAllow.length>0 && this._config.onlyAllow.indexOf(license)<0){
      return StatusEnum.Failure;
    }

    return StatusEnum.Warning;
  }

  async run(repo: {repo: string, owner: string}, ref : string = 'master', pr: PullRequestsGetResponse | undefined = undefined) : Promise<Array<IResult>>{

    let files : Array<string> = [];

    // only if a PR is provided and comparable mode is enabled
    // otherwise scan all files to get a complete view of found dependencies
    if(pr){
      const pr_contents = await this._context.github.pullRequests.listFiles({ ...repo, number: pr.number});
      files = pr_contents.data.map(x => x.filename); 
    }else{
      const repo_contens : Array<any> = (await this._context.github.repos.getContents({...repo, path: "/"})).data;
      files = repo_contens.filter(x  => x.type === "file").map(x => x.path)
    }

    var ll = new LicenseLookup();
    var matches = ll.matchFilesToManager(files);
    if(matches.length == 0)
    {
      return [];
    }

    for(const match of matches){

      try{

      var deps : Array<IDependency> = [];

      // if we only want new dependencies, we must exclude the ones currently in the base
      if(pr){

        // get proposed dependencies
        var head_response = await this._context.github.repos.getContents( {...repo, ref: pr.head.ref, path: match.file})
        const head_content = Buffer.from(head_response.data.content, 'base64').toString()
        deps = await match.manager.detect(head_content);

        if(this._onlyNew){
          // get current dependencies
          const base = {repo: pr.base.repo.name, owner: pr.base.repo.owner.login};
          var base_response = await this._context.github.repos.getContents( {...base, path: match.file,});
          const base_content = Buffer.from(base_response.data.content, 'base64').toString()
          var base_deps = await match.manager.detect(base_content);
          
          //filter out existing
          var baseDepsKeys = base_deps.map(x => x.name);
          deps = deps.filter( x => baseDepsKeys.indexOf(x.name)<0 );
        }
      }else{
        var repo_response = await this._context.github.repos.getContents( {...repo, ref: ref, path: match.file})
        const repo_content = Buffer.from(repo_response.data.content, 'base64').toString()
        deps = await match.manager.detect(repo_content);
      }
      
      var deps_lookup = await match.manager.lookup(deps);
      
      for(var dd of deps_lookup){

        var res : IResult = {
          label: `Detected **[${dd.name}](${dd.url})** as a dependency in **${match.file}**, ${dd.license ?  `licensed under: **[${dd.license}](https://spdx.org/licenses/${dd.license}.html)**` : 'With an unknown license' }`,
          result: this._licenseBanned(dd.license),
          dependency: dd
        };

        if(res.result === StatusEnum.Failure){
          res.description = "This dependency is distributed under a license which is not allowed on this project - **this pull request can therefore not be merged**";
        }else{
          res.description = `lease [review it](${dd.url}) and confirm you wish to introduce this to the codebase`;
        }

        this.result.push(res);
      }
      }catch(ex){
        this.result.push({
          label: `Could not process **${match.file}** for new dependencies`,
          result: StatusEnum.Warning
        });
      }
    }

    return this.result;
  }

  summary(){

    if(this._summary == null){
      
      this._summary = {
        Success : this.result.filter(x => x.result == StatusEnum.Success),
        Failure : this.result.filter(x => x.result == StatusEnum.Failure),
        Warning : this.result.filter(x => x.result == StatusEnum.Warning)
      };

    }

    return this._summary
  }

  render(incudeDescription : boolean = true){
    const icon = (status: StatusEnum)=>{
      switch (status) {
        case StatusEnum.Success:
          return '✅'
        case StatusEnum.Failure:
          return '❌'
        case StatusEnum.Warning:
          return '⚠️'
        default:
          return 'ℹ️'
      }
    }

   
    var resolutions = [];
   
    if(this.result){
      
      for(const subResult of this.result){
          resolutions.push(`#### ${icon(subResult.result)} ${subResult.label}`);
          
          if(subResult.dependency && incudeDescription){
            if(subResult.result === StatusEnum.Failure){
              resolutions.push("This dependency is distributed under a license which is not allowed on this project - **this pull request can therefore not be merged**");
            }else{
              resolutions.push(`lease [review it](${subResult.dependency.url}) and confirm you wish to introduce this to the codebase`);
            }
        }
      }
    }

    return resolutions.join('\n');
  }
}




