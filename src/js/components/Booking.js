import {select, templates} from "../settings.js";
import utils from "../utils.js";
import AmountWidget from "./AmountWidget.js";

class Booking {
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.getElements(element);
        thisBooking.initWidgets();
    }

    render(element){
            const generatedHTML = templates.bookingWidget();
            const generatedDOM = utils.createDOMFromHTML(generatedHTML);
            element.appendChild(generatedDOM);
    }

    getElements(element){
        const thisBooking = this;

        thisBooking.dom = {
            wrapper: element,
            peopleAmount: element.querySelector(select.widgets.booking.peopleAmount),
            hoursAmount: element.querySelector(select.widgets.booking.hoursAmount), 
        };
    }

    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);

        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

        thisBooking.dom.peopleAmount.addEventListener('click', function(event){
            event.preventDefault();
        });
    
        thisBooking.dom.hoursAmount.addEventListener('click', function(event){
            event.preventDefault();
        });
    }
}

export default Booking;