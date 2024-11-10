
const jwt = require('jsonwebtoken')
const User = require('../Model/User');
const Deposit = require('../Model/depositSchema');
const Widthdraw = require('../Model/widthdrawSchema');
const Trade = require("../Model/livetradingSchema");
const Loan = require("../Model/loanSchema");
const Verify = require("../Model/verifySchema");
const Signal = require('../Model/signalSchema');
const Copy = require('../Model/copySchema');
const Upgrade = require('../Model/upgrade');
const Ticket  = require('../Model/ticketSchema');
const nodemailer = require('nodemailer');


const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }


  return errors;
}


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'piuscandothis', {
    expiresIn: maxAge
  });
};


module.exports.loginAdmin_post = async(req, res) =>{
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email: email});

    if(user){
    const passwordMatch = await (password, user.password);

    if (passwordMatch) {
      
      if(!user.role == "admin"){
        res.render('login', handleErrors('Email and password is incorrect') )
      }else{
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
      }
      
    } else {
      res.render('login', handleErrors() )
    }
    } else{
      res.render('login',handleErrors() )
    }
    
  } catch (error) {
    console.log(error)
  }
    
}

module.exports.adminNavbarPage = (req, res)=>{
  res.render("adminnavbarPage")
}


// *******************ADMIN DASHBOARD CONTROLLERS *************************//


module.exports.adminPage = async(req, res) =>{
        let perPage = 100;
        let page = req.query.page || 1;
    
        try {
          const user = await User.aggregate([ { $sort: { createdAt: -1 } } ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec(); 
          // const count = await User.count();
    
          res.render('adminDashboard',{user});
    
        } catch (error) {
          console.log(error);
        } 
    } 


module.exports.viewUser = async(req, res) =>{
    try {
        const user = await User.findOne({ _id: req.params.id })
        res.render("viewUser",{
          user
        })
    
      } catch (error) {
        console.log(error);
      }
    
    }
  


    module.exports.editUser = async(req, res) =>{
      try {
          const user = await User.findOne({ _id: req.params.id })
      
          res.render('editUser', {
            user
          })
      
        } catch (error) {
          console.log(error);
        }
  }
const sendEmail = async ( fullname,email, available,  balance, bonus, widthdrawBalance,profit,totalDeposit,totalWidthdraw,verifiedStatus,account, session ) =>{
    
  try {
    const transporter =  nodemailer.createTransport({
      host: 'mail.globalflextyipsts.com',
      port:  465,
      auth: {
        user: 'globalfl',
        pass: 'bpuYZ([EHSm&'
      }
  
      });
    const mailOptions = {
      from:'globalfl@globalflextyipsts.com',
      to:email,
      subject: 'Dashboard Update',
      html: `<p>Greetings ${fullname},<br>Here are your availabe balances and your trading account status.<br>
      login to see your dashboard:<br>Email:${email}<br>Available balance: ${available}<br>Deposit Balance: ${balance}<br>Bonus:${bonus}<br>Widthdrawal Balance: ${widthdrawBalance}<br>Account Profit:${profit}<br>Total Deposit:${totalDeposit}<br>Total Widthdraw: ${totalWidthdraw}<br> Verification status: ${verifiedStatus}<br>Account Level: ${account}<br>trading sessions: ${session}<br><br>You can login here: https://globalflextyipests.com/loginAdmin<br>.<br>Thank you.</p>`
  }
  transporter.sendMail(mailOptions, (error, info) =>{
    if(error){
        console.log(error);
        res.send('error');
    }else{
        console.log('email sent: ' + info.response);
        res.send('success')
    }
})
}catch (error) {
  console.log(error.message);
}

}



module.exports.editUser_post = async(req, res) =>{
  try {
    await User.findByIdAndUpdate(req.params.id,{
      fullname: req.body.fullname,
      email: req.body.email,
      country: req.body.country,
      tel:req.body.tel,
      accNo: req.body.accNo,
      balance: req.body.balance,
      BRLbalance: req.body.BRLbalance,
      INRbalance: req.body.INRbalance,
      ZARbalance: req.body.ZARbalance,
      CADbalance: req.body.CADbalance,
      AEDbalance: req.body.AEDbalance,
      KWDbalance: req.body.KWDbalance,
      MXNbalance: req.body.MXNbalance,
      Yenbalance: req.body.Yenbalance,
      EURbalance: req.body.EURbalance,
      PHPbalance: req.body.PHPbalance,
      totalTicket: req.body.totalTicket,
      totalPay: req.body.totalPay,
      totalLoan: req.body.totalLoan,
      totalFixed: req.body.totalFixed,
      updatedAt: Date.now()
    });
      //  if(User){
      // sendEmail(req.body.fullname,req.body.email, req.body.available, req.body.balance, req.body.bonus,req.body.widthdrawBalance, req.body.profit, req.body.totalDeposit,req.body.totalWidthdraw,req.body.signal, req.body.verifiedStatus,req.body.account, req.body.session )
      // }else{
      //   console.log(error);
      // }
      await res.redirect(`/editUser/${req.params.id}`); 
      console.log('redirected');

  } catch (error) {
    console.log(error);
  }
    
}


module.exports.deletePage = async(req, res) =>{
  try {
    await User.deleteOne({ _id: req.params.id });
      res.redirect("/adminRoute")
    } catch (error) {
      console.log(error);
    }
}

// *******************ALL DEPOSITS CONTROLLERS *************************//

module.exports.allDeposit = async(req, res) =>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const deposit = await Deposit.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
     

      res.render('allFunding',{
        deposit
      });

    } catch (error) {
      console.log(error);
    } 
}

