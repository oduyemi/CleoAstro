import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

function escapeHtml(value: string): string {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
  
    return value.replace(/[&<>"']/g, (character) => {
      return entities[character] ?? character;
    });
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface BookingNotification {
  reference: string;
  packageName: string;
  amount: number;
  currency: string;
  fullName: string;
  email: string;
  phone: string;
  paymentStatus: string;
  paymentPlan?: string;
  transferReference?: string;
  status: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  question?: string;
}

export async function sendBookingNotification(
    booking: BookingNotification
  ): Promise<void> {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP environment variables are not configured.");
    }
  
    const e = escapeHtml;
    const amount = formatAmount(booking.amount, booking.currency);
  
    const detailRow = (label: string, value: string) => `
      <tr>
        <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#887b78;font-size:13px;width:42%;vertical-align:top;">
          ${e(label)}
        </td>
        <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#29181d;font-size:13px;font-weight:600;text-align:right;vertical-align:top;word-break:break-word;">
          ${e(value)}
        </td>
      </tr>
    `;
  
    const customerRows: [string, string][] = [
        ["Full Name", booking.fullName],
        ["Email Address", booking.email],
        ["Phone Number", booking.phone],
      ];
      
    const bookingRows: [string, string][] = [
        ["Package", booking.packageName],
        ["Amount", amount],
        ["Payment Status", booking.paymentStatus],
        ["Payment Plan", booking.paymentPlan || "Not applicable"],
        ["Transfer Reference", booking.transferReference || "Not provided"],
        ["Booking Status", booking.status],
    ];
    
    const birthRows: [string, string][] = [
        ["Date of Birth", booking.birthDate || "Not provided"],
        ["Time of Birth", booking.birthTime || "Not provided"],
        ["Place of Birth", booking.birthPlace || "Not provided"],
    ];
    
    const rows = (items: [string, string][]) => items.map(([label, value]) => detailRow(label, value)).join("");
  
    const question = booking.question
      ? e(booking.question).replace(/\n/g, "<br>")
      : "No additional question was provided.";
  
    const preheader = `A new ${booking.packageName} booking has been received. Reference: ${booking.reference}`;
  
    await transporter.sendMail({
      from: `"Cleo Astro" <${SMTP_USER}>`,
      to: "yhermii@gmail.com",
      replyTo: {
        name: booking.fullName,
        address: booking.email,
      },
      subject: `New Booking Received | ${booking.reference}`,
  
      text: `
          CLEO ASTRO
          A NEW BOOKING HAS ARRIVED
          
          A new booking has been submitted through Cleo Astro.
          
          BOOKING REFERENCE
          ${booking.reference}
          
          CUSTOMER INFORMATION
          Name: ${booking.fullName}
          Email: ${booking.email}
          Phone: ${booking.phone}
          
          BOOKING DETAILS
          Package: ${booking.packageName}
          Amount: ${amount}
          Payment Status: ${booking.paymentStatus}
          Payment Plan: ${booking.paymentPlan || "Not applicable"}
          Transfer Reference: ${booking.transferReference || "Not provided"}
          Booking Status: ${booking.status}
          
          BIRTH DETAILS
          Date of Birth: ${booking.birthDate || "Not provided"}
          Time of Birth: ${booking.birthTime || "Not provided"}
          Place of Birth: ${booking.birthPlace || "Not provided"}
          
          CUSTOMER'S MESSAGE
          ${booking.question || "No additional question was provided."}
          
          This is an automated notification from Cleo Astro.
          The sky remembers.
              `.trim(),
          
              html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>New Booking | Cleo Astro</title>
          </head>
          
          <body style="margin:0;padding:0;background-color:#f3eeeb;font-family:Arial,Helvetica,sans-serif;color:#29181d;">
          
            <!-- Preheader -->
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
              ${e(preheader)}
            </div>
          
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
              style="background-color:#f3eeeb;padding:35px 12px;">
              <tr>
                <td align="center">
          
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="max-width:620px;background-color:#fffdfb;border-radius:12px;overflow:hidden;">
          
                    <!-- Brand Header -->
                    <tr>
                      <td align="center"
                        style="background-color:#160b10;padding:42px 25px 36px;">
          
                        <div style="font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#c8a77a;">
                          THE SKY REMEMBERS
                        </div>
          
                        <h1 style="margin:16px 0 8px;color:#f1e8e3;font-family:Georgia,serif;font-size:36px;font-weight:400;letter-spacing:2px;">
                          CLEO ASTRO
                        </h1>
          
                        <div style="width:45px;height:1px;background-color:#c8a77a;margin:20px auto;"></div>
          
                        <p style="margin:0;color:#d9c5c0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                          New Booking Notification
                        </p>
          
                      </td>
                    </tr>
          
                    <!-- Main Content -->
                    <tr>
                      <td style="padding:38px 32px 20px;">
          
                        <div style="display:inline-block;background-color:#f4e9e8;color:#995d67;padding:8px 13px;border-radius:30px;font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">
                          &#10022; NEW BOOKING
                        </div>
          
                        <h2 style="margin:20px 0 12px;color:#29181d;font-family:Georgia,serif;font-size:27px;font-weight:400;line-height:1.35;">
                          A new journey<br>begins.
                        </h2>
          
                        <p style="margin:0;color:#786b69;font-size:14px;line-height:1.8;">
                          A new booking has just been submitted through Cleo Astro.
                          Here are the details for your review and follow-up.
                        </p>
          
                        <!-- Reference Card -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                          style="margin-top:27px;background-color:#f8f2ed;border:1px solid #eee1d7;border-radius:9px;">
                          <tr>
                            <td style="padding:21px 22px;">
          
                              <div style="font-size:10px;letter-spacing:2px;color:#947d70;text-transform:uppercase;">
                                BOOKING REFERENCE
                              </div>
          
                              <div style="margin-top:9px;color:#6e2738;font-size:21px;font-weight:bold;letter-spacing:1px;">
                                ${e(booking.reference)}
                              </div>
          
                              <div style="margin-top:9px;color:#8b7c76;font-size:12px;">
                                Please use this reference when tracking this booking.
                              </div>
          
                            </td>
                          </tr>
                        </table>
          
                      </td>
                    </tr>
          
                    <!-- Customer Information -->
                    <tr>
                      <td style="padding:20px 32px 10px;">
          
                        <h3 style="margin:0 0 8px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Customer Information
                        </h3>
          
                        <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
          
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          ${rows(customerRows)}
                        </table>
          
                      </td>
                    </tr>
          
                    <!-- Booking Information -->
                    <tr>
                      <td style="padding:27px 32px 10px;">
          
                        <h3 style="margin:0 0 8px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Booking & Payment Details
                        </h3>
          
                        <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
          
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          ${rows(bookingRows)}
                        </table>
          
                      </td>
                    </tr>
          
                    <!-- Birth Details -->
                    <tr>
                      <td style="padding:27px 32px 10px;">
          
                        <h3 style="margin:0 0 8px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Birth Details
                        </h3>
          
                        <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
          
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          ${rows(birthRows)}
                        </table>
          
                      </td>
                    </tr>
          
                    <!-- Customer Question -->
                    <tr>
                      <td style="padding:27px 32px 35px;">
          
                        <h3 style="margin:0 0 13px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Customer's Message
                        </h3>
          
                        <div style="background-color:#faf5f2;border-left:3px solid #c58b92;padding:18px 19px;color:#665856;font-size:13px;line-height:1.9;">
                          ${question}
                        </div>
          
                        <p style="margin:25px 0 0;color:#786b69;font-size:13px;line-height:1.8;">
                          Please review the booking and follow up with the customer
                          where necessary. You can reply directly to this email
                          to reach the customer.
                        </p>
          
                      </td>
                    </tr>
          
                    <!-- Footer -->
                    <tr>
                      <td align="center"
                        style="background-color:#160b10;padding:30px 25px;">
          
                        <div style="color:#c8a77a;font-family:Georgia,serif;font-size:21px;letter-spacing:2px;">
                          CLEO ASTRO
                        </div>
          
                        <p style="margin:12px 0;color:#d9c5c0;font-family:Georgia,serif;font-size:14px;font-style:italic;">
                          The sky remembers.
                        </p>
          
                        <div style="width:35px;height:1px;background-color:#80604e;margin:18px auto;"></div>
          
                        <p style="margin:0;color:#a99794;font-size:10px;line-height:1.8;letter-spacing:0.5px;">
                          This is an automated booking notification.<br>
                          Please do not reply to this system email.
                        </p>
          
                        <p style="margin:18px 0 0;color:#78676a;font-size:10px;">
                          &copy; ${new Date().getFullYear()} Cleo Astro. All rights reserved.
                        </p>
          
                      </td>
                    </tr>
          
                  </table>
          
                </td>
              </tr>
            </table>
          
          </body>
          </html>
      `,
    });
}
  


interface AdvertEnquiryNotification {
    fullName: string;
    email: string;
    phone?: string;
    businessName: string;
    website?: string;
    industry: string;
    advertType: string;
    advertDescription: string;
    campaignGoal?: string;
    targetAudience?: string;
    placement: string;
    budget?: string;
    startDate?: string;
    endDate?: string;
    destinationUrl?: string;
    assetUrl?: string;
    additionalNotes?: string;
    source: string;
    enquiryId: string;
  }
  
  export async function sendAdvertEnquiryNotification(
    enquiry: AdvertEnquiryNotification
  ): Promise<void> {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP environment variables are not configured.");
    }
  
    const e = escapeHtml;
  
    const optional = (value?: string) => value?.trim() || "Not provided";
  
    const detailRow = (label: string, value: string) => `
      <tr>
        <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#887b78;font-size:13px;width:42%;vertical-align:top;">
          ${e(label)}
        </td>
        <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#29181d;font-size:13px;font-weight:600;text-align:right;vertical-align:top;word-break:break-word;">
          ${e(value)}
        </td>
      </tr>
    `;
  
    const section = (title: string, content: string) => `
      <tr>
        <td style="padding:25px 32px 5px;">
          <h3 style="margin:0 0 10px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
            ${title}
          </h3>
          <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
          ${content}
        </td>
      </tr>
    `;
  
    const table = (items: [string, string][]) => `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        ${items.map(([label, value]) => detailRow(label, value)).join("")}
      </table>
    `;
  
    const businessDetails: [string, string][] = [
      ["Business Name", enquiry.businessName],
      ["Industry", enquiry.industry],
      ["Website", optional(enquiry.website)],
    ];
  
    const contactDetails: [string, string][] = [
      ["Contact Name", enquiry.fullName],
      ["Email Address", enquiry.email],
      ["Phone Number", optional(enquiry.phone)],
    ];
  
    const campaignDetails: [string, string][] = [
      ["Advert Type", enquiry.advertType],
      ["Placement", enquiry.placement],
      ["Campaign Goal", optional(enquiry.campaignGoal)],
      ["Target Audience", optional(enquiry.targetAudience)],
      ["Budget", optional(enquiry.budget)],
      ["Proposed Start Date", optional(enquiry.startDate)],
      ["Proposed End Date", optional(enquiry.endDate)],
    ];
  
    const advertDescription = e(enquiry.advertDescription).replace(
      /\n/g,
      "<br>"
    );
  
    const additionalNotes = enquiry.additionalNotes
      ? e(enquiry.additionalNotes).replace(/\n/g, "<br>")
      : "No additional notes provided.";
  
    const destinationUrl = enquiry.destinationUrl
      ? `<a href="${e(enquiry.destinationUrl)}" style="color:#8c5360;text-decoration:underline;">${e(enquiry.destinationUrl)}</a>`
      : "Not provided";
  
    const assetUrl = enquiry.assetUrl
      ? `<a href="${e(enquiry.assetUrl)}" style="color:#8c5360;text-decoration:underline;">View advertising asset</a>`
      : "Not provided";
  
    const preheader = `A new advertising enquiry has been received from ${enquiry.businessName}.`;
  
    await transporter.sendMail({
      from: `"Cleo Astro" <${SMTP_USER}>`,
      to: "yhermii@gmail.com",
      replyTo: {
        name: enquiry.fullName,
        address: enquiry.email,
      },
      subject: `New Advertising Enquiry | ${enquiry.businessName}`,

      text: `
          CLEO ASTRO
          NEW ADVERTISING ENQUIRY
          
          A new advertising enquiry has been submitted through Cleo Astro Bulletin.
          
          ENQUIRY ID
          ${enquiry.enquiryId}
          
          CONTACT INFORMATION
          Name: ${enquiry.fullName}
          Email: ${enquiry.email}
          Phone: ${optional(enquiry.phone)}
          
          BUSINESS INFORMATION
          Business: ${enquiry.businessName}
          Industry: ${enquiry.industry}
          Website: ${optional(enquiry.website)}
          
          CAMPAIGN DETAILS
          Advert Type: ${enquiry.advertType}
          Placement: ${enquiry.placement}
          Campaign Goal: ${optional(enquiry.campaignGoal)}
          Target Audience: ${optional(enquiry.targetAudience)}
          Budget: ${optional(enquiry.budget)}
          Start Date: ${optional(enquiry.startDate)}
          End Date: ${optional(enquiry.endDate)}
          
          ADVERT DESCRIPTION
          ${enquiry.advertDescription}
          
          DESTINATION URL
          ${optional(enquiry.destinationUrl)}
          
          ADVERTISING ASSET
          ${optional(enquiry.assetUrl)}
          
          ADDITIONAL NOTES
          ${optional(enquiry.additionalNotes)}
          
          SOURCE
          ${enquiry.source}
          
          This is an automated notification from Cleo Astro.
          The sky remembers.
              `.trim(),
          
              html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>New Advertising Enquiry | Cleo Astro</title>
          </head>
          
          <body style="margin:0;padding:0;background-color:#f3eeeb;font-family:Arial,Helvetica,sans-serif;color:#29181d;">
          
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
              ${e(preheader)}
            </div>
          
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
              style="background-color:#f3eeeb;padding:35px 12px;">
              <tr>
                <td align="center">
          
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="max-width:620px;background-color:#fffdfb;border-radius:12px;overflow:hidden;">
          
                    <!-- Brand Header -->
                    <tr>
                      <td align="center" style="background-color:#160b10;padding:42px 25px 36px;">
          
                        <div style="font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#c8a77a;">
                          THE SKY REMEMBERS
                        </div>
          
                        <h1 style="margin:16px 0 8px;color:#f1e8e3;font-family:Georgia,serif;font-size:36px;font-weight:400;letter-spacing:2px;">
                          CLEO ASTRO
                        </h1>
          
                        <div style="width:45px;height:1px;background-color:#c8a77a;margin:20px auto;"></div>
          
                        <p style="margin:0;color:#d9c5c0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                          Advertising Enquiry
                        </p>
          
                      </td>
                    </tr>
          
                    <!-- Introduction -->
                    <tr>
                      <td style="padding:38px 32px 20px;">
          
                        <div style="display:inline-block;background-color:#f4e9e8;color:#995d67;padding:8px 13px;border-radius:30px;font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">
                          &#10022; NEW ENQUIRY
                        </div>
          
                        <h2 style="margin:20px 0 12px;color:#29181d;font-family:Georgia,serif;font-size:27px;font-weight:400;line-height:1.35;">
                          A new brand wants<br>to connect.
                        </h2>
          
                        <p style="margin:0;color:#786b69;font-size:14px;line-height:1.8;">
                          A business has expressed interest in advertising through
                          Cleo Astro Bulletin. Review the enquiry details below
                          and follow up with the advertiser.
                        </p>
          
                        <!-- Enquiry Reference -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                          style="margin-top:27px;background-color:#f8f2ed;border:1px solid #eee1d7;border-radius:9px;">
                          <tr>
                            <td style="padding:21px 22px;">
          
                              <div style="font-size:10px;letter-spacing:2px;color:#947d70;text-transform:uppercase;">
                                ENQUIRY ID
                              </div>
          
                              <div style="margin-top:9px;color:#6e2738;font-size:17px;font-weight:bold;">
                                ${e(enquiry.enquiryId)}
                              </div>
          
                              <div style="margin-top:9px;color:#8b7c76;font-size:12px;">
                                Received through ${e(enquiry.source)}
                              </div>
          
                            </td>
                          </tr>
                        </table>
          
                      </td>
                    </tr>
          
                    <!-- Contact -->
                    ${section("Contact Information", table(contactDetails))}
          
                    <!-- Business -->
                    ${section("Business Information", table(businessDetails))}
          
                    <!-- Campaign -->
                    ${section("Campaign Details", table(campaignDetails))}
          
                    <!-- Advert Description -->
                    <tr>
                      <td style="padding:27px 32px 5px;">
                        <h3 style="margin:0 0 13px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Advert Description
                        </h3>
          
                        <div style="background-color:#faf5f2;border-left:3px solid #c58b92;padding:18px 19px;color:#665856;font-size:13px;line-height:1.9;">
                          ${advertDescription}
                        </div>
                      </td>
                    </tr>
          
                    <!-- Links -->
                    <tr>
                      <td style="padding:27px 32px 5px;">
                        <h3 style="margin:0 0 10px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Campaign Links & Assets
                        </h3>
          
                        <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
          
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#887b78;font-size:13px;width:42%;">
                              Destination URL
                            </td>
                            <td style="padding:13px 0;border-bottom:1px solid #eee5e2;text-align:right;font-size:13px;word-break:break-word;">
                              ${destinationUrl}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#887b78;font-size:13px;">
                              Advertising Asset
                            </td>
                            <td style="padding:13px 0;border-bottom:1px solid #eee5e2;text-align:right;font-size:13px;">
                              ${assetUrl}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
          
                    <!-- Notes -->
                    <tr>
                      <td style="padding:27px 32px 35px;">
          
                        <h3 style="margin:0 0 13px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Additional Notes
                        </h3>
          
                        <div style="background-color:#faf5f2;border-left:3px solid #c58b92;padding:18px 19px;color:#665856;font-size:13px;line-height:1.9;">
                          ${additionalNotes}
                        </div>
          
                        <p style="margin:25px 0 0;color:#786b69;font-size:13px;line-height:1.8;">
                          Please review this advertising enquiry and contact the
                          advertiser to discuss the proposed campaign, pricing
                          and next steps.
                        </p>
          
                      </td>
                    </tr>
          
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background-color:#160b10;padding:30px 25px;">
          
                        <div style="color:#c8a77a;font-family:Georgia,serif;font-size:21px;letter-spacing:2px;">
                          CLEO ASTRO
                        </div>
          
                        <p style="margin:12px 0;color:#d9c5c0;font-family:Georgia,serif;font-size:14px;font-style:italic;">
                          The sky remembers.
                        </p>
          
                        <div style="width:35px;height:1px;background-color:#80604e;margin:18px auto;"></div>
          
                        <p style="margin:0;color:#a99794;font-size:10px;line-height:1.8;letter-spacing:0.5px;">
                          This is an automated advertising enquiry notification.
                        </p>
          
                        <p style="margin:18px 0 0;color:#78676a;font-size:10px;">
                          &copy; ${new Date().getFullYear()} Cleo Astro. All rights reserved.
                        </p>
          
                      </td>
                    </tr>
          
                  </table>
          
                </td>
              </tr>
            </table>
          
          </body>
          </html>
              `,
    });
}
  


