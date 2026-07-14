import { defineConfig } from "tinacms";

// Your GitHub default branch (usually "main") 
const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  // These two come from your Tina Cloud account (set in Vercel env vars).
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "guide",
        label: "Guides",
        path: "src/content/guide",
        format: "md",
        ui: {
          // Auto-fill the URL slug from the title when creating a new guide
          filename: {
            readonly: false,
            slugify: (values) =>
              (values?.title || "untitled")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
          },
        },
        fields: [
          // ---- The essentials at the top ----
          {
            type: "string",
            name: "title",
            label: "Guide title (the H1)",
            isTitle: true,
            required: true,
            description: "e.g. 'The coast that earns the drive'",
          },
          {
            type: "string",
            name: "region",
            label: "Region",
            required: true,
            description: "e.g. 'North Norfolk'",
          },
          {
            type: "string",
            name: "standfirst",
            label: "Standfirst (the italic intro line under the title)",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "metaDescription",
            label: "Search description (for Google — ~155 characters)",
            ui: { component: "textarea" },
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero image",
            description: "Your own photo where you have one.",
          },
          {
            type: "string",
            name: "heroAlt",
            label: "Hero image description (for accessibility & SEO)",
          },
          {
            type: "number",
            name: "driveMinsFromLondon",
            label: "Drive time from London (minutes)",
            description: "Used by the 'near me' tool. e.g. 150 for 2hr 30",
          },
          {
            type: "string",
            name: "readTime",
            label: "Read time",
            description: "e.g. '12 min read'",
          },
          {
            type: "string",
            name: "mapLocation",
            label: "Map location (where the stay map centres)",
            description: "e.g. 'Holkham, Norfolk, UK'. Used by the [[STAY22MAP]] marker in the body.",
          },
          {
            type: "boolean",
            name: "published",
            label: "Published (visible on the site)",
            description: "Leave off while drafting.",
          },

          // ---- Quick-Facts box: one clean 'best base' CTA ----
          {
            type: "object",
            name: "quickFacts",
            label: "Quick-Facts box",
            fields: [
              { type: "string", name: "bestBase", label: "Best base", description: "e.g. 'Wells-next-the-Sea'" },
              { type: "string", name: "bestBasePrice", label: "From price", description: "e.g. '£120/night'" },
              { type: "string", name: "bestBaseLink", label: "Booking link (affiliate)", description: "Paste the booking URL; routing is handled for you." },
              { type: "string", name: "idealFor", label: "Ideal for", description: "e.g. 'Couples, dog owners, big-sky walkers'" },
              { type: "string", name: "getThere", label: "Getting there", description: "e.g. '2hr 30 drive from London; nearest station King's Lynn'" },
            ],
          },

          // ---- The body: the whole guide, written as flowing Markdown ----
          // One body field holding the full guide (## headings and all).
          // This matches how guides are actually written and how the
          // template renders them. Put [[STAY22MAP]] in the body where
          // the stay map should appear.
          {
            type: "rich-text",
            name: "body",
            label: "The guide (write the whole thing here)",
            description:
              "Write the guide as normal, using headings for each section (Why go, Where to stay, etc.). Put [[STAY22MAP]] on its own line where the stay map should appear.",
            isBody: true,
          },

          // ---- FAQ (feeds FAQ schema for AI-answer citations) ----
          {
            type: "object",
            name: "faq",
            label: "FAQ",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.question || "New question" }) },
            fields: [
              { type: "string", name: "question", label: "Question" },
              { type: "string", name: "answer", label: "Answer", ui: { component: "textarea" } },
            ],
          },

          // ---- Author byline ----
          {
            type: "string",
            name: "author",
            label: "Written by",
            description: "Whoever actually took the trip.",
          },
          {
            type: "string",
            name: "authorNote",
            label: "One line on the author",
            description: "e.g. 'George has driven to Norfolk every autumn for a decade.'",
          },
        ],
      },
    ],
  },
});
