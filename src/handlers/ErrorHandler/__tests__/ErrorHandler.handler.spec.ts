import {
  HandlerInputCreator,
} from '@ask-utils/test';
import { withErrorHandler, createErrorHandler } from '../index';
import { SkillBuilders, CustomSkillBuilder } from 'ask-sdk-core';
import { RequestEnvelope } from 'ask-sdk-model';

describe('withErrorHandler', () => {
  let skill: CustomSkillBuilder
  let event: RequestEnvelope
  beforeEach(() => {
    skill = SkillBuilders.custom().addRequestHandlers({
      canHandle: () => true,
      handle: () => {throw new Error('test')}
    })
    const { requestEnvelope } = new HandlerInputCreator().createLaunchRequest()
    event = requestEnvelope
  })
  it('should reject error if usePreset is false', async () => {
    skill = withErrorHandler(skill, {
      usePreset: false
    })
    await expect(skill.create().invoke(event)).rejects.toThrowError('test')
  })
  it('should handle Error if usePreset is true', async () => {
    skill = withErrorHandler(skill, {
      usePreset: true
    })
    await expect(skill.create().invoke(event)).resolves.toMatchObject({
      "response": {
        "outputSpeech": {
          "ssml": "<speak>Sorry I could not understand the meaning. Please tell me again</speak>",
          "type": "SSML",
        },
        "reprompt": {
          "outputSpeech": {
            "ssml": "<speak>Could you tell me onece more?</speak>",
            "type": "SSML",
          },
        },
        "shouldEndSession": false,
      },
      "sessionAttributes": {},
      "userAgent": expect.any(String),
      "version": expect.any(String),
    })
  })
  it('should handle Error by own made', async () => {
    skill = withErrorHandler(skill, {
      usePreset: false
    }).addErrorHandlers({
      canHandle: () => true,
      handle: input => {
        return input.responseBuilder.speak('Sorry I could not understand the meaning. Please tell me again').getResponse()
      }
    })
    await expect(skill.create().invoke(event)).resolves.toMatchObject({
      "response": {
        "outputSpeech": {
          "ssml": "<speak>Sorry I could not understand the meaning. Please tell me again</speak>",
          "type": "SSML",
        },
      },
      "sessionAttributes": {},
      "userAgent": expect.any(String),
      "version": expect.any(String),
    })
  })
});
describe('createErrorHandler', () => {
    it('dummy', () => {
      const input = new HandlerInputCreator().createLaunchRequest()
      const handler = createErrorHandler({
        usePreset: true
      })
      expect(handler.canHandle(input, new Error('dummy'))).toEqual(true)
    })
})