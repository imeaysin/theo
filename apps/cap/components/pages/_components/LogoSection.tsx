import Link from "next/link"

export const LogoSection = () => {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-5 pb-32 sm:px-8 md:pb-40 lg:px-10">
      <div className="mb-4">
        <Link
          href="/"
          aria-label="Cap Home"
          className="mx-auto inline-block h-auto w-[250px]"
        >
          <svg
            aria-label="Cap Logo"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-auto w-[250px]"
            fill="none"
            viewBox="0 0 255 30"
          >
            <path />
          </svg>
        </Link>
      </div>
      <div className="mx-auto mb-8 max-w-4xl text-center">
        <h2 className="mb-3 text-2xl">
          Used by employees at leading tech companies
        </h2>
      </div>
      <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="mx-auto grid grid-cols-2 gap-6 md:grid-cols-5 lg:max-w-4xl lg:gap-10">
          <div className="mt-8 flex items-center justify-center lg:mt-0">
            <img
              alt="Tesla Logo"
              loading="lazy"
              width={100}
              height={30}
              decoding="async"
              style={{ color: "transparent" }}
              src="/logos/tesla.svg"
            />
          </div>
          <div className="mt-8 flex items-center justify-center lg:mt-0">
            <img
              alt="Microsoft Logo"
              loading="lazy"
              width={98}
              height={24}
              decoding="async"
              style={{ color: "transparent" }}
              src="/logos/microsoft.svg"
            />
          </div>
          <div className="mt-8 flex items-center justify-center lg:mt-0">
            <img
              alt="Coinbase Logo"
              loading="lazy"
              width={139}
              height={32}
              decoding="async"
              style={{ color: "transparent" }}
              src="/logos/coinbase.svg"
            />
          </div>
          <div className="mt-8 flex items-center justify-center lg:mt-0">
            <img
              alt="IBM Logo"
              loading="lazy"
              width={80}
              height={20}
              decoding="async"
              style={{ color: "transparent" }}
              src="/logos/ibm.svg"
            />
          </div>
          <div className="mt-8 flex items-center justify-center lg:mt-0">
            <img
              alt="Dropbox Logo"
              loading="lazy"
              width={115}
              height={50}
              decoding="async"
              style={{ color: "transparent" }}
              src="/logos/dropbox.svg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
