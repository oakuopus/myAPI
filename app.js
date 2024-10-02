const express = require("express")
const path = require("path")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

const getData1 = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "db", "data1.json"), "utf-8"))
}
const getData2 = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "db", "data2.json"), "utf-8"))
}
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/index.html"))
})

app.get('/api/data', (req, res) => {
    const allData = [...getData1(), ...getData2()]
    res.json(allData)
})

const addEntry = (entry, file) => {
    console.log(entry, file)
    const append = (file == "1") ? getData1() : getData2();
    append.push(entry)
    fs.writeFileSync(`./db/data${file}.json`, JSON.stringify(append, null, 2));
}

app.get("/admin", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public/admin.html"))
})

app.get('/api/data/cars', (req, res) => {
    res.json(getData1())
})
app.get('/api/data/motorcycles', (req, res) => {
    res.json(getData2())
})

app.get("/api/data/cars/:dataID", (req, res) => {
    const { dataID } = req.params;
    const single = getData1().find(product => product.id == dataID);
    if (single) {
        res.json(single);
    } else {
        res.status(404).send("Entry not found");
    }
})
app.get("/api/data/motorcycles/:dataID", (req, res) => {
    const { dataID } = req.params;
    const single = getData2().find(product => product.id == dataID);
    if (single) {
        res.json(single);
    } else {
        res.status(404).send("Entry not found");
    }
})

app.post('/entry', (req, res) => {
    var file = req.body.vehicle == "Car" ? "1" : "2";
    if(file == "1"){
        const newEntry = {
            id: getData1().length + 1,
            model: req.body.model,
            year: req.body.year,
        }
        addEntry(newEntry, "1")
    }else if(file == "2")  {
        const newEntry = {
            id: getData2().length + 1,
            model: req.body.model,
            year: req.body.year,
        }
        addEntry(newEntry, "2")
    }else{
        res.status(400).send("Invalid vehicle type")
    }
    res.redirect("/admin")
})

app.put("/admin/edit/cars/:dataID", (req, res) => {
    var edit = getData1().find(edit => edit.id == Number(req.params.dataID))
    res.json(edit)
})

app.post("/", (req, res) => {
    console.log(req.url)
    res.status(404).send("lil bro stop posting on the index")
})

app.get("*", (req, res) => {
    res.status(404).send("404 you cannot use this route.")
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})