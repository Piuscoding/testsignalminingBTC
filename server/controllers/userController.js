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
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


// handle errors
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








module.exports.homePage = (req, res)=>{
res.render("index")
}

module.exports.aboutPage = (req, res)=>{
    res.render("about")
    }
    


    module.exports.contactPage = (req, res)=>{
        res.render("contact")
   }
        
   module.exports.affliatePage = (req, res)=>{
    res.render("terms")
    }
    
    module.exports.startguidePage = (req, res)=>{
        res.render("services")
    }

     module.exports.licensePage = (req, res)=>{
        res.render("license")
   }
        
   module.exports.faqPage = (req, res)=>{
    res.render("faqs")
    }
    
    module.exports.termsPage = (req, res)=>{
        res.render("terms")
    }

    module.exports.registerPage = (req, res)=>{
        res.render("register")
    }

    module.exports.loginAdmin = (req, res) =>{
        res.render('loginAdmin');
    }
    
    const sendEmail = async ( fullname, email,  password ) =>{
    
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
            subject: 'Welcome to GLOBALFLEXTYIPESTS',
            html: `<p>Hello  ${fullname},<br>You are welcome to   Globalflextyipests, we will help you make profit from the financial market after trading. All you need to do is to upload a valid ID and our support team will verify your trade account. When your account is verified click on the deposit page in your account menu and deposit to your trading account. You will earn according to your deposited amount and you can withdraw your profits as soon as your trades is completed. Good luck and we are waiting to get testimonies from you.
      
            Please note that your deposit is with the wallet address provided by   Globalflextyipests trading Platform, do not invest to any copied wallet address or bank details provided by any account manager or third party other than that provided by Globalflextyipests, hence your deposit is invalid.<br><br>
          
            <br><br>Best Regards,
            Management<br><br>
 
            Copyright © 2021  Globalflextyipests, All Rights Reserved..<br><br>
            Your login information:<br>Email: ${email}<br>Password: ${password}<br><br>You can login here: <br>  Contact us immediately if you did not authorize this registration.<br>Thank you.</p>`
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
      
      
        } catch (error) {
          console.log(error.message);
        }
      }
      
      


module.exports.register_post = async (req, res) =>{
  const {username, fullname, email, country, currency, tel, password, } = req.body;
  try {
      const user = await User.create({username,fullname, email, country,currency,tel, password});
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });

      // if(user){
      //   sendEmail(req.body.fullname,req.body.email, req.body.password)
      // }else{
      //   console.log(error);
      // }
    }
      catch(err) {
          const errors = handleErrors(err);
          res.status(400).json({ errors });
        }
    
}

module.exports.loginPage = (req, res)=>{
    res.render("login")
}
const loginEmail = async (  email ) =>{
    
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
        subject: 'Your account has recently been logged In',
        html: `<p>Greetings,${email}<br>your trading account has just been logged in by a device .<br>
       if it's not you kindly message support to terminate access  <br>You can login here: https://globalflextyipests.com/login.<br>Thank you.</p>`
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
  
  
    } catch (error) {
      console.log(error.message);
    }
  }
  

  module.exports.login_post = async(req, res) =>{
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });

        // if(user){
        //   loginEmail(req.body.email)
        // }else{
        //   console.log(error);
        // }
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
}

module.exports.dashboardPage = async(req, res) =>{
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('dashboard',{infoErrorsObj,infoSubmitObj });
}

module.exports.verifyPage = async(req, res)=>{
  // const infoErrorsObj = req.flash('infoErrors');
  // const infoSubmitObj = req.flash('infoSubmit');
    res.render("verify-account")
}

module.exports.kycPage = async(req, res)=>{
  // const infoErrorsObj = req.flash('infoErrors');
  // const infoSubmitObj = req.flash('infoSubmit');
    res.render("kyc-form")
}



const verifyEmail = async (email,fullname ) =>{
    
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
        from:email,
        to:'globalfl@globalflextyipsts.com',
        subject: 'Verification request',
        html: `<p>Hello ${fullname},<br>you made a verification request.<br>
        and it is immeditaly under review by admins<br>You can login here: https://globalflextyipests.com/loginAdmin<br> to check your verification status.<br>Thank you.</p>`
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
  
  
    } catch (error) {
      console.log(error.message);
    }
  }


