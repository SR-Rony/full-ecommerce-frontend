"use client";

import React from "react";
import localFont from "next/font/local";

const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`${myfont.className} text-4xl md:text-6xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4`}>
            Terms of Service
          </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl text-white">
          <p className="mb-6 text-gray-300 text-center">Effective Date: JULY 13, 2025</p>

          <p className="mb-8 text-gray-300 leading-relaxed">
            These Terms of Service ("Terms") govern your use of the website hammerandbell.site and hammerandbell.shop
            ("Website") and the products purchased through the Website. By accessing or purchasing from the Website, you
            ("Customer," "you," or "your") agree to be bound by these Terms. Please read these Terms carefully before
            purchasing or using any products from the Website.
          </p>

          <Section title="1. No Human Consumption">
            <p className="mb-4 text-gray-300">
              All products sold on this Website are <strong className="text-white">strictly for research purposes </strong> only. By purchasing products from this Website, you agree that:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4 text-gray-300">
              <li>You will use the products exclusively for <strong className="text-white"> legal research purposes</strong> in a <strong className="text-white"> controlled research environment</strong>.</li>
              <li>You will not use, or allow any third parties to use, any products purchased from the Website for <strong className="text-white"> human consumption</strong> or <strong className="text-white"> self-administration</strong>.</li>
              <li>You are aware that the products are <strong className="text-white">not approved for human use</strong> and are not intended to diagnose, treat, cure, or prevent any disease.</li>
              <li>You acknowledge that the products sold on this Website are <strong className="text-white">not pharmaceuticals </strong> and are not intended to be used as medication.</li>
            </ul>
            <p className="text-gray-300">
              The statements made about the products on this Website have not been evaluated by the <strong className="text-white"> FDA</strong>, and the products are not intended for <strong className="text-white">human consumption</strong>. They are intended for <strong className="text-white">research use only</strong> and should only be used in compliance with all applicable local, state, and federal laws.
            </p>
          </Section>

          <Section title="2. Age Requirement">
            <p className="mb-4 text-gray-300">
              All purchases on this Website are <strong className="text-white">strictly limited to individuals 21 years of age or older </strong>. By purchasing products from this Website, you represent and warrant that:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4 text-gray-300">
              <li>You are at least <strong className="text-white">21 years of age</strong>.</li>
              <li>You are legally able to enter into contracts and comply with these Terms.</li>
            </ul>
            <p className="text-gray-300">
              If you are under the age of 21, you are not authorized to purchase or use products from this Website.
            </p>
          </Section>

          <Section title="3. Research Use Only">
            <p className="mb-4 text-gray-300">
              You agree to use all products purchased from this Website <strong className="text-white">solely for research purposes</strong> and <strong className="text-white">not for human use </strong> or any application involving direct or indirect administration to human beings. By purchasing from this Website, you confirm that:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4 text-gray-300">
              <li>You understand that the products are intended for <strong className="text-white"> laboratory research</strong> and <strong className="text-white"> preclinical investigations</strong> only.</li>
              <li>You will not attempt to sell, distribute, or use any products for any purpose other than <strong className="text-white">scientific research</strong> in accordance with <strong className="text-white"> ethical standards</strong>.</li>
            </ul>
            <p className="text-gray-300">
              <strong className="text-white">Hammer & Bell</strong> takes no responsibility for any misuse of the products. You are solely responsible for complying with all applicable laws and regulations governing the possession, use, and distribution of these products.
            </p>
          </Section>

          <Section title="4. Legal Compliance">
            <p className="mb-4 text-gray-300">
              By purchasing products from this Website, you agree to fully comply with all <strong className="text-white"> local, state, and federal regulations</strong> regarding the use, handling, and possession of these products. This includes, but is not limited to, ensuring that:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4 text-gray-300">
              <li>You do not violate any laws or regulations regarding controlled substances, research materials, or illegal distribution.</li>
              <li>You will not distribute, sell, or offer any products purchased on this Website to others in violation of applicable laws.</li>
            </ul>
            <p className="text-gray-300">
              It is your responsibility to check and verify that the products you intend to purchase or use are legal to possess and use in your jurisdiction.
            </p>
          </Section>

          <Section title="5. No Medical or Therapeutic Claims">
            <p className="mb-4 text-gray-300">
              The products sold on this Website are not intended for <strong className="text-white">medical, therapeutic, or personal use </strong>. We make <strong className="text-white"> no claims</strong> regarding their effectiveness for any <strong className="text-white">medical</strong> condition, disease, or health benefit. All products are for <strong className="text-white">research purposes</strong> only.
            </p>
            <p className="mb-4 text-gray-300">
              Any statements on this Website about the products have not been evaluated or approved by the <strong className="text-white">FDA</strong>. By purchasing products from this Website, you acknowledge that:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-gray-300">
              <li>The products are intended solely for research purposes and not for <strong className="text-white">diagnosis, treatment,</strong> or <strong className="text-white">cure</strong> of any condition or disease.</li>
              <li>Hammer & Bell is not responsible for any harm, injury, or adverse effects that may result from misuse of the products.</li>
            </ul>
          </Section>

          <Section title="6. Product Descriptions and Availability">
            <p className="mb-4 text-gray-300">
              While we make every effort to provide accurate and up-to-date information regarding product descriptions, prices, and availability, we cannot guarantee that the products listed on this Website are free from errors. <strong className="text-white">Hammer & Bell</strong> reserves the right to:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4 text-gray-300">
              <li>Modify or update product descriptions at any time.</li>
              <li>Change product availability without notice.</li>
              <li>Discontinue products at any time.</li>
            </ul>
            <p className="text-gray-300">
              In the event that a product is mispriced or listed incorrectly, Hammer & Bell reserves the right to <strong className="text-white">cancel any orders</strong> placed at the incorrect price and offer the product at the correct price.
            </p>
          </Section>

          <Section title="7. Risk of Use">
            <p className="mb-4 text-gray-300">
              By purchasing products from this Website, you acknowledge that:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4 text-gray-300">
              <li>You understand that the use of research materials may carry <strong className="text-white">certain risks </strong>, especially if improperly handled or misused.</li>
              <li>You will take all necessary precautions to ensure safe handling and usage of the products in accordance with established research protocols.</li>
            </ul>
            <p className="text-gray-300">
              You assume all <strong className="text-white">risks and liabilities</strong> associated with the use of the products, including any potential violation of applicable laws.
            </p>
          </Section>

          <Section title="8. Disclaimer of Liability">
            <p className="mb-4 text-gray-300">
              To the fullest extent permitted by law, <strong className="text-white">Hammer & Bell</strong> disclaims all responsibility for any claims, damages, losses, or injuries arising from:
            </p>
            <ul className="list-disc pl-8 space-y-2 mb-4 text-gray-300">
              <li>Misuse or illegal use of the products.</li>
              <li>Violation of local, state, or federal regulations by the Customer.</li>
              <li>Any adverse effects resulting from the use of the products purchased from this Website.</li>
            </ul>
            <p className="text-gray-300">
              By purchasing from this Website, you release <strong className="text-white">Hammer & Bell</strong> from any and all liability for any damages, losses, or injuries that may occur as a result of using the products.
            </p>
          </Section>

          <Section title="9. Indemnification">
            <p className="mb-4 text-gray-300">
              By purchasing products from this Website, you agree to indemnify, defend, and hold <strong className="text-white">Hammer & Bell</strong>, its affiliates, employees, agents, and representatives harmless from any and all claims, liabilities, losses, damages, or expenses (including legal fees) arising out of:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-gray-300">
              <li>Your use or misuse of the products.</li>
              <li>Any violations of these Terms of Service.</li>
              <li>Your failure to comply with applicable laws and regulations.</li>
            </ul>
          </Section>

          <Section title="10. Changes to Terms">
            <p className="text-gray-300">
              <strong className="text-white">Hammer & Bell</strong> reserves the right to modify or update these <strong className="text-white">Terms of Service</strong> at any time without prior notice. Any changes will be posted on this page, and the <strong className="text-white">Effective Date</strong> will be updated accordingly. Your continued use of the Website or purchase of products after the posting of any changes constitutes your acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p className="text-gray-300">
              These <strong className="text-white">Terms of Service</strong> and any disputes related to them will be governed by and construed in accordance with the laws of the jurisdiction in which <strong className="text-white">Hammer & Bell</strong> operates, without regard to its conflict of law principles.
            </p>
          </Section>

          <Section title="12. Contact Information">
            <p className="text-gray-300 mb-4">
              For any questions, concerns, or requests for clarification regarding these Terms, please contact us at:
            </p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="font-medium text-white">
                <strong>Hammer & Bell</strong><br />
                <a href="mailto:supporr@hammerandbell.shop" className="text-emerald-400 hover:text-emerald-300 underline transition-colors">
                  supporr@hammerandbell.shop
                </a>
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 pb-6 border-b border-white/10 last:border-b-0">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-400">{title}</h2>
      {children}
    </section>
  );
}
