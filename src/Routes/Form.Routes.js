let {Router} = require("express");
const { FormModel } = require("../Models/Form.model");
const { Authenticate } = require("../Middleware/Authentication.Middleware");


let FormRouter = Router();


FormRouter.post("/generateform", Authenticate,async(req,res)=>{
    const user_id=req.body.user_id
    try {
        const Form =  FormModel( 
          { questions:[ {questionText: "",
            questionType: "",
            options: [
              {optionText: ""},
            
            ],
            answer: false,
            points:0,
            answerkey: "",
            open: true,
            required: false,
           
          }],
          formtitle:"Untitled Form",
          formdesc:"Untitled form with no descrition",
          user_id:user_id
        },
          );
          await Form.save();
          console.log(Form)
 res.send({"newForm_id":Form._id})

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
})



FormRouter.get('/userforms', Authenticate,async (req, res) => {
    // console.log(req.body)
    try {
      const user = await FormModel.find({ user_id:req.body.user_id});
      res.json(user);
    } catch (error) {
    //   console.error(error);/
      res.status(500).json({ error: 'Server error' });
    }
  });


  FormRouter.post('/addnewform', Authenticate, async (req, res) => {
    try {
      const user = new FormModel( {...req.body});
      await user.save()
      res.json({msg:"done",user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  })
  

FormRouter.get('/:id', Authenticate,async (req, res) => {
    console.log(req.body)
    try {
      const Singleform = await FormModel.findOne({form_id:req.params.id});
      res.json(Singleform);
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Server error' });
    }
  });
  


module.exports={FormRouter}