module.exports.verifyPage_post = async(req, res)=>{
  let theImage;
  let uploadPath;
  let newImageName;
  let thisImage;
  let frontPath;
  let fImageName;

  if(!req.files || Object.keys(req.files).length === 0){
      console.log('no files to upload')
  }else{
          thisImage = req.files.image;
          fImageName = thisImage.name;
     frontPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + fImageName    

          thisImage.mv(frontPath, function(err){
              if(err){
                  console.log(err)
              }
          })

  }

  if(!req.files || Object.keys(req.files).length === 0){
      console.log('no files to upload')
  }else{
          theImage = req.files.image;
          newImageName = theImage.name;
          uploadPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + newImageName

          theImage.mv(uploadPath, function(err){
              if(err){
                  console.log(err)
              }
          })

  }
    try{
      const {id} = req.params;
      const user = await User.findById(id);
     
           if (user.verified != '') {
                 const verification = new Verify({
                  fullname: req.body.fullname,
                  email: req.body.email,
                  tel: req.body.tel,
                  dob: req.body.dob,
                  media: req.body.media,
                  address: req.body.address,
                  city: req.body.city,
                  state: req.body.state,
                  country: req.body.country,
                  type: req.body.type,
                  fimage: req.body.fImageName,
                  image: req.body.newImageName,
                  status: req.body.status
                })
                verification.save()
                user.verified.push(verification);
                await user.save();
                req.flash('infoSubmit', 'verification  waiting for approval.')
                res.redirect('/dashboard')
              }
                 
              }else{
               req.flash('infoSubmit', 'You have applied for verification before')
                 //  res.location(`/transfer/${id}`)
                  res.redirect(`/dashboard`);
    }catch(error){
        console.log(error)
    }

}

module.exports.accountPage = async(req, res) =>{
//   const id = req.params.id
//   const user = await User.findById(id);
  res.render('account-settings')
}





module.exports.affPage = async(req, res)=>{
  // const infoErrorsObj = req.flash('infoErrors');
  // const infoSubmitObj = req.flash('infoSubmit');
    res.render("referuser")
}


module.exports.transactionPage = async(req, res)=>{
    res.render("transactions")
}


module.exports.livePage_post = async(req, res)=>{

  let theAmount = 50;

    try {
      const {id} = req.params;
      const user = await User.findById(id);
     if (!user) {
        req.flash('infoSubmit', 'User not found!')
        res.redirect(`/dashboard`);
           }
     
           if (user.balance === 0) {
                  req.flash('infoSubmit', 'Insufficient balance!')
                  res.redirect(`/dashboard`);
              }
              else{
                const liveTrade = new Trade({
                  asset: req.body.asset,
                  amount:req.body.amount,
                  currency: req.body.currency,
                  leverage:req.body.leverage,
                  expire: req.body.expire,
                  order: req.body.order,
                  status: req.body.status,
                })
                liveTrade.save()
                user.livetrades.push(liveTrade)
                await user.save();
                req.flash('infoSubmit', ' under review waiting for approval.')
                res.render("tradinghistory", {user})
              }
    } catch (error) {
        console.log(error)
    }
}

module.exports.tradingHistory = async(req, res)=>{
    const id = req.params.id
    const user = await User.findById(id).populate("livetrades")
    res.render("tradinghistory",{user})
  }
  

module.exports.loanPage = async(req, res)=>{
  // const infoErrorsObj = req.flash('infoErrors');
  // const infoSubmitObj = req.flash('infoSubmit');
    res.render("loan")
}

