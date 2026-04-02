import express from 'express'
const app = express()

app.use(express.static('public'))

// app.get('/about', (req, res) => {
//     res.send('Hello here')
// })
app.listen(5501, () => console.log('Server ready at port 5501'))