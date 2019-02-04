import { ITaskRunnerResults } from "./interfaces/itaskrunnerresult";
import { ITask } from "./interfaces/itask";
import { IAppConfig } from "./interfaces/config/iappconfig";
import { ITaskConfig } from "./interfaces/config/itaskconfig";
import { Context } from "probot";

export class TaskRunner {
  
  appconfig : IAppConfig;
  taskconfig : ITaskConfig;
  repo: {repo: string, owner: string};
  tasks : string[];

  constructor(appconfig : IAppConfig, taskconfig : ITaskConfig, repo: {repo: string, owner: string}) {
    this.appconfig = appconfig;
    this.taskconfig = taskconfig;
    this.repo = repo;
    this.tasks = Object.keys(this.taskconfig);
  }

  async run(context: Context) : Promise<ITaskRunnerResults>{
    const results = new Array<ITask>();

    for(const task of this.tasks){
      
      var tConfig = this.taskconfig[task];

      try{
        // The 2019 winner of the most wonderful syntax award... 
        //wanted to cast this as basetask, but seems impossible since we cannot load a type dynamicly into a generic
        var t : any = new ((await import("./tasks/" + task)).default)(this.appconfig, tConfig, this.repo);
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