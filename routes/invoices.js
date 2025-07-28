const express = require("express");
const router = express.Router();
const invoicesController = require("../controllers/invoicesController");

router.get("/", invoicesController.getAllInvoices);
router.post("/", invoicesController.createInvoice);
router.put("/:registration_id", invoicesController.updateInvoiceByRegistrationId);


module.exports = router;
