
# My API

API to search, update, create, and delete data from 2 seperate datasets. Features an admin and user page, admin page secured through password: "admin".



## Dependencies

```bash
  npm i ejs, fs, express
```

## Dev Dependencies

```bash
    npm i nodemon
    npm run dev
```
- Admin password: "admin"
## Deployment
- Download and extract Github file
- Open terminal to run
```bash 
npm i
node app.js
```
- API open on port 5000
- http://localhost:5000/admin?password=admin to access admin page
- http://localhost:5000/api/data to access user page, or press data button


## Usage/Examples

- /api/data/cars or /api/data/motorcyles to see individual datasets
- /api/data/cars/5 to see entry with id of 5
- /admin/edit/cars/5 to access admin editing/deletion form

```javascript
//Functions to retrieve and return data as json object
    const getData1 = () => {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "db", "data1.json"), "utf-8"))
    }
    const getData2 = () => {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "db", "data2.json"), "utf-8"))
    }

    //main page route
    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "public/index.html"))
    })

    //POST: add new entry
    app.post('/entry', (req, res) => {
    var file = req.body.vehicle == "Car" ? "1" : "2"; // determine which dataset to append to
    var data1 = getData1(), data2 = getData2() // call getdata funcs
    var highestId = 0 
    function getHighestId(data){ // function to return the highest id of the specified dataset
        return Math.max(...data.map(entry => entry.id))
    }
        if(file == "1"){
            highestId = getHighestId(data1) 
            const newEntry = { //create newEntry object
                id: highestId+1,
                model: req.body.model,
                year: req.body.year,
            }
            addEntry(newEntry, "1") //call addEntry function and return new entry and specified file to save the entry to dataset
        }else if(file == "2")  {
            highestId = getHighestId(data2)
            const newEntry = {
                id: highestId+1,
                model: req.body.model,
                year: req.body.year,
            }
            addEntry(newEntry, "2")
        }else{
            res.status(401).send("Invalid")
        }
    res.redirect("/admin?password=admin")
})
```





## Contributing

Contributions are always welcome!

Contact oakuopus@gmail.com for help or questions!


## License

[MIT](https://choosealicense.com/licenses/mit/)

## Version

Version 1.0 
2024/10/3/17/49