const express = require('express')
const exec = require('child_process').execSync;
const fs = require('fs')
const app = express()

const port = 80
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
  let valid_regExp = /^http(s)?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?/
  let valid_url_chars = /[;\|]/
  if(req.query.url.match(valid_regExp) === null || req.query.url.match(valid_url_chars) !== null){
    res.send(200, 'bad url format')
  }else{
    let exec_query = `sudo docker run -t wpscanteam/wpscan --url ${req.query.url} -f json`
    console.log(exec_query)
    let scan_result_json = exec(exec_query).toString()
    res.header({'Content-type': 'application/json'})
    res.send(200, scan_result_json)
  }

})

app.listen(port)

console.log(`-Server listening at ${port} port -`)
console.log('GET /scan is .available.')
