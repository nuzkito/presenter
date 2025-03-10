export default class Router {
    #subscribers = []
    #currentUrlParams = new URLSearchParams(window.location.search)

    constructor() {
        if (window.location.search === '') {
            this.#initializeCurrentState()
        }

        if (!window.history.state) {
            const state = Object.fromEntries(this.#currentUrlParams)
            window.history.replaceState(state, '', window.location.href)
        }

        this.handlePopState = this.handlePopState.bind(this)

        window.addEventListener('popstate', this.handlePopState)
    }

    subscribe(callback) {
        this.#subscribers.push(callback)

        return () => {
            this.#subscribers = this.#subscribers.filter(cb => cb !== callback)
        }
    }

    navigate(state = {}) {
        const urlParams = new URLSearchParams(state)

        if (urlParams.toString() === this.#currentUrlParams.toString()) return;

        this.#currentUrlParams = urlParams

        window.history.pushState(state, '', location.origin + location.pathname + '?' + urlParams.toString())

        this.notifySubscribers(state)
    }

    goToSlide(slideIndex) {
        this.navigate({
            mode: window.history.state.mode,
            slide: slideIndex,
        })
    }

    goToNextSlide() {
        this.goToSlide(window.history.state.slide + 1)
    }

    goToPreviousSlide() {
        this.goToSlide(window.history.state.slide - 1)
    }

    goToPresentationMode(slideNumber) {
        this.navigate({
            mode: 'presentation',
            slide: slideNumber,
        })
    }

    goToEditorMode() {
        this.navigate({
            mode: 'editor',
            slide: window.history.state.slide,
        })
    }

    currentState() {
        return window.history.state
    }

    handlePopState(event) {
        this.#currentUrlParams = new URLSearchParams(window.location.pathname)
        this.notifySubscribers(event.state)
    }

    notifySubscribers(state) {
        this.#subscribers.forEach(callback => callback(state))
    }

    #initializeCurrentState() {
        this.navigate({
            mode: 'editor',
            slide: 1,
        })
    }
}
