const express = require('express')
const exec = require('child_process').execSync;
const fs = require('fs')
const app = express()

const port = 3000
app.get('/ack', (req, res) => {
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.send(200)
  }
  if(req.method === 'GET'){
    res.send(200, 'instance ok!')
  }
})

app.get('/scan', (req, res) => {
  if(req.method === 'GET'){
  let template_html = fs.readFileSync('./html/template.html').toString()

  console.log(req.query.url)
  let exec_query = `docker run -t wpscanteam/wpscan --url ${req.query.url}`
  console.log(exec_query)
  let scan_result = exec(exec_query).toString()
  let dumped = scan_result.replace(/\[32m(.*?)$/mg,(match)=>{
    return `<h3>問題点:${match}</h3>`
  }).replace(/\[32m/g, '')
  let result = template_html.replace(/@@report@@/mg,dumped)
  res.header({'Content-type': 'text/html'})
  
  res.send(200, result)
  }
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.send(200)
  }
})

app.listen(port)

console.log(`-Server listening at ${port} port -`)
console.log('GET /scan is .available.')
