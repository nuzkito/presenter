export default class Presenter {
    #controlsListener

    constructor(router, presentation) {
        this.#controlsListener = function addPresenterEvents(event) {
            if (event.key === 'ArrowRight' && router.currentState().slide < presentation.totalSlides()) {
                router.goToNextSlide()
            } else if (event.key === 'ArrowLeft' && router.currentState().slide > 1) {
                router.goToPreviousSlide()
            } else if (event.key === 'Escape') {
                router.goToEditorMode()
            }
        }
    }

    activatePresenterMode() {
        document.body.classList.add('presenter-mode')
        window.addEventListener('keydown', this.#controlsListener)
    }

    disablePresenterMode() {
        document.body.classList.remove('presenter-mode')
        window.removeEventListener('keydown', this.#controlsListener)
    }
}