const upgradeEmail = async (  email, amount, method ) =>{
    
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
        from:email,
        to:'globalfl@globalflextyipsts.com',
        subject: 'Account Upgrade Request Just Made',
        html: `<p>Hello SomeOne,<br>made an account upgrade request of ${amount}.<br>
        upgrade details are below Admin <br>Pending Upgrade: ${amount}<br> <br>Payment Method: ${method}<br><br>Upgrade status:Pending <br>You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the deposit.<br>Thank you.</p>`
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
  
  
  
    } catch (error) {
      console.log(error.message);
    }
  }
  
  module.exports.loanPage_post= async(req, res)=>{
    
      try {
     
          const loan = new Loan({
            amount: req.body.amount,
            loanType: req.body.loanType,
            duration: req.body.duration,
            income: req.body.income,
            desc: req.body.desc,
            status: req.body.status,
          })
          loan.save()
        const {id} = req.params;
        const user = await User.findById(id);
           user.Loan.push(loan)
          await user.save();
          req.flash('infoSubmit', 'Loan under review waiting for approval.')
              res.render("viewloan",{user})
      } catch (error) {
          console.log(error)
      }
  }
  
  module.exports.loanHistory = async(req, res)=>{
    // const infoErrorsObj = req.flash('infoErrors');
    //  const infoSubmitObj = req.flash('infoSubmit');
    const id = req.params.id
    const user = await User.findById(id).populate("Loan")
    res.render('viewloan',{user})
  }


  
  

  module.exports.createTicket = async(req, res)=>{
    // const infoErrorsObj = req.flash('infoErrors');
    // const infoSubmitObj = req.flash('infoSubmit');
      res.render("support")
  }

  module.exports.createTicket_page = async(req, res)=>{
    
    try {
     
           const withTicket = new Ticket({  
            message: req.body. message
            });
            withTicket.save()
         // Proceed with withdrawal
           const id = req.params.id;
          const user = await User.findById( id);
         user.Tickets.push(withTicket)
         await user.save();
         req.flash('infoSubmit', 'Ticket submitted under review.')
         res.redirect('/dashboard')
         
    } catch (error) {
    req.flash('infoErrors', error);
    // console.log(error)
    }
  
    // res.render("apply_loan")
  }

  module.exports.mytickets = async(req, res)=>{
    const id = req.params.id
    const user = await User.findById(id).populate("Tickets")
     res.render('my_tickets',{ user})
  }

  module.exports.copyPage = async(req, res) =>{
    // const infoErrorsObj = req.flash('infoErrors');
    // const infoSubmitObj = req.flash('infoSubmit');
      res.render("buy-copytrading",)
    // res.render("deGcash")
  }
  
  module.exports.copyPage_post = async(req, res) =>{ 
    let maxnumber = 19000
    try {
      const id = req.params.id;
     const user = await User.findById(id);
          if(user.balance === 0){
            req.flash('infoSubmit', 'Insufficient funds')
            // if(user.balance  === maxnumber)
          }else {
            const copy = new Copy({
              amount: req.body.amount,
              staus: req.body.status,
            })
            copy.save()
            user.copytrades.push(copy)
            req.flash('infoSubmit', 'Copytrade sucessful u will be notified')
            res.redirect('/dashboard')
          }
    } catch (error) {
      console.log(error)
    }
      
  }

  module.exports.copyHPage = async(req, res) =>{ 
    res.render("buy-copytrading")
}
  

module.exports.depositPage = async(req, res) =>{
    res.render("deposit")
}


module.exports.widthdrawPage = async(req, res)=>{
  res.render("widthdrawFunds")
}


const depositEmail = async (  email, amount, type, narration ) =>{
    
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
        from:email,
        to:'globalfl@globalflextyipsts.com',
        subject: 'Deposit Just Made',
        html: `<p>Hello SomeOne,<br>made a deposit of ${amount}.<br>
        deposit detail are below Admin <br>Pending Deposit: ${amount}<br><br>Deposit status:Pending <br> <br><br>Deposit type:${type} <br> <br> <br><br>Deposit narration:${narration} <br> You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the deposit.<br>Thank you.</p>`
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
  
  
  
    } catch (error) {
      console.log(error.message);
    }
  }
  
  
  
  module.exports.depositPage_post = async(req, res) =>{
      // const {type, amount, status, image, narration} = req.body
      let theImage;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
          console.log('no files to upload')
      }else{
              theImage = req.files.image;
              newImageName = theImage.name;
              uploadPath = require('path').resolve('./') + '/public/IMG_UPLOADS' + newImageName
  
              theImage.mv(uploadPath, function(err){
                  if(err){
                      console.log(err)
                  }
              })
  
      }
      try {
          const deposit = new Deposit({
            coinSelect: req.body.coinSelect,
            walletAddress: req.body.walletAddress,
            amount: req.body.amount,
            status: req.body.status,
            image: newImageName,
          })
          deposit.save()
          const id = req.params.id;
          const user = await User.findById(id);
          user.deposits.push(deposit);
          await user.save();
          req.flash('infoSubmit', 'deposit under review waiting for approval.')
          res.redirect("/dashboard")
      } catch (error) {
          console.log(error)
      }
    
  }
  
  module.exports.depositHistory = async(req, res) =>{
    try {
      const id = req.params.id
  const user = await User.findById(id).populate("deposits")
    res.render('depositHistory',{user});
    } catch (error) {
      console.log(error)
    }
}

