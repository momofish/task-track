import Markdown from 'markdown-it'
import highlight from 'highlight.js'

export const md = new Markdown({
  highlight: (str, lang) => {
    if (lang && highlight.getLanguage(lang)) {
      try {
        return highlight.highlight(lang, str).value;
      } catch (__) { }
    }

    return '';
  }
});

export default {
  md,
}