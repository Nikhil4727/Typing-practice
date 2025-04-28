import mongoose from 'mongoose';

const userschema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    password:{type:String,required:true,minlength:6}
});

const User=mongoose.model('User',userschema);
export default User;