const db = require("../config/database");

// Get all users
exports.getAllInvoices = async (req, res) => {
  try {
    const [invoices] = await db.query("SELECT * FROM invoices");
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
  const { registration_id, CourseID, payment, tax_rate, discount_rate, payment_type, transaction_id } = req.body;

  try {
    // 1. Get registration details
    const [registration] = await db.query(
      "SELECT * FROM registrations WHERE RegistrationID = ?",
      [registration_id]
    );

    if (registration.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const { FullName, Email, PhoneNumber } = registration[0];

    // 2. Get course details
    const [course] = await db.query(
      "SELECT * FROM courses WHERE CourseID = ?",
      [CourseID]
    );

    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { CourseName, Price, StartingTime } = course[0];

    // 3. calculations
    const course_price = Price;
    const tax_amount = course_price * (tax_rate / 100);
    const total_payment_after_taxes = course_price + tax_amount;
    const total_payment = total_payment_after_taxes - (total_payment_after_taxes * (discount_rate/100));
    const balance = total_payment - payment;

    // 4. Generate invoice number
    const [lastInvoice] = await db.query(
      "SELECT MAX(id) as maxId FROM invoices"
    );
    const nextId = (lastInvoice[0].maxId || 0) + 1;
    const invoice_number = `INV-${String(nextId).padStart(5, "0")}`;

    // 5. Insert invoice into database
    const [result] = await db.query(
      "INSERT INTO invoices (registration_id, course_name, course_price, payment, tax_rate, tax_amount, discount_rate, total_payment, balance, invoice_number, student_name, email, phone, start_date, date, payment_type, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        registration_id,
        CourseName,
        course_price,
        payment,
        tax_rate,
        tax_amount,
        discount_rate,
        total_payment,
        balance,
        invoice_number,
        FullName,
        Email,
        PhoneNumber,
        StartingTime,
        new Date(),
        payment_type,
        transaction_id,
      ]
    );

    res.status(201).json({
      message: "Invoice created successfully",
      invoiceId: result.insertId,
      invoice_number,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Error creating invoice", error: error.message });
  }
};

// Update an invoice by registration_id
exports.updateInvoiceByRegistrationId = async (req, res) => {
  const { registration_id } = req.params;
  const { payment, tax_rate, discount_rate, payment_type, transaction_id } = req.body;

  try {
    // 1. Get the invoice to be updated
    const [invoice] = await db.query(
      "SELECT * FROM invoices WHERE registration_id = ?",
      [registration_id]
    );

    if (invoice.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 2. Get course details
    const [course] = await db.query(
      "SELECT * FROM courses WHERE CourseName = ?",
      [invoice[0].course_name]
    );

    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { Price } = course[0];

    // 3. calculations
    const course_price = Price;
    const tax_amount = course_price * (tax_rate / 100);
    const total_payment_after_taxes = course_price + tax_amount;
    const total_payment = total_payment_after_taxes - (total_payment_after_taxes * (discount_rate/100));
    const balance = total_payment - payment;

    // 4. Update invoice in database
    const [result] = await db.query(
      "UPDATE invoices SET payment = ?, tax_rate = ?, tax_amount = ?, discount_rate = ?, total_payment = ?, balance = ?, payment_type = ?, transaction_id = ? WHERE registration_id = ?",
      [
        payment,
        tax_rate,
        tax_amount,
        discount_rate,
        total_payment,
        balance,
        payment_type,
        transaction_id,
        registration_id,
      ]
    );

    res.status(200).json({
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Error updating invoice", error: error.message });
  }
};
