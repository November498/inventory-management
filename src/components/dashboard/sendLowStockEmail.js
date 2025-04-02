const sendLowStockEmail = async (
  supplierEmail,
  productName,
  productQuantity,
) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": import.meta.env.VITE_BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Your Store", email: "bagsuz@app.com" },
      to: [{ email: supplierEmail }],
      subject: `⚠️ Low Stock Alert: ${productName}`,
      htmlContent: `
        <p>Dear Supplier,</p>
        <p>The product <strong>"${productName}"</strong> is running low on stock. Only ${productQuantity} units are left.</p>
        <p>Please restock as soon as possible.</p>
        <p>Thank you!</p>
      `,
    }),
  });

  if (!response.ok) {
    console.error("Error sending email:", await response.json());
  } else {
    console.log("Email sent successfully");
  }
};

export default sendLowStockEmail;
