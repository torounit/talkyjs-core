import { isIntentRequestType } from '@ask-utils/core';
import { Request } from 'ask-sdk-model'; // 'ask-sdk-core/node_modules/ask-sdk-model'
import { Router } from '../model';
import { CountSituationOption } from '../model';

type State = string

export const shouldMatchRequestType = <T extends State = State>(
  request: Request,
  route: Router<T>
): boolean => {
  if (request.type !== route.requestType) return false;
  return true;
};
export const shouldMatchIntentRequest = <T extends State = State>(
  request: Request,
  route: Router<T>
): boolean => {
  if (!isIntentRequestType(request)) return false;
  /**
   * If the route handler expect to NOT IntentRequest, should return false
   */
  if (route.requestType !== 'IntentRequest') return false;
  if (!route.intentName) return true;
  if (typeof route.intentName === 'string') {
    return route.intentName === request.intent.name;
  }
  const matchedIntentName = route.intentName.find(
    name => name === request.intent.name
  );
  return !!matchedIntentName;
};

type CompareResult = 'true' | 'false' | undefined;
export const compareCountableSituation = (
  situation?: CountSituationOption,
  target: number = 0
): CompareResult => {
  let result: CompareResult;
  if (!situation) return result;
  const { gte, gt, eq, lt, lte } = situation;
  if (eq !== undefined) {
    result = eq === target ? 'true' : 'false';
    return result;
  }

  if (gte !== undefined) {
    result = gte <= target ? 'true' : 'false';
  } else if (gt !== undefined) {
    result = gt < target ? 'true' : 'false';
  }

  if (lt !== undefined) {
    result = lt > target ? 'true' : 'false';
  } else if (lte !== undefined) {
    result = lte >= target ? 'true' : 'false';
  }
  return result;
};
