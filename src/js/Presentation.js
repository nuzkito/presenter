import Markdown from "./Markdown.js"

export default class Presentation {
    #container
    #currentSlide = 0
    #listeners = []

    constructor(container) {
        this.#container = container
    }

    print(markdownString) {
        this.#container.innerHTML = new Markdown().parse(markdownString)

        this.#listeners.forEach(listener => listener(this.#container))
        this.#addCurrentClassToSlide(this.#currentSlide)
    }

    onPrint(listener) {
        this.#listeners.push(listener)
    }

    #addCurrentClassToSlide(slideIndex) {
        this.#container.children[slideIndex].classList.add('current')
    }

    #removeCurrentClassFromSlide(slideIndex) {
        this.#container.children[slideIndex].classList.remove('current')
    }

    #changeCurrentClassOfSlide(lastSlideIndex, newSlideIndex) {
        this.#removeCurrentClassFromSlide(lastSlideIndex)
        this.#addCurrentClassToSlide(newSlideIndex)
    }

    moveToSlide(slideIndex) {
        if (slideIndex >= this.#container.children.length) {
            slideIndex = this.#container.children.length - 1
        }

        if (slideIndex < 0) {
            slideIndex = 0
        }

        this.#changeCurrentClassOfSlide(this.#currentSlide, slideIndex)
        this.#currentSlide = slideIndex

        window.history.pushState(
            { slide: this.#currentSlide + 1 },
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
