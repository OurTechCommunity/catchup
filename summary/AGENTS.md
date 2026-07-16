# AGENTS.md

Guidance for AI agents creating or updating OTC CatchUp session summaries in this `summary/` folder.

## Scope And Safety

These instructions apply to every file under `summary/`.

For summary-writing tasks, work only on `content.adoc` files and this guide when explicitly asked. Do not create, edit, rewrite, format, rename, or otherwise touch any `attendees.adoc` file unless the user explicitly asks for attendee-file work.

When using existing summaries as examples, read `content.adoc` files only. Ignore `attendees.adoc` even if it is open in the editor.

## What These Summaries Are

Each `content.adoc` file is a concise AsciiDoc record of one OTC CatchUp session. The summary preserves what was discussed, who brought it up, what projects were shown, and which links/resources are useful later.

The writing style is:

- factual and compact
- short, crisp, and easy to understand
- written in simple English with common words
- speaker-led when the speaker is known
- community-meeting oriented, not corporate
- lightly conversational, but not chatty
- technical when the discussion was technical
- link-rich when links were shared
- written for someone who missed the session and wants the useful context

Do not turn a summary into an article, narrative, transcript, minutes with timestamps, or polished marketing recap.

Keep the output focused on technical conversations. Skip non-technical personal chat, life updates, travel talk, jokes, casual banter, and unrelated social discussion unless it directly affects a technical project, community program, event, or career/engineering decision.

## Canonical File Shape

Use AsciiDoc and start with this shape:

```adoc
Date: DD-MM-YYYY

Duration: N hr(s) N min(s)

==== Topics Discussed

* ...
```

Keep blank lines exactly like the examples:

- one blank line after `Date`
- one blank line after `Duration`
- one blank line after every `====` heading
- usually no introductory paragraph before the first bullet

Use the date format already used in the folder:

```adoc
Date: 20-11-2021
Date: 02-05-2026
```

Use duration wording in the existing style:

```adoc
Duration: 5 hr
Duration: 6 hr 50 min
Duration: 4 hrs 00 mins
Duration: 2 hr 15 mins
Duration: 1 hr 36 mins
```

Do not invent a duration. If the transcript does not provide one, ask or leave it for the user instead of guessing.

## Section Headings

Use level-four AsciiDoc headings:

```adoc
==== Topics Discussed
==== Projects Showcased
==== Projects Discussed
==== Show and Tell
==== Additional Resources
```

For new summaries, prefer:

1. `==== Topics Discussed`
2. `==== Projects Showcased` when there are demos or project walkthroughs
3. `==== Additional Resources` when there are standalone links with little discussion
4. `==== Show and Tell` only when the session clearly used that format

Historical files contain variants such as `Project Showcased`, `Resources shared`, `Past 3AM talks`, `Debates`, `Communities`, `OTC's Web Site!`, and `Moving from Zulip to Telegram`. Preserve these when editing old summaries, but do not introduce unusual headings in new summaries unless the source material clearly needs them.

## Bullet Syntax

Use unordered AsciiDoc bullets.

```adoc
* Main discussion point.
    ** Detail, explanation, resource, opinion, or follow-up.
        *** Deeper resource, sub-detail, or item in a list.
            **** Rare deeper detail.
```

The existing files use both spaces and tabs for indentation. For new summaries, use spaces consistently:

- `*` for main discussion threads
- `    **` for supporting details
- `        ***` for lists/resources inside a detail
- `            ****` only when the source truly has a fourth level

Do not over-nest. Most summaries need only `*` and `**`.

## How To Choose Top-Level Bullets

Use one top-level bullet per meaningful discussion thread, not one bullet per chat message.

Good top-level bullets:

```adoc
* link:https://twitter.com/harshgkapadia[Harsh Kapadia^] shared videos about Google Gemini AI.
* We talked about why we should learn networking.
* A discussion took place on large vs small pull requests, covering trade-offs between single large PRs and multiple smaller PRs.
* Nirmal asked Jaden about firewalls.
* Harsh Kapadia shared his recent work.
```

