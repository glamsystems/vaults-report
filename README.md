# Vaults Report

Open, community-curated effort to map the protocols, managers, and tooling powering vault infrastructure and onchain asset management.

**https://vaults.report**

## Tech Stack

- [Astro](https://astro.build) - Static site framework
- [React](https://react.dev) - UI components
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Nivo](https://nivo.rocks) - Data visualization
- [shadcn/ui](https://ui.shadcn.com) - Component library

## Project Structure

```
src/
├── pages/          # Astro pages (routes)
├── components/     # React & Astro components
├── content/learn/  # MDX educational content
├── layouts/        # Page layouts
├── lib/            # Utilities
└── styles/         # Global CSS
data/
├── directory.csv   # Protocol directory
├── resources.csv   # External resources
├── categories.yaml # Category definitions
└── chains.yaml     # Blockchain definitions
public/             # Static assets
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Contributing

To add or update a protocol:

1. Edit `data/directory.csv`
2. Follow the schema in `data/schema.yaml`
3. Submit a pull request

## License

- Code: [MIT](LICENSE)
- Data & Content: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Links

- Website: https://vaults.report
- Twitter: https://x.com/vaultsreport
- Publisher: [GLAM](https://glam.systems)
