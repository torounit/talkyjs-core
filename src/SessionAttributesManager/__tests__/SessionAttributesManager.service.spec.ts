import {
  HandlerInputFactory,
  RequestEnvelopeFactory,
  LaunchRequestFactory,
} from '@ask-utils/test';
import { HandlerInput } from 'ask-sdk-core';
import { SessionAttributesManager } from '../index';

class MockSessionAttributesManager extends SessionAttributesManager {
  private readonly recordKey = 'testData';
  public recordData(data: any) {
    this.updateSessionAttributes<any>(this.recordKey, data);
  }
  public loadLastData(): any | null {
    return this.getSessionAttributes<any>(this.recordKey);
  }
}

describe('SessionAttributesManager.service.ts', () => {
  let handlerInput: HandlerInput;
  beforeEach(() => {
    handlerInput = new HandlerInputFactory(
      new RequestEnvelopeFactory(new LaunchRequestFactory())
    ).create();
  });
  it.each([
    null,
    'hello',
    {
      name: 'test',
    },
  ])('should put %p, should get same', input => {
    const sessionManager = new MockSessionAttributesManager(handlerInput);
    if (input) sessionManager.recordData(input);
    expect(sessionManager.loadLastData()).toEqual(input);
  });
  it('should return not data, if no data given', () => {
    const { attributesManager } = handlerInput;
    new MockSessionAttributesManager({
      attributesManager,
    });
    expect(attributesManager.getSessionAttributes()).toEqual({});
  });
  it.each([
    'hello',
    {
      name: 'test',
    },
  ])('should record valid session format [input %p, return %p]', input => {
    const { attributesManager } = handlerInput;
    const sessionManager = new MockSessionAttributesManager({
      attributesManager,
    });
    if (input) sessionManager.recordData(input);
    expect(attributesManager.getSessionAttributes()).toEqual({
      __talkyjs: {
        testData: input,
      },
    });
  });
});
