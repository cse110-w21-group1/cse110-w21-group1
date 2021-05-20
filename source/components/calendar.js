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
    <div class="calendar-wrapper">
      <p>This is the calendar element</p>
    </div>
    ` 
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

// customElements.define('calendar-elem', CalendarElem);

//     this.attachShadow({ mode: 'open' });
//     const dummy = document.createElement('p');
//     dummy.innerHTML = 'This is the calendar element';
//     this.shadowRoot.appendChild(dummy);
  


// customElements.define('calendar', CalendarElem);

