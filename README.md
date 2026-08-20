# Salesforce Email Lookup

A [Raycast](https://raycast.com) extension that takes an email address and jumps straight to it in Salesforce. No tab hunting, no clicking through the global search box.

Paste anything that contains an address — a bare email, a `mailto:` link, or a `Jane Doe <jane.doe@example.com>` style header value — and it gets normalized before the search runs.

Four search targets, ordered so your preferred one is always first:

- **Lightning global search** — top results across every object
- **Contacts only** — Classic results; clicking through lands on the Lightning record
- **Leads only** — same, scoped to leads
- **All objects** — Classic results, widest net

Actions on any result: `Enter` opens it in your browser, `Cmd+Enter` copies the URL, `Cmd+Shift+Enter` copies it as a Markdown link.

## Install

Requires Raycast and Node 22+.

```sh
git clone https://github.com/jdorfman/raycast-salesforce-email-lookup.git
cd raycast-salesforce-email-lookup
npm install
npm run dev
```

`npm run dev` builds the extension and registers it with Raycast. Once it appears, you can stop the process — the extension stays installed.

On first run Raycast asks for your **Salesforce My Domain**: the prefix in your org's URL, so `acme` for `acme.lightning.force.com`. You can also set **Default Action** to pick which target `Enter` opens first.

## Develop

```sh
npm run dev    # live reload
npm run lint   # ray lint
npm run build  # production build
```

## License

MIT
