import { useState } from "react";
import {
  Action,
  ActionPanel,
  Clipboard,
  Icon,
  Keyboard,
  LaunchProps,
  List,
  getPreferenceValues,
  open,
  showHUD,
} from "@raycast/api";
import { buildUrl, isValidEmail, normalizeEmail, Target } from "./salesforce";

interface Preferences {
  myDomain: string;
  defaultTarget?: Target;
}

interface Entry {
  target: Target;
  title: string;
  subtitle: string;
  icon: Icon;
}

const ENTRIES: Entry[] = [
  {
    target: "lightning",
    title: "Lightning global search",
    subtitle: "Top results across every object",
    icon: Icon.MagnifyingGlass,
  },
  {
    target: "classicContacts",
    title: "Contacts only",
    subtitle: "Classic results, click through lands on the Lightning record",
    icon: Icon.Person,
  },
  {
    target: "classicLeads",
    title: "Leads only",
    subtitle: "Classic results, click through lands on the Lightning record",
    icon: Icon.PersonLines,
  },
  {
    target: "classicAll",
    title: "All objects",
    subtitle: "Classic results, widest net",
    icon: Icon.List,
  },
];

function orderEntries(preferred: Target): Entry[] {
  const first = ENTRIES.filter((entry) => entry.target === preferred);
  const rest = ENTRIES.filter((entry) => entry.target !== preferred);
  return [...first, ...rest];
}

export default function Command(props: LaunchProps<{ arguments: { email?: string } }>) {
  const preferences = getPreferenceValues<Preferences>();
  const myDomain = (preferences.myDomain ?? "").trim().replace(/^https?:\/\//, "");
  const preferred: Target = preferences.defaultTarget ?? "lightning";

  const [searchText, setSearchText] = useState(props.arguments?.email ?? "");
  const email = normalizeEmail(searchText);
  const valid = isValidEmail(searchText);

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Paste an email address"
      filtering={false}
    >
      {!valid ? (
        <List.EmptyView
          icon={Icon.Envelope}
          title={searchText.trim().length === 0 ? "Enter an email address" : "That is not a valid email address"}
          description={`Searching ${myDomain}.lightning.force.com`}
          actions={
            <ActionPanel>
              <Action
                title="Paste from Clipboard"
                icon={Icon.Clipboard}
                onAction={async () => {
                  const text = await Clipboard.readText();
                  if (text) {
                    setSearchText(text.trim());
                  }
                }}
              />
            </ActionPanel>
          }
        />
      ) : (
        orderEntries(preferred).map((entry) => {
          const url = buildUrl(entry.target, myDomain, email);
          return (
            <List.Item
              key={entry.target}
              icon={entry.icon}
              title={entry.title}
              subtitle={entry.subtitle}
              accessories={[{ text: email }]}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action
                      title="Open in Browser"
                      icon={Icon.Globe}
                      onAction={async () => {
                        await open(url);
                        await showHUD(`Searching Salesforce for ${email}`);
                      }}
                    />
                    <Action.CopyToClipboard
                      title="Copy URL"
                      content={url}
                      shortcut={{ modifiers: ["cmd"], key: "return" }}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section>
                    <Action.CopyToClipboard
                      title="Copy as Markdown Link"
                      content={`[${email}](${url})`}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "return" }}
                    />
                    <Action.CopyToClipboard
                      title="Copy Email Address"
                      content={email}
                      shortcut={Keyboard.Shortcut.Common.Copy}
                    />
                    <Action.Paste title="Paste URL" content={url} />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        })
      )}
    </List>
  );
}
