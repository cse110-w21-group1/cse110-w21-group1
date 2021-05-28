/**
 * Wrapper component that contains the calendar. 
 * Uses FullCalendar API to automatically generate the calendar.
 */
class CalendarElem extends HTMLElement {
  constructor() {
    super();

    // CSS template for the calendar element
    const template = document.createElement('template');
    template.innerHTML = `
    <link rel="stylesheet" href="./fullcalendar-5.7.0/lib/main.css">
    <style>
      /* Padding to compensate for the menu bar */
      .calendar-wrapper {
        padding-left: 140px;
      }

      /* Define font for all calendar text */
      div#calendar {
        font-family: Open Sans, sans-serif;
        font-size: 14px;
      }
       
      /* Override arrow characters on the prev/next buttons */
      .fc-icon-chevron-left:before {
        content: "<";
      }

      .fc-icon-chevron-right:before {
        content: ">";
      }
      
      /* Override button colors */ 
      /*
      .fc .fc-button-primary {
        color: #fff;
        background-color: #3498DB;
        border-color: #3498DB;
      }

      .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active {
        color: #fff;
        background-color: #2572a5;
        border-color: #151e27;
      }

      .fc .fc-button-primary:hover {
        color: #fff;
        background-color: #1e2b37;
        border-color: #1a252f;
      }
      .fc .fc-button-primary:disabled { /* not DRY */
        color: #fff;
        background-color: #2C3E50;
        border-color: #2C3E50;
      }
      .fc .fc-button-primary:focus {
        box-shadow: 0 0 0 0.2rem rgba(76, 91, 106, 0.5);
      }

      .fc .fc-button-primary:not(:disabled):active:focus,
      .fc .fc-button-primary:not(:disabled).fc-button-active:focus {
        box-shadow: 0 0 0 0.2rem rgba(76, 91, 106, 0.5);
      }
      */
    </style>
    <div class="calendar-wrapper">
      <div id='calendar' ></div>
    </div>
    ` 
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Overwrite fullcalendar render() method to create a new calendar before render
   */
  render() {
    const calDiv = this.shadowRoot.getElementById('calendar');
    const cal = new FullCalendar.Calendar(calDiv, {
      initialView: 'dayGridMonth', // initial calendar view is monthly 
      headerToolbar: { // define left, center and right of the header
        left: 'prev,next today', // prev/next and today buttons
        center: 'title', // the title
        right: 'dayGridMonth,timeGridWeek,timeGridDay' // month, week and daily views
      },
      handleWindowResize: true,  // Set to true to enable resizing of calendar with window
      aspectRatio: 2             // Changed from 1.35 to 2 to better fit the window space
    });
    cal.render();
  }
}

customElements.define('calendar-elem', CalendarElem);

