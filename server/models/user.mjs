import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gamesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],  
});
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
export default User;