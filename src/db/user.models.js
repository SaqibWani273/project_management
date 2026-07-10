import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;
import crypto from "node:crypto";
const userSchema = new Schema({
  avatar:{
    type:{
      url:String,
      localPath:String,
    },
    default: {
      url: "https://placehold.net/default.png",
      localPath:""
    }

  },
  username:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  password:{
    type:String,
    minLength: 4,
    required:[true,"Password is required"],
  },
  isEmailVerified:{
    type:Boolean,
    default:false
  },
  refreshToken:{
    type:String,

  },
  forgotPasswordToken:{
    type:String
  },
  forgotPasswordTokenExpiryDate:{
    type:Date
  },
  emailVerificationToken:{
    type:String
  },
  emailVerificationTokenExpiryDate:{
    type:Date
  },
  role:{
    type:String,
    enum:["user","project_manager","admin"],
    default:"user"
  }


}, {timestamps:true});
//hashing password everytime password is modified using prehooks
userSchema.pre("save",async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hashSync(this.password,10)
  }
  next()
})
userSchema.methods.isPasswordMatched = async function(password){
  return await bcrypt.compare(password,this.password)
}
userSchema.methods.getJwtToken = function(){
  return jwt.sign({id:this._id,email:this.email,username: this.username},process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn:process.env.JWT_ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.getJwtRefreshToken = function(){
  return jwt.sign({id:this._id},process.env.JWT_REFRESH_TOKEN_SECRET,{expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRY})
}

//temporary stateful tokens used for email verification and password reset
userSchema.methods.generateTemporaryToken = function(){
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

   return {unHashedToken, hashedToken, tokenExpiry};
}

const User = model('User', userSchema);
export default User;