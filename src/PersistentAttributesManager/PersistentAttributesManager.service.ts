import { AttributesManager } from 'ask-sdk-core';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Logger {
  debug(...args: any): void;
  error(...args: any): void;
}

export interface PersistentAttributes {
  [key: string]: any;
}

class DefaultLogger implements Logger {
  public debug(...args: any[]): void {
    console.debug(...args);
  }

  public info(...args: any[]): void {
    console.info(...args);
  }

  public error(...args: any[]): void {
    console.error(...args);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Simply wrapper of ask-sdk persistentAttributesManager
 */
export class PersistentAttributesManager<
  T extends PersistentAttributes = PersistentAttributes
> {
  private static instance: PersistentAttributesManager;
  private readonly logger: Logger = new DefaultLogger();
  private hasUpdated: boolean = false;
  protected readonly defaultAttributes?: T = undefined;

  public static getInstance<
    T extends PersistentAttributes = PersistentAttributes
  >(attributesManager: AttributesManager): PersistentAttributesManager<T> {
    if (!this.instance) {
      this.instance = new PersistentAttributesManager(attributesManager);
    }
    return this.instance as PersistentAttributesManager<T>;
  }

  protected readonly attributeManager: AttributesManager;
  public constructor(attributesManager: AttributesManager) {
    this.attributeManager = attributesManager;
  }

  public async getPersistentAttributes(
    defaultAttributes?: Partial<T>
  ): Promise<T> {
    try {
      const data = await this.attributeManager.getPersistentAttributes();
      if (data) {
        const item = {
          ...this.defaultAttributes,
          ...defaultAttributes,
          ...data,
        } as T;
        this.attributeManager.setPersistentAttributes(item);
        return item;
      }
    } catch (e) {
      this.logger.debug(e.name);
      this.logger.error(e);
    }
    const defaultAtts = {
      ...this.defaultAttributes,
      ...defaultAttributes,
    } as T;
    this.attributeManager.setPersistentAttributes(defaultAtts);
    return defaultAtts;
  }

  /**
   * Just update persistentAttributes with auto merge exsits props
   * [IMPORTANT] We have to execure `save()`method after update the attributes.
   * @param attributes
   * @example
   * ```
   * const persistentAttributesManager = PersistentAttributesManager.getInstance(handlerInput.attributesManager)
   *  await persistentAttributesManager.updatePersistentAttributes({
   *      name: 'John'
   *  })
   *  await persistentAttributesManager.save()
   *  ```
   */
  public async updatePersistentAttributes(
    attributes: Partial<T>
  ): Promise<void> {
    try {
      const data = await this.attributeManager.getPersistentAttributes();
      this.attributeManager.setPersistentAttributes(
        Object.assign({}, data, attributes)
      );
    } catch (e) {
      this.attributeManager.setPersistentAttributes(attributes);
    }
    this.hasUpdated = true;
  }

  /**
   * Update attributes if the prop has been updated
   */
  public async save(): Promise<void> {
    if (!this.hasUpdated) return;
    await this.attributeManager.savePersistentAttributes();
    this.hasUpdated = false;
  }
}
