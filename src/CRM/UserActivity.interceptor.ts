import { RequestInterceptor } from 'ask-sdk-core';
import { UserActivityManager } from './UserActivity.classs';

export const SkillInvocationRecorder: RequestInterceptor = {
  async process(input) {
    const manager = new UserActivityManager(input);
    await manager.trackSkillInvocation();
  },
};

/**
 * リクエスト時に起動数とターン数を記録する。
 * ・起動数はDBにはいる（実装済み）
 * ・ターン数はセッションにいれておく
 * 　・イベント系とかのリクエストは除外するようにする
 * 　・あとAttributesManagerがない時も除外
 */
