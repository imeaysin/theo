import { productConfig } from "@workspace/config/public"

export type Testimonial = {
  name: string
  handle: string
  image: string
  content: string
  url: string
}

const name = productConfig.name

/** Sample social proof for the landing template — replace with your own quotes. */
export const testimonials: Testimonial[] = [
  {
    name: "Steven Tey",
    handle: "Dub.co",
    image: "/testimonials/steven_tey.jpg",
    content: `${name} is one of my favorite pieces of software I've used in recent years — you own your data via open source and S3. Excited for this launch!`,
    url: "https://www.producthunt.com/",
  },
  {
    name: "Guillermo Rauch",
    handle: "Vercel",
    image: "/testimonials/guillermo_rauch.jpg",
    content: "Congrats on shipping!",
    url: "https://www.producthunt.com/",
  },
  {
    name: "Olivia",
    handle: "@olivialawson.co",
    image: "/testimonials/olivialawson.jpg",
    content: `I've been testing ${name} — the UI is polished, open source, self-hostable, and a strong alternative to closed SaaS recorders.`,
    url: "https://www.threads.com/",
  },
  {
    name: "Livvux",
    handle: "@livvux",
    image: "/testimonials/livvux.jpg",
    content: "One of my favorite open source projects",
    url: "https://x.com/",
  },
  {
    name: "Roger Mattos",
    handle: "@_rogermattos",
    image: "/testimonials/_rogermattos.jpg",
    content: `Tip for screen recordings: ${name} is lightweight, powerful, and stunning. Record and share in seconds.`,
    url: "https://x.com/",
  },
  {
    name: "Jaisal Rathee",
    handle: "@RatheeJaisal",
    image: "/testimonials/RatheeJaisal.jpg",
    content: "Best dash I've ever seen",
    url: "https://x.com/",
  },
  {
    name: "Azzam",
    handle: "@azrrow_s",
    image: "/testimonials/azrrow_s.jpg",
    content: `You can try ${name} — it's just better!`,
    url: "https://x.com/",
  },
  {
    name: "CJ",
    handle: "@cjkihl",
    image: "/testimonials/cjkihl.jpg",
    content: "Such a great open source project. I will never install OBS again",
    url: "https://x.com/",
  },
  {
    name: "Rohith Gilla",
    handle: "@gillarohith",
    image: "/testimonials/gillarohith.jpg",
    content: `Used ${name}. The whole experience from recording to the editor is pretty sweet.`,
    url: "https://x.com/",
  },
  {
    name: "Bilal Budhani",
    handle: "@BilalBudhani",
    image: "/testimonials/BilalBudhani.jpg",
    content: `Tried ${name} beta, reported an issue, and it was fixed in ~40 minutes. I'm sold.`,
    url: "https://x.com/",
  },
  {
    name: "Hrushi",
    handle: "@BorhadeHrushi",
    image: "/testimonials/BorhadeHrushi.jpg",
    content: `${name} is hands down one of the best OSS tools I've used — so much so I've uninstalled the closed alternatives.`,
    url: "https://x.com/",
  },
  {
    name: "Minimal Nerd",
    handle: "@minimalnerd",
    image: "/testimonials/minimalnerd.jpg",
    content: `This is the best open-source screen recorder for Mac`,
    url: "https://x.com/",
  },
  {
    name: "evening kid",
    handle: "@eveningkid",
    image: "/testimonials/eveningkid.jpg",
    content: `I've been looking for ages for a screen recording app that does the job — ${name} is awesome. Free, cross-platform, fully-featured, open-source.`,
    url: "https://x.com/",
  },
  {
    name: "Prayag",
    handle: "@prayagtushar",
    image: "/testimonials/prayagtushar.jpg",
    content: `I think I just found my go-to screen recording app — ${name}`,
    url: "https://x.com/",
  },
  {
    name: "Omar McAdam",
    handle: "UnInbox",
    image: "/testimonials/omar_mcadam.jpg",
    content:
      "Been following since the first announcement. Proud to say I've been a user since pre-beta.",
    url: "https://www.producthunt.com/",
  },
  {
    name: "Emeka Onu",
    handle: "Postly",
    image: "/testimonials/emekaonu.jpg",
    content: `Congratulations on the launch! I tried ${name} some time ago, and it's such a great product.`,
    url: "https://www.producthunt.com/",
  },
  {
    name: "Jay Ghiya",
    handle: "@BeLikeBumblebee",
    image: "/testimonials/BeLikeBumblebee.jpg",
    content: `Just purchased a commercial license. If you need product videos for your startup, ${name} is the easiest way to get started.`,
    url: "https://x.com/",
  },
  {
    name: "Tony Tong",
    handle: "muku.ai",
    image: "/testimonials/tony_tong.jpg",
    content: "Wow this is a beautiful product! Congratulations on the launch!",
    url: "https://www.producthunt.com/",
  },
  {
    name: "Geet Khosla",
    handle: "proem.ai",
    image: "/testimonials/geet_khosla.jpg",
    content: `I tried ${name} sometime ago — great product, well executed.`,
    url: "https://www.producthunt.com/",
  },
  {
    name: "diana",
    handle: "@pixelswithin",
    image: "/testimonials/pixelswithin.jpg",
    content: "Self-hosted recordings. The future is awesome.",
    url: "https://x.com/",
  },
  {
    name: "Rohan",
    handle: "@rohannrk",
    image: "/testimonials/rohannrk.jpg",
    content: "Love the product — using it regularly for sharing work updates.",
    url: "https://x.com/",
  },
  {
    name: "JoséPablo*",
    handle: "@jdomito_",
    image: "/testimonials/jdomito_.jpg",
    content: `${name} is actually way better than the closed alternatives`,
    url: "https://x.com/",
  },
  {
    name: "Greg_Ld",
    handle: "@Greg__LD",
    image: "/testimonials/Greg__LD.jpg",
    content: `No-brainer purchase: was looking for a solid screen recorder, gave ${name} a try, got a license within 10 minutes — flawless UX.`,
    url: "https://x.com/",
  },
  {
    name: "Elie Steinbock",
    handle: "@elie2222",
    image: "/testimonials/elie2222.jpg",
    content: "Open source",
    url: "https://x.com/",
  },
  {
    name: "Dozie",
    handle: "@dozibe",
    image: "/testimonials/dozibe.jpg",
    content: `Came at the right time. ${name} was well needed.`,
    url: "https://x.com/",
  },
  {
    name: "abdul",
    handle: "@NerdyProgramme2",
    image: "/testimonials/NerdyProgramme2.jpg",
    content: `Thanks for creating this. ${name} is so good — especially the zoom effects. An open-source alternative worth trying.`,
    url: "https://x.com/",
  },
  {
    name: "Christopher Sybico",
    handle: "Holoholo App",
    image: "/testimonials/christophersybico.jpg",
    content: "Sold on owning your own data",
    url: "https://www.producthunt.com/",
  },
  {
    name: "Cam Pak",
    handle: "",
    image: "/testimonials/campak.jpg",
    content: `Thank you for ${name}!`,
    url: "https://www.producthunt.com/",
  },
]
