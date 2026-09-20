# Chat backend — setup

## 1. Create the rate-limit namespace

```bash
npx wrangler kv namespace create CHAT_KV
```

Paste the returned `id` into `wrangler.jsonc`.

## 2. Store the API key

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Never put the key in the repo, in `wrangler.jsonc`, or in a GitHub secret used
by the deploy action — `wrangler secret` stores it encrypted on the Worker and
it survives deploys.

## 3. Deploy

```bash
npx wrangler deploy
```

## How it behaves

| Situation | What happens |
|---|---|
| Crisis language in the message | Fixed human-written reply with 911 / 988 / SAMHSA. **The model is never called.** |
| More than 12 messages in 60s from one IP | Polite throttle message |
| `ANTHROPIC_API_KEY` not set | Returns `reply: null`; the client falls back to its built-in keyword answers |
| Anthropic returns an error | Returns `reply: null`; same fallback |
| Model output trips a guardrail | Replaced with "call Jeff at 228-669-4346" |
| Anything thrown | Phone number, never a stack trace |

The site keeps working with the backend switched off. That is deliberate:
`jh-chatbot.js` still holds the full keyword answer set, so an outage degrades
the bot rather than breaking it.

## What is not stored

Nothing. No message content, no transcripts, no identifiers. The KV namespace
holds only a per-IP counter that expires after two minutes. If you later want
transcripts for improving answers, that is a deliberate decision requiring a
privacy notice — people disclose serious things to a box on a recovery
website.

## Cost

Claude Haiku at roughly 1,200 input and 150 output tokens per exchange is on
the order of a tenth of a cent per conversation. A thousand conversations a
month lands near a dollar.

## Editing the answers

`src/chat.js` → the `FACTS` block. It is the only thing the model may state.
The "NOT YET PUBLISHED" list at the bottom is what it must refuse to guess at —
move an item out of that list once Jeff supplies the real answer.

