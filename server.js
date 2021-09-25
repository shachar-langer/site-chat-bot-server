const fs = require('fs').promises
const path = require('path')
const { build } = require('vite')
const express = require('express')
const cors = require('cors')
const AdmZip = require('adm-zip')
const { body, validationResult } = require('express-validator')

const app = express()
const port = process.env.PORT || 5555

app.use(cors({ credentials: true, origin: true }))

app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.get('/test', (req, res) => {
  res.send({ message: 'This is test' })
})

app.post('/build', body('config').notEmpty(), async (req, res) => {
  // TODO - validate config's schema

  // Finds the validation errors in this request
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const config = req.body.config

  try {
    // Inject the configuration to the site-bot repo
    await fs.writeFile(
      path.resolve(__dirname, './site-chat-bot/src/data/test_convo.json'),
      JSON.stringify(config)
    )
  } catch (e) {
    console.log(`Oops something went wrong! Error: ${e}`)
    return res.status(500).send('Something went wrong')
  }

  // Build the bot (build the /site-chat-bot repository)
  // TODO - validate that the path exists
  const siteChatBotPath = path.resolve(__dirname, './site-chat-bot')
  process.chdir('./site-chat-bot')
  await build({
    root: siteChatBotPath
  })
  process.chdir('../')

  console.log('--- Finished building the site-bot')

  // Zip the /site-chat-bot/dist folder and send it back
  try {
    const zip = new AdmZip()
    // TODO - make sure the folder exists
    zip.addLocalFolder('./site-chat-bot/dist')

    const zipBuffer = zip.toBuffer()

    // TODO - get name from the UI
    const fileName = 'bot.zip'

    res.set('Content-Type', 'application/octet-stream')
    res.set('Content-Disposition', `attachment; filename=${fileName}`)
    res.set('Content-Length', zipBuffer.length)
    res.send(zipBuffer)
  } catch (e) {
    console.log(`Oops something went wrong! Error: ${e}`)
    res.status(500).send('Something went wrong')
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
