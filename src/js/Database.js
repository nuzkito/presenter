export default class Database {
    findPresentation() {
        return localStorage.getItem('presentations.default')
    }

    savePresentation(content) {
        localStorage.setItem('presentations.default', content)
    }
}
