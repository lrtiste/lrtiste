import {test} from 'zora';
import {body, TAB_PANEL_TAG_NAME} from '../util.js';

/**
 * @test {TabPanel}
 */
test('TabPanel Component', ({test}) => {

    test('TabPanel is connected', t => {
        const el = document.createElement(TAB_PANEL_TAG_NAME);
        body.appendChild(el);
        t.eq(el.getAttribute('role'), 'tabpanel', 'should have the role tabpanel');
        t.eq(el.getAttribute('slot'), 'tabpanels', 'should be put in the tabpanels slot');
    });

    /**
     * @test {Tab#active}
     */
    test('active getter should follow the `hidden` attribute', t => {
        const el = document.createElement(TAB_PANEL_TAG_NAME);
        t.eq(el.active, true);
        el.setAttribute('hidden', '');
        t.eq(el.active, false);
    });
});