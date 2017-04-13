import { Selection } from './Selection';
import { Logger } from 'onix-core';

export interface CopyToClipboardProps {
    message?: string;
}

var defaultMessage = 'Copy to clipboard: #{key}, Enter';

function format(message) {
    var copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
    return message.replace(/#{\s*key\s*}/g, copyKey);
}

export function copy(text: string, options?: CopyToClipboardProps): boolean {
    var message, reselectPrevious, range, selection, mark, success = false;
    if (!options) { options = {}; }
    
    try {
        reselectPrevious = Selection.toggle();

        range = document.createRange();
        selection = document.getSelection();

        mark = document.createElement('span');
        mark.textContent = text;
        mark.setAttribute('style', [
            // reset user styles for span element
            'all: unset',
            // prevents scrolling to the end of the page
            'position: fixed',
            'top: 0',
            'clip: rect(0, 0, 0, 0)',
            // used to preserve spaces and line breaks
            'white-space: pre',
            // do not inherit user-select (it may be `none`)
            '-webkit-user-select: text',
            '-moz-user-select: text',
            '-ms-user-select: text',
            'user-select: text',
        ].join(';'));

        document.body.appendChild(mark);

        range.selectNode(mark);
        selection.addRange(range);

        var successful = document.execCommand('copy');
        if (!successful) {
            throw new Error('copy command was unsuccessful');
        }
        success = true;
    } catch (err) {
        Logger.error('unable to copy using execCommand: ', err);
        Logger.warn('trying IE specific stuff');
        try {
            window['clipboardData'].setData('text', text);
            success = true;
        } catch (err) {
            Logger.error('unable to copy using clipboardData: ', err);
            Logger.error('falling back to prompt');
            message = format('message' in options ? options.message : defaultMessage);
            window.prompt(message, text);
        }
    } finally {
        if (selection) {
            if (typeof selection.removeRange == 'function') {
                selection.removeRange(range);
            } else {
                selection.removeAllRanges();
            }
        }

        if (mark) {
            document.body.removeChild(mark);
        }
        
        reselectPrevious();
    }

    return success;
}