Use nested bullets for:

- explanations
- links/resources attached to the topic
- responses from other people
- lists of technologies, books, talks, courses, or tools
- project features and implementation details
- pros/cons or trade-offs

When a topic is only a list of links someone shared, make the top-level bullet the speaker/action and nest the links:

```adoc
* Harsh Kapadia shared
    ** link:https://www.youtube.com/watch?v=example[Video title^]
    ** link:https://github.com/example/project[Project repository^]
```

When the topic itself is a concept, title the bullet with the concept and explain inside:

```adoc
* Cache coherency and the MESI Protocol
    ** Anil Harwani explained what cache hierarchy, cache coherency and the MESI Protocol are and how they fit together.
    ** link:https://en.wikipedia.org/wiki/MESI_protocol[MESI Protocol^]
```

## Voice And Tone

The voice is plain meeting-summary prose. It should sound like a human community maintainer taking useful notes.

Write short sentences. Prefer easy words over complex words. If a sentence becomes long, split it or move details into nested bullets.

Prefer wording like:

- `talked about`
- `shared`
- `asked`
- `explained`
- `discussed`
- `showcased`
- `demonstrated`
- `suggested`
- `recommended`
- `pointed out`
- `clarified`
- `mentioned`
- `gave an update on`
- `walked through`
- `asked for help with`
- `asked for suggestions on`
- `the group discussed`
- `we talked about`

Examples in the target style:

```adoc
* link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^] asked what it means to run an application or a server "as a service" and how to restart a link:https://nodejs.org[Node.js^] server which is running as a process.
    ** link:https://pm2.keymetrics.io[PM2 - A process manager for Node.js^] is a daemon process manager that helps manage and keep applications online.
    ** Command to restart a service: `pm2 restart <application name>`
```

```adoc
* Nabeel discussed his workflow with AI-assisted development and how he leverages AI tools for coding while still considering himself an engineer.
    ** He emphasized that strong fundamentals (logic, system design, and language understanding) are essential when using AI, and that this should not be confused with "vibe coding."
```

Avoid:

- generic AI openings like `The meeting covered a wide range of topics`
- corporate phrases like `leveraged`, `robust ecosystem`, `deep dive`, `cutting-edge`, `synergies`
- difficult words when a simple word works
- long paragraphs or long multi-clause bullets
- em dashes
- hype unless the source itself is hype or the existing community tone calls for it
- moralizing or adding your own opinion
- summary conclusions not present in the transcript
- transcript-like play-by-play
- rewriting casual community notes as formal board minutes

## Level Of Detail

The summaries are compact, but they do not remove useful technical context. Preserve the idea, the reason it mattered, and the useful references.

Include:

- the speaker, when known
- the topic, tool, technology, project, article, talk, book, or course
- short explanations of technical terms when the session explained them
- resource links that were shared
- trade-offs and conclusions when the group reached them
- notable warnings, gotchas, or caveats
- project features, stack, links, and feedback
- meaningful disagreements, if they shaped the discussion

Omit:

- non-technical conversation unless it is needed to understand a technical, community, event, or career point
- filler banter
- repeated acknowledgements
- greetings beyond `General introductions.` when appropriate
- every small conversational turn
- uncertain guesses
- private/sensitive details not meant for a public summary
- attendee metadata
- timestamps

When source material repeats itself, merge repeated turns into one clear bullet.

## Handling Casual Language

Early summaries sometimes include casual community tone like `lol`, `really nice project`, `crazy amazing`, emojis, or brief celebratory notes. Preserve this only when editing an old file that already uses it or when the moment is clearly celebratory.

For new summaries, be warmer than corporate notes but more controlled than chat:

```adoc
* Rishit Dagli shared his research paper link:https://arxiv.org/abs/2304.05350[Astroformer: More Data Might Not be All You Need for Classification^] that got published.
```

Do not add emojis unless they are already in the source or the existing session summary style clearly uses them for that moment.

## Speaker Names

