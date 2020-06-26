import { ResponseInterceptor } from 'ask-sdk-core';
import { PersistentAttributesManager } from './PersistentAttributesManager.service';

/**
 * ResponseInterceptor to auto save the persistent attributes if any props has beend update
 */
export const SavePersistentAttributesInterceptor: ResponseInterceptor = {
  async process({ attributesManager }): Promise<void> {
    const persistentAttributesManager = PersistentAttributesManager.getInstance(
      attributesManager
    );
    await persistentAttributesManager.save();
  },
};
