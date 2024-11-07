import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import passportLocalMongoose from 'passport-local-mongoose';


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
UserSchema.plugin(passportLocalMongoose);


// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    try {
      if (!this.isModified('password')) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
  
  // Method to compare passwords for login
  UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

const User = mongoose.model('User', UserSchema);
export default User;