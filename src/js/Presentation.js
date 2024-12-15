import Markdown from "./Markdown.js"

export default class Presentation {
    #container
    #currentSlide = 0

    constructor(container) {
        this.#container = container
    }

    print(markdownString) {
        this.#container.innerHTML = new Markdown().parse(markdownString)
    }

    moveToSlide(slideIndex) {
        if (slideIndex >= this.#container.children.length) {
            slideIndex = this.#container.children.length - 1
        }

        if (slideIndex < 0) {
            slideIndex = 0
        }

        const lastSlide = this.#currentSlide
        this.#currentSlide = slideIndex
        this.#container.children[lastSlide].classList.remove('current')
        this.#container.children[this.#currentSlide].classList.add('current')

        window.history.pushState(
            {slide: this.#currentSlide + 1},
            'Slide ' + (this.#currentSlide + 1),
            location.origin + location.pathname + '?slide=' + (this.#currentSlide + 1),
        )
    }

    moveToNextSlide() {
        this.moveToSlide(this.#currentSlide + 1)
    }

    moveToPreviousSlide() {
        this.moveToSlide(this.#currentSlide - 1)
    }

    currentSlide() {
        return this.#currentSlide
    }
}