interface ConsultationNotification {
    reference: string;
    consultationType: string;
    consultationName: string;
    amount: number;
    currency: string;
    fullName: string;
    email: string;
    phone: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    question: string;
    transferReference: string;
    paymentStatus: string;
    status: string;
  }
  
  export async function sendConsultationNotification(
    consultation: ConsultationNotification
  ): Promise<void> {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error("SMTP environment variables are not configured.");
    }
  
    const e = escapeHtml;
    const amount = formatAmount(
      consultation.amount,
      consultation.currency
    );
  
    const detailRow = (label: string, value: string) => `
      <tr>
        <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#887b78;font-size:13px;width:42%;vertical-align:top;">
          ${e(label)}
        </td>
        <td style="padding:13px 0;border-bottom:1px solid #eee5e2;color:#29181d;font-size:13px;font-weight:600;text-align:right;vertical-align:top;word-break:break-word;">
          ${e(value)}
        </td>
      </tr>
    `;
  
    const table = (items: [string, string][]) => `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        ${items.map(([label, value]) => detailRow(label, value)).join("")}
      </table>
    `;
  
    const customerDetails: [string, string][] = [
      ["Full Name", consultation.fullName],
      ["Email Address", consultation.email],
      ["Phone Number", consultation.phone],
    ];
  
    const consultationDetails: [string, string][] = [
      ["Consultation Type", consultation.consultationName],
      ["Amount", amount],
      ["Payment Method", "Bank Transfer"],
      ["Payment Status", consultation.paymentStatus],
      ["Transfer Reference", consultation.transferReference],
      ["Request Status", consultation.status],
    ];
  
    const birthDetails: [string, string][] = [
      ["Date of Birth", consultation.birthDate || "Not provided"],
      ["Time of Birth", consultation.birthTime || "Not provided"],
      ["Place of Birth", consultation.birthPlace || "Not provided"],
    ];
  
    const question = e(consultation.question).replace(/\n/g, "<br>");
  
    const preheader = `New ${consultation.consultationName} request received from ${consultation.fullName}.`;
  
    await transporter.sendMail({
      from: `"Cleo Astro" <${SMTP_USER}>`,
      to: "yhermii@gmail.com",
      replyTo: {
        name: consultation.fullName,
        address: consultation.email,
      },
      subject: `New ${consultation.consultationName} Request | ${consultation.reference}`,
      text: `
          CLEO ASTRO
          NEW CONSULTATION REQUEST
          
          A new consultation request has been submitted.
          
          CONSULTATION REFERENCE
          ${consultation.reference}
          
          CUSTOMER INFORMATION
          Name: ${consultation.fullName}
          Email: ${consultation.email}
          Phone: ${consultation.phone}
          
          CONSULTATION DETAILS
          Type: ${consultation.consultationName}
          Amount: ${amount}
          Payment Method: Bank Transfer
          Payment Status: ${consultation.paymentStatus}
          Transfer Reference: ${consultation.transferReference}
          Request Status: ${consultation.status}
          
          BIRTH DETAILS
          Date of Birth: ${consultation.birthDate || "Not provided"}
          Time of Birth: ${consultation.birthTime || "Not provided"}
          Place of Birth: ${consultation.birthPlace || "Not provided"}
          
          CUSTOMER'S QUESTION
          ${consultation.question}
          
          This is an automated notification from Cleo Astro.
          The sky remembers.
              `.trim(),
          
              html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light">
            <meta name="supported-color-schemes" content="light">
            <title>New Consultation | Cleo Astro</title>
          </head>
          
          <body style="margin:0;padding:0;background-color:#f3eeeb;font-family:Arial,Helvetica,sans-serif;color:#29181d;">
          
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
              ${e(preheader)}
            </div>
          
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
              style="background-color:#f3eeeb;padding:35px 12px;">
              <tr>
                <td align="center">
          
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="max-width:620px;background-color:#fffdfb;border-radius:12px;overflow:hidden;">
          
                    <!-- Brand Header -->
                    <tr>
                      <td align="center" style="background-color:#160b10;padding:42px 25px 36px;">
          
                        <div style="font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#c8a77a;">
                          THE SKY REMEMBERS
                        </div>
          
                        <h1 style="margin:16px 0 8px;color:#f1e8e3;font-family:Georgia,serif;font-size:36px;font-weight:400;letter-spacing:2px;">
                          CLEO ASTRO
                        </h1>
          
                        <div style="width:45px;height:1px;background-color:#c8a77a;margin:20px auto;"></div>
          
                        <p style="margin:0;color:#d9c5c0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                          Consultation Notification
                        </p>
          
                      </td>
                    </tr>
          
                    <!-- Introduction -->
                    <tr>
                      <td style="padding:38px 32px 20px;">
          
                        <div style="display:inline-block;background-color:#f4e9e8;color:#995d67;padding:8px 13px;border-radius:30px;font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">
                          &#10022; NEW REQUEST
                        </div>
          
                        <h2 style="margin:20px 0 12px;color:#29181d;font-family:Georgia,serif;font-size:27px;font-weight:400;line-height:1.35;">
                          A new path<br>seeks guidance.
                        </h2>
          
                        <p style="margin:0;color:#786b69;font-size:14px;line-height:1.8;">
                          A customer has submitted a consultation request through
                          Cleo Astro. Review the details below and follow up
                          once the payment has been verified.
                        </p>
          
                        <!-- Reference -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                          style="margin-top:27px;background-color:#f8f2ed;border:1px solid #eee1d7;border-radius:9px;">
                          <tr>
                            <td style="padding:21px 22px;">
          
                              <div style="font-size:10px;letter-spacing:2px;color:#947d70;text-transform:uppercase;">
                                CONSULTATION REFERENCE
                              </div>
          
                              <div style="margin-top:9px;color:#6e2738;font-size:19px;font-weight:bold;letter-spacing:1px;">
                                ${e(consultation.reference)}
                              </div>
          
                              <div style="margin-top:9px;color:#8b7c76;font-size:12px;">
                                ${e(consultation.consultationName)}
                              </div>
          
                            </td>
                          </tr>
                        </table>
          
                      </td>
                    </tr>
          
                    <!-- Customer -->
                    <tr>
                      <td style="padding:20px 32px 5px;">
                        <h3 style="margin:0 0 8px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Customer Information
                        </h3>
                        <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
                        ${table(customerDetails)}
                      </td>
                    </tr>
          
                    <!-- Consultation -->
                    <tr>
                      <td style="padding:27px 32px 5px;">
                        <h3 style="margin:0 0 8px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Consultation & Payment Details
                        </h3>
                        <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
                        ${table(consultationDetails)}
                      </td>
                    </tr>
          
                    <!-- Birth Details -->
                    <tr>
                      <td style="padding:27px 32px 5px;">
                        <h3 style="margin:0 0 8px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Birth Details
                        </h3>
                        <div style="height:1px;background-color:#e9dcd7;margin-bottom:5px;"></div>
                        ${table(birthDetails)}
                      </td>
                    </tr>
          
                    <!-- Question -->
                    <tr>
                      <td style="padding:27px 32px 35px;">
          
                        <h3 style="margin:0 0 13px;color:#6e2738;font-family:Georgia,serif;font-size:19px;font-weight:400;">
                          Customer's Question
                        </h3>
          
                        <div style="background-color:#faf5f2;border-left:3px solid #c58b92;padding:18px 19px;color:#665856;font-size:13px;line-height:1.9;">
                          ${question}
                        </div>
          
                        <p style="margin:25px 0 0;color:#786b69;font-size:13px;line-height:1.8;">
                          Please review this consultation request and verify the
                          reported bank transfer before proceeding with the
                          consultation.
                        </p>
          
                      </td>
                    </tr>
          
                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background-color:#160b10;padding:30px 25px;">
          
                        <div style="color:#c8a77a;font-family:Georgia,serif;font-size:21px;letter-spacing:2px;">
                          CLEO ASTRO
                        </div>
          
                        <p style="margin:12px 0;color:#d9c5c0;font-family:Georgia,serif;font-size:14px;font-style:italic;">
                          The sky remembers.
                        </p>
          
                        <div style="width:35px;height:1px;background-color:#80604e;margin:18px auto;"></div>
          
                        <p style="margin:0;color:#a99794;font-size:10px;line-height:1.8;letter-spacing:0.5px;">
                          This is an automated consultation notification.
                        </p>
          
                        <p style="margin:18px 0 0;color:#78676a;font-size:10px;">
                          &copy; ${new Date().getFullYear()} Cleo Astro. All rights reserved.
                        </p>
          
                      </td>
                    </tr>
          
                  </table>
          
                </td>
              </tr>
            </table>
          
          </body>
          </html>
              `,
    });
}
  


interface DonationNotification {
    reference: string;
    amount: number;
    currency: string;
    fullName?: string;
    email?: string;
    phone?: string;
    transferReference: string;
    message?: string;
    paymentStatus: string;
    status: string;
    createdAt?: Date;
  }
  
  export const sendDonationNotification = async (
    donation: DonationNotification,
  ) => {
    const recipient = "yhermii@gmail.com";
  
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error("SMTP configuration is incomplete.");
    }
  
    const amount = formatAmount(donation.amount, donation.currency);
  
    const details: [string, string][] = [
        ["Donation reference", donation.reference],
        ["Amount", amount],
        ["Payment method", "Bank transfer"],
        ["Transfer reference", donation.transferReference],
        ["Payment status", donation.paymentStatus],
        ["Donation status", donation.status],
        [
          "Date submitted",
          donation.createdAt
            ? new Date(donation.createdAt).toLocaleString("en-NG", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Not available",
        ],
      ];
      
      const donorDetails: [string, string][] = [
        ["Full name", donation.fullName || "Not provided"],
        ["Email address", donation.email || "Not provided"],
        ["Phone number", donation.phone || "Not provided"],
      ];
      
      const row = ([label, value]: [string, string]) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #eee5e2;color:#8b7778;font-size:12px;width:38%;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:12px 14px;border-bottom:1px solid #eee5e2;color:#302124;font-size:13px;font-weight:500;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `;
  
    const safeMessage = donation.message
      ? escapeHtml(donation.message).replace(/\n/g, "<br>")
      : "No additional message.";
  
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:32px 12px;background:#f5f0ed;font-family:Arial,Helvetica,sans-serif;color:#302124;">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #eee5e2;border-radius:16px;overflow:hidden;">
  
            <div style="padding:34px 30px;background:#160b10;text-align:center;">
              <p style="margin:0 0 10px;color:#c8a77a;font-size:10px;letter-spacing:3px;text-transform:uppercase;">
                CLEO ASTRO
              </p>
              <h1 style="margin:0;color:#f1e8e3;font-family:Georgia,serif;font-size:27px;font-weight:400;">
                A new donation has been reported
              </h1>
              <p style="margin:12px 0 0;color:#d5bdba;font-size:13px;line-height:1.7;">
                A donor has submitted a bank transfer confirmation.
              </p>
            </div>
  
            <div style="padding:30px;">
              <div style="padding:20px;background:#faf6f3;border:1px solid #eee5e2;border-radius:12px;text-align:center;">
                <p style="margin:0 0 8px;color:#947c78;font-size:10px;letter-spacing:2px;text-transform:uppercase;">
                  Donation amount
                </p>
                <p style="margin:0;color:#6b0f1a;font-family:Georgia,serif;font-size:32px;">
                  ${escapeHtml(amount)}
                </p>
              </div>
  
              <h2 style="margin:28px 0 12px;color:#6b0f1a;font-family:Georgia,serif;font-size:18px;font-weight:400;">
                Donation details
              </h2>
  
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                ${details.map(row).join("")}
              </table>
  
              <h2 style="margin:28px 0 12px;color:#6b0f1a;font-family:Georgia,serif;font-size:18px;font-weight:400;">
                Donor information
              </h2>
  
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                ${donorDetails.map(row).join("")}
              </table>
  
              <h2 style="margin:28px 0 12px;color:#6b0f1a;font-family:Georgia,serif;font-size:18px;font-weight:400;">
                Donor's message
              </h2>
  
              <div style="padding:16px;background:#faf6f3;border-radius:10px;color:#665557;font-size:13px;line-height:1.8;">
                ${safeMessage}
              </div>
  
              <p style="margin:26px 0 0;color:#947c78;font-size:12px;line-height:1.8;">
                Please verify the transfer against your bank statement before updating the donation's payment status.
              </p>
            </div>
  
            <div style="padding:22px 30px;background:#160b10;text-align:center;">
              <p style="margin:0;color:#c8a77a;font-family:Georgia,serif;font-size:15px;">
                The sky remembers.
              </p>
              <p style="margin:8px 0 0;color:#a99091;font-size:10px;">
                Automated notification from Cleo Astro
              </p>
            </div>
  
          </div>
        </body>
      </html>
    `;
  
    const text = [
      "A new donation has been reported.",
      "",
      ...details.map(([label, value]) => `${label}: ${value}`),
      "",
      "Donor information:",
      ...donorDetails.map(([label, value]) => `${label}: ${value}`),
      "",
      `Donor's message: ${donation.message || "No additional message."}`,
      "",
      "Please verify the transfer against your bank statement.",
    ].join("\n");
  
    await transporter.sendMail({
      from: `"Cleo Astro" <${process.env.SMTP_USER}>`,
      to: recipient,
      ...(donation.email ? { replyTo: donation.email } : {}),
      subject: `New Donation Reported — ${amount} (${donation.reference})`,
      text,
      html,
    });
};



