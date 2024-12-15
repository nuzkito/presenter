import { Marked } from 'marked'
import { markedHighlight } from "marked-highlight"
import hljs from 'highlight.js'
import 'highlight.js/styles/a11y-light.css'

const startSlideHtml = '<section class="slide"><div class="content">'
const endSlideHtml = '</div></section>'

const highlightExtension = markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        return hljs.highlight(code, {
            language: hljs.getLanguage(lang) ? lang : 'plaintext'
        }).value
    }
})

const options = {
    renderer: {
        hr() {
            return endSlideHtml + startSlideHtml
        }
    },
    hooks: {
        postprocess(html) {
            return startSlideHtml + html + endSlideHtml
        }
    }
}

const marked = new Marked(options, highlightExtension)

export default class Markdown {
    parse(markdownString) {
        return marked.parse(markdownString)
    }
}
