[![CircleCI](https://badgen.net/circleci/github/Citykleta/ui-kit)](https://circleci.com/gh/Citykleta/ui-kit)

# Citykleta UI-Kit

Common widgets built with native **web components** (no extra lib or framework) and with **accessibility** in mind. Based on the 
[wai-aria authoring recommendations](https://www.w3.org/TR/wai-aria-practices/#combobox)

## Usage

### Installation

``npm install --save @citykleta/ui-kit``

### Getting Started

You'll need first to register the component with namespace of your choice. Then simply add the tags in your markup 

```html
<ui-listbox>
    <ui-listbox-option selected>option 1</ui-listbox-option>
    <ui-listbox-option>option 2</ui-listbox-option>
    <ui-listbox-option>option 3</ui-listbox-option>
    <ui-listbox-option>option 4</ui-listbox-option>
</ui-listbox>

<script type="module" async>
import {ListBox, ListBoxOption} from 'path/to/lib';
customElements.define('ui-listbox',ListBox);
customElements.define('ui-listbox-option',ListBoxOption);
</script>
```

### With framework X

All these web components can be configured and updated with attributes which make it very easy to integrate with any vue engine (such [React]() for example)

```javascript

```