Use the best known human name from the source. Full names are preferred when available.

Modern summaries often use plain names:

```adoc
* Harsh Kapadia shared ...
* Nirmal asked ...
* Jia showcased ...
```

When a speaker profile link is known or already present nearby, use the AsciiDoc external link style:

```adoc
link:https://twitter.com/harshgkapadia[Harsh Kapadia^]
link:https://linkedin.com/in/krishna-gadia[Krishna Gadia^]
```

Older summaries use Zulip-style mentions such as `@*Harsh Kapadia*`. Do not introduce that style in new summaries. Do not rewrite old mentions just to modernize them unless the user asks for cleanup.

If the speaker is unclear, use group phrasing:

```adoc
* We talked about ...
* The group discussed ...
* A discussion took place on ...
* Several people shared opinions on ...
```

Do not invent speaker names.

## Links

Prefer AsciiDoc link syntax:

```adoc
link:https://example.com[Readable label^]
```

Use the trailing `^` in link labels for new external links:

```adoc
link:https://missing.csail.mit.edu[The Missing Semester of Your CS Education^]
link:https://github.com/HarshKapadia2/dotfiles[His dotfiles^]
```

Use readable labels, not raw URLs, unless the URL itself is the meaningful label.

Remove trailing slashes from links when the slash is not needed. For example, use `https://www.hackthebox.com`, not `https://www.hackthebox.com/`. Keep a trailing slash only if removing it would change the URL or break a path/query.

Good:

```adoc
* link:https://github.com/Jia2005/Algorific[Algorific^]
* link:https://www.youtube.com/watch?v=g2hiVp6oPZc[Writing a Text Editor - Computerphile^]
```

Acceptable when the raw domain is the product:

```adoc
* link:https://metatags.io[Meta Tags Toolkit^]
* link:https://cpu.land[Putting the "You" in CPU^]
```

Place links where they belong:

- inline when the link is part of a sentence
- nested under the topic when it supports that topic
- under `==== Additional Resources` when it was shared without much discussion

Do not duplicate the same link in both the topic and `Additional Resources`.

If a platform, tool, project, article, course, or resource is mentioned in a summary point and its link is available, put the link in that summary point instead of leaving it in `Additional Resources`.

Good:

```adoc
* We talked about practicing cybersecurity on link:https://www.hackthebox.com[Hack The Box^].
```

Avoid:

```adoc
* We talked about practicing cybersecurity on Hack The Box.

==== Additional Resources

* link:https://www.hackthebox.com[Hack The Box^]
```

Do not write a person's name just because they shared a link. If the point is only a resource, list the resource. If the person explained or discussed the topic, mention the person for that discussion and attach the link to the topic.

## Technical Terms And Code

Preserve exact technical names, capitalization, command names, filenames, protocols, products, and acronyms.

Use backticks for:

- commands: `pm2 restart <application name>`
- config keys: `PS1`
- symbols: `bind()`
- filenames: `manifest.json`
- shell literals: `!`, `?`, `+n`
- code snippets: `while(1)`, `sleep()`

Use AsciiDoc escaping where needed:

```adoc
C{pp}
I^2^C
```

Expand acronyms when the source or context clearly gives the expansion:

```adoc
Artificial General Intelligence (AGI)
Large Language Models (LLMs)
Cyclic Redundancy Check (CRC)
OffSec Web Expert (OSWE)
```

Do not invent expansions.

If a transcript contains a wrong spelling or typo and the intended technical term is obvious, fix it in the summary. If unsure, preserve the source wording or avoid the term.

## Projects Sections

Use `==== Projects Showcased` for demos, project walkthroughs, portfolio reviews, app updates, hackathon projects, research implementations, hardware demos, and tools people built.

Typical shape:

```adoc
==== Projects Showcased

* Name showcased _Project Name_, a short description of what it does.
    ** It was built using link:https://example.com[Technology^], Python and SQLite.
    ** link:https://github.com/example/project[GitHub repository^]
    ** link:https://example.com[Web app^]
```

