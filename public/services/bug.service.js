import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugs'

// _createBugs()

const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getLabels
}

function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy})
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL + (bug._id || ''), bug)
        .then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, pageIdx: 0, paginationOn: true, sortBy: 'title', sortDir: 1, createdAt: 0 }
}

function getLabels() {
    return [
        'back', 'front', 'critical', 'fixed', 'in progress', 'stuck'
    ]
}