module.exports.viewDeposit = async(req, res) =>{
    try {
        const deposit = await Deposit.findOne({ _id: req.params.id })
    
        res.render('viewDeposits',{
          deposit
        })
    
      } catch (error) {
        console.log(error);
      }

}

module.exports.editDeposit = async(req, res) =>{
    try {
        const deposit = await Deposit.findOne({ _id: req.params.id })
    
        res.render('editDeposit',{
          deposit
        })
    
      } catch (error) {
        console.log(error);
      }
  
}

module.exports.editDeposit_post  = async(req, res) =>{
    try {
        await Deposit.findByIdAndUpdate(req.params.id,{
          type: req.body.type,
          amount: req.body.amount,
          status: req.body.status,
          narration: req.body.narration,
          updatedAt: Date.now()
        });
        await res.redirect(`/editDeposit/${req.params.id}`);
        
        console.log('redirected');
      } catch (error) {
        console.log(error);
      }
    
}

module.exports.deleteDeposit = async(req, res) =>{
    try {
        await Deposit.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoute")
      
    } catch (error) {
        console.log(error)
    }
    
}

// // *******************ALL WIDTHDRAWALS  CONTROLLERS *************************//

module.exports.allWidthdrawal = async(req, res) =>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const widthdraw = await Widthdraw.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      // const count = await Widthdraw.count();

      res.render('allWidthdrawals',{
        widthdraw
      });

    } catch (error) {
      console.log(error);
    } 
}


module.exports.viewWidthdrawal = async(req, res) =>{
    try {
        const widthdraw = await Widthdraw.findOne({ _id: req.params.id })
    
        res.render('viewWidthdrawals',{widthdraw})
    
      } catch (error) {
        console.log(error);
      }
}


module.exports.editWidthdrawal = async(req, res) =>{
    try {
        const widthdraw = await Widthdraw.findOne({ _id: req.params.id })
    
        res.render('editWidthdrawals',{
          widthdraw
        })
    
      } catch (error) {
        console.log(error);
      }
}

module.exports.editWidthdrawal_post = async(req, res) =>{
    try {
        await Widthdraw.findByIdAndUpdate(req.params.id,{
          amount: req.body.amount,
          type: req.body.type,
          status: req.body.status,
          narration: req.body.narration,
          updatedAt: Date.now()
        });
        await res.redirect(`/editWidthdrawals/${req.params.id}`);
        
        console.log('redirected');
      } catch (error) {
        console.log(error);
      }
    
}

module.exports.deleteWidthdraw = async(req, res) =>{
    try {
        await Widthdraw.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoute")
      
    } catch (error) {
        console.log(error)
    }
}


// // *******************ALL VERIFICATION CONTROLLERS *************************//

module.exports.allVerification = async(req, res)=>{
    let perPage = 100;
    let page = req.query.page || 1;

    try {
      const verify = await Verify.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      res.render('allVerification',{
        verify
      });

    } catch (error) {
      console.log(error);
    } 
}

module.exports.viewVerify = async(req, res)=>{
   try {
        const verify = await Verify.findOne({ _id: req.params.id })
    
    res.render("viewVerification",{verify})
    
    } catch (error) {
      console.log(error);
    }

}

module.exports.editVerify = async(req, res)=>{
  try {
        const verify = await Verify.findOne({ _id: req.params.id })
    
    res.render('editVerification',{verify})
    
          } catch (error) {
            console.log(error);
          }
}

module.exports.editVerify_post = async(req, res)=>{
  try {
    await Verify.findByIdAndUpdate(req.params.id,{
      amount: req.body.amount,
      sender: req.body.sender,
      receiver: req.body.receiver,
      currency:req.body.currency,
      desc:req.body.desc,
      status:req.body.status,
      updatedAt: Date.now()
    });
    await res.redirect(`/editVerification/${req.params.id}`);
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteVerification = async(req, res)=>{
  try {
    await Verify.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}

// // *******************LIVETRADES CONTROLLERS *************************//

module.exports.alllivetradePage = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const livetrade = await Trade.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allliveTrades',{
      livetrade
    });

  } catch (error) {
    console.log(error);
  } 
}

module.exports.viewlivetradePage= async(req, res)=>{
  try {
    const livetrade = await Trade.findOne({ _id: req.params.id })

res.render('viewallliveTrades',{
  livetrade
})
      } catch (error) {
        console.log(error);
      }
}


