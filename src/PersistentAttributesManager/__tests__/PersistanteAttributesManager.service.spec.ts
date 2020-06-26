import {
  MockPersistenceAdapter,
  HandlerInputFactory,
  RequestEnvelopeFactory,
  LaunchRequestFactory,
} from '@ask-utils/test';
import { HandlerInput } from 'ask-sdk-core';
import { PersistentAttributesManager } from '../index';

describe('PersistenteAttributesManager.service.ts', () => {
  let handlerInput: HandlerInput;
  let handlerInput2: HandlerInput;
  let adapter = new MockPersistenceAdapter();
  beforeEach(() => {
    adapter = new MockPersistenceAdapter();
    handlerInput = new HandlerInputFactory(
      new RequestEnvelopeFactory(new LaunchRequestFactory())
    )
      .setPersistanceAdapter(adapter)
      .create();
    handlerInput2 = new HandlerInputFactory(
      new RequestEnvelopeFactory(new LaunchRequestFactory())
    )
      .setPersistanceAdapter(adapter)
      .create();
  });
  describe('Singleton test', () => {
    it('| Should save and get next request', async () => {
      const persistentManager = PersistentAttributesManager.getInstance(
        handlerInput.attributesManager
      );

      await persistentManager.updatePersistentAttributes({
        test: true,
      });
      await persistentManager.save();

      expect(
        await handlerInput2.attributesManager.getPersistentAttributes()
      ).toEqual({
        test: true,
      });
    });
  });

  describe('class extend test', () => {
    type TestTypes = {
      name: string;
      count: number;
    };
    class ExtendClass extends PersistentAttributesManager<TestTypes> {
      protected readonly defaultAttributes = {
        name: 'john',
        count: 0,
      };
    }
    let target: ExtendClass;
    beforeEach(() => {
      adapter = new MockPersistenceAdapter();
      handlerInput = new HandlerInputFactory(
        new RequestEnvelopeFactory(new LaunchRequestFactory())
      )
        .setPersistanceAdapter(adapter)
        .create();
      target = new ExtendClass(handlerInput.attributesManager);
    });
    it('should get default value', async () => {
      const attributes = await target.getPersistentAttributes();
      expect(attributes).toEqual({
        name: 'john',
        count: 0,
      });
    });
    it('should get overwritten default value', async () => {
      const attributes = await target.getPersistentAttributes({
        count: 2,
      });
      expect(attributes).toEqual({
        name: 'john',
        count: 2,
      });
    });
    it('should get overwritten default value', async () => {
      const attributes = await target.getPersistentAttributes({
        count: 2,
      });
      expect(attributes).toEqual({
        name: 'john',
        count: 2,
      });
    });
    it('should not saved default atts when does not call save', async () => {
      handlerInput2 = new HandlerInputFactory(
        new RequestEnvelopeFactory(new LaunchRequestFactory())
      )
        .setPersistanceAdapter(adapter)
        .create();
      const target2 = new ExtendClass(handlerInput2.attributesManager);
      await target.getPersistentAttributes({
        count: 2,
      });
      const attributes = await target2.getPersistentAttributes();
      expect(attributes).toEqual({
        name: 'john',
        count: 0,
      });
    });
    it('should saved default atts when call save', async () => {
      handlerInput2 = new HandlerInputFactory(
        new RequestEnvelopeFactory(new LaunchRequestFactory())
      )
        .setPersistanceAdapter(adapter)
        .create();
      const target2 = new ExtendClass(handlerInput2.attributesManager);
      const att = await target.getPersistentAttributes({
        count: 2,
      });
      await target.updatePersistentAttributes(att);
      await target.save();
      const attributes = await target2.getPersistentAttributes();
      expect(attributes).toEqual({
        name: 'john',
        count: 2,
      });
    });
  });

  describe('Class method test', () => {
    it('| should not save adn get persisted attributes without execute save method', async () => {
      const persistentManager = new PersistentAttributesManager(
        handlerInput.attributesManager
      );

      await persistentManager.updatePersistentAttributes({
        test: true,
      });

      expect(
        await handlerInput2.attributesManager.getPersistentAttributes()
      ).toEqual({});
    });
    it('| should save adn get persisted attributes', async () => {
      const persistentManager = new PersistentAttributesManager(
        handlerInput.attributesManager
      );

      await persistentManager.updatePersistentAttributes({
        test: true,
      });
      await persistentManager.save();

      expect(
        await handlerInput2.attributesManager.getPersistentAttributes()
      ).toEqual({
        test: true,
      });
    });
    it('| Should execute savePersistentAttribuets if any prop has been updated', async () => {
      const { attributesManager } = handlerInput;
      attributesManager.savePersistentAttributes = jest.fn();
      const persistentManager = new PersistentAttributesManager(
        attributesManager
      );

      await persistentManager.updatePersistentAttributes({
        test: true,
      });
      await persistentManager.save();
      expect(attributesManager.savePersistentAttributes).toHaveBeenCalled();
    });
    it('| Should not execute savePersistentAttribuets if any prop has been updated', async () => {
      const { attributesManager } = handlerInput;
      attributesManager.savePersistentAttributes = jest.fn();
      const persistentManager = new PersistentAttributesManager(
        attributesManager
      );

      await persistentManager.save();
      expect(attributesManager.savePersistentAttributes).not.toHaveBeenCalled();
    });
    it('| Should execute savePersistentAttribuets2 times', async () => {
      const { attributesManager } = handlerInput;
      attributesManager.savePersistentAttributes = jest.fn();
      const persistentManager = new PersistentAttributesManager(
        attributesManager
      );

      await persistentManager.updatePersistentAttributes({
        test: true,
      });
      await persistentManager.save();
      await persistentManager.save();
      expect(attributesManager.savePersistentAttributes).toHaveBeenCalledTimes(
        1
      );
    });
    it('| Should execute savePersistentAttribuets2 times', async () => {
      const { attributesManager } = handlerInput;
      attributesManager.savePersistentAttributes = jest.fn();
      const persistentManager = new PersistentAttributesManager(
        attributesManager
      );

      await persistentManager.updatePersistentAttributes({
        test: true,
      });
      await persistentManager.save();
      await persistentManager.updatePersistentAttributes({
        test: true,
      });
      await persistentManager.save();
      expect(attributesManager.savePersistentAttributes).toHaveBeenCalledTimes(
        2
      );
    });
    it('| Should merge exists props', async () => {
      const persistentManager = new PersistentAttributesManager(
        handlerInput.attributesManager
      );

      await persistentManager.updatePersistentAttributes({
        test: true,
        test1: true,
      });
      await persistentManager.save();

      await persistentManager.updatePersistentAttributes({
        test1: false,
        test2: false,
      });
      await persistentManager.save();
      expect(
        await handlerInput2.attributesManager.getPersistentAttributes()
      ).toEqual({
        test: true,
        test1: false,
        test2: false,
      });
    });
  });
});
