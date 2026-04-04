import express from 'express'
import { bugService } from './services/bug.service.js'
const app = express()

app.use(express.static('public'))

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

    bugService.get(bugId)
        .then(bug => res.send(bug))
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