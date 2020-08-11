const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash")

mongoose.connect('mongodb://localhost:27017/Pharmacy', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const thepass = '8599qwerty';
var error1  = "";
var pharmacyId = 1;
var theLabel = "Enter password";
var message = '';
var message2 =  "";
var message3 =  "";
var message5 =  "";
var message6 =  "";
var message7 =  "";
var message8 =  "";
var qty;
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
  pharmacies:String,
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
  res.render("removePharmacyForm", {message8:message8});
});

app.get("/addDrug", function(req,res){
  res.render("addDrugForm", {message6:message6});
});

app.get("/removeDrug", function(req,res){
  res.render("removeDrugForm");
});

app.get("/updateInformation", function(req,res){
  res.render("updateInformationsForm");
});

app.get("/updateOnCall", function(req,res){
  res.render("updatePharmacyOnCall", {message3:message3});
});

app.get("/pharmacy/:pharmacyName", function(req, res){
  theName = req.params.pharmacyName;
  res.render("thePharmacy", {theName:theName});
});

// test this
app.get("/drugList/:pharmacyName", function(req, res){
  theName = req.params.pharmacyName;
  drugList.find({pharmacyName:theName}).sort('drugName').exec(function(err, results) {
    if(!err){
      if(results){
        res.render("listOfProduct",{results:results,theName:theName})
      }
    }
  });
});

app.get("/listOfPharmacy", function(req,res){
   pharmacyList.find({}).sort('pharmacyName').exec(function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.render("listOfPharmacy", {results:result, message:message})
      }
    });
});

app.get("/ofOnCall", function(req,res){
   onCall.find({}).sort('pharmacyName').exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        res.render("theCall", {docs:docs, message3:message3})
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
  pharmacyList.find({}).sort('pharmacyName').exec(function(err, result)
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

app.post("/submitAddDrug", function(req, res)
{
  const pharmacyName = req.body.pharmacyName;
  const drugName = req.body.drugName;
  const quantity = Number(req.body.quantity);
  const typeOfDrug = req.body.typeOfDrug;
  const price = Number(req.body.price);
  const D ={pharmacyName:pharmacyName, drugName:drugName, typeOfDrug:typeOfDrug}
  const NewDrug = new drugList({
    pharmacyName:pharmacyName,
    drugName:drugName,
    quantity:quantity,
    typeOfDrug:typeOfDrug,
    price:price
  }) ;
  drugList.findOne({pharmacyName:pharmacyName, drugName:drugName, typeOfDrug:typeOfDrug}, function(err, foundDrugs)
  {
    if(!err)
    {
      if(foundDrugs && price !== foundDrugs.price)
      {
        qty = quantity + foundDrugs.quantity
        message6 = ( " attention the previous price " + foundDrugs.price + " and the input " + price + " does not match: confirm price");
        res.render("setDrugPrice", {foundDrugs:foundDrugs, message6:message6, qty})
      }
      else if(foundDrugs && price === foundDrugs.price)
      {
        qty = quantity + foundDrugs.quantity
        drugList.updateOne({pharmacyName:pharmacyName, drugName:drugName, typeOfDrug:typeOfDrug},{quantity:qty}, function(err)
        {
          if(!err)
          {
            message6 = "Successfully update " + drugName + " " + typeOfDrug + " new quantity " + qty
            res.redirect("addDrug");
          }
        })
      }
      else
      {
        NewDrug.save(function(err) {
          if(err){
            console.log(err)
          }else
          {
            message6 = "Successfully save " + drugName + " " + typeOfDrug + " new quantity " + quantity + foundDrugs.quantity
            res.redirect("addDrug");
          }
        });

      }
    }
  })

});

app.post("/submitAddDrug2", function(req, res)
{
  const pharmacyName = req.body.pharmacyName;
  const drugName = req.body.drugName;
  const quantity = Number(req.body.quantity);
  const typeOfDrug = req.body.typeOfDrug;
  const price = Number(req.body.price);
  const D ={pharmacyName:pharmacyName, drugName:drugName, typeOfDrug:typeOfDrug}
  const NewDrug = new drugList({
    pharmacyName:pharmacyName,
    drugName:drugName,
    quantity:quantity,
    typeOfDrug:typeOfDrug,
    price:price
  }) ;

  NewDrug.save(function(err) {
    if(!err){
      message6 = "Successfully save " + drugName + " " + typeOfDrug + " new quantity " + qty
    }
  })
  res.redirect("addDrug")
});


app.post("/submitRemoveDrug", function(req, res){
  const pharmacyName = req.body.pharmacyName;
  const drugName = req.body.drugName;
  const quantity = req.body.quantity;
  const typeOfDrug = req.body.typeOfDrug;
  const price = req.body.price;
  drugList.findOne({pharmacyName:pharmacyName, drugName:drugName, typeOfDrug:typeOfDrug}, function(err, foundDrugs)
  {
    if(!err){
      if(foundDrugs && quantity>foundDrugs.quantity){
        message7 = "sorry we only have " + foundDrugs.quantity + "remaining in stock "
      }
      if(foundDrugs && foundDrugs.quantity>= quantity){
        var qty = foundDrugs.quantity - quantity
        drugList.updateOne({pharmacyName:pharmacyName, drugName:drugName, typeOfDrug:typeOfDrug},{quantity:qty}, function(err) {
          if(!err){
            message7 = "Successfully update " + drugName + " " + typeOfDrug + " new quantity " + qty
          }
        })
      }
      if(!foundDrugs){
        message7 = "sorry this drug is not availlable make sure you enter drug's reference properly"
      }
    }
  })
  res.render("removeDrugForm", {message7:message7})
});


app.post("/submitRemovePharmacy", function(req, res) {
  const password = req.body.Password;
  const pharmacyName = req.body.pharmacyName;
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
             message8 = "Successfully delete " + pharmacyName + " pharmacy"
             res.render("removePharmacyForm", {message8: message8})
           }
         })
       }
       else
       {
         message8 = "check your input there is no pharmacy under this name"
         res.render("removePharmacyForm", {message8: message8})
       }
     }
   });
});

app.post("/submitUpdateOnCall", function(req, res){
  const date = req.body.date;
  const pharmacies = req.body.pharmaciesNames;
  const thisOnCall = new onCall({
    date:date,
    pharmacies:pharmacies
  })
  onCall.find({date:date}, function(err, docs){
    if(!err){
      if(docs.length>=1){
        message3 = "check date!!! onCall already set for this date"
      }
      else{
        thisOnCall.save();
        message3 = "Successfully update pharmacies oncall for the date " + date ;
      }
    }
  })
  res.redirect("ofOnCall")
});

app.post("/searchDrug", function(req, res){
nameOfDrug  = req.body.nameOfDrug;
drugList.find({drugName:drugName}).sort('pharmacyName').exec(function(err, results) {
  if(!err){
    if(results){
      res.render("listOfDrug", { results:results,message5:message5 })
    }
    else{
      message5 = "no drug with such a name in the availlable phamacies"
      res.render("searchDrugForm", {message5:message5})
    }
  }

})
});

app.post("/searchDrug2", function(req, res){
drugName = req.body.drugName;
pharmacyName = req.body.pharmacyName;
drugList.find({pharmacyName:pharmacyName, drugName:drugName}, function(err,results) {
  if(!err){
    if(results.length>=1){
      res.render("listOfDrug", { results:results, message5:message5 })
    }
    else{
      message5 = "no drug with such a name in the availlable phamacies"
      res.render("searchDrugForm", {message5:message5, results:results})
    }
  }

})
});



app.listen(5000, function() {
  console.log("Server started on port 5000");
});
