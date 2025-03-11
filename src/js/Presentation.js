import Markdown from "./Markdown.js"

export default class Presentation {
    #container
    #listeners = []
    #router

    constructor(container, router) {
        this.#container = container
        this.#router = router
    }

    print(markdownString) {
        this.#container.innerHTML = new Markdown().parse(markdownString)

        this.#changeSlideClasses(this.#router.currentState().slide - 1)

        this.#listeners.forEach(listener => listener(this.#container))
    }

    onPrint(listener) {
        this.#listeners.push(listener)
    }

    moveToSlide(slideNumber) {
        let slideIndex = slideNumber - 1
        if (slideIndex >= this.#container.children.length) {
            slideIndex = this.#container.children.length - 1
        }

        if (slideIndex < 0) {
            slideIndex = 0
        }

        this.#changeSlideClasses(slideIndex)
    }

    totalSlides() {
        return this.#container.children.length
    }

    #changeSlideClasses(slideIndex) {
        Array.from(this.#container.children).forEach((slide, index) => {
            if (index < slideIndex) {
                slide.classList.add('previous')
                slide.classList.remove('current')
                slide.classList.remove('following')
            } else if (index === slideIndex) {
                slide.classList.add('current')
                slide.classList.remove('previous')
                slide.classList.remove('following')
            } else if (index > slideIndex) {
                slide.classList.add('following')
                slide.classList.remove('previous')
                slide.classList.remove('current')
            }
        });
    }
}
