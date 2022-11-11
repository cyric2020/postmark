const SimpleMarkdown = require('@khanacademy/simple-markdown');
const katex = require('katex');
const hljs = require('highlight.js');

var latexInlineRule = {
    order: SimpleMarkdown.defaultRules.text.order,
    match: function(source) {
        // Match anything between $ and $
        return source.match(/^\$([^$]+)\$/);
    },
    parse: function(capture, parse, state) {
        return {
            content: capture[1],
        };
    },
    react: function(node, output, state) {
        return katex.renderToString(node.content, {displayMode: false});
    },
    html: function(node, output, state) {
        return '<latex>' + katex.renderToString(node.content, {displayMode: false}) + '</latex>';
    },
};

var latexBlockRule = {
    order: SimpleMarkdown.defaultRules.text.order - 1,
    match: function(source) {
        // Match anything between $$ and $$
        return source.match(/^\$\$([^$]+)\$\$/);
    },
    parse: function(capture, parse, state) {
        return {
            content: capture[1],
        };
    },
    html: function(node, output, state) {
        return '<latex class="block">' + katex.renderToString(node.content, {displayMode: true}) + '</latex>';
    },
};

var quadHeaderRule = {
    order: SimpleMarkdown.defaultRules.text.order,
    match: function(source) {
        return source.match(/^####(.*)/);
    },
    parse: function(capture, recurseParse, state) {
        return {
            content: recurseParse(capture[1], state),
        };
    },
    html: function(node, recurseOutput, state) {
        return '<h4>' + recurseOutput(node.content) + '</h4>';
    },
};

var codeBlockRule = {
    // override the default code block rule
    order: SimpleMarkdown.defaultRules.codeBlock.order,
    match: function(source) {
        return source.match(/^```([a-z]+)?\n([\s\S]+?)\n```/);
    },
    parse: function(capture, parse, state) {
        return {
            lang: capture[1],
            content: capture[2],
        };
    },
    html: function(node, output, state) {
        var lang = node.lang;
        var content = node.content;
        if (lang) {
            var html = hljs.highlight(content, {language: lang}).value;
            return `<pre><code class="hljs ${lang}">${html}</code></pre>`;
        } else {
            return '<pre><code>' + content + '</code></pre>';
        }
    },
};

var filenameRule = {
    order: SimpleMarkdown.defaultRules.text.order - 0.1,
    match: function(source) {
        return source.match(/^\@\(([\s\S]+)\)/);
    },
    parse: function(capture, recurseParse, state) {
        return {
            content: recurseParse(capture[1], state),
        };
    },
    html: function(node, recurseOutput, state) {
        return '<filename>' + recurseOutput(node.content) + '</filename>';
    },
}

var dotpointRule = {
    order: SimpleMarkdown.defaultRules.text.order - 1,
    match: function(source) {
        return source.match(/^\-\s(.*)/);
    },
    parse: function(capture, recurseParse, state) {
        return {
            content: recurseParse(capture[1], state),
        };
    },
    html: function(node, recurseOutput, state) {
        // get the indent level
        var indent = 0;
        var parent = state.parent;
        while (parent) {
            if (parent.type == 'dotpoint') {
                indent++;
            }
            parent = parent.parent;
        }
        return '<dotpoint indent="' + indent + '">' + recurseOutput(node.content) + '</dotpoint>';
    },
}

var rules = {
    ...SimpleMarkdown.defaultRules,
    // Add your custom rules here
    latexBlock: latexBlockRule,
    latexInline: latexInlineRule,
    quadHeader: quadHeaderRule,
    codeBlock: codeBlockRule,
    filename: filenameRule,
    dotpoint: dotpointRule,
}

var rawBuildParser = SimpleMarkdown.parserFor(rules);

var parse = function(source) {
    var blockSource = source + "\n\n";
    return rawBuildParser(blockSource, {inline: false});
};
var htmlOutput = SimpleMarkdown.outputFor(rules, 'html');

exports.markdownToHtml = function (markdown, theme) {
    var parseTree = parse(markdown);
    var html = htmlOutput(parseTree);

    // add required files
    html += '<link rel="stylesheet" href="https://unpkg.com/katex@0.12.0/dist/katex.min.css" />';
    html += `<link rel="stylesheet"href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/${theme}.min.css">`;
    return html;
};

exports.render = function (markdown, theme) {
    var html = this.markdownToHtml(markdown, theme);
    return html;
};