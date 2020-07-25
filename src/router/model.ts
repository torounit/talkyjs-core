import { HandlerInput } from 'ask-sdk';
import { Response, Request } from 'ask-sdk-model'; // 'ask-sdk-core/node_modules/ask-sdk-model'
import { StateManager, State } from '@ask-utils/situation';

/**
 * Router for ASK SDK v2
 */
export type CountOperator = 'gt' | 'gte' | 'eq' | 'lte' | 'lt';
export type CountSituationOption = {
  [operator in CountOperator]?: number;
};
export interface RouteSituation {
  state?: SituationState;
  custom?: (input: HandlerInput) => boolean | Promise<boolean>;
  shouldEndSession?: boolean;
  // Number of the invocation of the skill by the user
  invocationCount?: CountSituationOption;
  // The session turn count
  turnCount?: CountSituationOption;
}

interface SituationState {
  current?: string;
  next?: string;
}

export interface HandlerHelpers<T extends State = State> {
  stateManager: StateManager<T>;
}
export type RouterHandler<T extends State = State> = (
  handlerInput: HandlerInput,
  helpers: HandlerHelpers<T>
) => Response | Promise<Response>;

export interface Router<T extends State = State> {
  requestType: Request['type'];
  intentName?: string | string[];
  situation?: RouteSituation;
  handler: RouterHandler<T>;
}
