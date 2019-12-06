const express = require('express')
const exec = require('child_process').execSync;
const app = express()

const port = 3000

app.get('/scan', (req, res) => {
  console.log(req.query.url)
  let exec_query = `docker run -t wpscanteam/wpscan --url ${req.query.url}`
  console.log(exec_query)
  let result = exec(exec_query).toString()
  res.header({'Content-type': 'text/html'})

  res.send(200, result)
})

app.listen(port)

console.log(`-Server listening at ${port} port -`)
console.log('GET /scan is .available.')
