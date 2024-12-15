import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

export default class Editor {
    #editorView
    #listeners = []

    constructor(container) {
        this.#editorView = new EditorView({
            extensions: [
                basicSetup,
                markdown({
                    codeLanguages: languages,
                }),
                EditorView.updateListener.of((viewUpdate) => {
                    if (!viewUpdate.docChanged) {
                        return
                    }

                    this.#listeners.forEach(listener => listener(viewUpdate.state.doc.toString()))
                }),
            ],
            parent: container
        })
    }

    setContent(content) {
        this.#editorView.dispatch(this.#editorView.state.update({
            changes: {
                from: 0,
                to: this.#editorView.state.doc.length,
                insert: content,
            }
        }))
    }

    getContent() {
        return this.#editorView.state.doc.toString()
    }

    onChange(listener) {
        this.#listeners.push(listener)
    }
}
