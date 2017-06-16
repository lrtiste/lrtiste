import * as events from 'smart-table-events';

const {proxyListener, emitter:createEmitter} = events;

const ACTIVE_ITEM_CHANGED = 'ACTIVE_ITEM_CHANGED';
const proxy = proxyListener({[ACTIVE_ITEM_CHANGED]: 'onActiveItemChange'});

export default ({emitter = createEmitter(), activeItem = 0, itemCount}) => {
  const state = {activeItem, itemCount};
  const event = proxy({emitter});
  const dispatch = () => emitter.dispatch(ACTIVE_ITEM_CHANGED, Object.assign({}, state));
  const api = {
    activateItem(index){
      state.activeItem = index < 0 ? itemCount - 1 : index % itemCount;
      dispatch();
    },
    activateNextItem(){
      api.activateItem(state.activeItem + 1);
    },
    activatePreviousItem(){
      api.activateItem(state.activeItem - 1);
    },
    refresh(){
      dispatch();
    }
  };

  return Object.assign(event, api);
};