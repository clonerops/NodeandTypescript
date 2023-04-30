import { Schema, model } from "mongoose"

const User = new Schema({
    firstName: {
        type: String,
        required: true    
    },
    lastName: {
        type: String,
        required: true 
    },
    nationalCode: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    activationCode: {
        type: Number,
        default: null
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: null
    }
})

export default model("user", User)