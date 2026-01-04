type ItemTileProps = {
  slug: string
  name: string
}

export function ItemTile({ slug, name }: ItemTileProps) {
  // Get first word only
  const shortName = name.split(' ')[0]

  return (
    <div
      className="w-16 h-16 flex flex-col items-center justify-center gap-0.5 p-1 rounded border border-border"
      title={name}
    >
      <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
        <img
          src={`/assets/logos/normalized/${slug}-light.svg`}
          alt={name}
          className="w-full h-full object-contain dark:hidden"
        />
        <img
          src={`/assets/logos/normalized/${slug}-dark.svg`}
          alt={name}
          className="w-full h-full object-contain hidden dark:block"
        />
      </div>
      <span className="text-[8px] text-muted-foreground w-full text-center leading-tight truncate">
        {shortName}
      </span>
    </div>
  )
}
