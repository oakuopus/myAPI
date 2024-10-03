const express = require("express")
const path = require("path")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

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
    const append = (file == "1") ? getData1() : getData2();
    append.push(entry)
    fs.writeFileSync(`./db/data${file}.json`, JSON.stringify(append, null, 2));
}
const saveData = (data, file) => {
    fs.writeFileSync(`./db/data${file}.json`, JSON.stringify(data, null, 2))
}

app.get("/admin", (req, res) => {
    if(req.query.password == "admin"){
        res.sendFile(path.resolve(__dirname, "public/admin.html"))
    }else{
        res.status(401).send("Unauthorized");
    }
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
                id: getData1()[-1].id + 1,
                model: req.body.model,
                year: req.body.year,
            }
            addEntry(newEntry, "1")
        }else if(file == "2")  {
            const newEntry = {
                id: getData2()[-1].id + 1,
                model: req.body.model,
                year: req.body.year,
            }
            addEntry(newEntry, "2")
        }else{
            res.status(401).send("Invalid")
        }
    res.redirect("/admin?password=admin")
})

app.get("/admin/edit/cars/:id", (req, res) => {
    var edit = getData1().find(edit => edit.id == Number(req.params.id))
    if(!req.params.id){
        res.status(404).send("ID not found")
    }
    if(req.query.password == "admin") {
        res.render("edit", {edit})
    }else{
        res.status(401).send("Unauthorized")
    }
})
app.get("/admin/edit/motorcycles/:id", (req, res) => {
    var edit = getData2().find(edit => edit.id == Number(req.params.id))
    if(!req.params.id){
        res.status(404).send("ID not found")
    }
    if(req.query.password == "admin") {
        res.render("edit", {edit})
    }else{
        res.status(401).send("Unauthorized")
    }
})

app.post("/admin/:id", (req, res) =>{
    var edit = getData1()
    var file = req.body.vehicle == "Car" ? "1" : "2";
    console.log(file)
    var editIndex = edit.findIndex(edit => edit.id == req.params.id)
    edit[editIndex].model = req.body.model
    edit[editIndex].year = req.body.year
    if(file == "1"){
        saveData(edit, "1")
    }else{
        saveData(edit, "2")
    }
    res.redirect("/admin?password=admin")
})

app.post("/admin/edit/cars/:id/delete", (req, res) => {
    let data = getData1()
    console.log(req.params.id)
    data = data.filter(item => item.id != req.params.id)
    saveData(data, "1")
    res.redirect("/admin?password=admin")
})

app.post("/admin/edit/motorcycles/:id/delete", (req, res) => {
    let data = getData2()
    data = data.filter(del => del.id != req.params.id)
    saveData(data, "2")
    res.redirect("/admin?password=admin")
})

app.get("*", (req, res) => {
    res.status(404).send("404 you cannot use this route.")
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})