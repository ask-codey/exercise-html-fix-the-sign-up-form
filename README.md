# Exercise: Fix the Frustrating Sign-Up Form

Exercise code for the lesson **Exercise: Fix the Frustrating Sign-Up Form** in the HTML in Depth course on [ask-codey.com](https://www.ask-codey.com).

Peak Fitness, a made-up gym, has a membership sign-up form that people give up on. It's frustrating on purpose: placeholders instead of labels, every field a plain text box, nothing the browser can fill in, a rule with no hint, a note that only works if you can see red, and a reset button right beside the submit button. You'll fix `signup.html` so people can finish it, and tests check every fix.

## What's here

- `signup.html`: the sign-up form. The comment at the top lists what to fix. For you to finish.
- `received.html`: shows, as a table, what the form sent. Its small script reads the answers from the page's address; you don't need to read it. Ready to use.
- `style.css`: the gym's ready-made stylesheet. It styles plain HTML, so the form looks good as soon as its HTML is right. A hint is a paragraph whose `id` ends in `-hint`, such as `<p id="zip-hint">`. Ready to use.
- `signup.test.js` and `package.json`: the checks. You don't need to change these.

## Before you start

You need Node.js (the course's setup lesson installs it) and VS Code with the Live Server extension.

Open this folder in VS Code, open a terminal there (**Terminal > New Terminal**), and type this once. It downloads the two small tools the checks use, into a `node_modules` folder:

```bash
npm install
```

## Run it

Right-click `signup.html` and choose **Open with Live Server**. Fill in the form and press the button: `received.html` shows what the form sent.

## Check your work

```bash
npm test
```

At first almost every check fails: that is expected. Each fix you make turns its check green. A failing check's message says which field it looked at and what it expected, for example *The "email" field should be type="email".*

## What to do

1. **Give every field a real label.** Give each field an `id`, and a `<label for="that id">` with words in it. Keep each `name` exactly as it is: `received.html` shows the answers by those names.
2. **Give every field the type that fits.** Email, phone, birth date and password each have their own type. The membership plan is one choice from three: Basic ($25 a month), Plus ($40) and Premium ($60). A ZIP code stays `type="text"`.
3. **Let the browser and the phone help.** Add `autocomplete` to the name, email, phone, birth date, ZIP code and password, and `inputmode="numeric"` to the ZIP code.
4. **Explain the rules people can't see.** The ZIP code has a `pattern` and the password a `minlength`. Give each a hint that says what to type, tied to its field with `aria-describedby`.
5. **Say "required" in words.** Remove the "Required fields in red" note, and add "(required)" to the label of every required field (for the plan, to its question).
6. **Remove the reset button,** and give the submit button words that say what happens.
7. **Try it the way people use it.**
   - With the keyboard only: **Tab** to each field, type, and press **Enter** to send. Can you reach and answer everything?
   - On a phone-sized screen: in the developer tools (**F12**), turn on the device toolbar (**Ctrl+Shift+M**, or **Cmd+Shift+M** on a Mac) and pick a phone. Is it one column, and is every label next to its field?

## The rules

- Keep every `name` attribute as it was in the starter.
- Use HTML only: the checks read your HTML, and `style.css` doesn't need to change.
- Use made-up answers when you try the form, never a real password: `received.html` puts every answer in the page's address.
- This exercise's form uses `method="get"` only so `received.html` can read the answers from the address. A real sign-up form sends by POST, as in *How a Form Sends Data*.

## Tips

- A placeholder disappears as soon as someone types, so it can't be the only label.
- Radio buttons that answer one question share one `name`, and sit in a `<fieldset>` with a `<legend>` that asks the question.
- A hint needs an `id`. The field's `aria-describedby` names that `id`, so a screen reader reads the hint after the label.
- `autocomplete="new-password"` tells a password manager this is a new password, so it can offer to make one.
- The validator's messages name the line: start with the first one.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Work on GitHub* walks through every screen.
