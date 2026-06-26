import type { LegalDocument } from "@workspace/ui/components/landing"
import { siteConfig } from "@/config/site"

const { name, legalEntity, supportEmail, dmcaEmail } = siteConfig

export const termsDocument: LegalDocument = {
  title: "Terms and Conditions",
  lastUpdated: "October 26, 2023",
  intro: [
    `These Terms and Conditions ("Terms", "Terms and Conditions") govern your relationship with the ${name} application (the "Service") operated by ${legalEntity} ("us", "we", or "our").`,
    "Please read these Terms and Conditions carefully before using our Service.",
    "By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.",
  ],
  sections: [
    {
      title: "1. Subscriptions",
      blocks: [
        {
          type: "paragraph",
          text: 'Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly basis.',
        },
        {
          type: "paragraph",
          text: `At the end of each Billing Cycle, your Subscription will automatically renew under the same conditions unless you cancel it or ${legalEntity} cancels it. You may cancel your Subscription through your online account management page or by contacting ${legalEntity}'s customer support.`,
        },
        {
          type: "paragraph",
          text: "A valid payment method, including a credit card, is required. You must provide accurate and complete billing information. By submitting payment information, you authorize us to charge Subscription fees to your chosen payment method.",
        },
        {
          type: "paragraph",
          text: `If automatic billing fails, ${legalEntity} will issue an invoice and require manual payment within a stated deadline.`,
        },
      ],
    },
    {
      title: "2. Fee Changes",
      blocks: [
        {
          type: "paragraph",
          text: `${legalEntity} may modify Subscription fees at its sole discretion. Any changes will take effect at the end of the current Billing Cycle.`,
        },
        {
          type: "paragraph",
          text: "We will provide reasonable prior notice of any changes. Continued use of the Service after fee changes take effect constitutes your agreement to the new fees.",
        },
      ],
    },
    {
      title: "3. Refunds",
      blocks: [
        {
          type: "paragraph",
          text: `Refund requests may be considered on a case-by-case basis and are granted at the sole discretion of ${legalEntity}.`,
        },
      ],
    },
    {
      title: "4. Content",
      blocks: [
        {
          type: "paragraph",
          text: 'Our Service may allow you to post, link, store, share, and otherwise make available various information ("Content"). You are responsible for the legality, reliability, and appropriateness of any Content you post.',
        },
        {
          type: "paragraph",
          text: "By posting Content, you grant us a license to use, modify, display, reproduce, and distribute it on the Service. You retain ownership of your Content and are responsible for protecting your rights.",
        },
        { type: "paragraph", text: "You warrant that:" },
        {
          type: "list",
          items: [
            "You own or have rights to the Content,",
            "Posting the Content does not violate any rights of others.",
          ],
        },
        {
          type: "paragraph",
          text: `${legalEntity} does not verify the accuracy or suitability of any financial or tax-related Content shared through the Service. Use of such Content is at your own risk.`,
        },
      ],
    },
    {
      title: "5. Accounts",
      blocks: [
        {
          type: "paragraph",
          text: "When you create an account, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of these Terms.",
        },
        {
          type: "paragraph",
          text: "You are responsible for safeguarding your password and all activity under your account. You agree not to disclose your password to any third party and to notify us of any unauthorized use.",
        },
        { type: "paragraph", text: "You may not use a username that:" },
        {
          type: "list",
          items: [
            "Belongs to someone else without authorization,",
            "Is not lawfully available,",
            "Is offensive, vulgar, or obscene.",
          ],
        },
      ],
    },
    {
      title: "6. Financial and Tax Disclaimer",
      blocks: [
        {
          type: "paragraph",
          text: `${legalEntity} is not a financial advisor, accountant, or tax consultant. All content and functionality within the Service are provided for general informational purposes only and do not constitute financial, legal, or tax advice.`,
        },
        {
          type: "paragraph",
          text: "You are solely responsible for complying with all applicable financial and tax regulations, including local reporting obligations. We strongly recommend verifying all decisions and data with your local tax authority or a qualified professional.",
        },
        {
          type: "paragraph",
          text: `${legalEntity} accepts no liability for any consequences, losses, or penalties resulting from your use of the Service for financial or tax purposes.`,
        },
        {
          type: "subsection",
          title: "6.1 Invoices and Payments",
          blocks: [
            {
              type: "paragraph",
              text: `The Service may allow you to create, send, and manage invoices and to enable payment through third-party payment providers. ${legalEntity} does not verify the legal, tax, or regulatory correctness of any invoice or payment request.`,
            },
            { type: "paragraph", text: "You acknowledge and agree that:" },
            {
              type: "list",
              items: [
                "You are solely responsible for the accuracy, legality, and compliance of all invoices you create or send using the Service;",
                "You are responsible for ensuring invoices meet all applicable legal, tax, and accounting requirements in your jurisdiction;",
                `${legalEntity} is not responsible for payment disputes, failed payments, chargebacks, or customer disagreements;`,
                `Use of third-party payment providers is subject to their own terms and policies, and ${legalEntity} assumes no liability for their actions or availability.`,
              ],
            },
          ],
        },
      ],
    },
    {
      title: "7. Reliance on External Services and User-Generated Data",
      blocks: [
        {
          type: "paragraph",
          text: `${legalEntity} relies on third-party services (e.g., banking APIs, payment providers, and financial aggregators) to provide transactional data and related functionality. Additionally, the Service may involve manually inputted or user-generated data.`,
        },
        { type: "paragraph", text: "You acknowledge and agree that:" },
        {
          type: "list",
          items: [
            'All financial and transactional data—whether sourced externally or entered by users—is displayed "as is", without verification or warranty;',
            `${legalEntity} cannot guarantee the completeness, accuracy, timeliness, or reliability of such data;`,
            "You are solely responsible for verifying all information before using it for decisions or reporting;",
            `${legalEntity} shall not be liable for any loss, damage, or liability arising from the use of such data, including errors, omissions, delays, misinterpretations, or disruptions;`,
            "Your reliance on third-party data or user-submitted content is entirely at your own risk.",
          ],
        },
        {
          type: "subsection",
          title: "7.1 Accounting and ERP Integrations",
          blocks: [
            {
              type: "paragraph",
              text: "The Service may allow you to export financial data, transactions, attachments, and related information to third-party accounting or ERP systems, including but not limited to Fortnox, Xero, and QuickBooks.",
            },
            { type: "paragraph", text: "You acknowledge and agree that:" },
            {
              type: "list",
              items: [
                `${legalEntity} acts solely as a technical facilitator of data transfer and does not control, verify, or validate how third-party accounting systems process, interpret, or apply exported data;`,
                "You are solely responsible for reviewing, approving, and verifying all exported data before it is used for bookkeeping, reporting, tax filings, or compliance purposes;",
                `${legalEntity} is not responsible for errors, omissions, misclassifications, tax treatments, or reporting outcomes resulting from exported data or third-party system behavior;`,
                "Any reliance on accounting or ERP integrations is at your own risk.",
              ],
            },
          ],
        },
      ],
    },
    {
      title: "8. Copyright Policy",
      blocks: [
        {
          type: "paragraph",
          text: "We respect intellectual property rights and respond to claims of copyright or other IP infringement.",
        },
        {
          type: "paragraph",
          text: `If you believe your work has been used in a way that constitutes infringement, please email ${dmcaEmail} with:`,
        },
        {
          type: "list",
          items: [
            "A detailed description of the material,",
            "Identification of the copyrighted work,",
            "Your contact details,",
            "A good-faith statement of unauthorized use.",
          ],
        },
        {
          type: "paragraph",
          text: "False claims may result in legal liability, including damages and attorney's fees.",
        },
      ],
    },
    {
      title: "9. Intellectual Property",
      blocks: [
        {
          type: "paragraph",
          text: `The Service and its original content (excluding Content provided by users), features, and functionality are and remain the property of ${legalEntity} and its licensors.`,
        },
        {
          type: "paragraph",
          text: "Our trademarks and trade dress may not be used without prior written permission.",
        },
      ],
    },
    {
      title: "10. Links to Other Websites",
      blocks: [
        {
          type: "paragraph",
          text: `The Service may contain links to third-party websites or services that are not controlled by ${legalEntity}.`,
        },
        {
          type: "paragraph",
          text: `We assume no responsibility for third-party content, privacy policies, or practices. You agree that ${legalEntity} shall not be liable for any loss or damage caused by use of such content or services.`,
        },
        {
          type: "paragraph",
          text: "Please review the terms and policies of any third-party websites you visit.",
        },
      ],
    },
    {
      title: "11. Termination",
      blocks: [
        {
          type: "paragraph",
          text: "We may terminate or suspend your account without prior notice for any reason, including violation of these Terms.",
        },
        {
          type: "paragraph",
          text: "Upon termination, your right to use the Service will cease immediately. You may also terminate your account at any time by discontinuing use of the Service.",
        },
      ],
    },
    {
      title: "12. Limitation of Liability",
      blocks: [
        {
          type: "paragraph",
          text: `${legalEntity} and its affiliates, directors, employees, and suppliers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including:`,
        },
        {
          type: "list",
          items: [
            "Loss of profits, data, or goodwill,",
            "Errors or delays in third-party data,",
            "Unauthorized access or use of your Content,",
            "Any use of the Service.",
          ],
        },
        {
          type: "paragraph",
          text: "This limitation applies even if a remedy fails of its essential purpose.",
        },
      ],
    },
    {
      title: "13. Disclaimer",
      blocks: [
        {
          type: "paragraph",
          text: 'You use the Service at your own risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind.',
        },
        { type: "paragraph", text: "We do not warrant that:" },
        {
          type: "list",
          items: [
            "The Service will be secure, timely, or error-free,",
            "Any defects will be corrected,",
            "The Service is free of viruses or harmful components,",
            "The results will meet your requirements,",
            "Third-party data or integrations will be reliable.",
          ],
        },
      ],
    },
    {
      title: "14. Governing Law",
      blocks: [
        {
          type: "paragraph",
          text: "These Terms are governed by the laws of Sweden, without regard to its conflict of law rules.",
        },
        {
          type: "paragraph",
          text: "Failure to enforce any part of the Terms does not waive our rights. If any provision is found to be invalid, the remainder remains in effect.",
        },
        {
          type: "paragraph",
          text: `These Terms constitute the entire agreement between you and ${legalEntity} regarding the Service.`,
        },
      ],
    },
    {
      title: "15. Changes",
      blocks: [
        {
          type: "paragraph",
          text: "We reserve the right to modify or replace these Terms at any time. Material changes will be announced at least 30 days before they take effect.",
        },
        {
          type: "paragraph",
          text: "By continuing to use the Service after changes are effective, you agree to be bound by the new terms. If you do not agree, please stop using the Service.",
        },
      ],
    },
    {
      title: "16. Contact Us",
      blocks: [
        {
          type: "paragraph",
          text: "For questions regarding these Terms, contact:",
        },
        { type: "email", address: supportEmail },
      ],
    },
  ],
}

