import { RequestInterceptor } from 'ask-sdk-core';
import { UserActivityManager } from './UserActivity.classs';

export const SkillInvocationRecorder: RequestInterceptor = {
  async process(input) {
    const manager = new UserActivityManager(input);
    await manager.trackSkillInvocation();
  },
};
