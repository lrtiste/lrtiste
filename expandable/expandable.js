import * as events from 'smart-table-events';
import elementComponent from '../common/element';
import * as checkKeys from '../common/util';

const {proxyListener, emitter:createEmitter} = events;

const EXPANDED_CHANGED = 'EXPANDED_CHANGED';
const proxy = proxyListener({[EXPANDED_CHANGED]: 'onExpandedChange'});

function expandableFactory ({emitter = createEmitter(), expanded}) {
  const state = {expanded};
  const dispatch = () => emitter.dispatch(EXPANDED_CHANGED, Object.assign({}, state));
  const setAndDispatch = (val) => () => {
    if (val !== undefined) {
      state.expanded = val;
    }
    dispatch();
  };
  const target = proxy({emitter});
  return Object.assign(target, {
    expand: setAndDispatch(true),
    collapse: setAndDispatch(false),
    toggle(){
      state.expanded = !state.expanded;
      dispatch();
    },
    refresh(){
      dispatch();
    },
    clean(){
      target.off();
    }
  });
}

export default function expandable ({expandKey = 'isArrowDown', collapseKey = 'isArrowUp'} = {}) {
  return function ({element}) {
    const expander = element.querySelector('[aria-expanded]');
    const expanded = expander.getAttribute('aria-expanded') !== 'false';

    const emitter = createEmitter();

    const expandableComp = expandableFactory({emitter, expanded});
    const elementComp = elementComponent({element, emitter});

    const expandableId = expander.getAttribute('aria-controls') || '';
    const expandable = element.querySelector(`#${expandableId}`) || document.getElementById(expandableId);

    const expanderComp = elementComponent({element: expander, emitter: createEmitter()});
    const expandedComp = elementComponent({element: expandable, emitter: createEmitter()});

    expandableComp.onExpandedChange(({expanded}) => {
      expanderComp.attr('aria-expanded', expanded);
      expandedComp.attr('aria-hidden', !expanded);
    });

    expanderComp.onkeydown((ev) => {
      if (checkKeys.isEnter(ev) || checkKeys.isSpace(ev)) {
        expandableComp.toggle();
        ev.preventDefault();
      } else if (collapseKey && checkKeys[collapseKey](ev)) {
        expandableComp.collapse();
        ev.preventDefault();
      } else if (expandKey && checkKeys[expandKey](ev)) {
        expandableComp.expand();
        ev.preventDefault();
      }
    });

    expanderComp.onclick((ev) => {
      const {clientX, clientY} = ev;
      // to differentiate a click generated from a keypress or an actual click
      // preventDefault does not seem enough on FF
      if (clientX !== 0 && clientY !== 0) {
        expandableComp.toggle()
      }
    });

    expandableComp.refresh();

    return Object.assign({}, expandableComp, elementComp, {
      expander(){
        return expanderComp;
      },
      expandable(){
        return expandedComp;
      },
      clean(){
        elementComp.clean();
        expanderComp.clean();
        expandedComp.clean();
        expandableComp.clean();
      }
    });
  }
}