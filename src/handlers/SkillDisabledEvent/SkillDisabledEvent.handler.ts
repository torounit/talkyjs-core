import { RequestHandler, createAskSdkError, getUserId } from 'ask-sdk-core';
import { LoggerService } from '../../Logger';

export const SkillDisabledEventHandler: RequestHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === 'AlexaSkillEvent.SkillDisabled';
  },
  async handle(handlerInput) {
    const { logger } = LoggerService.getInstance(handlerInput.requestEnvelope);
    const userId = getUserId(handlerInput.requestEnvelope)
    logger.info(`User ${userId} has disabled the skill`)
    const { deletePersistentAttributes } = handlerInput.attributesManager
    if (!deletePersistentAttributes) throw createAskSdkError('DeleteDisabledUserHandler', 'deletePersistentAttributes is not defined. Please upgrade your ask-sdk.')
    await deletePersistentAttributes()
    logger.info(`Delete the user data: ${userId}`)
    return handlerInput.responseBuilder.getResponse()
  },
};
