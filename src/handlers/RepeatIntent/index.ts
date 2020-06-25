import { RepeatIntent } from './RepeatIntent.handler';
import { RecordTheResponseInterceptor } from './RepeatIntent.interceptor';
import { CustomSkillBuilder } from 'ask-sdk-core';
export * from './RepeatIntent.handler';
export * from './RepeatIntent.interceptor';

/**
 * Add AMAZON.RepeatIntent handler and record last response to the session interceptor
 * @param skill
 */
export const withRepeatIntentHandler = (
  skill: CustomSkillBuilder
): CustomSkillBuilder => {
  skill
    .addResponseInterceptors(RecordTheResponseInterceptor)
    .addRequestHandlers(RepeatIntent);
  return skill;
};
