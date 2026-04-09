import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

app.get('/api/bug/save', (req, res) => {
    const { _id, title, severity, description } = req.query
    const bugToSave = {
        _id,
        title,
        severity: +severity,
        description
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

app.get('/api/bug/:_id', (req, res) => {
    const bugId = req.params._id

    let EXPIRATION = 7000

    let visitedBugs = req.cookies['visited-bugs'] || []

    if (visitedBugs.length === 3) return res.status(401).send('Wait for a bit')

    let visitedBug = { id: bugId, visitedAt: Date.now()}

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

app.get('/api/bug/:_id/remove', (req, res) => {
    const bugId = req.params._id
    bugService.remove(bugId)
        .then(() => res.send('OK'))
        .catch(err => {
            loggerService.error(err)
            res.status(404).send('Cant remove bug')
        })
})
// app.get('/about', (req, res) => {
//     res.send('Hello here')
// })
app.listen(5501, () => console.log('Server ready at port 5501'))