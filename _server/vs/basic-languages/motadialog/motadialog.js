define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Allow for running under nodejs/requirejs in tests
    var _monaco = (typeof monaco === 'undefined' ? self.monaco : monaco);
    exports.conf = {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        onEnterRules: [
            {
                // e.g. /** | */
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: { indentAction: _monaco.languages.IndentAction.IndentOutdent, appendText: ' * ' }
            },
            {
                // e.g. /** ...|
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                action: { indentAction: _monaco.languages.IndentAction.None, appendText: ' * ' }
            },
            {
                // e.g.  * ...|
                beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                action: { indentAction: _monaco.languages.IndentAction.None, appendText: '* ' }
            },
            {
                // e.g.  */|
                beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                action: { indentAction: _monaco.languages.IndentAction.None, removeText: 1 }
            }
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
        ],
    };
    exports.language = {
        // Set defaultToken to invalid to see what you do not tokenize yet
        defaultToken: '',
        var: ["item:", "status:", "flag:", "switch:"],
        cvar: /(状态|变量|物品|独立开关)[:：]/,
        operators: [
            '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**',
            '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
            '|', '^', '!', '~', '&&', '||', '??', '?', ':', '=', '+=', '-=',
            '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=',
            '^=', '@',
        ],
        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        // The main tokenizer for our languages
        tokenizer: {
            root: [
                [/[{}]/, 'delimiter.bracket'],
                { include: 'common' }
            ],
            common: [
                [/\${/, "keyword", "@experssion"],
            ],
            experssion: [
                [/}/, "keyword", "@pop"],
                [/[a-z]*:/, {
                    cases: {
                        '@var': { token: 'type', next: "@name" },
                        '@default': ''
                    }
                }],
                [/@cvar/, "type", "@name"],
                [/@symbols/, {
                    cases: {
                        '@operators': 'delimiter',
                        '@default': ''
                    }
                }],
            ],
            name: [
                [/([\u4E00-\u9FA5]+|[a-zA-Z_$][\w$]*)/, 'identifier', '@pop'],
                [/}/, '@rematch', '@pop'],
            ]
        },
    };
});
