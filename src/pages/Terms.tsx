import { PageHeading } from "@/components/PageHeading";
import { SiteLayout } from "@/components/SiteLayout";

const SECTIONS = [
  {
    title: "What Open When is",
    body: "Open When is a small tool for making a collection of personal messages, photos and notes for one person, and sharing it through a private link. It is provided as-is, without a guarantee of uninterrupted availability.",
  },
  {
    title: "Your content",
    body: "The words and photographs you add are yours. By saving a box you give Open When permission to store and display that content so the recipient can view it. You're responsible for having the right to share what you upload, including photographs of other people.",
  },
  {
    title: "Please keep it kind",
    body: "Don't use Open When to harass anyone, share unlawful material, or upload content you don't have permission to use. Boxes that are reported for abuse may be removed.",
  },
  {
    title: "Links and access",
    body: "Anyone with a box link can view the box. There is no password protection in this version, and we can't control who a link is forwarded to. Keep your edit access secure by signing in with your own email address.",
  },
  {
    title: "Deleting",
    body: "You can delete any box you created. Deletion removes the box, its envelopes and its photos, and the link stops working. It cannot be undone.",
  },
  {
    title: "Changes",
    body: "Open When is an early product and may change. If these terms change in a meaningful way, the date on this page will change with them.",
  },
];

export default function Terms() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <PageHeading
          eyebrow="Terms"
          title="The short, readable version."
          lede="A few sensible ground rules for using Open When."
        />
        <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-muted-foreground/70">
          Last updated: November 2026
        </p>

        <div className="mt-12 space-y-0">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              className="border-t border-border py-8 first:border-t-0 first:pt-0"
            >
              <h2 className="font-serif text-[23px] leading-tight">
                {section.title}
              </h2>
              <p className="mt-3 text-[14.5px] leading-[1.85] text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-4 text-[14px] leading-[1.85] text-muted-foreground">
          Questions? Write to{" "}
          <a
            href="mailto:hello@openwhen.app"
            className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            hello@openwhen.app
          </a>
          .
        </p>
      </div>
    </SiteLayout>
  );
}
