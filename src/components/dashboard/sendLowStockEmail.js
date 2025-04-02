const sendLowStockEmail = async (
  supplierEmail,
  productName,
  productQuantity,
) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": import.meta.env.VITE_BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Bags Uz", email: "noreply@sendinblue.com" }, // Generic Brevo email
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
      const errorData = await response.json();
      console.error("Error sending email:", errorData);
    } else {
      console.log("Email sent successfully");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export default sendLowStockEmail;
