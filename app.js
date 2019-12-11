const express = require('express')
const exec = require('child_process').execSync;
const fs = require('fs')
const app = express()
function getNowYMD(){
  var dt = new Date();
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth()+1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
	var h = ("00" + dt.getHours()).slice(-2);
  var result = "" + y  + m + d+h;
  return result;
}
const log_file = getNowYMD()
const access_limit = 100
app.locals.access_count = 0

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
  let valid_url_chars = /[;\|{}$]/
  res.header({'Content-type': 'application/json'})
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  try {
    if(req.query.url.match(valid_regExp) === null || req.query.url.match(valid_url_chars) !== null){
      res.send(400, 'bad url format')
    }else{
      if(app.locals.access_count < access_limit){
        let exec_query = `sudo docker run -t wpscanteam/wpscan --url ${req.query.url} -f json`
        console.log(exec_query);fs.writeFileSync(log_file, exec_query)
        let scan_result_json = exec(exec_query).toString()
        res.send(200, scan_result_json)
        app.locals.access_count++ 
      }else{
        res.send(200, 'Sorry, Please come again tomorrow!!')
      }
    }
  } catch (err) {
    console.log(err);fs.writeFileSync(log_file, err)
    res.send(400, 'bad url format')
  }

})

app.listen(port)

console.log(`-Server listening at ${port} port -`)
console.log('GET /scan is .available.')
