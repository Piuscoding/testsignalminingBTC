
const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

//************************************* */  Admin Dashboard  routes**********************//

router.get('/adminRoute',adminController.adminPage );

router.get("/adminnavbarPage", adminController.adminNavbarPage)

router.get('/viewUser/:id',adminController.viewUser );

router.get('/editUser/:id',adminController.editUser );

router.put('/editUser/:id', adminController.editUser_post);

// //************************************* */ All Deposits  routes**********************//

router.get('/allFunding',adminController.allDeposit );

router.get('/viewDeposit/:id',adminController.viewDeposit );

router.get('/editDeposit/:id',adminController.editDeposit);

router.put('/editDeposit/:id',adminController.editDeposit_post );

// //************************************* */ All Widthdrawals  routes**********************//

router.get('/allWidthdrawals',adminController.allWidthdrawal );

router.get('/viewWidthdrawals/:id',adminController.viewWidthdrawal );

router.get('/editWidthdrawals/:id',adminController.editWidthdrawal );
router.put('/editWidthdrawals/:id',adminController.editWidthdrawal_post );

// //************************************* */ All Verification routes**********************//
router.get('/Allpayment',adminController.allVerification );
router.get('/viewVerify/:id',adminController.viewVerify);
router.get('/editVerification/:id',adminController.editVerify);
router.put('/editVerification/:id',adminController.editVerify_post );

// //************************************* */ All live trades routes**********************//
router.get("/allFixed", adminController.alllivetradePage)
router.get("/view-livetrade/:id", adminController.viewlivetradePage)
router.get("/edit-livetrade/:id", adminController.editlivetradePage)
router.put('/editlivetrade/:id',adminController.editLivetrade_post );

// //************************************* */ All Account Upgrades routes**********************//
router.get("/allLoans", adminController.allupgradesPage)
router.get("/viewUpgrade/:id", adminController.viewUprgadesPage)
router.get("/editUpgrade/:id", adminController.editUpgradesPage);
router.put('/editUpgrade/:id',adminController.editUpgrade_post );

// //************************************* */ All Tickets**********************//
router.get("/allTickets", adminController.allTTicketPage)
router.get("/viewTickets/:id", adminController.viewTicketPage)
router.get("/editTickets/:id", adminController.editTicketPage);
router.put('/editTickets/:id',adminController.editTicket_post );

// //************************************* */ All Transfer**********************//
router.get("/allCopytrades", adminController.allTransfer)
router.get("/viewTransfer/:id", adminController.viewTransfer)

// //************************************* */ All Exchange**********************//
router.get("/allSignal", adminController.allExchange)
router.get("/viewExchange/:id", adminController.viewExchange)

// //************************************* */ All Loans**********************//
// router.get("/allLoan", adminController.allExchange)
// router.get("/viewExchange/:id", adminController.viewExchange)
// router.put("/viewExchange/:id", adminController.viewExchange)

// //************************************* */ All Plans**********************//
// router.get("/allPlan", adminController.allExchange)
// router.get("/viewExchange/:id", adminController.viewExchange)
// router.put("/viewExchange/:id", adminController.viewExchange)

// //************************************* */ All supports**********************//
// router.get("/allSupport", adminController.allExchange)
// router.get("/viewExchange/:id", adminController.viewExchange)


// //************************************* */ All Delete routes**********************//
router.delete('/deleteUser/:id', adminController.deletePage);
router.delete('/deleteDeposit/:id', adminController.deleteDeposit);
router.delete('/deleteWidthdrawal/:id', adminController.deleteWidthdraw)
router.delete('/deleteVerification/:id', adminController.deleteVerification)
router.delete("/deletelivetrade/:id", adminController.deleteLivetrade)
router.delete("/deleteUpgrade/:id", adminController.deleteUpgrade)

router.delete('/deleteExchange/:id', adminController.deleteExchange)
router.delete("/deleteTransfer/:id", adminController.deleteTransfer)
router.delete("/deleteTickets/:id", adminController.deleteTicket)

module.exports = router;