interface ProductOrderNotification {
    reference: string;
    productName: string;
    productSlug: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    currency: string;
    fullName: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    deliveryNotes?: string;
    transferReference: string;
    paymentStatus: string;
    status: string;
    createdAt?: Date;
  }
  
  export const sendProductOrderNotification = async (
    order: ProductOrderNotification,
  ) => {
    const recipient = "yhermii@gmail.com";
  
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error("SMTP configuration is incomplete.");
    }
  
    const formattedTotal = formatAmount(
      order.totalAmount,
      order.currency,
    );
  
    const formattedUnitPrice = formatAmount(
      order.unitPrice,
      order.currency,
    );
  
    const orderDetails: [string, string][] = [
      ["Order reference", order.reference],
      ["Product", order.productName],
      ["Product slug", order.productSlug],
      ["Quantity", String(order.quantity)],
      ["Unit price", formattedUnitPrice],
      ["Total amount", formattedTotal],
      ["Payment method", "Bank transfer"],
      ["Transfer reference", order.transferReference],
      ["Payment status", order.paymentStatus],
      ["Order status", order.status],
      [
        "Date submitted",
        order.createdAt
          ? new Date(order.createdAt).toLocaleString("en-NG", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "Not available",
      ],
    ];
  
    const customerDetails: [string, string][] = [
      ["Full name", order.fullName],
      ["Email address", order.email],
      ["Phone number", order.phone],
      ["Delivery address", order.deliveryAddress],
    ];
  
    const row = ([label, value]: [string, string]) => `
      <tr>
        <td style="padding:12px 14px;border-bottom:1px solid #eee5e2;color:#8b7778;font-size:12px;width:38%;vertical-align:top;">
          ${escapeHtml(label)}
        </td>
        <td style="padding:12px 14px;border-bottom:1px solid #eee5e2;color:#302124;font-size:13px;font-weight:500;">
          ${escapeHtml(value)}
        </td>
      </tr>
    `;
  
    const safeNotes = order.deliveryNotes
      ? escapeHtml(order.deliveryNotes).replace(/\n/g, "<br>")
      : "No additional delivery instructions.";
  
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:32px 12px;background:#f5f0ed;font-family:Arial,Helvetica,sans-serif;color:#302124;">
          <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eee5e2;border-radius:16px;overflow:hidden;">
  
            <div style="padding:34px 30px;background:#160b10;text-align:center;">
              <p style="margin:0 0 10px;color:#c8a77a;font-size:10px;letter-spacing:3px;text-transform:uppercase;">
                CLEO ASTRO
              </p>
              <h1 style="margin:0;color:#f1e8e3;font-family:Georgia,serif;font-size:27px;font-weight:400;">
                A new product order
              </h1>
              <p style="margin:12px 0 0;color:#d5bdba;font-size:13px;line-height:1.7;">
                A customer has submitted a product order and transfer confirmation.
              </p>
            </div>
  
            <div style="padding:30px;">
              <div style="padding:22px;background:#faf6f3;border:1px solid #eee5e2;border-radius:12px;text-align:center;">
                <p style="margin:0 0 8px;color:#947c78;font-size:10px;letter-spacing:2px;text-transform:uppercase;">
                  Order total
                </p>
                <p style="margin:0;color:#6b0f1a;font-family:Georgia,serif;font-size:32px;">
                  ${escapeHtml(formattedTotal)}
                </p>
                <p style="margin:10px 0 0;color:#947c78;font-size:11px;">
                  ${order.quantity} × ${escapeHtml(formattedUnitPrice)}
                </p>
              </div>
  
              <h2 style="margin:28px 0 12px;color:#6b0f1a;font-family:Georgia,serif;font-size:18px;font-weight:400;">
                Order information
              </h2>
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                ${orderDetails.map(row).join("")}
              </table>
  
              <h2 style="margin:28px 0 12px;color:#6b0f1a;font-family:Georgia,serif;font-size:18px;font-weight:400;">
                Customer information
              </h2>
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                ${customerDetails.map(row).join("")}
              </table>
  
              <h2 style="margin:28px 0 12px;color:#6b0f1a;font-family:Georgia,serif;font-size:18px;font-weight:400;">
                Delivery instructions
              </h2>
              <div style="padding:16px;background:#faf6f3;border-radius:10px;color:#665557;font-size:13px;line-height:1.8;">
                ${safeNotes}
              </div>
  
              <p style="margin:26px 0 0;color:#947c78;font-size:12px;line-height:1.8;">
                Please verify the bank transfer before confirming this order or beginning fulfilment.
              </p>
            </div>
  
            <div style="padding:22px 30px;background:#160b10;text-align:center;">
              <p style="margin:0;color:#c8a77a;font-family:Georgia,serif;font-size:15px;">
                The sky remembers.
              </p>
              <p style="margin:8px 0 0;color:#a99091;font-size:10px;">
                Automated notification from Cleo Astro
              </p>
            </div>
  
          </div>
        </body>
      </html>
    `;
  
    const text = [
      "A new Cleo Astro product order has been submitted.",
      "",
      ...orderDetails.map(([label, value]) => `${label}: ${value}`),
      "",
      "Customer information:",
      ...customerDetails.map(([label, value]) => `${label}: ${value}`),
      "",
      `Delivery instructions: ${order.deliveryNotes || "None"}`,
      "",
      "Please verify the bank transfer before fulfilling this order.",
    ].join("\n");
  
    await transporter.sendMail({
      from: `"Cleo Astro" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: order.email,
      subject: `New Product Order — ${order.productName} (${order.reference})`,
      text,
      html,
    });
};
  
  