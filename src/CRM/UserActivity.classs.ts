import { HandlerInput, isNewSession } from 'ask-sdk-core';
import { RequestEnvelope } from 'ask-sdk-model';
import moment from 'moment';
import { isSkillEvent } from '@ask-utils/core';
import { PersistentAttributesManager } from '../PersistentAttributesManager';
import {
  UserActivityConfig,
  UserActivityAdapter,
  UserActivity,
} from './UserActivity.interface';
import { getUnixTime, defaultUserActivityConfig } from './UserActivity.utils';
import { SkillConfig } from '../Config/Config';
import { TalkyJSDBType } from 'framework';

type ActivityAttributes = {
  invocationNumber: number;
  lastInvocationTime: number;
}
export class UserActivityManager extends PersistentAttributesManager<ActivityAttributes> {
  protected readonly adapter?: UserActivityAdapter;
  protected readonly requestEnvelope: RequestEnvelope;
  protected readonly config: UserActivityConfig;
  private readonly dbType: TalkyJSDBType
  protected readonly defaultAttributes: ActivityAttributes = {
    invocationNumber: 0,
    lastInvocationTime: getUnixTime(),
  };
  public constructor(
    {
      attributesManager,
      requestEnvelope,
    }: Pick<HandlerInput, 'attributesManager' | 'requestEnvelope'>,
    config: UserActivityConfig = defaultUserActivityConfig,
    options?: {
      adapter?: UserActivityAdapter;
      dbType?: TalkyJSDBType
    }
  ) {
    super(attributesManager);
    this.requestEnvelope = requestEnvelope;
    this.adapter = options?.adapter;
    this.dbType = options && options.dbType ? options.dbType : SkillConfig.getInstance().getDBType()
    this.config = config;
  }

  /**
   * Check the first skill invocation
   */
  public async isFirstSkillInvocation(): Promise<boolean> {
    const data = await this.getLastActivity();
    if (!data) return false;
    return data.invocationNumber <= 1;
  }

  /**
   * If the user will be returned after churning, it will be true
   */
  public async isReturnedUser(): Promise<boolean> {
    const data = await this.getLastActivity();
    if (!data) return false;
    const diff = moment().diff(moment.unix(data.lastInvocationTime), 'days');
    return diff > this.config.returnedUserDays;
  }

  /**
   * Get The user activity
   */
  public async getLastActivity(): Promise<UserActivity | null> {
    if (this.dbType === 'none') {
      return null;
    }

    const data = await this.getPersistentAttributes(this.defaultAttributes);
    return data;
  }

  /**
   * Update skill invocation activity
   */
  public async trackSkillInvocation(): Promise<void> {
    if (!isNewSession(this.requestEnvelope)) return;
    if (isSkillEvent(this.requestEnvelope)) return;
    if (!this.attributeManager) return;
    const activity = await this.getLastActivity();
    const data = activity || this.defaultAttributes
    data.invocationNumber = data.invocationNumber + 1;
    data.lastInvocationTime = getUnixTime();

    await this.updatePersistentAttributes(data);

    /**
     * Execute additional track skill invocation event
     */
    if (this.adapter) {
      await this.adapter.trackSkillInvocation(this.requestEnvelope);
    }
  }
}
