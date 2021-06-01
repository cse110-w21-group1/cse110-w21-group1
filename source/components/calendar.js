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

    const calDiv = this.shadowRoot.getElementById('calendar');
    this.cal = new FullCalendar.Calendar(calDiv, {
      initialView: 'dayGridMonth'
    });

  }

  /**
   * Renders the calendar and pulls the events from the notes array to add onto the calendar.
   * 
   * @param {*} notesMap - A map containing ids mapped to notes
   */
  render(notesMap) {
    const calDiv = this.shadowRoot.getElementById('calendar');
    let eventsList = []; 
    notesMap.forEach((value) => {
      if (value.tag == "Event") {
      const event = {
        id: value.id,
        title: value.title,
        start: value.eventDate, // TODO: needs to be changed to the event date instead of the date of creation
      };
        allDay: true
        eventsList.push(event);
      }
    });
    this.cal = new FullCalendar.Calendar(calDiv, {
      initialView: 'dayGridMonth', 
      events: eventsList
      
    });
    console.log(eventsList);
    this.cal.render();
  }
}

customElements.define('calendar-elem', CalendarElem);

