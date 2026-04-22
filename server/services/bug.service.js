import { utilService } from './util.service.js'

const PATH = 'data/bug.json'
const PAGE_SIZE = 3
const bugs = utilService.readJsonFile(PATH)

export const bugService = {
    query,
    get,
    remove,
    save,
}

function query(filterBy = {}) {

    let filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels && filterBy.labels.length > 0) {
        filteredBugs = filteredBugs.filter(bug => filterBy.labels.some(label => bug.labels?.includes(label)))
    }

    if (filterBy.sortBy) {
        const {sortBy, sortDir} = filterBy

        filteredBugs.sort((a, b) => {
            let valA = a[sortBy]
            let valB = b[sortBy]

            if (typeof valA === 'string'){
                return valA.localeCompare(valB) * sortDir
            }
            
            return (valA - valB) * sortDir
        })
    }

    const total = filteredBugs.length

    if (filterBy.paginationOn) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        const endIdx = filterBy.pageIdx * PAGE_SIZE + PAGE_SIZE

        filteredBugs = filteredBugs.slice(startIdx, endIdx)
    }

    return Promise.resolve({ bugs: filteredBugs, total })
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
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile(PATH, bugs)
}