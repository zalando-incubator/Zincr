import { ITaskRunnerResults } from "./interfaces/itaskrunnerresult";
import { ITask } from "./interfaces/itask";
import { IAppConfig } from "./interfaces/config/iappconfig";
import { ITaskConfig } from "./interfaces/config/itaskconfig";
import { Context } from "probot";

export class TaskRunner {
  
  appconfig : IAppConfig;
  taskconfig : ITaskConfig;
  repo: {repo: string, owner: string};
  tasks : Array< [string, any] > ;
  organization: string | undefined;

  constructor(appconfig : IAppConfig, taskconfig : ITaskConfig, repo: {repo: string, owner: string}, organization: string | undefined) {
    this.appconfig = appconfig;
    this.taskconfig = taskconfig;
    this.repo = repo;
    this.tasks = Object.entries(this.taskconfig).filter(x => x[1].enabled);
    this.organization = organization;
  }

  async run(context: Context) : Promise<ITaskRunnerResults>{
    const results = new Array<ITask>();

    for(const task of this.tasks){
      
      var taskname = task[0];
      var tConfig = task[1];

      try{
        // The 2019 winner of the most wonderful syntax award... 
        //wanted to cast this as basetask, but seems impossible since we cannot load a type dynamicly into a generic
        var t : any = new ((await import(this.appconfig.tasksdirectory + taskname)).default)(this.appconfig, tConfig, this.repo, this.organization);
        if(t !== null){
          await t.run(context);
          results.push(t);
        }
      }catch(ex){
        console.log(ex);
      }
    }
    
    const result : ITaskRunnerResults =  {
      Failure : results.filter(x => x.summary().Failure.length > 0),
      Warning : results.filter(x => x.summary().Warning.length > 0 && x.summary().Failure.length == 0),
      Success : results.filter(x => x.summary().Warning.length == 0 && x.summary().Failure.length == 0)
    }

    return result;

  }
}