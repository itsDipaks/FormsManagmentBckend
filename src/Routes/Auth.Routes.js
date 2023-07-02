let {Router} = require("express");

const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { Authenticate } = require("../Middleware/Authentication.Middleware");
const { UserModel } = require("../Models/User.model");
require("dotenv").config;

let AuthRouter = Router();

// ----------------------Add Employee ----------------------------

AuthRouter.post("/signup", async (req, res) => {
  let {email} = req.body;
  let isexist = await UserModel.findOne({email});
  if (isexist) {
    res
      .status(201)
      .send({msg: "UserExist"});
  } else {
    const {name, email, password} = req.body;

    bcrypt.hash(password, 4, async function (err, hashedpassword) {
      if (err) {
        res.status(201).send({msg: "Somethingwrong ", err: err});
      } else {
        try {
          let newUser = new UserModel({
            name,
            email,
            password: hashedpassword,
          });
          await newUser.save();
          res.status(200).send({msg:"Sucessfully" });
        } catch (err) {
          res
            .status(201)
            .send({msg: "Somethingwrong", err});
        }
      }
    });
  }
});


// ----------------------Login Employee ----------------------------
AuthRouter.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try {
    if (email && password) {
      const Checkuser = await UserModel.findOne({email});

      if (!Checkuser) {
        res.status(201).send({msg: "NotFound"});
      } else {
        const hashedpassword = Checkuser.password;
        const user_id = Checkuser._id;
        bcrypt.compare(password, hashedpassword, function (err, result) {
          if (result) {
            var token = jwt.sign({user_id: user_id}, process.env.PRIVATEKEY);
            res.status(200).send({msg:"Sucessfully",token: token })
          } else {
            res.status(201).send({
              msg: "WrongCred",
              err: err,
            });
          }
        });
      }
    } else {
      res.send({msg: "SomeThingWrong"});
    }
  } catch (err) {
    res.send({msg: "SomeThingWrong", err});
  }
});



AuthRouter.get('/profile', Authenticate,async (req, res) => {
  console.log(req.body)
  try {
    const user = await UserModel.findById( req.body.user_id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = {AuthRouter};
