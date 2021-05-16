class CalendarElem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const dummy = document.createElement('p');
    dummy.innerHTML = 'This is the calendar element';
    this.shadowRoot.appendChild(dummy);
  }
}

customElements.define('calendar', CalendarElem);