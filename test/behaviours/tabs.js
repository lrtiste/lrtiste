import {tabList, tab} from '../../behaviours/tabs';
import {default as tape} from 'tape';

export function test () {
  tape('tabItem should use a tabList as a mediator when toggling', t=> {
    const tabStamp = tab();
    const tb = tabStamp({
      tabList: {
        toggleItem(item){
          t.equal(item, tb);
          t.end();
        },
        addItem(item){

        }
      }
    });
    tb.toggle();
  });

  tape('should add tab items', t=> {
    const tabStamp = tab();
    const tabListStamp = tabList();
    const tabs = tabListStamp();
    const tab1 = tabStamp({tabList: tabs});
    const tab2 = tabStamp({tabList: tabs});
    const tab3 = tabStamp({tabList: tabs});
    t.equal(tabs.items.length,3);
    t.end();
  });

  tape('should close other tabs when opening one',t=>{
    const tabStamp = tab();
    const tabListStamp = tabList();
    const tabs = tabListStamp();
    const tab1 = tabStamp({tabList: tabs});
    const tab2 = tabStamp({tabList: tabs,isOpen:true});
    const tab3 = tabStamp({tabList: tabs});
    t.equal(tabs.items.length,3);
    t.equal(tab2.isOpen,true);
    tab1.toggle();
    t.equal(tab1.isOpen,true);
    t.equal(tab2.isOpen,false);
    t.equal(tab2.isOpen,false);
    t.end();
  });

}