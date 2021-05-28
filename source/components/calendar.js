class CalendarElem extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = `
    <style>
      .calendar-wrapper {
        padding-left: 140px;
      }
    </style>
    <link rel="stylesheet" href="./fullcalendar-5.7.0/lib/main.css">
    <div class="calendar-wrapper">
      <div id='calendar' ></div>
    </div>
    ` 
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  render() {
    const calDiv = this.shadowRoot.getElementById('calendar');
    const cal = new FullCalendar.Calendar(calDiv, {
      initialView: 'dayGridMonth'
    });
    cal.render();
  }
}



// customElements.define('calendar-elem', CalendarElem);

//     this.attachShadow({ mode: 'open' });
//     const dummy = document.createElement('p');
//     dummy.innerHTML = 'This is the calendar element';
//     this.shadowRoot.appendChild(dummy);
  


// customElements.define('calendar', CalendarElem);


customElements.define('calendar-elem', CalendarElem);

