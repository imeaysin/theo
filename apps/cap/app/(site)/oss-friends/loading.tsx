export default function Loading() {
  return (
    <div className="mt-[120px]">
      <div className="relative z-10 w-full px-5 pt-24 pb-36">
        <div className="mx-auto mb-16 w-full max-w-5xl px-5 text-center sm:px-8">
          <div className="animate-pulse">
            <div className="mx-auto mb-4 h-16 max-w-md rounded-lg bg-muted"></div>
            <div className="mx-auto mb-2 h-6 max-w-2xl rounded-lg bg-muted"></div>
            <div className="mx-auto mb-2 h-6 max-w-xl rounded-lg bg-muted"></div>
            <div className="mx-auto h-6 max-w-lg rounded-lg bg-muted"></div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg border border-border bg-background p-6"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="mr-2 h-6 flex-1 rounded bg-muted"></div>
                  <div className="h-5 w-5 rounded bg-muted"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 rounded bg-muted"></div>
                  <div className="h-4 w-3/4 rounded bg-muted"></div>
                  <div className="h-4 w-1/2 rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
