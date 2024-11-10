const mongoose = require('mongoose');
const  validator  = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
    },
    tel:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        required: validator.isEmail['Please enter an email']
        // required:  [isEmail, 'Please enter an email']
    },
    country:{
        type: String
    },
    currency:{
        type: String
    },

    password:{
        type: String,
    },
    image:{
        type: String,
        default: "/profile/default.png"
    },
    accNo:{
        type: String,
        default: "Loading"
    }, 
    balance:{
        type: Number,
        default: 0
    },

    profit:{
        type: Number,
        default: 0
    },
    totalwithdraw:{
        type: Number,
        default: 0
    },
    totalTicket:{
        type: String,
        default: "0"
    },
    totalPay:{
        type: String,
        default: "0"
    },
    totalLoan:{
        type: String,
        default: "0"
    },

    totalFixed:{
        type: String,
        default: "0"
    },
    signals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'signal'
    },
    copytrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'copytrade'
    },
    livetrades:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'livetrade'
    },
    upgrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'upgrade'
    },
    Loan: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'loan'
    },
    verified:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'verify'
    },
   
    deposits:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'deposit'
    },

    widthdraws:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'widthdraw'
    },
    Tickets:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ticket'
    },
    role:{
        type: Number,
        default: 0
    }
},{timestamps: true})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await (password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };
  

const User = mongoose.model('user', userSchema)

module.exports = User;
