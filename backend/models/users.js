import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, enum: ['admin', 'subscriber'] },
    profiles: { 
      type: [{
        profileName: { type: String, required: true },
        age: { type: Number, required: true },
      }], 
      validate: [arrayLimit, '{PATH} exceeds the limit of 4'] 
    }
  }, {
    timestamps: true
  });
  
  
  function arrayLimit(val) {
    return val.length <= 4;
  }

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password) ;
}

userSchema.methods.toJSON = function(){
    const userData = this.toObject();
    delete userData.password;
    return userData;
}
  
  const User = mongoose.model('User', userSchema);
  
  export default User;
  