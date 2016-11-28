import {ariaElement, element} from '../behaviours/elements';
import {compose, methods, init} from 'stampit';
import{observable} from '../behaviours/observables';
import {listMediatorStamp, listItemStamp} from '../behaviours/listMediators';

const mandatoryElement = element();
const menuElement = ariaElement({ariaRole: 'menu'});

const abstractMenuItem = compose(
  ariaElement({ariaRole: 'menuitem'}),
  listItemStamp,
  observable('isSelected'),
  init(function () {
    this.$on('isSelected', isSelected => {
      this.el.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected === true) {
        this.el.focus();
      }
    });
  })
);

const menuItemEvenBinding = init(function () {
  this.el.addEventListener('keydown', event => {
    const {keyCode:k, target} = event;
    if (k === 37 || k === 38) {
      this.selectPrevious();
    } else if (k === 39 || k === 40) {
      this.selectNext();
    } else if ((k === 13 || k === 32) && this.listMediator.toggle) {
      this.listMediator.toggle();
    }
  });
});

const menuItemStamp = compose(
  abstractMenuItem,
  menuItemEvenBinding
);

const subMenuItemEventBinding = init(function () {
  this.el.addEventListener('keydown', event => {
    const {keyCode:k} = event;
    if (k === 38) {
      this.selectPrevious();
    } else if (k === 40) {
      this.selectNext();
    } else if (k === 13 || k === 32) {
      this.listMediator.toggle();
    }
  });
});

const subMenuItemStamp = compose(
  abstractMenuItem,
  subMenuItemEventBinding
);

const toggleStamp = methods({
  toggle(){
    this.isOpen = !this.isOpen;
  }
});

const menuEventBinding = init(function () {
  this.toggler.addEventListener('click', event => {
    this.toggle();
  });
  this.toggler.addEventListener('keydown', event => {

    const {keyCode:k, target} = event;
    if (k === 13 || k === 32) {
      if (target.tagName !== 'BUTTON' || target.tagName !== 'A') {
        this.toggle();
      }
    } else if (k === 40 && !this.isOpen) {
      this.toggle();
    } else if (k === 38 && this.isOpen) {
      this.toggle();
    }
  });
});

const subMenuEventBinding = init(function () {

  const next = () => {
    this.selectNext();
    if (this.isOpen) {
      this.toggle();
    }
  };

  const previous = () => {
    this.selectPrevious();
    if (this.isOpen) {
      this.toggle();
    }
  };

  this.toggler.addEventListener('click', event => {
    this.toggle();
  });
  this.toggler.addEventListener('keydown', event => {
    const {keyCode:k, target} = event;
    if ((k === 13 || k === 32) && target.tagName !== 'BUTTON') {
      this.toggle();
    } else if (k === 39) {
      next();
    } else if (k === 37) {
      previous();
    } else if (k === 40 && target === this.toggler) {
      if (!this.isOpen) {
        this.toggle();
      } else {
        this.selectNext();
      }
    } else if (k === 38 && target === this.toggler) {
      if (this.isOpen) {
        this.toggle();
      } else {
        this.selectPrevious();
      }
    }
  });
  this.el.addEventListener('keydown', event => {
    const {keyCode:k} = event;
    if (k === 39) {
      next();
    } else if (k === 37) {
      previous();
    }
  });
});

function menuInitStamp ({menuItem = menuItemStamp}={}) {
  return init(function () {
    const menu = menuElement({el: this.el.querySelector('[role=menu]') || this.el});
    const toggler = this.el.querySelector('[aria-haspopup]') || this.el;

    Object.defineProperty(this, 'toggler', {value: toggler});
    Object.defineProperty(this, 'menu', {value: menu});

    this.toggler.setAttribute('tabindex', 0);
    this.menu.el.setAttribute('tabindex', -1);

    for (const el of this.menu.el.querySelectorAll('[role="menuitem"]')) {
      menuItem({listMediator: this, el});
    }

    this.$on('isOpen', isOpen => {
      this.toggler.setAttribute('aria-expanded', isOpen);
      this.menu.el.setAttribute('aria-hidden', !isOpen);
      if (isOpen && this.items.length) {
        this.selectItem(this.items[0]);
      }
    });
    this.$on('isSelected', isSelected => {
      this.toggler.setAttribute('tabindex', isSelected ? 0 : -1);
      if (isSelected) {
        this.toggler.focus();
      }
    });

    this.isOpen = this.isOpen || !!this.toggler.getAttribute('aria-expanded');
  });
}

const abstractMenuStamp = compose(
  mandatoryElement,
  listMediatorStamp,
  toggleStamp,
  observable('isOpen')
);

export function dropdown ({menuItem = menuItemStamp} ={}) {
  return compose(
    abstractMenuStamp,
    menuInitStamp({menuItem}),
    menuEventBinding
  );
}

export function subMenu ({menuItem = subMenuItemStamp}={}) {
  return compose(
    listItemStamp,
    abstractMenuStamp,
    observable('isSelected'),
    menuInitStamp({menuItem}),
    subMenuEventBinding
  );
}

const subMenuStamp = subMenu({menuItem: subMenuItemStamp});

export function menuBar ({menuItem = menuItemStamp, subMenu = subMenuStamp}={}) {
  return compose(
    ariaElement({ariaRole: 'menubar'}),
    listMediatorStamp,
    init(function () {
      for (const item of findChildrenMenuItem(this.el)) {
        if (item.querySelector('[role=menu]') !== null) {
          subMenu({el: item, listMediator: this});
        } else {
          menuItem({listMediator: this, el: item});
        }
      }
    })
  );
}

export function menuItem () {
  return menuItemStamp;
}

export function subMenuItem () {
  return subMenuItemStamp;
}

function findChildrenMenuItem (base) {
  const items = [];
  for (const c of base.children) {
    const role = c.getAttribute('role');
    if (role === 'menu') {
      continue;
    }
    if (role === 'menuitem') {
      items.push(c);
    } else {
      items.push(...findChildrenMenuItem(c));
    }
  }
  return items;
}