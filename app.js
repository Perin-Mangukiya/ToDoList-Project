const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");
const app = express();

mongoose.connect("");
const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
})

const item2 = new Item({
    name: "Hit + button to add new items"
})

const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];

const date = require(__dirname + "/date.js");
const day = date.getDay();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        if(foundItems.length===0) {
            Item.insertMany(defaultItems, function (err) {
                if(err)
                console.log(err);
                else
                console.log("Insertion done successfully!")
            })   
            res.redirect("/");       
        }
        res.render("list", {listTitle: day, Items: foundItems});    
    })
    
})

const listItemSchema = {
    name: String
}
const listSchema = new mongoose.Schema({
    name: String,
    items: [listItemSchema]
})

const List = mongoose.model("List", listSchema);

app.get("/:customListName", function (req, res) {
    const customListName = lodash.capitalize(req.params.customListName);
    List.findOne({name: customListName}, function(err, foundList){
        if(!err) {
            if(!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/"+customListName);
            }
            else
            res.render("list", {listTitle: foundList.name, Items: foundList.items});
        }
    })
    
})

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    })

    if(req.body.list === day) {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({name: listName}, function (err, foundList) {
            foundList.items.push(item);
            foundList.save(); 
        })
        res.redirect("/"+listName);    
    }
})

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    
    if(listName === day) {
        Item.findByIdAndRemove({_id: checkedItemId}, function (err) {
            if(err) console.log(err);
            else console.log("Delete Successfully");
        });
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            if(!err)
            res.redirect("/"+listName);
        })
        
    }
});

let port = process.env.PORT;
if(port==null || port=="") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server has started");
});