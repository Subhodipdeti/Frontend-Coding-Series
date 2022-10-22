// all styles here
import '../styles/index.css';
import { colors } from '../constants/colors';
import { slotsTime } from "../constants/slots";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addMinutes } from 'date-fns';

// all target elements here
const eventContainer = document.querySelector(".events-container");
const addEventModal = document.getElementById('add-event-modal');
const addEvent = document.getElementById('add-event');

const dayOfWeek = document.querySelector('.day-in-string-view');
const dayOfWeekNumber = document.querySelector('.day-in-numbers-view');

const eventDate = document.getElementById("date-picker");
const eventStatrTime = document.getElementById("time-picker-start");
const eventEndTime = document.getElementById("time-picker-end");

const eventTitle = document.getElementById('event-title');
const timeSlotsView = document.querySelector('.times-view');

const currentDate  = new Date();
const hour = currentDate.getHours();
const time = currentDate.getMinutes();

eventStatrTime.value = `${hour}:${time}`;
const endtime = addMinutes(currentDate, 30);
eventEndTime.value = `${endtime.getHours()}:${endtime.getMinutes()}`;
eventDate.value = format(new Date(), 'yyyy-MM-dd');

const result = eachDayOfInterval({
  start: startOfWeek(new Date()),
  end: endOfWeek(new Date())
})

for (const r of result) {
  const stringLi = document.createElement('li');
  const numberLi = document.createElement('li');

  const stringNode = document.createTextNode(format(r, 'ccc').toLocaleUpperCase());
  const numberNode = document.createTextNode(format(r, 'd'));

  stringLi.appendChild(stringNode);
  numberLi.appendChild(numberNode);

  dayOfWeek.appendChild(stringLi);
  dayOfWeekNumber.appendChild(numberLi);
}

for (const slot of slotsTime) {
  const li = document.createElement('li');
  const content = document.createTextNode(slot);
  li.appendChild(content);
  timeSlotsView.appendChild(li);
}

const saveEventBtn = document.querySelector('#save-event');
 
 var events = [];
 const businessStartHours = 1;
 const timeslotInterval = 15;
 const daysInaWeek = 7;
 const sections = daysInaWeek;
 const eventsByDay = {};

 var id = 1;
 
 function createEvent() {
  if(!eventTitle.value?.trim()) {
    alert("Enter a title");
    return;
  };

  const event = {
    id: id,
    starttime: eventStatrTime.value,
    endtime: eventEndTime.value,
    date: eventDate.value,
    name: eventTitle.value
  };

  id++;
  eventContainer.innerHTML = "";
  events = [];
  events.push(event);
  processEvents();
  loadEvents();
  toggleEventModal(false)
 }

 function toggleEventModal(modalStatus) {
     if(modalStatus) {
      addEventModal.classList.remove('hidden');
     } else {
      addEventModal.classList.add('hidden');
     }
 }
 
 addEvent.addEventListener('click', () => toggleEventModal(true));
 saveEventBtn.addEventListener('click', createEvent);

 function processEvents() {
   events.forEach(evt => {
     const cell = getCell(evt.starttime);
 
     // check if exist
     if (!eventsByDay[evt.date]) {
       eventsByDay[evt.date] = {};
       eventsByDay[evt.date][cell] = [];
     }
 
     if (!eventsByDay[evt.date][cell]) {
       eventsByDay[evt.date][cell] = [];
     }
 
     eventsByDay[evt.date][cell].push(evt);
   });
 }

 function getCell(starttime) {
   const h = +starttime.split(":")[0];
   return h - businessStartHours;
 }
 
 function loadEvents() {
   Object.keys(eventsByDay).forEach(e => {
     const eventsForThisDay = eventsByDay[e];
     Object.keys(eventsForThisDay).forEach(c => {
       const events = eventsForThisDay[c];
       var totalEventsPerCell = events.length;
       var offset = 0;
 
       for (var i = 0; i < events.length; i++) {
         var event = events[i];
 
         const colPos = getColumnPosition(event.date);
         const perc = 100 / (sections + 1 - colPos);
         const percW = Math.floor(perc / totalEventsPerCell);
 
         var wMultiplier = 1.5;
         // for last one is just percW
         if (offset === totalEventsPerCell - 1) {
           wMultiplier = 0.95;
         }
 
         event["width"] = percW * wMultiplier;
         event["left"] = percW * offset;
         event["time"] = `${event.starttime} - ${event.endtime}`;
         renderEvent(event);
 
         ++offset;
       }
     });
   });
 }
 
 function renderEvent(event) {
   const oneEvent = document.createElement("div");
   const eventName = document.createTextNode(event.name);
   const color = Math.floor(Math.random() * colors.length);

   oneEvent.appendChild(eventName);
   oneEvent.setAttribute("class", "slot");
 
   /**
    * if two events have same start time
    */
   
   oneEvent.style.background = colors[color];
   oneEvent.style.width = event.width + "%";
   oneEvent.style.left = event.left + "%";
   oneEvent.style.zIndex = event.zindex;
   oneEvent.style.height = getHeight(event.starttime, event.endtime) + "px";
   // 100 / ((8-colPos))
   oneEvent.style.gridRowStart = getRowPosition(event.starttime);
   oneEvent.style.gridColumnStart = getColumnPosition(event.date);

   eventContainer.appendChild(oneEvent); 

 }

 /**
  * given a start date returns the column position
  *
  * input: startdate (yy-mm-dd)
  */
 function getColumnPosition(startdate) {
   const y = +startdate.split("-")[0];
   const m = +startdate.split("-")[1];
   const d = +startdate.split("-")[2];
 
   const date = new Date(y, m - 1, d);
   return date.getDay() + 1;
 }
 
 /**
  * given start time returns the row position
  *
  * input: starttime (x:xx)
  */
 function getRowPosition(s) {
   const h = +s.split(":")[0];
   const m = +s.split(":")[1];
  
   const totalMinutes = Math.abs(businessStartHours - h) * 60 + m;
   const rowPos = ((totalMinutes / timeslotInterval) + 1).toFixed(0);
   return rowPos;
 }
 
 /**
  * given start and end times will return the height in px
  *
  * start: x:xx
  * end: x:xx
  */
 function getHeight(starttime, endtime) {
   const starthour = starttime.split(":")[0];
   const startmin = starttime.split(":")[1];
   const endhour = endtime.split(":")[0];
   const endmin = endtime.split(":")[1];
 
   var datestart = new Date();
   var dateend = new Date();
   datestart.setHours(parseInt(starthour));
   datestart.setMinutes(parseInt(startmin));
 
   dateend.setHours(parseInt(endhour));
   dateend.setMinutes(parseInt(endmin));
 
   var duration = Math.abs(datestart.valueOf() - dateend.valueOf()) / 1000;
   return duration / 60;
 }