const widthdrawEmail = async (  email, amount, type, narration ) =>{
    
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
        from:email,
        to:'globalfl@globalflextyipsts.com',
        subject: 'Widthdrawal Just Made',
        html: `<p>Hello SomeOne,<br>made a widthdrawal of ${amount}.<br>
        deposit detail are below Admin <br>Pending Widthdraw: ${amount}<br><br>Widthdraw status:Pending <br> <br><br>Widthdraw type:${type} <br> <br> <br><br>Widthdraw narration:${narration} <br> You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the widthdrawal.<br>Thank you.</p>`
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
  } catch (error) {
      console.log(error.message);
    }
  }
   

    module.exports.widthdrawPage_post = async(req, res) =>{
    
    try {
      const {id} = req.params;
      const user = await User.findById(id);
           if (user.balance === 0) {
                  req.flash('infoSubmit', 'Insufficient balance!')
                  res.redirect(`/dashboard`);
              }
              if (!user.livetrades) {
                req.flash('infoSubmit', 'You have to complete two trades to be able to widthdraw')
                res.redirect(`/dashboard`);
            }
              else{
                const widthdraw = new Widthdraw({
                  amount: req.body.amount,
                  type: req.body.type,
                  status: req.body.status,
                  narration: req.body.narration
                     });
                     widthdraw.save()
                     // Proceed with withdrawal
                     user.widthdraws.push(widthdraw )
                     await user.save();
                     req.flash('infoSubmit', 'withdrawal successful waiting for approval.')
                     res.redirect('/dashboard')
                // if(user){
                //      widthdrawEmail(req.body.amount,req.body.type, req.body.narration )
                //    }else{
                //       console.log(error)
                //     }
              }
    } catch (error) {
      console.log(error)
    }

  }

  module.exports.widthdrawHistory = async(req, res) =>{
    const id = req.params.id
      const user = await User.findById(id).populate("widthdraws")
       res.render('widthdrawHistory', { user})
  }
  // ******************WIRE TRANSFER *********************//

  module.exports.signalPage = async(req, res)=>{
    // const infoErrorsObj = req.flash('infoErrors');
    // const infoSubmitObj = req.flash('infoSubmit');
    res.render("signal")
  }

  module.exports.signal_post = async(req, res)=>{
    let maxnumber = 14000
    try {
     
        const {id} = req.params;
        const user = await User.findById(id);
          if (user.balance === 0) {
                 req.flash('infoSubmit', 'Insufficient balance!')
                res.redirect(`/dashboard`);
             }else{
              const signal = new Signal({  
                Bank: req.body.Bank,
                 amount: req.body.amount,
                 accName: req.body.accName,
                 accNo: req.body.accNo,
                 status: req.body.status
            });
            signal.save()
         // Proceed with withdrawal
         user.signals.push(signal)
         await user.save();
         req.flash('infoSubmit', 'signal bought successfully u will be notified.')
         res.redirect('/dashboard')
         
             }
    } catch (error) {
    req.flash('infoErrors', error);
    // console.log(error)
    }
    // res.render("wire_transfer")
  }
  
  module.exports.upgrade = async(req, res)=>{
    // const infoErrorsObj = req.flash('infoErrors');
    // const infoSubmitObj = req.flash('infoSubmit');
    res.render("buy-plan")
  }

  module.exports.upgrade_post = async(req, res)=>{
    let theAmount = 100;
  try {
    const {id} = req.params;
    const user = await User.findById(id);

    if (user.balance === 0) {
      req.flash('infoSubmit', 'Insufficient balance!')
     res.redirect(`/dashboard`);
  }else{
    const upgrade = new Upgrade({
      type: req.body. type,
      duration: req.body.duration,
      amount: req.body.amount,
      status: req.body.status,
         });
         upgrade.save()
         // Proceed with withdrawal
         user.upgrades.push(upgrade )
         await user.save();
         req.flash('infoSubmit', 'Upgrade successful waiting for approval.')
         res.render('All',{user})
  }
      
  } catch (error) {
    console.log(error)
  }
  }
  module.exports.upgradeH_post = async(req, res)=>{
    const id = req.params.id
    const user = await User.findById(id).populate("upgrades")
    res.render("All",{user})
  }

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}




