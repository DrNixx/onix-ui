import { Intl as IntlCore } from 'onix-core';

export class Intl {
    private static intlInitialized = false;

    public static register = () => {
        if (!Intl.intlInitialized) {
            IntlCore.register();
            IntlCore.registerStrings('forms', {
                'ru-ru': {
                    copy_to_clipboard: "Копировать строку в буфер обмена",
                },

                'en-us': {
                    copy_to_clipboard: "Copy string to clipboard",
                }
            });

            Intl.intlInitialized = true;
        }
    }
}


