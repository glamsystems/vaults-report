import { GithubLogo, FileText, XLogo, Globe, LinkedinLogo, EnvelopeSimple, TelegramLogo } from '@phosphor-icons/react'
import type { DirectoryEntry } from '@/lib/directory'
import { ThemedLogo } from '@/components/shared/ThemedLogo'

export function ChainBadges({ chains, maxRows = 1, maxVisible: maxVisibleProp }: { chains: string[]; maxRows?: 1 | 2; maxVisible?: number }) {
  if (!chains.length) return <span className="text-muted-foreground">—</span>

  // Use explicit maxVisible if provided, otherwise 2 badges per row
  const maxVisible = maxVisibleProp ?? maxRows * 2
  const displayChains = chains.slice(0, maxVisible)
  const remaining = chains.length - maxVisible

  return (
    <div className="flex flex-wrap gap-1">
      {displayChains.map((chain) => (
        <span
          key={chain}
          className="inline-flex items-center rounded-none bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
        >
          {chain}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center rounded-none bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  )
}

export function LinkIcons({ entry, showAll = false }: { entry: DirectoryEntry; showAll?: boolean }) {
  const { name, url, github, docs, twitter, linkedin, email, telegram } = entry

  return (
    <div className="flex items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
        title="Website"
        data-umami-event="outbound_click"
        data-umami-event-type="website"
        data-umami-event-project={name}
      >
        <Globe className="size-5" />
      </a>
      {github && (
        <a
          href={`https://github.com/${github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="GitHub"
          data-umami-event="outbound_click"
          data-umami-event-type="github"
          data-umami-event-project={name}
        >
          <GithubLogo className="size-5" />
        </a>
      )}
      {docs && (
        <a
          href={docs}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Documentation"
          data-umami-event="outbound_click"
          data-umami-event-type="docs"
          data-umami-event-project={name}
        >
          <FileText className="size-5" />
        </a>
      )}
      {twitter && (
        <a
          href={`https://x.com/${twitter}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="X/Twitter"
          data-umami-event="outbound_click"
          data-umami-event-type="twitter"
          data-umami-event-project={name}
        >
          <XLogo className="size-5" />
        </a>
      )}
      {showAll && linkedin && (
        <a
          href={`https://linkedin.com/company/${linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="LinkedIn"
          data-umami-event="outbound_click"
          data-umami-event-type="linkedin"
          data-umami-event-project={name}
        >
          <LinkedinLogo className="size-5" />
        </a>
      )}
      {showAll && email && (
        <a
          href={`mailto:${email}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Email"
          data-umami-event="outbound_click"
          data-umami-event-type="email"
          data-umami-event-project={name}
        >
          <EnvelopeSimple className="size-5" />
        </a>
      )}
      {showAll && telegram && (
        <a
          href={`https://t.me/${telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Telegram"
          data-umami-event="outbound_click"
          data-umami-event-type="telegram"
          data-umami-event-project={name}
        >
          <TelegramLogo className="size-5" />
        </a>
      )}
    </div>
  )
}

export function ProjectHoverContent({ entry, category, isDark }: { entry: DirectoryEntry; category: string; isDark: boolean }) {
  return (
    <div className="space-y-3 text-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ThemedLogo slug={entry.slug} name={entry.name} isDark={isDark} className="size-8" />
        <div>
          <p className="font-medium font-[family-name:var(--font-geist-sans)]">{entry.name}</p>
          <p className="text-xs text-muted-foreground">
            {entry.subCategory || category}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="font-[family-name:var(--font-geist-sans)] text-muted-foreground">{entry.description}</p>

      {/* Chains */}
      <div>
        <ChainBadges chains={entry.chains} maxRows={2} />
      </div>

      {/* Links */}
      <div className="pt-1">
        <LinkIcons entry={entry} showAll />
      </div>
    </div>
  )
}
