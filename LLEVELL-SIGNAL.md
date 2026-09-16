# LLeveLL Signal

The site now includes a custom chatbot experience called **LLeveLL Signal**.

## What works immediately

Signal includes a built-in site-aware guide, so the UI works without any API key. It can answer common questions about:

- LLeveLL services
- selected projects
- the team / About section
- AI approach
- Apps
- starting a project

It can also navigate directly to relevant sections, open the Apps experience, and open the Start Something project brief.

## Connect a real AI model later

Set this Vite environment variable:

```env
VITE_LLEVELL_CHAT_ENDPOINT=/api/chat
```

Signal sends:

```json
{
  "message": "user question",
  "history": [{ "role": "assistant", "content": "..." }],
  "context": { "name": "LLeveLL", "positioning": "...", "sections": [] }
}
```

Minimum response:

```json
{ "reply": "Your answer here" }
```

Optional UI action response:

```json
{
  "reply": "Take a look at the work.",
  "actions": [
    { "label": "View projects", "type": "navigate", "target": "team" }
  ]
}
```

Supported action types in the current UI: `navigate`, `apps`, `contact`.
