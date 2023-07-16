const mongoose = require('mongoose')
const Exam = require("./examModel")

const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    correctOption: {
        type: String,
        required: true
    },
    options: {
        type: Object,
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams",
        required: true
    },
},{
    timestamps: true
})

// remove question from the exam if the question is deleted
questionSchema.post('remove',async function(res, next){
    await Exam.updateOne({ _id: this.exam},{
        $pull: {questions: this._id}
    });
    next();
})

const questionModel = mongoose.model("questions",questionSchema)
module.exports = questionModel;