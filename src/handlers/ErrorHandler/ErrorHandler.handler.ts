import { ErrorHandler as IErrorHandler, RequestInterceptor, CustomSkillBuilder } from 'ask-sdk-core';
import { LoggerService } from '../../Logger';
import { TalkyJSErrorHandlerConfig } from '../../framework' 
import * as Sentry from '@sentry/node'

import {
  ErrorHandlerService
} from './ErrorHandler.service'

export const createErrorHandler = (conf: TalkyJSErrorHandlerConfig): IErrorHandler => {
  const handler: IErrorHandler = {
    canHandle(input) {
      return ErrorHandlerService.canSpeakRequest(input)
    },
    handle: (handlerInput, error) => {
      const { logger } = LoggerService.getInstance(handlerInput.requestEnvelope);
      logger.error(error)
      if (conf.sentry) {
        Sentry.captureEvent({
            message: error.message,
            extra: {
                request: handlerInput.requestEnvelope,
                error,
                stack: error.stack
            }
        })
      }
      const {speak, reprompt } = ErrorHandlerService.getResponse(handlerInput)
        return handlerInput.responseBuilder
            .speak(speak)
            .reprompt(reprompt)
            .getResponse()
    }
  }
  return handler
}

const ConfigureSentryErrorInterceptor: RequestInterceptor = {
  process ({ requestEnvelope }) {
      const { System } = requestEnvelope.context
      const userParams: {[key: string]: string} = {
          userId: System.user.userId
      }
      if (System.device) userParams.deviceId = System.device.deviceId
      if (requestEnvelope.session) userParams.sessionId = requestEnvelope.session.sessionId

      Sentry.configureScope(scope => {
          scope.setTag('request_id', requestEnvelope.request.requestId)
          scope.setUser(userParams)
      })
  }
}

export const withErrorHandler = (skill: CustomSkillBuilder, config: TalkyJSErrorHandlerConfig): CustomSkillBuilder => {
  if (!config.usePreset) return skill;
  if (config.sentry) {
    Sentry.init({ dsn: config.sentry.dsn })
    skill.addRequestInterceptors(ConfigureSentryErrorInterceptor)
  }
  skill.addErrorHandlers(createErrorHandler(config))  
  return skill
}