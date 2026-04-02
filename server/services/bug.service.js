import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const PATH = 'data/bug.json'
const bugs = readJsonFile(PATH)

export const bugService = {
    query,
    get,
    remove,
    save,
}

function query() {
    return Promise.resolve(bugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject(`Cant find bug with id ${bugId}`)
        
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject(`Can't find bug with id ${bugId}`)

    bugs.splice(idx, 1)

    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[idx] = { ...bugs[idx], ...bugToSave }
    } else {
        bugToSave._id = makeId()
        bugs.push(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return writeJsonFile(PATH, bugs)
}