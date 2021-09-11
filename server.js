const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/build', (req, res) => {
  console.log(req.body.config)

  // 1. Inject the configuration to the site-bot repo
  // 2. Build the repo with the configuration
  // 3. Zip the /dist folder

  const fileName = 'dummy.json'
  const options = {
    root: path.join(__dirname, 'data')
  }

  // 4. Send the file back - TODO
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
