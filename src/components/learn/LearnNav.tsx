import { CaretLeft, CaretRight } from "@phosphor-icons/react"

interface LearnNavProps {
  prevPage?: { title: string; slug: string }
  nextPage?: { title: string; slug: string }
  lastModified?: string | null
}

export function LearnNav({ prevPage, nextPage, lastModified }: LearnNavProps) {
  return (
    <nav className="mt-12 pt-8 pb-8">
      <div className="flex w-full gap-4">
      <div className="flex-1">
        {prevPage && (
          <a
            href={`/learn/${prevPage.slug === 'overview' ? '' : prevPage.slug}`}
            className="flex items-center gap-2 px-4 py-3 border border-border hover:bg-muted transition-colors"
          >
            <CaretLeft className="size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">Previous</span>
            <span className="font-[family-name:var(--font-geist-sans)] ml-auto">{prevPage.title}</span>
          </a>
        )}
      </div>
      <div className="flex-1">
        {nextPage && (
          <a
            href={`/learn/${nextPage.slug === 'overview' ? '' : nextPage.slug}`}
            className="flex items-center gap-2 px-4 py-3 border border-border hover:bg-muted transition-colors"
          >
            <span className="font-[family-name:var(--font-geist-sans)]">{nextPage.title}</span>
            <span className="text-muted-foreground text-sm ml-auto">Next</span>
            <CaretRight className="size-4 shrink-0" />
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
