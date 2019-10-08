import {test} from 'zora';
import {body, nextTick, TAB_PANEL_TAG_NAME, TAB_SET_TAG_NAME, TAB_TAG_NAME} from '../util.js';
import ChangeEvent from '../../src/common/change-event.js';

/**
 * @test {TabSet}
 */

const createTabSet = () => {
    const tabset = document.createElement(TAB_SET_TAG_NAME);
    tabset.innerHTML = `
  <${TAB_TAG_NAME}><span>tab 1</span></${TAB_TAG_NAME}>
  <${TAB_TAG_NAME} id="custom-tab-id">tab 2</${TAB_TAG_NAME}>
  <${TAB_TAG_NAME}>tab 3</${TAB_TAG_NAME}>
  <${TAB_PANEL_TAG_NAME} id="custom-tab-panel-id-1">content panel 1</${TAB_PANEL_TAG_NAME}>
  <${TAB_PANEL_TAG_NAME} id="custom-tab-panel-id-2">content <strong>panel 2</strong></${TAB_PANEL_TAG_NAME}>
  <${TAB_PANEL_TAG_NAME}>content panel 3</${TAB_PANEL_TAG_NAME}>
  `;
    return tabset;
};

const checkAttributes = (items, expected, assert) => {
    items.forEach((item, index) => {
        for (const [attribute, value] of Object.entries(expected[index])) {
            assert.eq(item.getAttribute(attribute), value);
        }
    });
};

/**
 * @test {TabSet}
 */
