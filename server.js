const path = require('path')
process = require('process')
const { build } = require('vite')
const express = require('express')

const app = express()
const port = process.env.PORT || 5555

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/build', async (req, res) => {
  console.log(req.body.config)

  // 1. Inject the configuration to the site-bot repo
  // 2. Build the repo with the configuration

  const siteChatBotPath = path.resolve(__dirname, './site-chat-bot')
  process.chdir('./site-chat-bot')
  await build({
    root: siteChatBotPath
    // base: './site-chat-bot/' //siteChatBotPath
  })
  process.chdir('../')

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
