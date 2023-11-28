import {settings, classNames, select} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.widgets.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    
    //thisApp.activatePage(thisApp.pages[0].id);
    let pageMatchingHash = thisApp.pages[0].id;

    for (const page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    //thisApp.activatePage(idFromHash);
    thisApp.activatePage(pageMatchingHash);

    for(const link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        
        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id*/
        thisApp.activatePage(id);

        /* change url hash */
        window.location.hash = `#/${id}`;
      })
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class active to matching pages, remove from non-matching */
    for(const page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class active to matching links, remove from non-matching */
    for(const link of thisApp.navLinks){
     link.classList.toggle(
      classNames.nav.active, 
      link.getAttribute('href') == `#${pageId}`
      );
    }
  },

  initBooking: function(){
    const thisApp = this;
    thisApp.bookingWidgetElement = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(thisApp.bookingWidgetElement);
  },

  initMenu: function(){
    const thisApp = this;
    
    for(const productData in thisApp.data.products){
      //new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};

    const url = `${settings.db.url}/${settings.db.products}`;

    fetch(url)
      .then(rawResponse => rawResponse.json())
      .then(parsedResponse => {
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);

    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    })
  }
};

app.init();