export const privacyDocument: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "June 26, 2026",
  intro: [
    `This Privacy Policy describes how ${siteConfig.name} collects, uses, and protects personal data when you use the Service.`,
    "By using the Service, you agree to the collection and use of information in accordance with this policy.",
  ],
  sections: [
    {
      title: "Information we collect",
      paragraphs: [
        "We collect information you provide directly (such as name, email, and billing details) and data generated through use of the Service (such as transaction metadata and usage logs).",
        "When you connect financial accounts, we receive data authorized by you through our banking partners.",
      ],
    },
    {
      title: "How we use information",
      paragraphs: [
        "We use data to provide and improve the Service, process payments, send transactional communications, and maintain security.",
        "We do not sell your personal data.",
      ],
    },
    {
      title: "Data retention",
      paragraphs: [
        "We retain data for as long as your account is active or as needed to provide the Service and comply with legal obligations.",
      ],
    },
    {
      title: "Security",
      paragraphs: [
        "We use industry-standard measures to protect your data, including encryption in transit and access controls.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "Depending on your location, you may have rights to access, correct, delete, or export your personal data. Contact us to exercise these rights.",
      ],
    },
    {
      title: "Cookies",
      paragraphs: [
        "We use cookies and similar technologies for authentication, preferences, and analytics. You can control cookies through your browser settings.",
      ],
    },
    {
      title: "Changes",
      paragraphs: [
        "We may update this policy from time to time. We will post the updated policy on this page with a revised date.",
      ],
    },
  ],
}
