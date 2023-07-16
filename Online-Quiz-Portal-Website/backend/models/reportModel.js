const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams",
        required: true
    },
    result: {
        type: Object,
        required: true
    }
},{
    timestamps: true
})

const reportModel = mongoose.model("reports",reportSchema)
module.exports = reportModel