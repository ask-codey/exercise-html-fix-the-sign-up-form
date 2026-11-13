// Checks your sign-up form: what a browser, a phone and a screen reader rely on to help people finish it.
// Run it with: npm test (run npm install once first). You don't need to change this file.
const nodeTest = require('node:test');

// Runs one check. When it fails, the output starts "Not yet:" and says what to fix, with no stack trace to scroll past.
function test(name, run) {
  return nodeTest(name, async (context) => {
    try {
      await run(context);
    } catch (error) {
      const problem = new Error(error.message);
      problem.stack = `Not yet: ${error.message}`;
      throw problem;
    }
  });
}
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { JSDOM } = require('jsdom');
const { HtmlValidate } = require('html-validate');

const html = readFileSync('signup.html', 'utf8');
const page = new JSDOM(html).window.document;
const all = (selector) => [...page.querySelectorAll(selector)];
const words = (element) => (element?.textContent ?? '').replace(/\s+/g, ' ').trim();

// The fields people fill in: everything in the form except buttons.
const fields = () => all('form input, form select, form textarea')
  .filter((field) => !['submit', 'reset', 'button', 'hidden', 'image'].includes(field.type));

// The first field with this name.
const field = (name) => page.querySelector(`form [name="${name}"]`);

// A field's label: a <label for="its id">, or a <label> wrapped around it.
const labelOf = (control) =>
  (control.id && page.querySelector(`label[for="${control.id}"]`)) || control.closest('label');

// The words that name a field: its label, or for a radio button, its group's <legend> too.
const nameWords = (control) => {
  const legend = control.type === 'radio' ? words(control.closest('fieldset')?.querySelector('legend')) : '';
  return `${legend} ${words(labelOf(control))}`;
};

test('1) every field keeps its name, so received.html can show it', () => {
  for (const name of ['fullName', 'email', 'phone', 'birthDate', 'zip', 'plan', 'password', 'terms']) {
    assert.ok(field(name), `The form has no field named "${name}". Keep each name attribute as it was in the starter.`);
  }
});

test('2) every field has a real label', () => {
  for (const control of fields()) {
    const label = labelOf(control);
    assert.ok(label && words(label),
      `The field named "${control.name}" has no <label>. Give it an id, and a <label for="that id"> with words in it. A placeholder is not a label: it disappears as soon as someone types.`);
  }
});

test('3) every field has the type that fits its answer', () => {
  const expected = { email: 'email', phone: 'tel', birthDate: 'date', password: 'password' };
  for (const [name, type] of Object.entries(expected)) {
    assert.equal(field(name)?.getAttribute('type'), type, `The "${name}" field should be type="${type}".`);
  }
  assert.notEqual(field('zip')?.getAttribute('type'), 'number',
    'A ZIP code is not a number you do math with: keep it type="text" and give it inputmode="numeric".');
});

test('4) the plan is one choice from three, grouped with a question', () => {
  const plan = field('plan');
  if (plan?.tagName === 'SELECT') {
    assert.ok(plan.querySelectorAll('option').length >= 3, "Give the plan's <select> an <option> for Basic, Plus and Premium.");
    return; // a <select> is named by its label, checked in test 2
  }
  const radios = all('form input[type="radio"][name="plan"]');
  assert.equal(radios.length, 3, 'Make the plan three radio buttons, all with name="plan": Basic, Plus and Premium.');
  for (const radio of radios) {
    const legend = radio.closest('fieldset')?.querySelector('legend');
    assert.ok(words(legend), 'Put the plan\'s radio buttons in a <fieldset>, with a <legend> that asks the question.');
  }
});

test('5) autocomplete tells the browser what each field is', () => {
  const expected = {
    fullName: 'name', email: 'email', phone: 'tel', birthDate: 'bday', zip: 'postal-code', password: 'new-password',
  };
  for (const [name, value] of Object.entries(expected)) {
    assert.equal(field(name)?.getAttribute('autocomplete'), value, `Give the "${name}" field autocomplete="${value}".`);
  }
});

test('6) the ZIP code brings up the number keypad on a phone', () => {
  assert.equal(field('zip')?.getAttribute('inputmode'), 'numeric', 'Give the ZIP code inputmode="numeric".');
});

test('7) every rule a person can\'t see has a hint tied to its field', () => {
  for (const control of all('form [pattern], form [minlength]')) {
    const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    assert.ok(ids.length > 0,
      `The "${control.name}" field has a rule (pattern or minlength), so it needs a hint that says what to type, tied to it with aria-describedby="the hint's id".`);
    for (const id of ids) {
      assert.ok(words(page.getElementById(id)),
        `The "${control.name}" field's aria-describedby names "${id}", but no element with that id has any words.`);
    }
  }
});

test('8) required fields say so in words, not color alone', () => {
  assert.ok(!/in red/i.test(words(page.body)),
    'Remove the "Required fields in red" note: a color can\'t be heard by a screen reader, and many people can\'t tell red apart.');
  for (const control of all('form [required]')) {
    assert.match(nameWords(control), /required/i,
      `The "${control.name}" field is required: say so in its label (or its group's legend), such as "(required)".`);
  }
});

test('9) no reset button', () => {
  assert.equal(all('button[type="reset"], input[type="reset"]').length, 0,
    'Remove the reset button: one click by mistake throws away everything someone typed.');
  assert.ok(page.querySelector('form button:not([type]), form button[type="submit"], form input[type="submit"]'),
    'Keep a submit button, so the form can be sent.');
});

test('10) the validator finds no errors', async () => {
  // The recommended rules, plus the ones for a whole page (such as "every field has a label").
  // require-sri is off: it is for files loaded from other sites, and style.css is your own.
  const validator = new HtmlValidate({
    extends: ['html-validate:recommended', 'html-validate:document'],
    rules: { 'require-sri': 'off' },
  });
  const report = await validator.validateString(html, 'signup.html');
  const errors = report.results.flatMap((result) => result.messages)
    .map((message) => `line ${message.line}: ${message.message} (${message.ruleId})`);
  assert.deepEqual(errors, [], `The validator found ${errors.length} problem(s):\n${errors.join('\n')}`);
});
