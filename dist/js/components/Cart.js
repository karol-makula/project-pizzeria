import {select, classNames, settings, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from '../components/CartProduct.js';

class Cart {
    constructor(element){
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;
      
      thisCart.dom = {
        toggleTrigger: element.querySelector(select.cart.toggleTrigger),
        productList: element.querySelector(select.cart.productList),
        deliveryFee: element.querySelector(select.cart.deliveryFee),
        subtotalPrice: element.querySelector(select.cart.subtotalPrice),
        totalPrice: element.querySelectorAll(select.cart.totalPrice),
        totalNumber: element.querySelector(select.cart.totalNumber),
        form: element.querySelector(select.cart.form),
        address: element.querySelector(select.cart.address),
        phone: element.querySelector(select.cart.phone),
      };

      thisCart.dom.wrapper = element;
    }

    initActions(){
      const thisCart = this;
      
      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });

      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });

      thisCart.dom.productList.addEventListener('remove', function(event){
        thisCart.remove(event.detail.cartProduct);
      });

      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisCart.sendOrder();
      });

      thisCart.dom.address.addEventListener('change', function(){
        thisCart.dom.address.classList.add(classNames.cart.wrapperError);
        if (thisCart.dom.address.value.length >= 6 && thisCart.dom.address.value.includes('@')) {
          thisCart.dom.address.classList.remove(classNames.cart.wrapperError);
        }
      });

      thisCart.dom.phone.addEventListener('change', function(){
        thisCart.dom.phone.classList.add(classNames.cart.wrapperError);
        if (thisCart.dom.phone.value.length == 9) {
          thisCart.dom.phone.classList.remove(classNames.cart.wrapperError);
        }
      });
    }

    add(menuProduct){
      const thisCart = this;

      /* generate HTML based on temple */
      const generatedHTML = templates.cartProduct(menuProduct);

      /* create element using utils.createElementFromHTML */
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      
      /* add element to menu */
      thisCart.dom.productList.appendChild(generatedDOM);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

      thisCart.update();
  }

    update(){

      const thisCart = this;

      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

      thisCart.totalNumber = 0; 
      thisCart.subtotalPrice = 0;
      thisCart.totalPrice = 0;

      for (let thisCartProduct of thisCart.products) {
        thisCart.totalNumber += thisCartProduct.amount;
        thisCart.subtotalPrice += thisCartProduct.price;
      }

      
      if (!thisCart.products.length) {
        thisCart.deliveryFee = 0;
      }

      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

      for(const singleTotalPrice of thisCart.dom.totalPrice){
        singleTotalPrice.innerHTML = thisCart.totalPrice;
      }
  }

    remove(cartProduct){
    const thisCart = this;

    cartProduct.dom.wrapper.remove();
    const productIndex = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(productIndex);
    thisCart.update();
  }

    sendOrder(){
    const thisCart = this;

    const url = `${settings.db.url}/${settings.db.orders}`;

    thisCart.payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    }

    for(const prod of thisCart.products){
      thisCart.payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thisCart.payload),
    };

    if (thisCart.validate(thisCart.payload)) {
      fetch(url, options)
        .then(response => {return response.json()})
        .then(parsedResponse => {console.log('odpowiedź: ', parsedResponse);});
        thisCart.resetToDefault();
    }
  }

    validate(payload) {
    const thisCart = this;

    if (payload.products.length != 0) {
      if (payload.phone.length == 9) {
        thisCart.dom.phone.classList.remove(classNames.cart.wrapperError);

        if (/^([w!#$%&'*+-=?^`{|}~]+\.)*[w!#$%&'*+\-=?^`{|}~]+@((((([a-z0-9]{1}[a-z0-9-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?)$/i.test(payload.address)){
          thisCart.dom.address.classList.remove(classNames.cart.wrapperError);
          return true;
        } else {
          thisCart.dom.address.classList.add(classNames.cart.wrapperError);
          alert('Address too short. Please provide correct address - at least 6 characters');
        }
      } else {
        thisCart.dom.phone.classList.add(classNames.cart.wrapperError);
        alert('Phone field error. Please provide correct phone number - 9 digits.');
      }
    } else {
      alert('Cart looks empty. Please put some products.');
    }
  }

    resetToDefault(){
      const thisCart = this;

      /*for(const product of thisCart.products){
        product.dom.wrapper.remove();
      }
      thisCart.products = [];

      thisCart.update();*/

      thisCart.products = [];
      thisCart.update();
      thisCart.dom.productList.innerHTML='';
      thisCart.dom.form.reset();
  }
}

export default Cart;