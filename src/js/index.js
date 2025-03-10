import defaultPresentationContent from 'bundle-text:./default-presentation.md'
import Database from './Database.js'
import Editor from './Editor.js'
import Presentation from './Presentation.js'
import Presenter from './Presenter.js'
import Router from './Router.js'

if (module.hot) {
    module.hot.accept()
}

function updateWindowAspectRatio() {
    document.querySelector('#slides').style.setProperty('--window-aspect-ratio', window.innerWidth / window.innerHeight)
}

document.addEventListener("DOMContentLoaded", () => {
    const router = new Router()
    const presentation = new Presentation(document.querySelector('#slides'))
    const presenter = new Presenter(router, presentation)
    const database = new Database()
    const editor = new Editor(document.querySelector('#editor'))

    presentation.onPrint(function (container) {
        container.querySelectorAll('.slide').forEach(function (slide, index) {
            slide.addEventListener('click', () => {
                router.goToPresentationMode(index + 1)
            })
        })
    })

    editor.setContent(database.findPresentation() ?? defaultPresentationContent)
    editor.onChange(function (content) {
        presentation.print(content)
        database.savePresentation(content)
    })
    presentation.print(editor.getContent())

    router.subscribe(function (state) {
        if (state.slide) {
            if (state.slide > presentation.totalSlides()) {
                router.goToSlide(presentation.totalSlides())
                return
            } else if (state.slide < 1) {
                router.goToSlide(1)
                return
            } else {
                presentation.moveToSlide(state.slide)
            }
        }

        if (state.mode === 'presentation') {
            presenter.activatePresenterMode()
        } else {
            presenter.disablePresenterMode()
        }
    })

    router.notifySubscribers(router.currentState())

    document.querySelector('#start').addEventListener('click', function () {
        router.goToPresentationMode(router.currentState().slide)
    })

    window.addEventListener("resize", updateWindowAspectRatio)
    updateWindowAspectRatio()
})
