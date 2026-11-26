# Cursed Seas — Agent Guide

## Campaign and canon

- Cursed Seas is a D&D 5th Edition (2014) campaign set in Norberia. Write all wiki content in English.
- The Dungeon Master (DM) is the final authority on campaign canon. Use the repository as the reference for published lore and the DM's campaign notes for unpublished lore.
- Use confirmed facts in wiki pages. Label creative suggestions as proposals and ask the DM when a missing or conflicting detail affects canon, character relationships, or what players may know.
- Modify repository files only when explicitly requested. Campaign brainstorming, adventure preparation, and creative suggestions do not authorize wiki edits.
- Keep campaign preparation and DM-only information in private notes. Keep secrets and unrevealed material out of wiki pages, source comments, assets, and pull requests. The site's `noIndex` setting does not restrict access.

## Wiki structure and editorial conventions

- When updating a page, preserve its structure, formatting, writing style, and established lore. Preserve existing information unless the DM explicitly requests its removal or correction.
- Place new Markdown or MDX pages in the relevant section of `docs/`. Use `docs/players/` for player characters and their related pages, `docs/regions/` or the relevant location section for places, and existing sections such as `docs/factions/`, `docs/other-npcs/`, `docs/homebrew-rules/`, and `docs/important-items/` for their respective topics. Preserve the distinction between `docs/player-s-diary/` and `docs/travel-s-diary/`.
- `sidebars.js` generates the sidebar from `docs/`. Follow neighboring files for names, front matter, sidebar positions, and `_category_.json` metadata. Preserve existing slugs and routes. If a route must change, update its inbound links.
- Use `docs/players/jori/jori.md` as the reference for player character layouts and portraits. Follow its `npc-header`, `npc-header-image`, and `npc-header-content` structure, with descriptive portrait alt text and a two-column character summary table. Follow the existing convention of loading portraits from the adjacent `<character>-assets/` directory with a relative `require(...)`.
- Follow the existing relationship table format and use the exact heading `## Related NPC's`. Link names to their existing wiki pages where available and use confirmed descriptions of their relationships.

## Development and verification

- Keep changes compatible with Docusaurus 3.10.2 and the existing classic preset. Use Node.js 20 for parity with GitHub Actions. Avoid unnecessary dependencies.
- Keep changes scoped to the explicit request. Refactor unrelated code, reorganize directories, update dependencies, or change shared styles only when explicitly requested.
- Reuse the components in `src/components/` for the interactive map, initiative tracker, travel diary, cookie consent, and clickable portraits. Use `src/css/custom.css` for authorized shared style changes and follow the existing CSS module patterns for component-specific styles. Preserve the portrait classes used by `ClickableNpcImages`.
- Verify internal links against the target page's actual route and check image paths and filenames with exact casing. Docs are served at the site root under the GitHub Pages base path `/cursed-seas/`. Use Docusaurus `Link` for internal JSX navigation and `useBaseUrl` for public asset URLs where appropriate.
- Run `npm ci` when dependencies need to be installed, then run `npm run build` when the environment permits. Fix broken links or build errors introduced by the change. If the local build is unavailable, perform the available static checks and report the blocker and which verification steps could not be completed. Report a build or test as passing only after it has run successfully.

## GitHub workflow

- Make changes on a descriptively named branch based on `main`. Respect branch protection and avoid working, committing, or pushing directly on `main`.
- Use a pull request targeting `main`. Summarize the changes, affected files, and verification results in the pull request.
- Obtain the owner's explicit authorization before merging or publishing changes. `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on pushes to `main` and can also be run manually. Treat merging to `main` or manually triggering that workflow as a publishing action.
