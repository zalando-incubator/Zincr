import { IAppParams } from "../interfaces/params/iappparams";
import { AppConfig, getTasksConfig } from "../config/app";
import { Zincr } from "../zincr";
import { Context } from "probot";

export async function processPullRequest(context : Context) {
  const params : IAppParams = {
    repo: context.repo(),
    organization: null,
    taskconfig: await getTasksConfig(context), 
    appconfig: AppConfig
  };

  if(context.payload.repository.organization && context.payload.repository.organization.login){
    params.organization = context.payload.repository.organization.login;
  }

  var zincr = new Zincr(params);
  await zincr.onChange(context); 
}