import { homepageCopy } from "../../../data/homepage-copy"

const Faq = () => {
  return (
    <div className="mx-auto max-w-[1000px] px-5">
      <h2 className="mb-10 text-4xl text-foreground">
        {homepageCopy.faq.title}
      </h2>
      <div className="flex flex-col gap-4">
        {homepageCopy.faq.items.map((item, index) => (
          <details
            key={index.toString()}
            className="group overflow-hidden rounded-xl border border-border bg-card text-foreground transition-colors duration-200 open:bg-primary open:text-primary-foreground hover:bg-muted open:hover:bg-primary"
          >
            <summary className="block cursor-pointer list-none px-6 py-4 text-left marker:hidden [&::-webkit-details-marker]:hidden">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-foreground group-open:text-primary-foreground">
                  {item.question}
                </p>
                <span className="ml-4 shrink-0 text-2xl leading-none group-open:hidden">
                  +
                </span>
                <span className="ml-4 hidden shrink-0 text-2xl leading-none text-primary-foreground group-open:block">
                  -
                </span>
              </div>
            </summary>
            <p className="px-6 pb-4 text-primary-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

export default Faq
