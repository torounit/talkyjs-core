import { RequestInterceptor } from 'ask-sdk-core';
import { UserActivityManager } from './UserActivity.classs';

export const SkillInvocationRecorder: RequestInterceptor = {
  async process(input) {
    const manager = new UserActivityManager(input);
    await manager.trackSkillInvocation();
  },
};

/**
 * @todo
 * - turn1でSTOP / Cancel / SessionEndedを実行されたら記録する（直帰）
 * - ISP系のリクエストがあったら記録する
 *   - ISP興味持ったけど、購入しなかった（カゴ落ち）
 *   - 購入まで行った（CV）
 *   - キャンセルした(churn)
 * - 権限許可した・しなかったの記録（これもCV?）
 * - GAかHubSpotにputEventできるAdapterでも作ってやる？
 */
