const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Pharmacy', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const thepass = '8599qwerty';
var pharmacyId = 1;
var theLabel = "Enter password";
var message = '';
var message2 =  "";
var message3 = "";
var resuls = [];

const pharmacySchema = new mongoose.Schema({
  name:String,
  locations:String,
  phoneNumber:String,
  pharmacyId:String
});
const pharmacyList = mongoose.model("pharmacyList", pharmacySchema)

const DrugSchema = new mongoose.Schema({
  pharmacyName:String,
  drugName:String,
  quantity:Number,
  typeOfDrug:String,
  price:Number,
});
const drugList = mongoose.model("drugList", DrugSchema)

const onCallSchema = new mongoose.Schema({
  date:String,
  pharmacies:String
});
const onCall = mongoose.model("onCall", onCallSchema)

app.get("/HildaPharmacyHelper", function(req,res){
  res.render("homePage");
});

app.get("/addNewPharmacy", function(req,res){
  res.render("addPharmacyForm");
});

app.get("/addNewDrug", function(req,res){
  res.render("addDrugForm",{message2:message2});
});

app.get("/removePharmacy", function(req,res){
  res.render("removePharmacyForm");
});

app.get("/removeDrug", function(req,res){
  res.render("removeDrugForm");
});

app.get("/updateInformation", function(req,res){
  res.render("updateInformationsForm");
});

app.get("/updateOnCall", function(req,res){
  res.render("updatePharmacyOnCall");
});

app.get("/pharmacy/:pharmacyName", function(req, res){
  theName = req.params.pharmacyName;
  res.render("pharmacy", {theName:theName});
});

app.get("listOfOnCall", function(req, res){
  onCall.find({}, function(err, docs)
  {
    if(!){
      res.render("theCall", {docs:docs});
    }
  })
});

app.get("/listOfPharmacy", function(req,res){
   pharmacyList.find({}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.render("listOfPharmacy", {results:result, message:message})
      }
    });
});

app.post("/submitAddPharmacy", function(req, res){
  const password = req.body.adminPassword;
  const pharmacyName = req.body.pharmacyName;
  const pharmacyLocation = req.body.pharmacyLocation;
  const pharmacyPhoneNumber = req.body.pharmacyPhoneNumber;
  pharmacyId ++ ;
  thisId = 'abc'+ pharmacyId +'wy';
  const NewPharmacy = new pharmacyList
  ({
    name:pharmacyName,
    locations:pharmacyLocation,
    phoneNumber:pharmacyPhoneNumber,
    pharmacyId:thisId
  }) ;
  var pharmacies = [];
  pharmacyList.find({}, function(err, result)
  {
     if (err)
     {
       res.send(err);
     } else
     {
       for (var i = 0; i < result.length; i++) {
         pharmacies.push(result[i].name);
       }
       if(!pharmacies.includes(pharmacyName))
       {
         NewPharmacy.save(function (err)
         {
           if(!err)
           {
             message = "Successfully save " + pharmacyName + " pharmacy"
           }
         })
       }
       else
       {
         message = "there is already a pharmacy under this name "
         console.log(err)
       }
     }
   });
  res.redirect("listOfPharmacy")
});

app.post("/submitAddDrug", function(req, res){
  const pharmacyName = req.body.pharmacyName;
  const drugName = req.body.drugName;
  const quantity = parseInt(req.body.quantity);
  const typeOfDrug = req.body.typeOfDrug;
  const price = parseInt(req.body.price);
   var drugs = [];
  const NewDrug = new drugList
  ({
    pharmacyName:pharmacyName,
    drugName:drugName,
    quantity:quantity,
    typeOfDrug:typeOfDrug,
    price:price
  }) ;
  var d = {drugName:drugName, typeOfDrug:typeOfDrug, price:price};
  drugList.findOne({d},function(err, doc)
   {
     if(!err)
     {
       console.log(doc);
       if(doc)
       {
         const qty = doc.quantity + quantity;
         drugList.updateOne({d},{quantity:qty},function(err)
          {
           if(!err)
           {
             message2 = "Successfully update " + drugName + " in" pharmacyName + "pharmacy";
           }
         });
     }else
     {
       drugList.save(function(err)
       {
         if(!err)
         {
           message2 = "Successfully Save " + drugName + " in" pharmacyName + "pharmacy";
         }
       })
     }
   }
 });
  res.render("addDrugForm",{message2:message2})
});

app.post("/submitRemovePharmacy", function(req, res) {
  const password = req.body.adminPassword;
  const pharmacyName = req.body.pharmacyToRemove;
  var pharmacies = [];
  pharmacyList.find({}, function(err, result) {
     if (err) {
       res.send(err);
     } else {
       for (var i = 0; i < result.length; i++) {
         pharmacies.push(result[i].name);
       }
       if(pharmacies.includes(pharmacyName))
       {
         pharmacyList.deleteOne({ name: pharmacyName }, function (err)
         {
           if(!err)
           {
             message = "Successfully delete " + pharmacyName + " pharmacy"
           }
         })
       }
       else
       {
         message = "check your input there is no pharmacy under this name"
       }
     }
   });
   res.redirect("/listOfPharmacy")
});

app.post("/submitUpdateOnCall", function(req, res){
  const date = req.body.date;
  const pharmacyName = req.body.pharmacies;
  const thisOnCall = new onCall
  ({
    date:date,
    pharmacies:pharmacies,
  }) ;
  onCall.save();
  message3 = "successfully update oncall of the date " + date
  res.render("updatePharmacyOnCall", {message3:message3});
});


app.post("/searchDrug", function(req, res){
nameOfDrug  = req.body.nameOfDrug;
res.send()
});

app.listen(5000, function() {
  console.log("Server started on port 5000");
});
