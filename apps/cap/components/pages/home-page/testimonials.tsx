import { Button } from "@/components/cap-ui"
import { motion } from "framer-motion"
import Image from "next/image"
import { homepageCopy } from "../../../data/homepage-copy"
import { testimonials } from "../../../data/testimonials"

// Combined type for testimonial data and its position/style configuration
interface TestimonialItem {
  name: string
  handle: string
  image: string
  content: string
  url: string
  position: { left?: string; right?: string; top?: string }
  rotation: number
  zIndex: number
}

// Card component props - now directly takes the TestimonialItem
interface TestimonialCardProps {
  item: TestimonialItem
}

// Testimonial card component
const TestimonialCard = ({ item }: TestimonialCardProps) => {
  // Destructure all properties from item, including position, rotation and zIndex
  const { name, handle, image, content, url, position, rotation, zIndex } = item

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="h-fit min-w-[300px] cursor-pointer rounded-xl border border-border bg-card p-6 shadow-lg transition-shadow duration-200 ease-in-out hover:shadow-xl md:absolute md:h-auto md:w-full md:max-w-[300px] md:min-w-min"
      style={{
        ...position,
        transformOrigin: "center center",
      }}
      initial={{
        rotate: rotation,
        zIndex: zIndex,
      }}
      whileHover={{
        rotate: 0,
        scale: 1.05,
        y: -5,
        zIndex: 50,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <div className="mb-4 flex items-center">
        <div className="relative mr-3 size-12 overflow-hidden rounded-full border-2 border-border">
          <Image
            src={image}
            key={image}
            alt={`${name}'s profile picture`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">{handle}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </motion.a>
  )
}

// Combined testimonial data with position and style configurations
const testimonialItems: TestimonialItem[] = [
  {
    ...testimonials[2],
    position: { right: "5%", top: "5%" },
    rotation: 8,
    zIndex: 4,
  },
  {
    ...testimonials[25],
    position: { right: "25%", top: "15%" },
    rotation: -5,
    zIndex: 3,
  },
  {
    ...testimonials[9],
    position: { left: "5%", top: "10%" },
    rotation: -8,
    zIndex: 2,
  },
  {
    ...testimonials[22],
    position: { left: "25%", top: "5%" },
    rotation: 5,
    zIndex: 1,
  },
  {
    ...testimonials[12],
    position: { right: "18%", top: "40%" },
    rotation: 8,
    zIndex: 3,
  },
  {
    ...testimonials[10],
    position: { left: "20%", top: "40%" },
    rotation: -4,
    zIndex: 0,
  },
]

// Main Testimonials component
const Testimonials = () => {
  return (
    <div className="mx-auto w-full max-w-[1200px] md:px-5">
      <div className="mb-16 px-5 text-center">
        <h2 className="mx-auto mb-3 w-full text-4xl font-medium text-balance text-foreground">
          {homepageCopy.testimonials.title}
        </h2>
        <p className="mx-auto w-full max-w-[400px] text-lg leading-7 text-muted-foreground">
          {homepageCopy.testimonials.subtitle}
        </p>
      </div>

      <div className="relative min-h-fit w-full overflow-x-auto px-5 py-10 md:h-[600px] md:px-0">
        {/* Card layout container */}
        <div className="flex h-full w-full flex-row md:relative">
          {testimonialItems.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </div>
      <Button
        href="/testimonials"
        className="mx-auto mt-10 w-fit md:mt-0"
        variant="dark"
        size="lg"
      >
        {homepageCopy.testimonials.cta}
      </Button>
    </div>
  )
}

export default Testimonials
