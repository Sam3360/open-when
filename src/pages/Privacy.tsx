import { PageHeading } from "@/components/PageHeading";
import { SiteLayout } from "@/components/SiteLayout";
import type { ReactNode } from "react";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-[23px] leading-tight">{title}</h2>
      <div className="mt-3 space-y-3.5 text-[14.5px] leading-[1.85] text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <PageHeading
          eyebrow="Privacy"
          title="Where your box actually lives."
          lede="This page describes what Open When really does with the words and photographs you put into a box. It is written to match the current version of the product, not a future one."
        />
        <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-muted-foreground/70">
          Last updated: November 2026
        </p>

        <div className="mt-12">
          <Section title="What is stored">
            <p>
              Boxes are stored in a hosted database (Convex). Each box holds the
              names, titles, note, theme and envelope contents you enter. Each
              photo you upload is stored as a file in the same hosted service,
              and the box references that file.
            </p>
            <p>
              Nothing is stored only on your device once you save a box — that's
              why the link works on someone else's phone.
            </p>
          </Section>

          <Section title="How box links work">
            <p>
              Every saved box gets its own random identifier, used in a link
              like{" "}
              <span className="whitespace-nowrap font-mono text-[12.5px] text-foreground">
                /box/xxxxxxxxxxxxxxxx
              </span>
              . The identifier is long and randomly generated. Anyone who has
              the link can open the box — there is no password on a box in this
              version.
            </p>
            <p>
              That means a forwarded link works for whoever receives it. Treat
              the link the way you'd treat the gift itself: share it with the
              person it's for.
            </p>
          </Section>

          <Section title="Accounts and who can edit">
            <p>
              Creating a box requires signing in, either with a one-time code
              sent to your email address or as a guest. Your boxes are linked to
              that sign-in, and only you can edit or delete them.
            </p>
            <p>
              A guest sign-in lives in this browser. Those boxes stay available
              after a refresh, but signing in on a different device won't show
              them. Signing in with an email code is what keeps your boxes
              reachable from anywhere.
            </p>
            <p>
              People opening a box never need an account, and the recipient view
              has no editing controls. It is a read-only page.
            </p>
          </Section>

          <Section title="What recipients can see">
            <p>
              The recipient sees the box title, their name, your name, your
              note, the cover theme and every envelope. They do not see your
              email address, your account, or any of your other boxes.
            </p>
            <p>
              Open When does not currently record which envelopes have been
              opened. There is no read receipt, and no notification when someone
              opens the link.
            </p>
          </Section>

          <Section title="Not listed, not searchable">
            <p>
              There is no public directory of boxes, and no way to browse other
              people's boxes. Box pages ask search engines not to index them,
              and no box content is exposed through a listing endpoint.
            </p>
          </Section>

          <Section title="Drafts in your browser">
            <p>
              While you're making a box, this browser keeps a draft in local
              storage so a refresh doesn't lose your work. The draft is removed
              when you save the box or choose to start fresh. Clearing your
              browser's site data will also remove unsaved drafts.
            </p>
          </Section>

          <Section title="Photos">
            <p>
              Photos are validated (JPG, PNG or WebP, up to 8 MB) and uploaded
              to the hosted file store. They are served to anyone viewing the
              box through the link. Removing a photo while editing deletes the
              stored file when you save; deleting the whole box deletes its
              photos too.
            </p>
            <p>
              If you upload a photo for a draft and never save the box, that
              file stays in storage rather than being cleaned up automatically.
              Deleting the saved box removes the photos it contains.
            </p>
            <p>
              Please only upload photographs you have the right to share with
              the person receiving the box.
            </p>
          </Section>

          <Section title="Deleting a box">
            <p>
              You can delete a box from your dashboard. Deleting removes the
              box, its envelopes and its uploaded photos from the database. The
              recipient link then shows the “couldn't be found” page and no
              longer exposes the box. Deletion can't be undone.
            </p>
          </Section>

          <Section title="What we don't do">
            <p>
              There are no advertising trackers or third-party analytics scripts
              on Open When in this version. We don't ask for your location, sell
              data, or use box contents to train anything.
            </p>
          </Section>

          <Section title="Security, honestly">
            <p>
              Access is controlled by the unguessable link and by sign-in for
              editing. Box contents are not end-to-end encrypted: they are
              stored on the server so they can be displayed to the recipient,
              which means the service can read them. Open When is an early,
              small product and does not claim security certifications.
            </p>
            <p>
              Don't use it for passwords, financial details, or anything you
              wouldn't put in an email to the person receiving the box.
            </p>
          </Section>

          <Section title="Questions">
            <p>
              For anything about this page, write to{" "}
              <a
                href="mailto:hello@openwhen.app"
                className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                hello@openwhen.app
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </SiteLayout>
  );
}
