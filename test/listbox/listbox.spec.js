import {test} from 'zora';
import {body, LIST_BOX_OPTION_TAG_NAME, LIST_BOX_TAG_NAME} from './util.js';
import {nextTick} from '../util.js';

/**
 * @test {ListBox}
 */
test('ListBox component', ({test}) => {

    test('Empty ListBox is connected', t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        body.appendChild(el);

        t.eq(el.getAttribute('role'), 'listbox', 'should have set the role');
        t.eq(el.getAttribute('tabindex'), '0', 'should have added the element in tab sequence');
        t.eq(el.selectedIndex, -1, 'no element should be selected');
        t.eq(el.selectedOption, null, 'no element should be selected');
        t.eq(el.length, 0, 'length should be 0 as there is no option');
    });

    test('ListBox with some options but no default value is connected', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME}>option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME}>option 2</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME}>option 3</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME}>option 4</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        t.eq(el.getAttribute('role'), 'listbox', 'should have set the role');
        t.eq(el.getAttribute('tabindex'), '0', 'should have added the element in tab sequence');
        t.eq(el.selectedIndex, -1);
        t.eq(el.selectedOption, null);
        t.eq(el.length, 4, 'should have four options');

        const [opt1, opt2, opt3, opt4] = el.querySelectorAll('[role=option]');

        t.ok(opt1.id.startsWith('listbox-option'), 'should have assigned a generated id');
        t.ok(opt2.id.startsWith('listbox-option'), 'should have assigned a generated id');
        t.ok(opt3.id.startsWith('listbox-option'), 'should have assigned a generated id');
        t.ok(opt4.id.startsWith('listbox-option'), 'should have assigned a generated id');

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'false');
        t.eq(opt3.getAttribute('aria-selected'), 'false');
        t.eq(opt4.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), '');
    });

    test('ListBox with some options and default value is connected', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME}>option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} selected>option 3</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME}>option 4</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        t.eq(el.getAttribute('role'), 'listbox', 'should have set the role');
        t.eq(el.getAttribute('tabindex'), '0', 'should have added the element in tab sequence');
        t.eq(el.selectedIndex, 2, 'should select the option with the "selected" attribute');
        t.eq(el.selectedOption, el.children[2], 'should return the 3rd option element');
        t.eq(el.length, 4, 'should have four options');

        const [opt1, opt2, opt3, opt4] = el.querySelectorAll('[role=option]');

        t.ok(opt1.id.startsWith('listbox-option'), 'should have assigned a generated id');
        t.eq(opt2.id, 'custom-id', 'should use the provided id');
        t.ok(opt3.id.startsWith('listbox-option'), 'should have assigned a generated id');
        t.ok(opt4.id.startsWith('listbox-option'), 'should have assigned a generated id');

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'false');
        t.eq(opt3.getAttribute('aria-selected'), 'true');
        t.eq(opt4.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), opt3.id, 'should have updated the aria-activedescendant with the selected option id');
    });

    /** @test {ListBox#selectedIndex} */
    test('updating the selected index property should update the component', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        t.eq(el.selectedIndex, -1);
        t.eq(el.selectedOption, null);
        t.eq(el.length, 2, 'should have two options');

        const [opt1, opt2] = el.querySelectorAll('[role=option]');

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), '');

        el.selectedIndex = 1;

        t.eq(el.selectedIndex, 1);
        t.eq(el.selectedOption, opt2);

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'true');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-2');

        el.selectedIndex = 666;

        t.eq(el.selectedIndex, -1, 'should have unselected all');
        t.eq(el.selectedOption, null, 'should have unselected all');

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'false', 'should have unselected all');

        t.eq(el.getAttribute('aria-activedescendant'), '', 'should have unselected all');
    });

    test('click an option should select it', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        t.eq(el.selectedIndex, -1);
        t.eq(el.selectedOption, null);
        t.eq(el.length, 2, 'should have two options');

        const [opt1, opt2] = el.querySelectorAll('[role=option]');

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), '');

        opt1.click();

        t.eq(el.selectedIndex, 0);
        t.eq(el.selectedOption, opt1);

        t.eq(opt1.getAttribute('aria-selected'), 'true');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-1');
    });

    test('arrow key down should select the next option', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        t.eq(el.selectedIndex, -1);
        t.eq(el.selectedOption, null);
        t.eq(el.length, 2, 'should have two options');

        const [opt1, opt2] = el.querySelectorAll('[role=option]');

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), '');

        el.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown'
        }));

        t.eq(el.selectedIndex, 0);
        t.eq(el.selectedOption, opt1);

        t.eq(opt1.getAttribute('aria-selected'), 'true');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-1');
    });

    test('arrow key down should keep the last option in case it is already selected', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} selected id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        const [opt1, opt2] = el.querySelectorAll('[role=option]');

        t.eq(el.selectedIndex, 1);
        t.eq(el.selectedOption, opt2);

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'true');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-2');

        el.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown'
        }));

        t.eq(el.selectedIndex, 1);
        t.eq(el.selectedOption, opt2);

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'true');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-2');
    });

    test('arrow key up should select the last option if none is selected', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        t.eq(el.selectedIndex, -1);
        t.eq(el.selectedOption, null);
        t.eq(el.length, 2, 'should have two options');

        const [opt1, opt2] = el.querySelectorAll('[role=option]');

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), '');

        el.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowUp'
        }));

        t.eq(el.selectedIndex, 1);
        t.eq(el.selectedOption, opt2);

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'true');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-2');
    });

    test('arrow key up should select the previous option', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} selected id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        const [opt1, opt2] = el.querySelectorAll('[role=option]');

        t.eq(el.selectedIndex, 1);
        t.eq(el.selectedOption, opt2);

        t.eq(opt1.getAttribute('aria-selected'), 'false');
        t.eq(opt2.getAttribute('aria-selected'), 'true');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-2');

        el.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowUp'
        }));

        t.eq(el.selectedIndex, 0);
        t.eq(el.selectedOption, opt1);

        t.eq(opt1.getAttribute('aria-selected'), 'true');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-1');
    });

    test('arrow key up should keep the first option selected if it is already selected', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} selected id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        const [opt1, opt2] = el.querySelectorAll('[role=option]');

        t.eq(el.selectedIndex, 0);
        t.eq(el.selectedOption, opt1);

        t.eq(opt1.getAttribute('aria-selected'), 'true');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-1');

        el.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowUp'
        }));

        t.eq(el.selectedIndex, 0);
        t.eq(el.selectedOption, opt1);

        t.eq(opt1.getAttribute('aria-selected'), 'true');
        t.eq(opt2.getAttribute('aria-selected'), 'false');

        t.eq(el.getAttribute('aria-activedescendant'), 'custom-id-1');
    });

    test('listbox should emit "change" event when selected option changes ', async t => {
        const el = document.createElement(LIST_BOX_TAG_NAME);
        el.innerHTML = `
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-1">option 1</${LIST_BOX_OPTION_TAG_NAME}>
        <${LIST_BOX_OPTION_TAG_NAME} id="custom-id-2">option 2</${LIST_BOX_OPTION_TAG_NAME}>
        `;

        body.appendChild(el);

        await nextTick();

        let selectedIndex = null;

        el.addEventListener('change', ev => {
            selectedIndex = ev.selectedIndex;
        });

        t.eq(selectedIndex, null);

        el.selectedIndex = 0;

        t.eq(selectedIndex, 0, 'event should have been emitted');
    });
});