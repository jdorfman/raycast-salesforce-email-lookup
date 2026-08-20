# Salesforce Email Lookup

A [Raycast](https://raycast.com) extension that takes an email address and jumps straight to it in Salesforce. No tab hunting, no clicking through the global search box.

Paste anything that contains a bare email, a `mailto:` link, or a `Jane Doe <jane.doe@example.com>` style header value and it gets normalized before the search runs.

https://github.com/user-attachments/assets/04709c06-bdb5-45b2-bb9f-fe2f529bafb2

## Install

Requires Raycast and Node 22+.

```sh
git clone https://github.com/jdorfman/raycast-salesforce-email-lookup.git
cd raycast-salesforce-email-lookup
npm install
npm run dev
```

`npm run dev` builds the extension and registers it with Raycast. Once it appears, you can stop the process and the extension stays installed.

On first run Raycast asks for your **Salesforce My Domain**: the prefix in your org's URL, so `acme` for `acme.lightning.force.com`. You can also set **Default Action** to pick which target `Enter` opens first.

## Develop

```sh
npm run dev    # live reload
npm run lint   # ray lint
npm run build  # production build
```

## License

MIT
