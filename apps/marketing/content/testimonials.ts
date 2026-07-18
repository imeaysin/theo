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
    name: "Alex Rivera",
    handle: "@alexbuilds",
    image: "/testimonials/steven_tey.jpg",
    content: `${name} made our launch demos so much easier — polished, fast, and we own our content.`,
    url: "https://example.com",
  },
  {
    name: "Jordan Lee",
    handle: "Studio North",
    image: "/testimonials/guillermo_rauch.jpg",
    content: "Congrats on shipping — the template is a great starting point.",
    url: "https://example.com",
  },
  {
    name: "Sam Okonkwo",
    handle: "@samok",
    image: "/testimonials/olivialawson.jpg",
    content: `We've been testing ${name}. Clean UI, open source, and easy to customize for our brand.`,
    url: "https://example.com",
  },
  {
    name: "Riley Chen",
    handle: "@rileyc",
    image: "/testimonials/livvux.jpg",
    content: "One of my favorite open source starter kits",
    url: "https://example.com",
  },
  {
    name: "Morgan Blake",
    handle: "@morganb",
    image: "/testimonials/_rogermattos.jpg",
    content: `${name} is lightweight and looks great out of the box. Ship a landing page in a weekend.`,
    url: "https://example.com",
  },
  {
    name: "Casey Nguyen",
    handle: "@caseyn",
    image: "/testimonials/RatheeJaisal.jpg",
    content: "Best marketing template I've used this year",
    url: "https://example.com",
  },
  {
    name: "Taylor Brooks",
    handle: "@taylorb",
    image: "/testimonials/azrrow_s.jpg",
    content: `Try ${name} — swap the config and it already feels like your product.`,
    url: "https://example.com",
  },
  {
    name: "Jamie Ortiz",
    handle: "@jamieo",
    image: "/testimonials/cjkihl.jpg",
    content: "Clear structure, sensible defaults, and easy to fork.",
    url: "https://example.com",
  },
  {
    name: "Drew Patel",
    handle: "@drewp",
    image: "/testimonials/gillarohith.jpg",
    content: `Used ${name} for our site relaunch. From hero to pricing, the flow just works.`,
    url: "https://example.com",
  },
  {
    name: "Avery Kim",
    handle: "@averyk",
    image: "/testimonials/BilalBudhani.jpg",
    content: "Filed feedback, saw it addressed quickly. Sold on the approach.",
    url: "https://example.com",
  },
  {
    name: "Quinn Morales",
    handle: "@quinm",
    image: "/testimonials/BorhadeHrushi.jpg",
    content: `${name} is one of the cleanest OSS landing setups I've used.`,
    url: "https://example.com",
  },
  {
    name: "Harper Diaz",
    handle: "@harperd",
    image: "/testimonials/minimalnerd.jpg",
    content: "Great default typography and layout — easy to brand.",
    url: "https://example.com",
  },
  {
    name: "Reese Alvarez",
    handle: "@reesea",
    image: "/testimonials/eveningkid.jpg",
    content: `Looking for a solid product landing page? ${name} is free, cross-platform ready, and open source.`,
    url: "https://example.com",
  },
  {
    name: "Cameron Wu",
    handle: "@cameronw",
    image: "/testimonials/prayagtushar.jpg",
    content: `I think I just found my go-to landing template — ${name}`,
    url: "https://example.com",
  },
  {
    name: "Parker Singh",
    handle: "Northwind",
    image: "/testimonials/omar_mcadam.jpg",
    content:
      "Been following since the first announcement. Happy to be an early adopter.",
    url: "https://example.com",
  },
  {
    name: "Skylar James",
    handle: "Postcraft",
    image: "/testimonials/emekaonu.jpg",
    content: `Congratulations on the launch! ${name} is a strong foundation for a product site.`,
    url: "https://example.com",
  },
  {
    name: "Robin Vale",
    handle: "@robinv",
    image: "/testimonials/BeLikeBumblebee.jpg",
    content: `Grabbed a commercial license. If you need a polished marketing site, ${name} gets you started fast.`,
    url: "https://example.com",
  },
  {
    name: "Dana Foster",
    handle: "Brightline",
    image: "/testimonials/tony_tong.jpg",
    content: "Wow — beautiful defaults. Congratulations on the launch!",
    url: "https://example.com",
  },
  {
    name: "Eden Shah",
    handle: "proem.ai",
    image: "/testimonials/geet_khosla.jpg",
    content: `Tried ${name} — great product template, well executed.`,
    url: "https://example.com",
  },
  {
    name: "Phoenix Reed",
    handle: "@phoenixr",
    image: "/testimonials/pixelswithin.jpg",
    content: "Self-hostable and configurable. The future is awesome.",
    url: "https://example.com",
  },
  {
    name: "Sage Turner",
    handle: "@saget",
    image: "/testimonials/rohannrk.jpg",
    content: "Love the product — using it for our marketing site refresh.",
    url: "https://example.com",
  },
  {
    name: "Rowan Ellis",
    handle: "@rowane",
    image: "/testimonials/jdomito_.jpg",
    content: `${name} is actually way better than the closed alternatives`,
    url: "https://example.com",
  },
  {
    name: "Kai Nakamura",
    handle: "@kain",
    image: "/testimonials/Greg__LD.jpg",
    content: `No-brainer: forked ${name}, swapped productConfig, and had a landing page ready the same day.`,
    url: "https://example.com",
  },
  {
    name: "Logan Pierce",
    handle: "@loganp",
    image: "/testimonials/elie2222.jpg",
    content: "Open source",
    url: "https://example.com",
  },
  {
    name: "Finley Cruz",
    handle: "@finleyc",
    image: "/testimonials/dozibe.jpg",
    content: `Came at the right time. ${name} was exactly what we needed.`,
    url: "https://example.com",
  },
  {
    name: "Blake Nguyen",
    handle: "@blaken",
    image: "/testimonials/NerdyProgramme2.jpg",
    content: `Thanks for creating this. ${name} is so good — especially the homepage structure.`,
    url: "https://example.com",
  },
  {
    name: "Charlie Soto",
    handle: "Holoholo App",
    image: "/testimonials/christophersybico.jpg",
    content: "Sold on owning your own data",
    url: "https://example.com",
  },
  {
    name: "Morgan Pak",
    handle: "",
    image: "/testimonials/campak.jpg",
    content: `Thank you for ${name}!`,
    url: "https://example.com",
  },
]
