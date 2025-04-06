"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _simpleMarkdown = _interopRequireDefault(require("@khanacademy/simple-markdown"));
var _katex = _interopRequireDefault(require("katex"));
var _highlight = _interopRequireDefault(require("highlight.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import SimpleMarkdown from '@khanacademy/simple-markdown';

const SimpleMarkdown = _simpleMarkdown.default.default || _simpleMarkdown.default;
/* example settings
{
    theme: 'default',
    enableLatex: true,
    enableHighlight: true,
    includeKatexCss: true,
    includeHighlightCss: true,
}
*/

// var rawBuildParser = SimpleMarkdown.parserFor(rules);

// var htmlOutput = SimpleMarkdown.outputFor(rules, 'html');

class Postmark {
  constructor(settings) {
    this.theme = settings.theme || 'default';
    this.enableLatex = settings.enableLatex || false;
    this.enableHighlight = settings.enableHighlight || false;
    this.enableCodeBlock = settings.enableCodeBlock || false;
    this.enableFilename = settings.enableFilename || false;
    this.includeKatexCss = settings.includeKatexCss || false;
    this.includeHighlightCss = settings.includeHighlightCss || false;
    this.rules = {
      ...SimpleMarkdown.defaultRules,
      // Add custom rules here
      latexBlock: this.enableLatex ? latexBlockRule : null,
      latexInline: this.enableLatex ? latexInlineRule : null,
      quadHeader: quadHeaderRule,
      quintHeader: quintHeaderRule,
      codeBlock: this.enableCodeBlock ? codeBlockRule : null,
      filename: this.enableFilename ? filenameRule : null,
      dotpoint: dotpointRule,
      typographicReplacementEn: typographicReplacementEnRule,
      typographicReplacementEm: typographicReplacementEmRule,
      multilineBlockQuote: multilineBlockQuoteRule,
      imageWithDimensions: imageWithDimensionsRule,
      highlight: highlightRule,
      superscript: superscriptRule,
      subscript: subscriptRule,
      calloutBlock: calloutBlockRule
    };
    this.rawBuildParser = SimpleMarkdown.parserFor(this.rules);
    this.htmlOutput = SimpleMarkdown.outputFor(this.rules, 'html');
  }
  parse(source) {
    var blockSource = source + "\n\n";
    return this.rawBuildParser(blockSource, {
      inline: false
    });
  }
  markdownToHtml(markdown) {
    var parseTree = this.parse(markdown);
    var html = this.htmlOutput(parseTree);

    // add required files
    if (this.includeKatexCss) {
      html += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" />';
    }
    html += `<link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/${this.theme}.min.css">`;
    return html;
  }
  render(markdown) {
    return this.markdownToHtml(markdown);
  }
}
var latexInlineRule = {
  order: SimpleMarkdown.defaultRules.text.order,
  match: function (source) {
    // Match anything between $ and $
    return source.match(/^\$([^$]+)\$/);
  },
  parse: function (capture, parse, state) {
    return {
      content: capture[1]
    };
  },
  react: function (node, output, state) {
    return _katex.default.renderToString(node.content, {
      displayMode: false
    });
  },
  html: function (node, output, state) {
    return '<latex>' + _katex.default.renderToString(node.content, {
      displayMode: false
    }) + '</latex>';
  }
};
var latexBlockRule = {
  order: SimpleMarkdown.defaultRules.text.order - 1,
  match: function (source) {
    // Match anything between $$ and $$
    return source.match(/^\$\$([^$]+)\$\$/);
  },
  parse: function (capture, parse, state) {
    return {
      content: capture[1]
    };
  },
  html: function (node, output, state) {
    return '<latex class="block">' + _katex.default.renderToString(node.content, {
      displayMode: true
    }) + '</latex>';
  }
};
var quadHeaderRule = {
  order: SimpleMarkdown.defaultRules.text.order,
  match: function (source) {
    return source.match(/^####(.*)/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1], state)
    };
  },
  html: function (node, recurseOutput, state) {
    return '<h4>' + recurseOutput(node.content) + '</h4>';
  }
};
var quintHeaderRule = {
  order: SimpleMarkdown.defaultRules.text.order - 0.1,
  match: function (source) {
    return source.match(/^#####(.*)/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1], state)
    };
  },
  html: function (node, recurseOutput, state) {
    return '<h5>' + recurseOutput(node.content) + '</h5>';
  }
};
var codeBlockRule = {
  // override the default code block rule
  order: SimpleMarkdown.defaultRules.codeBlock.order,
  // order: SimpleMarkdown.defaultRules.text.order - 0.1,
  match: function (source) {
    return source.match(/^```([a-z]+)?\n([\s\S]+?)\n```/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      lang: capture[1],
      content: capture[2]
    };
  },
  html: function (node, output, state) {
    var lang = node.lang;
    var content = node.content;
    if (!lang) lang = 'Plaintext';
    var html = _highlight.default.highlight(content, {
      language: lang
    }).value;
    return `<pre><code class="hljs ${lang}">${html}</code></pre>`;
  }
};

// var filenameRule = {
//     // order: SimpleMarkdown.defaultRules.text.order - 0.1,
//     order: SimpleMarkdown.defaultRules.codeBlock.order + 0.1,
//     match: function(source) {
//         return source.match(/^\@\(((.*?)+)\)\n/);
//     },
//     parse: function(capture, recurseParse, state) {
//         return {
//             content: recurseParse(capture[1], state),
//             // content: capture[1],
//         };
//     },
//     html: function(node, recurseOutput, state) {
//         return '<filename>' + recurseOutput(node.content) + '</filename>';
//         // return '<filename>' + node.content + '</filename>';
//     },
// }

var filenameRule = {
  order: SimpleMarkdown.defaultRules.codeBlock.order + 0.1,
  match: function (source) {
    return source.match(/^\@\(((.*?)+)\)\n\```([a-z]+)?\n([\s\S]+?)\n```/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1], state),
      lang: capture[3],
      code: capture[4]
    };
  },
  html: function (node, recurseOutput, state) {
    var lang = node.lang;
    var content = node.content;
    var code = node.code;
    if (!lang) lang = 'Plaintext';
    var html = _highlight.default.highlight(code, {
      language: lang
    }).value;
    return '<div class="paragraph"><filename>' + recurseOutput(content) + '</filename><pre><code class="hljs ' + lang + '">' + html + '</code></pre></div>';
  }
};
var dotpointRule = {
  order: SimpleMarkdown.defaultRules.text.order - 1,
  match: function (source) {
    return source.match(/^\-\s(.*)/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1], state)
    };
  },
  html: function (node, recurseOutput, state) {
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
  }
};
var typographicReplacementEnRule = {
  order: SimpleMarkdown.defaultRules.text.order - 0.5,
  match: function (source) {
    return source.match(/^--/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: capture[1]
    };
  },
  html: function (node, recurseOutput, state) {
    return '&ndash;';
  }
};
var typographicReplacementEmRule = {
  order: SimpleMarkdown.defaultRules.text.order - 0.5,
  match: function (source) {
    return source.match(/^---/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: capture[1]
    };
  },
  html: function (node, recurseOutput, state) {
    return '&mdash;';
  }
};
var multilineBlockQuoteRule = {
  order: SimpleMarkdown.defaultRules.blockQuote.order,
  match: function (source) {
    return source.match(/^\>(.*)/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1], state)
    };
  },
  html: function (node, recurseOutput, state) {
    return '<blockquote>' + recurseOutput(node.content) + '</blockquote>';
  }
};
var imageWithDimensionsRule = {
  order: SimpleMarkdown.defaultRules.image.order - 0.1,
  match: function (source) {
    return source.match(/^\!\[(.*?)\]\((.*?)\)\{(.*)\}/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      alt: capture[1],
      target: capture[2],
      dimensions: capture[3]
    };
  },
  html: function (node, recurseOutput, state) {
    return '<img src="' + node.target + '" alt="' + node.alt + '" style="' + node.dimensions + '"/>';
  }
};
var highlightRule = {
  order: SimpleMarkdown.defaultRules.text.order - 0.1,
  match: function (source) {
    return source.match(/^\=\=(.*?)\=\=/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1])
    };
  },
  html: function (node, recurseOutput, state) {
    return '<highlight>' + recurseOutput(node.content) + '</highlight>';
  }
};
var superscriptRule = {
  order: SimpleMarkdown.defaultRules.text.order - 0.1,
  match: function (source) {
    return source.match(/^\^(.*?)\^/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1])
    };
  },
  html: function (node, recurseOutput, state) {
    return '<sup>' + recurseOutput(node.content) + '</sup>';
  }
};
var subscriptRule = {
  order: SimpleMarkdown.defaultRules.text.order - 0.1,
  match: function (source) {
    return source.match(/^_(.*?)_/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      content: recurseParse(capture[1])
    };
  },
  html: function (node, recurseOutput, state) {
    return '<sub>' + recurseOutput(node.content) + '</sub>';
  }
};
var calloutBlockRule = {
  // order: SimpleMarkdown.defaultRules.text.order - 0.1,
  order: SimpleMarkdown.defaultRules.codeBlock.order + 0.4,
  match: function (source) {
    return source.match(/^:::\s\[([\s\S]+?)\]\s\(([\s\S]+?)\)\s\{([\s\S]+?)\}\n([\s\S]+?)\n:::/);
  },
  parse: function (capture, recurseParse, state) {
    return {
      title: capture[1] || 'Title',
      icon: capture[2] || 'info',
      class: capture[3] || 'info',
      content: recurseParse(capture[4]) || 'Content'
      // content: capture[4] || 'Content',
    };
  },
  html: function (node, recurseOutput, state) {
    return '<callout class="' + node.class + '"><callout-info><callout-icon>' + node.icon + '</callout-icon><callout-title>' + node.title + '</callout-title></callout-info>' + recurseOutput(node.content) + '</callout>';
  }
};

// var rules = {
//     ...SimpleMarkdown.defaultRules,
//     // Add your custom rules here
//     latexBlock: latexBlockRule,
//     latexInline: latexInlineRule,
//     quadHeader: quadHeaderRule,
//     codeBlock: codeBlockRule,
//     filename: filenameRule,
//     dotpoint: dotpointRule,
// }

// var rawBuildParser = SimpleMarkdown.parserFor(rules);

// var htmlOutput = SimpleMarkdown.outputFor(rules, 'html');

// module.exports = {
// render: render,
// parse: parse,
// markdownToHtml: markdownToHtml,
// };
var _default = exports.default = {
  Postmark: Postmark
};
