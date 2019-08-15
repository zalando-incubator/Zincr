import { ITaskRunnerResults } from "./interfaces/itaskrunnerresult";
import { ITask } from "./interfaces/itask";
import { IAppConfig } from "./interfaces/config/iappconfig";
import { ITaskConfig } from "./interfaces/config/itaskconfig";
import { Context } from "probot";
import { BaseTask } from "./tasks/base";
import { ITaskParams } from "./interfaces/params/itaskparams";
import { ITaskRunnerParams } from "./interfaces/params/itaskrunnerparams";

export class TaskRunner {
  
  appconfig : IAppConfig;
  taskconfig : ITaskConfig;
  repo: {repo: string, owner: string};
  tasks : Array< [string, any] > ;
  organization: string | null;

  constructor(params : ITaskRunnerParams) {
    this.appconfig = params.appconfig;
    this.taskconfig = params.taskconfig;
    this.repo = params.repo;
    this.tasks = Object.entries(this.taskconfig).filter(x => x[1].enabled);
    this.organization = params.organization;
  }

  async loadRunners() : Promise< Array<BaseTask<any>> >{
    
    const runners = new Array<BaseTask<any>>();

    for(const task of this.tasks){
      
      var taskname = task[0];
      var tConfig = task[1];

    
        // The 2019 winner of the most wonderful syntax award... 
        const params : ITaskParams<any> = {
          appconfig: this.appconfig,
          config: tConfig,
          repo: this.repo,
          organization: this.organization
        };

        try{
        var t : BaseTask<any> = new ((await import(params.appconfig.tasksdirectory + taskname)).default)(params);
        if(t !== null){
          runners.push(t);
        }
        }catch(ex){
          console.log(ex);
        } 
    }
    
    return runners;
  }

  async run(context: Context) : Promise<ITaskRunnerResults>{
    const results = new Array<ITask<any>>();
    const runners = await this.loadRunners();
    
    for(const runner of runners){
        await runner.start(context);
        results.push(runner);
    }
    
    const result : ITaskRunnerResults =  {
      Failure : results.filter(x => x.summary().Failure.length > 0),
      Warning : results.filter(x => x.summary().Warning.length > 0 && x.summary().Failure.length == 0),
      Success : results.filter(x => x.summary().Warning.length == 0 && x.summary().Failure.length == 0)
    }

    return result;

  }
}