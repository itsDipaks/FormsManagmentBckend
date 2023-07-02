
const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  form_id:{type:String},  
  formtitle:{type:String},
    formdesc:{type:String},
  questions: [ {questionText: { type: String},
    questionType:{ type: String},
    options: [
      {optionText:{ type: String}}
    ],
    answer:{ type: Boolean},
    points:{ type: Number},
    answerkey:{ type: String},
    open: { type: Boolean},
    required: { type: Boolean},
    }],
    user_id:{type:String ,required:true}
});



const FormModel = mongoose.model("Formsdata", FormSchema);

module.exports = {FormModel};
