import { RequestHandler, getRequest } from 'ask-sdk-core';
import { LoggerService } from '../../Logger';
import { SessionEndedRequest } from 'ask-sdk-model';

export const SessionEndedRequestHandler: RequestHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(input) {
    const { logger } = LoggerService.getInstance(input.requestEnvelope);
    const request = getRequest<SessionEndedRequest>(input.requestEnvelope)
    logger.info('Session ended with reason:', request.reason)
    if (request.error) logger.error('Error', request.error)
    return input.responseBuilder.getResponse()
  },
};
