import { Intl as IntlCore } from 'onix-core';

var intlInitialized = false;

export function registerStrings() {
    if (!intlInitialized) {
        
        IntlCore.registerStrings('forms', {
            'ru-ru': {
                copy_to_clipboard: "Копировать строку в буфер обмена",
            },

            'en-us': {
                copy_to_clipboard: "Copy string to clipboard",
            }
        });

        intlInitialized = true;
    }
}
