const express = require('express')
const app = express();
const displayData = require("./data.json");

let port = process.env.PORT || 3000
app.get('/', (req, res) => {
    res.send("API is running")
})

app.get("/motors", (req, res)=> {
    res.status(200).send(displayData)
})

app.listen(port, ()=> {
    console.log("API STARTED ON DEV MODE and listening on port 3000")
})