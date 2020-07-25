import {
  TalkyJSSkillConfig,
  TalkyJSSkillStage,
  TalkyJSErrorHandlerConfig,
} from '../framework/skillFactory.interface';
import { TLogLevelName } from 'tslog';

export class SkillConfig {
  private static _instance: SkillConfig;
  private _config: TalkyJSSkillConfig & {
    stage: TalkyJSSkillStage;
    logLevel: TLogLevelName;
    errorHandler: TalkyJSErrorHandlerConfig;
  };
  private constructor(config?: TalkyJSSkillConfig) {
    this._config = this.fillDefaultConfigProps(config);
  }
  private fillDefaultConfigProps(config?: TalkyJSSkillConfig) {
    const stage = config && config.stage ? config.stage : 'development';
    const logLevel = config && config.logLevel ? config.logLevel : 'info';
    const skillId = config && config.skillId ? config.skillId : undefined;
    const errorHandler =
      config && config.errorHandler
        ? config.errorHandler
        : {
            usePreset: true,
          };
    return {
      ...config,
      stage,
      logLevel,
      skillId,
      errorHandler,
    };
  }
  private updateConfig(config?: TalkyJSSkillConfig) {
    this._config = this.fillDefaultConfigProps(config);
    return this;
  }
  public loadConfig() {
    return this._config;
  }
  public static getInstance(config?: TalkyJSSkillConfig): SkillConfig {
    if (!this._instance) {
      this._instance = new SkillConfig(config);
    }
    if (config) this._instance.updateConfig(config);
    return this._instance;
  }
  public getDBType() {
    const type = this._config.database?.type;
    if (type === undefined) return 'none';
    return type;
  }
}
