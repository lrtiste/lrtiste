import {test} from 'zora';
import {body, LIST_BOX_OPTION_TAG_NAME} from './util.js';

/**
 * @test {ListBoxOption}
 */
test('ListBoxOption component', ({test}) => {
    test('ListBoxOption component is connected', t => {
        const el = document.createElement(LIST_BOX_OPTION_TAG_NAME);
        el.setAttribute('label', 'some label');
        body.appendChild(el);

        t.eq(el.getAttribute('role'), 'option', 'should have set the role');
        t.eq(el.getAttribute('slot'), 'options', 'should have set the slot attribute');
        t.eq(el.getAttribute('aria-label'), 'some label', 'should have updated the aria-label attribute');
    });

    /** @test {ListBoxOption#label} */
    test('label property getter should default to textContent if attribute is not present', t => {
        const el = document.createElement(LIST_BOX_OPTION_TAG_NAME);
        el.textContent = 'I am the text content';
        body.appendChild(el);
        t.eq(el.label, 'I am the text content');
    });

    /** @test {ListBoxOption#label} */
    test('label property setter should reflect on aria-label attribute', t => {
        const el = document.createElement(LIST_BOX_OPTION_TAG_NAME);
        el.setAttribute('label', 'some label');
        body.appendChild(el);

        t.eq(el.getAttribute('aria-label'), 'some label', 'should have updated the aria-label attribute');
        el.label = 'updated label';
        t.eq(el.getAttribute('aria-label'), 'updated label', 'should have updated the aria-label attribute');
    });

    /** @test {ListBoxOption#selected} */
    test('selected property getter', t => {
        const el = document.createElement(LIST_BOX_OPTION_TAG_NAME);
        el.setAttribute('label', 'some label');
        body.appendChild(el);

        t.eq(el.selected, false, 'should be false if no aria-selected is set');
        el.setAttribute('aria-selected', 'false');
        t.eq(el.selected, false, 'should be false if aria-selected value is "false');
        el.setAttribute('aria-selected', 'true');
        t.eq(el.selected, true, 'should be true if aria-selected is "true"');
    });
});