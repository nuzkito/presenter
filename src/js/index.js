import defaultPresentationContent from 'bundle-text:./default-presentation.md'
import Database from './Database.js'
import Editor from './Editor.js'
import Presentation from './Presentation.js'
import Presenter from './Presenter.js'

if (module.hot) {
    module.hot.accept()
}

function updateWindowAspectRatio() {
    document.querySelector('#slides').style.setProperty('--window-aspect-ratio', window.innerWidth / window.innerHeight)
}

document.addEventListener("DOMContentLoaded", () => {
    const presentation = new Presentation(document.querySelector('#slides'))
    const presenter = new Presenter(presentation)
    presentation.onPrint(function (container) {
        container.querySelectorAll('.slide').forEach(function (slide, index) {
            slide.addEventListener('click', () => {
                presentation.moveToSlide(index)
                presenter.activatePresenterMode()
            })
        })
    })

    const database = new Database()
    const editor = new Editor(document.querySelector('#editor'))
    editor.setContent(database.findPresentation() ?? defaultPresentationContent)
    editor.onChange(function (content) {
        presentation.print(content)
        database.savePresentation(content)
    })
    presentation.print(editor.getContent())
    presenter.initialize()

    window.addEventListener("resize", updateWindowAspectRatio)
    updateWindowAspectRatio()
})
