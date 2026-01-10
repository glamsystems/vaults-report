import { CaretLeft, CaretRight } from "@phosphor-icons/react"

interface LearnNavProps {
  prevPage?: { title: string; slug: string; buttonLabel?: string }
  nextPage?: { title: string; slug: string; buttonLabel?: string }
  lastModified?: string | null
}

export function LearnNav({ prevPage, nextPage, lastModified }: LearnNavProps) {
  return (
    <nav className="mt-12 pt-8 pb-8">
      <div className="flex w-full gap-2 sm:gap-4">
      <div className="flex-1 min-w-0">
        {prevPage && (
          <a
            href={`/learn/${prevPage.slug === 'overview' ? '' : prevPage.slug}`}
            className="flex items-center gap-2 px-2 sm:px-4 py-3 border border-border hover:bg-muted transition-colors w-full"
          >
            <CaretLeft className="size-4 shrink-0" />
            <span className="hidden sm:inline text-muted-foreground text-sm">Previous</span>
            <span className="font-[family-name:var(--font-geist-sans)] ml-auto truncate">
              <span className="sm:hidden">{prevPage.buttonLabel ?? prevPage.title.split(' ')[0]}</span>
              <span className="hidden sm:inline">{prevPage.title}</span>
            </span>
          </a>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {nextPage && (
          <a
            href={`/learn/${nextPage.slug === 'overview' ? '' : nextPage.slug}`}
            className="flex items-center gap-2 px-2 sm:px-4 py-3 border border-border hover:bg-muted transition-colors w-full"
          >
            <span className="font-[family-name:var(--font-geist-sans)] truncate">
              <span className="sm:hidden">{nextPage.buttonLabel ?? nextPage.title.split(' ')[0]}</span>
              <span className="hidden sm:inline">{nextPage.title}</span>
            </span>
            <span className="hidden sm:inline text-muted-foreground text-sm ml-auto">Next</span>
            <CaretRight className="size-4 shrink-0 sm:ml-0 ml-auto" />
          </a>
        )}
      </div>
      </div>
        {lastModified && (
            <p className="text-sm text-muted-foreground mt-18 opacity-50">
                Last updated: {lastModified}
            </p>
        )}
    </nav>
  )
}
