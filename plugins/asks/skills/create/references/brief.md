# The kind of work, what a completion must include, and its checks

Open this when the task mentions a photo, a file, a website, an app or a link, or when you write the
checks for an ask.

## Choose what a completion must include

No word in the task chooses anything. "Photo", "screenshot", "PDF", a link, a question mark or a
phrase in quotes add nothing by themselves: you choose, in the tool's own fields, from what the person
wants back. With nothing chosen, an ask is answered in words and checked only for handing over actual
work.

| They want back … | Choose |
| --- | --- |
| a written answer | nothing more |
| a photo taken now | the photo choice (`post_ask`: `proof` `photo`; an ask at a place: `needs` `photo`) |
| a file (a document, a recording, screenshots) | the file choice (`post_ask`: `proof` `file`) |
| it done at a place | the place (`near`, as coordinates) |
| a full review report | the report choice (`report`) |
| a check that one web address is up | the website check (below) |

Say what you chose when you read the preview: "They send a photo, taken within 400 m of <place>."

## Pick the kind yourself, from what they want done

Never let words in the task decide the kind. "Test", "check", "works" and a link do not make a website
check.

- **A review:** someone uses an app or a site and says what they found (was it clear, what confused
  them, what broke). This is most asks that link an app. It gets **no** website check.
- **A website check:** the whole job is "is this one address up?". Only then pass the website-check
  field (`post_ask`: `site_check`; an ask at a place: `needs` `url-check` with `url`).

Not sure which → ask one plain question: "Do you want someone to try it and tell you what they found,
or only to check the address loads?"

## One exact address

A website check takes exactly one address, starting with `https://`, in its own field. The automatic
re-check reads that address and no other. The task names two (say a live site and a test site) →
**Say:** "Which one should be checked: <first> or <second>?" Two checks wanted → two asks.

## Checks say what evidence they need

A check tells the person doing the work what to put in the completion. Write the evidence, not a
summary of it.

- Good: "Include the observed HTTP status code, or describe the connection failure if the request did
  not return a response."
- Bad: "Reports what the site answered."

Keep what a machine checks (a status code, a length, a location) apart from what a person reviews
(was it clear, is it on topic). Never write a machine check for something only a person can judge.

## Questions about a screen

When the work is looking at an app's screens, ask for three things apart, so seeing and interpreting
never mix:

1. **What was visible:** what they saw on the screen, as it was.
2. **What it suggested:** what they took it to mean.
3. **What the interface explained:** what the app itself said about it (a label, a tooltip, help text).

Always allow "not seen". A name you expect on the screen (say "Control Room") is something to
compare: ask "What does the main room's label read?", then compare it with the name. Don't ask "Does
it read Control Room?".

## Before the yes

The preview lists every check the ask will carry, in the words the ask page and the completion form
will show. Read that list to the person with the total. A check they did not ask for, or one that
does not fit the work → change the ask and preview again. Never post it as it is.
