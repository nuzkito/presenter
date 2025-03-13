export default class Filesystem {
    async save(content, filename = 'presentation.md') {
        if ('showSaveFilePicker' in window) {
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'Markdown files',
                    accept: {
                        'text/markdown': ['.md'],
                    },
                }],
            })
            const writable = await handle.createWritable()
            await writable.write(content)
            await writable.close()
        } else {
            const blob = new Blob([content], {
                type: 'text/markdown',
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    async load() {
        if ('showOpenFilePicker' in window) {
            const [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Markdown files',
                    accept: {
                        'text/markdown': ['.md'],
                    },
                }],
            })

            const file = await handle.getFile()

            return await file.text()
        } else {
            return new Promise((resolve, reject) => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.md'

                input.onchange = async () => {
                    const file = input.files[0]

                    if (!file) {
                        reject(new Error('No file selected'))
                        return
                    }

                    if (!file.name.toLowerCase().endsWith('.md')) {
                        reject(new Error('Invalid file type. Please select a markdown file'))
                        return
                    }

                    try {
                        resolve(await file.text())
                    } catch (error) {
                        reject(error)
                    }
                }

                input.click()
            })
        }
    }
}
