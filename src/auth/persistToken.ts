import { safeStorage } 		  	from 'electron';
import Store 				 				  = require('electron-store');

const store = new Store<Record<string, string>>({
  name: 'ray-encrypted',
  watch: true,
  encryptionKey: 'this_only_obfuscates',
});

export default {
  setToken(key: string, token: string) {
    const buffer = safeStorage.encryptString(token);
    store.set(key, buffer.toString('latin1'));
  },

  deleteToken(key: string) {
    store.delete(key);
  },

  getCredentials(): Array<{ key: string; token: string }> {
    return Object.entries(store.store).reduce((credentials, [key, buffer]) => {
      return [...credentials, { key, token: safeStorage.decryptString(Buffer.from(buffer, 'latin1')) }];
    }, [] as Array<{ key: string; token: string }>);
  },

  getToken(key: string): string {
	const buffer = store.get(key);
	return safeStorage.decryptString(Buffer.from(buffer, 'latin1'));
  }
};
