export default class Presenter {
    #presentation
    #controlsListener

    constructor(presentation) {
        this.#presentation = presentation
        const presenter = this
        this.#controlsListener = function addPresenterEvents(event) {
            if (event.key === 'ArrowRight') {
                presenter.#presentation.moveToNextSlide()
            } else if (event.key === 'ArrowLeft') {
                presenter.#presentation.moveToPreviousSlide()
            } else if (event.key === 'Escape') {
                presenter.disablePresenterMode()
            }
        }
    }

    activatePresenterMode() {
        this.#presentation.moveToSlide(this.#presentation.currentSlide())
        document.body.classList.add('presenter-mode')
        window.addEventListener('keydown', this.#controlsListener)
    }

    disablePresenterMode() {
        document.body.classList.remove('presenter-mode')
        window.removeEventListener('keydown', this.#controlsListener)
        window.history.pushState({}, 'Presenter', location.origin + location.pathname)
    }

    initialize() {
        const presenter = this
        const urlParams = new URLSearchParams(window.location.search)

        if (urlParams.has('slide')) {
            this.#presentation.moveToSlide(Number(urlParams.get('slide')) - 1)
            this.activatePresenterMode()
        }

        document.querySelector('#start').addEventListener('click', function () {
            presenter.activatePresenterMode()
        })
    }
}
