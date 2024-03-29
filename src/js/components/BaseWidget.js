class BaseWidget{
    constructor(wrapperElement, initialValue){
        const thisWidget = this;

        thisWidget.getElement(wrapperElement);
        thisWidget.correctValue = initialValue;
    }

    getElement(wrapperElement){
        const thisWidget = this;

        thisWidget.dom = {
            wrapper: wrapperElement,
        }
    }

    get value(){
        const thisWidget = this;

        return thisWidget.correctValue;
    }

    set value(value){
        const thisWidget = this;
  
        const newValue = thisWidget.parseValue(value);
  
        if(thisWidget.correctValue !== newValue && thisWidget.isValid(newValue)){
          thisWidget.correctValue = newValue;
          thisWidget.announce();
        }
  
        thisWidget.renderValue();
    }

    setValue(value){
        const thisWidget = this;
        thisWidget.value = value;
    }

    parseValue(value){
        return parseInt(value);
    }

    isValid(value){
        return !isNaN(value);
    }

    renderValue(){
        const thisWidget = this;
        thisWidget.dom.wrapper.innerHTML = thisWidget.value;
    }
      
    announce(){
        const thisWidget = this;
  
        /*const event = new Event('updated');
        thisWidget.dom.wrapper.dispatchEvent(event);*/
        const event = new CustomEvent('updated', {
          bubbles: true
        });
        thisWidget.dom.wrapper.dispatchEvent(event);
    }
}

export default BaseWidget;