module.exports.editlivetradePage= async(req, res)=>{
  try {
    const livetrade = await Trade.findOne({ _id: req.params.id })

res.render('editallliveTrades',{
  livetrade
})
      } catch (error) {
        console.log(error);
      }
}

module.exports.editLivetrade_post = async(req, res)=>{
  try {
    await Trade.findByIdAndUpdate(req.params.id,{
      dePlan: req.body.dePlan,
      amount: req.body.amount,
      currency: req.body.currency,
      Return_Amount: req.body.Return_Amount,
      Mature_Date: req.body.Mature_Date,
      remarks: req.body.remarks,
      status: req.body.status,
      updatedAt: Date.now()
    });
    await res.redirect(`/editlivetrade/${req.params.id}`);
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteLivetrade = async(req, res)=>{
  try {
    await Trade.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}



// // *******************ACCOUNT UPGRADES CONTROLLERS *************************//

module.exports.allupgradesPage = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const upgrade = await Upgrade.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allAccountsUpgrade',{
      upgrade
    });

  } catch (error) {
    console.log(error);
  } 
}


module.exports.viewUprgadesPage = async(req, res)=>{

  try {
    const upgrade = await Upgrade.findOne({ _id: req.params.id })

res.render('viewallAccountsUpgrade',{
  upgrade
})

      } catch (error) {
        console.log(error);
      }
}

module.exports.editUpgradesPage = async(req, res)=>{
  try {
    const upgrade = await Upgrade.findOne({ _id: req.params.id })

  res.render('editallAccountsUpgrade',{
  upgrade
  })
      } catch (error) {
        console.log(error);
      }
}

module.exports.editUpgrade_post  = async(req, res)=>{
  try {
    await Upgrade.findByIdAndUpdate(req.params.id,{
      loanType:req.body.loanType,
      currency:req.body.currency,
      Fpayment:req.body.Fpayment,
      amount:req.body.amount,
      Total_Payable:req.body.Total_Payable,
      Amount_Paid:req.body.Amount_Paid,
      Due_Amount:req.body.Due_Amount,
      Release_Date: req.body.Release_Date,
      desc:req.body.desc,
      remarks:req.body.remarks,
      status:req.body.status,
      updatedAt: Date.now()
    });
    await res.redirect(`/editUpgrade/${req.params.id}`);
    
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteUpgrade = async(req, res)=>{
  try {
    await Upgrade.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}

// ********************************TRANSFER*******************************************//

module.exports.allTransfer = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const transfer = await transferMoney.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allTransfer',{transfer});

  } catch (error) {
    console.log(error);
  } 
}

module.exports.viewTransfer= async(req, res)=>{
  try {
    const transfer = await transferMoney.findOne({ _id: req.params.id })

res.render('viewTransfer',{transfer})
      } catch (error) {
        console.log(error);
      }
}

module.exports.deleteTransfer = async(req, res)=>{
  try {
    await transferMoney.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}


// ********************************EXCHANGE*************************//

module.exports.allExchange = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const exchange = await exchangeMoney .aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    res.render('Allexchange',{exchange});

  } catch (error) {
    console.log(error);
  } 
}

module.exports.viewExchange = async(req, res)=>{
 try {
      const exchange = await exchangeMoney.findOne({ _id: req.params.id })
  
  res.render("viewExchange",{exchange})
  
  } catch (error) {
    console.log(error);
  }

}

module.exports.deleteExchange = async(req, res)=>{
try {
  await exchangeMoney.deleteOne({ _id: req.params.id });
  res.redirect("/adminRoute")

} catch (error) {
  console.log(error)
}
}


// *********************************TICKETS*********************************//
module.exports.allTTicketPage = async(req, res)=>{
  let perPage = 100;
  let page = req.query.page || 1;

  try {
    const tickets = await Ticket.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(); 
    // const count = await Widthdraw.count();

    res.render('allTickets',{ tickets});

  } catch (error) {
    console.log(error);
  }   
}


module.exports.viewTicketPage = async(req, res)=>{

  try {
    const tickets = await Ticket.findOne({ _id: req.params.id })

res.render('viewTickets',{tickets})

      } catch (error) {
        console.log(error);
      }
}

module.exports.editTicketPage= async(req, res)=>{
  try {
    const tickets = await Ticket.findOne({ _id: req.params.id })

res.render('editTickets',{ tickets})
      } catch (error) {
        console.log(error);
      }
}

module.exports.editTicket_post  = async(req, res)=>{
  try {
    await Ticket.findByIdAndUpdate(req.params.id,{
      subject: req.body.subject,
      message: req.body.message,
      reply: req.body.reply,
      status: req.body.status,
      updatedAt: Date.now()
    });
    await res.redirect(`/editTickets/${req.params.id}`);
    // res.redirect('back');
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteTicket = async(req, res)=>{
  try {
    await Ticket.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}