Use italics with underscores for project names when the existing style does so:

```adoc
_Heartry_
_Git Graph_
_Weebo_
```

If only one project is briefly mentioned and there is no real showcase, keep it under `==== Topics Discussed`.

Use `==== Projects Discussed` only when the session is more about ideas, feedback, or ongoing projects than live demos.

Use `==== Show and Tell` when the session explicitly has that flavor or a file already uses it.

## Additional Resources

Use `==== Additional Resources` for newer summaries where links were shared without detailed discussion.

Keep the section simple:

```adoc
==== Additional Resources

* link:https://www.youtube.com/playlist?list=example[Course or playlist title^]
* link:https://github.com/example/project[Project GitHub repo^]
```

Do not add commentary to every link unless the source provided context. Resource-only sections should remain skimmable.

If a resource clearly belongs to a parent topic, keep it nested under that topic instead of moving it to `Additional Resources`.

Do not include the name of the person who shared a link in `Additional Resources`. The section should contain resources, not attribution.

## Grouping And Ordering

Preserve the rough flow of the session, but prioritize clarity. It is fine to group related chat turns together when the transcript jumps around.

Use these grouping patterns:

- one topic with multiple related resources
- one speaker sharing several links
- one concept explained with nested details
- one project with its stack and links
- one broad discussion with several sub-opinions

Do not split one coherent topic into five separate bullets just because five messages were sent.

Do not combine unrelated topics just because the same person mentioned them.

## Common Summary Patterns

Question and answer:

```adoc
* Dheeraj Lalwani asked what it means to run an application or a server "as a service".
    ** Jaden Furtado replied that it is used to make servers run as background processes and keep applications online.
```

Shared resources:

```adoc
* Harsh Kapadia shared
    ** link:https://missing.csail.mit.edu[The Missing Semester of Your CS Education^]
    ** link:https://github.com/HarshKapadia2/dotfiles[His dotfiles^]
```

Concept discussion:

```adoc
* We talked about link:https://en.wikipedia.org/wiki/Transmission_Control_Protocol[TCP^] and link:https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp[UDP^].
    ** We talked about checksums, CRCs, parity checks and how hashing provides integrity checks.
```

Project showcase:

```adoc
* Jia showcased _Algorific_, a tool for visualizing Data Structures and Algorithms.
    ** link:https://github.com/Jia2005/Algorific[Algorific^]
```

Trade-off discussion:

```adoc
* A discussion took place on large vs small pull requests, covering trade-offs between single large PRs and multiple smaller PRs, along with different team practices.
```

## Creating A New Summary From Transcript Or Chat History

Follow this workflow:

1. Read the source transcript/chat history fully enough to understand the session.
2. Identify date and duration.
3. Extract the main discussion threads.
4. Attribute speakers where known.
5. Merge repeated messages into concise bullets.
6. Keep useful technical explanations as nested bullets.
7. Attach links to the topic they belong to.
8. Move demos/builds to `==== Projects Showcased` when appropriate.
9. Move standalone links to `==== Additional Resources` when appropriate.
10. Remove non-technical conversation.
11. Check AsciiDoc syntax, link labels, code formatting, project names, acronyms, names, and trailing slashes in links.
12. Re-read for skimmability and remove filler.

The finished summary should feel like it belongs beside the existing `content.adoc` files: concise, direct, technically useful, and faithful to the session.

## Hard Rules

- Do not touch `attendees.adoc` files.
- Do not invent facts, names, links, dates, durations, or conclusions.
- Do not include attendee lists in `content.adoc`.
- Do not expose private details unless clearly intended for the public summary.
- Do not use Markdown link syntax in new summaries; use AsciiDoc link syntax.
- Do not add a generic overview paragraph.
- Do not over-polish the community voice into corporate prose.
- Do not leave raw transcript fragments when they can be summarized clearly.
- Do not include non-technical conversation.
- Do not use em dashes.
- Do not write the name of the person who shared a link when the point is only that a link was shared.
- Do not keep unnecessary trailing slashes in links.
