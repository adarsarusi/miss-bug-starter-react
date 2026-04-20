import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// support arrays in query params
app.set('query parser', 'extended')

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        paginationOn: req.query.paginationOn === 'true',
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || 'title',
        sortDir: +req.query.sortDir || 1,
        createdAt: +req.query.createdAt || 0,
        labels: req.query.labels || []
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/:_id', (req, res) => {
    const bugId = req.params._id

    let EXPIRATION = 7000

    let visitedBugs = req.cookies['visited-bugs'] || []

    if (visitedBugs.length === 3) return res.status(401).send('Wait for a bit')

    let visitedBug = { id: bugId, visitedAt: Date.now() }

    visitedBugs = visitedBugs.filter(bug => Date.now() - bug.visitedAt < EXPIRATION)

    visitedBugs.push(visitedBug)

    bugService.get(bugId)
        .then(bug => {
            res.cookie('visited-bugs', visitedBugs, { maxAge: EXPIRATION })

            console.log('user visited the following bugs: ' + visitedBugs.map(bug => bug.id))

            res.send(bug)
        })
        .catch(err => {
            loggerService.error(err)
            res.status(404).send('Cant find bug')
        })
})

app.delete('/api/bug/:_id', (req, res) => {
    const bugId = req.params._id
    bugService.remove(bugId)
        .then(() => res.send('OK'))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send('Cant remove bug')
        })
})

app.put('/api/bug/:_id', (req, res) => {
    const { _id, title, severity, description } = req.body
    const bugToSave = {
        _id,
        title,
        severity: +severity,
        description,
        labels: labels || []
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.post('/api/bug', (req, res) => {
    const { title, severity, description } = req.body
    const bugToSave = {
        title,
        severity: +severity,
        description,
        labels: labels || []
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send(err)
        })
})

app.get('{*splat}', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(5501, () => console.log('Server ready at port 5501'))