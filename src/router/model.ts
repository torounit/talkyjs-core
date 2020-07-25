import { HandlerInput } from 'ask-sdk';
import { Response, Request } from 'ask-sdk-model'; // 'ask-sdk-core/node_modules/ask-sdk-model'

/**
 * Router for ASK SDK v2
 */
export type CountOperator = 'gt' | 'gte' | 'eq' | 'lte' | 'lt';
export type CountSituationOption = {
  [operator in CountOperator]?: number;
};
export interface RouteSituation<State extends string = string> {
  state?: State;
  custom?: (input: HandlerInput) => boolean | Promise<boolean>;
  shouldEndSession?: boolean;
  // Number of the invocation of the skill by the user
  invocationCount?: CountSituationOption;
  // The session turn count
  turnCount?: CountSituationOption;
}

export type RouterHandler = (
  handlerInput: HandlerInput
) => Response | Promise<Response>;

export interface Router<State extends string = string> {
  requestType: Request['type'];
  intentName?: string | string[];
  situation?: RouteSituation<State>;
  handler: RouterHandler;
}
