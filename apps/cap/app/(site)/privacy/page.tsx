import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Cap",
}

export default function App() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-32 sm:px-8 md:py-40">
      <div className="flex flex-col gap-6 text-center">
        <h1 className="animate-in text-3xl delay-300 fade-in slide-in-from-bottom-4 md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mx-auto max-w-lg animate-in pb-10 text-lg text-muted-foreground delay-500 fade-in slide-in-from-bottom-4">
          We&apos;ve tried to make this privacy policy as simple and digestible
          as possible. If you have any questions, please don&apos;t hesitate to
          reach out to us.
        </p>
        <div className="animate-in text-left text-base leading-7 text-muted-foreground delay-500 fade-in slide-in-from-bottom-4 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-8 [&_p]:mb-5">
          <p>
            At Cap Software, Inc. (&quot;Cap,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;), we are committed to protecting
            your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our software application and
            services (collectively, the &quot;Services&quot;). By using our
            Services, you consent to the collection, use, and disclosure of your
            information as described in this Privacy Policy.
          </p>
          <ol>
            <li>
              <h3>Information We Collect</h3>
              <br />
              a. Personal Information: When you create an account, we collect
              your name, email address, and any other information you
              voluntarily provide to us.
              <br />
              b. Usage Data: We collect information about how you use our
              Services, such as the videos you create, the duration of your
              recordings, and the features you utilize.
              <br />
              c. Device Information: We may collect information about the
              devices you use to access our Services, including the hardware
              model, operating system and version, and unique device
              identifiers.
              <br />
              d. Cookies and Similar Technologies: We use cookies and similar
              technologies to enhance your experience, analyze trends, and
              administer our Services.
            </li>
            <li>
              <h3>How We Use Your Information</h3>
              <br />
              a. To provide, maintain, and improve our Services.
              <br />
              b. To communicate with you, provide customer support, and respond
              to your inquiries.
              <br />
              c. To personalize your experience and deliver content and product
              offerings relevant to your interests.
              <br />
              d. To detect, prevent, and address technical issues and protect
              against fraudulent or illegal activities.
              <br />
              e. To generate aggregated, anonymized data for statistical and
              research purposes.
            </li>
            <li>
              <h3>Sharing Your Information</h3>
              <br />
              a. We may share your information with third-party service
              providers who assist us in operating our Services and conducting
              our business.
              <br />
              b. We may disclose your information if required to do so by law or
              in the good faith belief that such action is necessary to comply
              with legal obligations or to protect our rights, property, or
              safety, or that of our users or the public.
              <br />
              c. In the event of a merger, acquisition, or sale of all or a
              portion of our assets, your information may be transferred as part
              of the transaction.
            </li>
            <li>
              <h3>Data Security</h3>
              <br />
              We implement reasonable security measures to protect your
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet
              or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </li>
            <li>
              <h3>Your Choices</h3>
              <br />
              a. You can update, correct, or delete your account information at
              any time by logging into your account.
              <br />
              b. You can opt-out of receiving promotional emails from us by
              following the unsubscribe instructions provided in those emails.
              <br />
              c. You can control the use of cookies through your browser
              settings, but note that disabling cookies may limit your ability
              to use certain features of our Services.
            </li>
            <li>
              <h3>Retention of Your Information</h3>
              <br />
              We retain your information for as long as necessary to fulfill the
              purposes outlined in this Privacy Policy, unless a longer
              retention period is required or permitted by law.
            </li>
            <li>
              <h3>Children&apos;s Privacy</h3>
              <br />
              Our Services are not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we become aware that a child under 13 has provided us with
              personal information, we will take steps to delete such
              information.
            </li>
            <li>
              <h3>Changes to This Privacy Policy</h3>
              <br />
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last Updated&quot; date at the top of this
              Privacy Policy.
            </li>
            <li>
              <h3>Contact Us</h3>
              <br />
              If you have any questions or concerns about this Privacy Policy or
              our privacy practices, please contact us at hello@cap.so.
            </li>
          </ol>
          <p>
            By using our Services, you acknowledge that you have read and
            understood this Privacy Policy and agree to be bound by its terms.
          </p>
          <p>Privacy Policy for Cap Software, Inc.</p>
          <p>Last Updated: 24th April 2024</p>
        </div>
      </div>
    </div>
  )
}
