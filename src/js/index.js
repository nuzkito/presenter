import defaultPresentationContent from 'bundle-text:./default-presentation.md'
import Database from './Database.js'
import Editor from './Editor.js'
import Presentation from './Presentation.js'
import Presenter from './Presenter.js'

if (module.hot) {
    module.hot.accept()
}

document.addEventListener("DOMContentLoaded", () => {
    const presentation = new Presentation(document.querySelector('#slides'))
    const database = new Database()
    const editor = new Editor(document.querySelector('#editor'))
    editor.setContent(database.findPresentation() ?? defaultPresentationContent)
    editor.onChange(function (content) {
        presentation.print(content)
        database.savePresentation(content)
    })
    presentation.print(editor.getContent())
    const presenter = new Presenter(presentation)
    presenter.initialize()
})
