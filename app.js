const express = require('express')
const exec = require('child_process').execSync;
const fs = require('fs')
const app = express()

const port = 443
app.get('/ack', (req, res) => {
  if(req.method === 'GET'){
    res.send(200, 'instance ok!')
  }
})
app.options('*',(req, res)=>{
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.send(200)
}) 

app.get('/scan', (req, res) => {
  //let template_html = fs.readFileSync('./html/template.html').toString()
  let exec_query = `sudo docker run -t wpscanteam/wpscan --url ${req.query.url} -f json`
  if(match(/^http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?/) )
  console.log(exec_query)
  let scan_result_json = exec(exec_query).toString()
  res.header({'Content-type': 'application/json'})
  res.send(200, scan_result_json)
})

app.listen(port)

console.log(`-Server listening at ${port} port -`)
console.log('GET /scan is .available.')
