import { AttributesManager } from 'ask-sdk-core';
export abstract class SessionAttributesManager {
  protected readonly prefix = '__talkyjs';
  protected readonly attributesManager: AttributesManager;
  constructor({ attributesManager }: { attributesManager: AttributesManager }) {
    this.attributesManager = attributesManager;
  }

  /**
   * update talkyjs sessionAttributes
   * @param key
   * @param data
   */
  protected updateSessionAttributes<Data = any>(key: string, data: Data) {
    const attributes = this.attributesManager.getSessionAttributes();
    const att = attributes[this.prefix] || {};
    attributes[this.prefix] = {
      ...att,
      [key]: data,
    };
    this.attributesManager.setSessionAttributes(attributes);
  }

  /**
   * Get talkyjs sessionAttributes
   * @param key
   */
  protected getSessionAttributes<Data = any>(key: string): Data | null {
    const data = this.attributesManager.getSessionAttributes();
    if (!data || !Object.prototype.hasOwnProperty.call(data, this.prefix))
      return null;
    const record = data[this.prefix];
    return record[key] || null;
  }
}