test('TabSet Component', ({test}) => {

    test('TabSet is connected: it should select the first tab if none has the `selected` attribute', async t => {
        const el = createTabSet();
        body.appendChild(el);

        await nextTick();

        t.eq(el.length, 3);
        t.eq(el.selectedIndex, 0);

        const [tab1, tab2, tab3] = el.querySelectorAll(TAB_TAG_NAME);
        const [tabpanel1, tabpanel2, tabpanel3] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

        checkAttributes([tab1, tab2, tab3], [
            {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
            {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'},
            {'aria-selected': 'false', 'aria-controls': tabpanel3.id, tabindex: '-1'}
        ], t);

        checkAttributes([tabpanel1, tabpanel2, tabpanel3], [
            {'aria-labelledby': tab1.id, hidden: null},
            {'aria-labelledby': tab2.id, hidden: ''},
            {'aria-labelledby': tab3.id, hidden: ''}
        ], t);
    });

    test('TabSet is connected: it should select the tab with the `selected` attribute', async t => {
        const el = createTabSet();
        body.appendChild(el);

        el.querySelectorAll(TAB_TAG_NAME)[1].setAttribute('selected', '');

        await nextTick();

        t.eq(el.length, 3);
        t.eq(el.selectedIndex, 1);

        const [tab1, tab2, tab3] = el.querySelectorAll(TAB_TAG_NAME);
        const [tabpanel1, tabpanel2, tabpanel3] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

        checkAttributes([tab1, tab2, tab3], [
            {'aria-selected': 'false', 'aria-controls': tabpanel1.id, tabindex: '-1'},
            {'aria-selected': 'true', 'aria-controls': tabpanel2.id, tabindex: '0'},
            {'aria-selected': 'false', 'aria-controls': tabpanel3.id, tabindex: '-1'}
        ], t);

        checkAttributes([tabpanel1, tabpanel2, tabpanel3], [
            {'aria-labelledby': tab1.id, hidden: ''},
            {'aria-labelledby': tab2.id, hidden: null},
            {'aria-labelledby': tab3.id, hidden: ''}
        ], t);
    });

    test('click should select the new tab', async t => {
        const el = createTabSet();
        body.appendChild(el);

        await nextTick();

        t.eq(el.length, 3);
        t.eq(el.selectedIndex, 0);

        const [tab1, tab2, tab3] = el.querySelectorAll(TAB_TAG_NAME);
        const [tabpanel1, tabpanel2, tabpanel3] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

        checkAttributes([tab1, tab2, tab3], [
            {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
            {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'},
            {'aria-selected': 'false', 'aria-controls': tabpanel3.id, tabindex: '-1'}
        ], t);

        checkAttributes([tabpanel1, tabpanel2, tabpanel3], [
            {'aria-labelledby': tab1.id, hidden: null},
            {'aria-labelledby': tab2.id, hidden: ''},
            {'aria-labelledby': tab3.id, hidden: ''}
        ], t);

        tab2.click();

        checkAttributes([tab1, tab2, tab3], [
            {'aria-selected': 'false', 'aria-controls': tabpanel1.id, tabindex: '-1'},
            {'aria-selected': 'true', 'aria-controls': tabpanel2.id, tabindex: '0'},
            {'aria-selected': 'false', 'aria-controls': tabpanel3.id, tabindex: '-1'}
        ], t);

        checkAttributes([tabpanel1, tabpanel2, tabpanel3], [
            {'aria-labelledby': tab1.id, hidden: ''},
            {'aria-labelledby': tab2.id, hidden: null},
            {'aria-labelledby': tab3.id, hidden: ''}
        ], t);

        t.eq(el.selectedIndex, 1);
    });

    test('keyboard navigation with `follow-focus` attribute', ({test}) => {

        const createTabSet = () => {
            const tabset = document.createElement(TAB_SET_TAG_NAME);
            tabset.innerHTML = `
  <${TAB_TAG_NAME}><span>tab 1</span></${TAB_TAG_NAME}>
  <${TAB_TAG_NAME}>tab 2</${TAB_TAG_NAME}>
  <${TAB_PANEL_TAG_NAME}>content panel 1</${TAB_PANEL_TAG_NAME}>
  <${TAB_PANEL_TAG_NAME}>content <strong>panel 2</strong></${TAB_PANEL_TAG_NAME}>
  `;
            tabset.setAttribute('follow-focus', '');
            return tabset;
        };

        test('RightArrow navigation', async t => {
            const el = createTabSet();
            body.appendChild(el);

            await nextTick();

            t.eq(el.length, 2);
            t.eq(el.selectedIndex, 0);

            const [tab1, tab2] = el.querySelectorAll(TAB_TAG_NAME);
            const [tabpanel1, tabpanel2] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            tab1.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowRight'
            }));

            t.eq(el.selectedIndex, 1);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'false', 'aria-controls': tabpanel1.id, tabindex: '-1'},
                {'aria-selected': 'true', 'aria-controls': tabpanel2.id, tabindex: '0'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: ''},
                {'aria-labelledby': tab2.id, hidden: null}
            ], t);

            t.is(el.querySelector(':focus'), tab2);

            tab2.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowRight'
            }));

            t.eq(el.selectedIndex, 0);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            t.is(el.querySelector(':focus'), tab1);
        });

        test('LeftArrow navigation', async t => {
            const el = createTabSet();
            body.appendChild(el);

            await nextTick();

            t.eq(el.length, 2);
            t.eq(el.selectedIndex, 0);

            const [tab1, tab2] = el.querySelectorAll(TAB_TAG_NAME);
            const [tabpanel1, tabpanel2] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            tab1.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowLeft'
            }));

            t.eq(el.selectedIndex, 1);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'false', 'aria-controls': tabpanel1.id, tabindex: '-1'},
                {'aria-selected': 'true', 'aria-controls': tabpanel2.id, tabindex: '0'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: ''},
                {'aria-labelledby': tab2.id, hidden: null}
            ], t);

            t.is(el.querySelector(':focus'), tab2);

            tab2.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowLeft'
            }));

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            t.eq(el.selectedIndex, 0);

            t.is(el.querySelector(':focus'), tab1);
        });

    });

    test('keyboard navigation without `follow-focus` attribute', ({test}) => {

        const createTabSet = () => {
            const tabset = document.createElement(TAB_SET_TAG_NAME);
            tabset.innerHTML = `
  <${TAB_TAG_NAME}><span>tab 1</span></${TAB_TAG_NAME}>
  <${TAB_TAG_NAME}>tab 2</${TAB_TAG_NAME}>
  <${TAB_PANEL_TAG_NAME}>content panel 1</${TAB_PANEL_TAG_NAME}>
  <${TAB_PANEL_TAG_NAME}>content <strong>panel 2</strong></${TAB_PANEL_TAG_NAME}>
  `;
            return tabset;
        };

        test('RightArrow navigation', async t => {
            const el = createTabSet();
            body.appendChild(el);

            await nextTick();

            t.eq(el.length, 2);
            t.eq(el.selectedIndex, 0);

            const [tab1, tab2] = el.querySelectorAll(TAB_TAG_NAME);
            const [tabpanel1, tabpanel2] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            tab1.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowRight'
            }));

            t.eq(el.selectedIndex, 0);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            t.is(el.querySelector(':focus'), tab2);

            tab2.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowRight'
            }));

            t.eq(el.selectedIndex, 0);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            t.is(el.querySelector(':focus'), tab1);
        });

        test('LeftArrow navigation', async t => {
            const el = createTabSet();
            body.appendChild(el);

            await nextTick();

            t.eq(el.length, 2);
            t.eq(el.selectedIndex, 0);

            const [tab1, tab2] = el.querySelectorAll(TAB_TAG_NAME);
            const [tabpanel1, tabpanel2] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            tab1.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowLeft'
            }));

            t.eq(el.selectedIndex, 0);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            t.is(el.querySelector(':focus'), tab2);

            tab2.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowLeft'
            }));

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            t.eq(el.selectedIndex, 0);

            t.is(el.querySelector(':focus'), tab1);
        });

        test('select tab on Enter keydown', async t => {
            const el = createTabSet();
            body.appendChild(el);

            await nextTick();

            t.eq(el.length, 2);
            t.eq(el.selectedIndex, 0);

            const [tab1, tab2] = el.querySelectorAll(TAB_TAG_NAME);
            const [tabpanel1, tabpanel2] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            tab2.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter'
            }));

            t.eq(el.selectedIndex, 1);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'false', 'aria-controls': tabpanel1.id, tabindex: '-1'},
                {'aria-selected': 'true', 'aria-controls': tabpanel2.id, tabindex: '0'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: ''},
                {'aria-labelledby': tab2.id, hidden: null}
            ], t);
        });

        test('select tab on Space keydown', async t => {
            const el = createTabSet();
            body.appendChild(el);

            await nextTick();

            t.eq(el.length, 2);
            t.eq(el.selectedIndex, 0);

            const [tab1, tab2] = el.querySelectorAll(TAB_TAG_NAME);
            const [tabpanel1, tabpanel2] = el.querySelectorAll(TAB_PANEL_TAG_NAME);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'true', 'aria-controls': tabpanel1.id, tabindex: '0'},
                {'aria-selected': 'false', 'aria-controls': tabpanel2.id, tabindex: '-1'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: null},
                {'aria-labelledby': tab2.id, hidden: ''}
            ], t);

            tab2.dispatchEvent(new KeyboardEvent('keydown', {
                key: ' '
            }));

            t.eq(el.selectedIndex, 1);

            checkAttributes([tab1, tab2], [
                {'aria-selected': 'false', 'aria-controls': tabpanel1.id, tabindex: '-1'},
                {'aria-selected': 'true', 'aria-controls': tabpanel2.id, tabindex: '0'}
            ], t);

            checkAttributes([tabpanel1, tabpanel2], [
                {'aria-labelledby': tab1.id, hidden: ''},
                {'aria-labelledby': tab2.id, hidden: null}
            ], t);
        });
    });

    test('selecting a new tab should trigger a `change event`', async t => {
        const el = createTabSet();
        body.appendChild(el);

        await nextTick();

        let eventValue = null;

        el.addEventListener('change', ev => eventValue = ev);

        t.eq(el.length, 3);
        t.eq(el.selectedIndex, 0);

        el.selectedIndex = 2;

        t.eq(eventValue, new ChangeEvent(2));
    });
});