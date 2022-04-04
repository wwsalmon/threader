import Prism from "prismjs";

// originally from https://github.com/ianstormtaylor/slate/blob/main/site/examples/markdown-preview.tsx
// see also https://github.com/PrismJS/prism/blob/master/components/prism-markdown.js which has a bunch of stuff but not headings

console.log(Prism.languages, Prism.languages.markdown);

Prism.languages.markdown =
    Prism.languages.extend("markup", {}),
    Prism.languages.insertBefore("markdown", "prolog", {
        blockquote: {pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation"},
        code: [{pattern: /^(?: {4}|\t).+/m, alias: "keyword"}, {pattern: /``.+?``|`[^`\n]+`/, alias: "keyword"}],
        h2:
            [
                {
                    pattern: /\w+.*(?:\r?\n|\r)(?:--+)/,
                    alias: "important",
                    inside: {punctuation: /--+$/}
                },
                {
                    pattern: /(^\s*)##(?!#).+/m,
                    lookbehind: !0,
                    alias: "important",
                    inside: {punctuation: /^##|##$/}
                },
            ],
        h1:
            [
                {
                    pattern: /\w+.*(?:\r?\n|\r)(?:==+)/,
                    alias: "important",
                    inside: {punctuation: /==+$/}
                },
                {
                    pattern: /(^\s*)#(?!#).+/m,
                    lookbehind: !0,
                    alias: "important",
                    inside: {punctuation: /^#|#$/}
                },
            ],
        hr: {pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m, lookbehind: !0, alias: "punctuation"},
        list: {pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m, lookbehind: !0, alias: "punctuation"},
        "url-reference": {
            pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
                variable: {pattern: /^(!?\[)[^\]]+/, lookbehind: !0},
                string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                punctuation: /^[\[\]!:]|[<>]/
            },
            alias: "url"
        },
        bold: {
            pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: !0,
            inside: {punctuation: /^\*\*|^__|\*\*$|__$/}
        },
        italic: {
            pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: !0,
            inside: {punctuation: /^[*_]|[*_]$/}
        },
        url: {
            pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
            inside: {
                variable: {pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0},
                string: {pattern: /"(?:\\.|[^"\\])*"(?=\)$)/}
            }
        }
    }),
    Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url),
    Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url),
    Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic),
    Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);