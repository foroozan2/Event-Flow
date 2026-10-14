/* =========================================================
   EVENTFLOW - EVENT MANAGEMENT SYSTEM
   ========================================================= */


/* =========================================================
   1. SELECT ELEMENTS FROM HTML
   ========================================================= */

// Dashboard
const totalEventsElement = document.getElementById("total-events");
const activeEventsElement = document.getElementById("active-events");
const totalParticipantsElement =
    document.getElementById("total-participants");
const availableTicketsElement =
    document.getElementById("available-tickets");

const dashboardContent =
    document.getElementById("dashboard-content");


// Events
const eventSearch = document.getElementById("event-search");
const eventFilter = document.getElementById("event-filter");
const addEventButton = document.getElementById("add-event-button");

const eventFormContainer =
    document.getElementById("event-form-container");

const eventForm = document.getElementById("event-form");
const cancelEventButton =
    document.getElementById("cancel-event-button");

const eventList = document.getElementById("event-list");


// Event form inputs
const eventName = document.getElementById("event-name");
const eventDate = document.getElementById("event-date");
const eventTime = document.getElementById("event-time");
const eventLocation = document.getElementById("event-location");
const eventCapacity = document.getElementById("event-capacity");
const eventPrice = document.getElementById("event-price");
const eventType = document.getElementById("event-type");
const eventDescription =
    document.getElementById("event-description");
const eventImage = document.getElementById("event-image");


// Participants
const participantSearch =
    document.getElementById("participant-search");

const participantFilter =
    document.getElementById("participant-filter");

const addParticipantButton =
    document.getElementById("add-participant-button");

const participantFormContainer =
    document.getElementById("participant-form-container");

const participantForm =
    document.getElementById("participant-form");

const participantList =
    document.getElementById("participant-list");

const participantTableBody =
    document.getElementById("participant-table-body");


// Participant form inputs
const participantName =
    document.getElementById("participant-name");

const participantEmail =
    document.getElementById("participant-email");

const participantPhone =
    document.getElementById("participant-phone");

const participantEvent =
    document.getElementById("participant-event");

const participantStatus =
    document.getElementById("participant-status");


// Attendance
const attendanceEvent =
    document.getElementById("attendance-event");

const attendanceDate =
    document.getElementById("attendance-date");

const attendanceTableBody =
    document.getElementById("attendance-table-body");


// Tickets
const ticketEvent =
    document.getElementById("ticket-event");

const addTicketButton =
    document.getElementById("add-ticket-button");

const ticketFormContainer =
    document.getElementById("ticket-form-container");

const ticketForm =
    document.getElementById("ticket-form");

const ticketList =
    document.getElementById("ticket-list");


// Ticket form inputs
const ticketName =
    document.getElementById("ticket-name");

const ticketPrice =
    document.getElementById("ticket-price");

const ticketCapacity =
    document.getElementById("ticket-capacity");

const ticketDescription =
    document.getElementById("ticket-description");


// Reports
const reportTotalEvents =
    document.getElementById("report-total-events");

const reportTotalParticipants =
    document.getElementById("report-total-participants");

const reportAttendanceRate =
    document.getElementById("report-attendance-rate");

const reportTotalRevenue =
    document.getElementById("report-total-revenue");

const reportContent =
    document.getElementById("report-content");


// Settings
const settingsForm =
    document.getElementById("settings-form");

const adminName =
    document.getElementById("admin-name");

const theme =
    document.getElementById("theme");

const currency =
    document.getElementById("currency");

const settingsContent =
    document.getElementById("settings-content");


/* =========================================================
   2. APPLICATION DATA
   ========================================================= */

let events =
    JSON.parse(localStorage.getItem("eventflow-events")) || [];

let participants =
    JSON.parse(localStorage.getItem("eventflow-participants")) || [];

let tickets =
    JSON.parse(localStorage.getItem("eventflow-tickets")) || [];

let attendance =
    JSON.parse(localStorage.getItem("eventflow-attendance")) || [];

let settings =
    JSON.parse(localStorage.getItem("eventflow-settings")) || {
        adminName: "",
        theme: "light",
        currency: "usd"
    };


/* =========================================================
   3. EDITING STATE
   ========================================================= */

let editingEventId = null;
let editingParticipantId = null;
let editingTicketId = null;


/* =========================================================
   4. HELPER FUNCTIONS
   ========================================================= */


/*
   Generate a unique ID.
*/

function generateId() {
    return Date.now() + Math.random();
}


/*
   Save application data to localStorage.
*/

function saveData() {

    localStorage.setItem(
        "eventflow-events",
        JSON.stringify(events)
    );

    localStorage.setItem(
        "eventflow-participants",
        JSON.stringify(participants)
    );

    localStorage.setItem(
        "eventflow-tickets",
        JSON.stringify(tickets)
    );

    localStorage.setItem(
        "eventflow-attendance",
        JSON.stringify(attendance)
    );

    localStorage.setItem(
        "eventflow-settings",
        JSON.stringify(settings)
    );
}


/*
   Format a date.
*/

function formatDate(date) {

    if (!date) {
        return "No date";
    }

    const dateObject = new Date(date);

    return dateObject.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


/*
   Format money according to selected currency.
*/

function formatCurrency(amount) {

    const currencyMap = {
        usd: "USD",
        eur: "EUR",
        afn: "AFN"
    };

    return `${Number(amount).toLocaleString()} ${
        currencyMap[settings.currency] || "USD"
    }`;
}


/*
   Find an event by its ID.
*/

function getEventById(id) {

    return events.find(function (event) {
        return String(event.id) === String(id);
    });
}


/*
   Find a participant by ID.
*/

function getParticipantById(id) {

    return participants.find(function (participant) {
        return String(participant.id) === String(id);
    });
}


/*
   Find a ticket by ID.
*/

function getTicketById(id) {

    return tickets.find(function (ticket) {
        return String(ticket.id) === String(id);
    });
}


/*
   Determine the current status of an event.
*/

function getEventStatus(event) {

    if (event.status === "cancelled") {
        return "cancelled";
    }

    const eventDateTime =
        new Date(`${event.date}T${event.time}`);

    const now = new Date();

    if (eventDateTime < now) {
        return "completed";
    }

    return "upcoming";
}


/* =========================================================
   5. EVENT FUNCTIONS
   ========================================================= */


/*
   Display all events.
*/

function renderEvents() {

    eventList.innerHTML = "";

    const searchText =
        eventSearch.value.toLowerCase().trim();

    const selectedFilter =
        eventFilter.value;


    const filteredEvents = events.filter(function (event) {

        const matchesSearch =
            event.name.toLowerCase().includes(searchText) ||
            event.location.toLowerCase().includes(searchText) ||
            event.type.toLowerCase().includes(searchText);


        const status =
            getEventStatus(event);

        const matchesFilter =
            selectedFilter === "all" ||
            status === selectedFilter;


        return matchesSearch && matchesFilter;
    });


    if (filteredEvents.length === 0) {

        eventList.innerHTML = `
            <div class="empty-state">
                <h3>No events found</h3>
                <p>Create an event or change your search.</p>
            </div>
        `;

        return;
    }


    filteredEvents.forEach(function (event) {

        const participantCount =
            participants.filter(function (participant) {
                return (
                    String(participant.eventId) ===
                    String(event.id) &&
                    participant.status !== "cancelled"
                );
            }).length;


        const remainingCapacity =
            Math.max(
                Number(event.capacity) - participantCount,
                0
            );


        const status =
            getEventStatus(event);


        const eventCard =
            document.createElement("div");

        eventCard.className = "event-card";


        eventCard.innerHTML = `
            ${
                event.image
                    ? `<img src="${event.image}" alt="${event.name}">`
                    : ""
            }

            <div class="event-card-content">

                <span class="event-status">
                    ${status}
                </span>

                <h3>${event.name}</h3>

                <p>
                    <strong>Type:</strong>
                    ${event.type}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${formatDate(event.date)}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${event.time}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${event.location}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${event.capacity}
                </p>

                <p>
                    <strong>Available:</strong>
                    ${remainingCapacity}
                </p>

                <p>
                    <strong>Price:</strong>
                    ${formatCurrency(event.price)}
                </p>

                <p>
                    ${event.description || "No description available."}
                </p>

                <div class="event-actions">

                    <button
                        type="button"
                        onclick="editEvent('${event.id}')">
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteEvent('${event.id}')">
                        Delete
                    </button>

                    ${
                        status !== "cancelled"
                        ? `
                            <button
                                type="button"
                                onclick="cancelEvent('${event.id}')">
                                Cancel Event
                            </button>
                        `
                        : ""
                    }

                </div>

            </div>
        `;


        eventList.appendChild(eventCard);
    });
}


/*
   Show the event form.
*/

function showEventForm() {

    eventFormContainer.style.display = "block";

    eventForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/*
   Hide the event form.
*/

function hideEventForm() {

    eventFormContainer.style.display = "none";

    eventForm.reset();

    editingEventId = null;
}


/*
   Add or edit an event.
*/

eventForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            eventName.value.trim();

        const date =
            eventDate.value;

        const time =
            eventTime.value;

        const location =
            eventLocation.value.trim();

        const capacity =
            Number(eventCapacity.value);

        const price =
            Number(eventPrice.value) || 0;

        const type =
            eventType.value;

        const description =
            eventDescription.value.trim();


        if (capacity < 1) {

            alert("Capacity must be at least 1.");

            return;
        }

        if (editingEventId !== null) {

            const eventToEdit =
                getEventById(editingEventId);


            if (eventToEdit) {

                eventToEdit.name = name;
                eventToEdit.date = date;
                eventToEdit.time = time;
                eventToEdit.location = location;
                eventToEdit.capacity = capacity;
                eventToEdit.price = price;
                eventToEdit.type = type;
                eventToEdit.description = description;
            }


            saveData();
            renderEvents();
            updateAll();


            alert("Event updated successfully.");

            hideEventForm();

            return;
        }


        /*
           Otherwise create a completely new event.
        */

        const newEvent = {

            id: generateId(),

            name: name,

            date: date,

            time: time,

            location: location,

            capacity: capacity,

            price: price,

            type: type,

            description: description,

            image: "",

            status: "active"
        };


        /*
           Read the selected image.
        */

        if (eventImage.files.length > 0) {

            const reader = new FileReader();


            reader.onload = function () {

                newEvent.image =
                    reader.result;

                events.push(newEvent);

                saveData();

                renderEvents();

                updateAll();

                hideEventForm();
            };


            reader.readAsDataURL(
                eventImage.files[0]
            );

        } else {

            events.push(newEvent);

            saveData();

            renderEvents();

            updateAll();

            hideEventForm();
        }
    }
);


/*
   Edit event.
*/

function editEvent(id) {

    const event =
        getEventById(id);


    if (!event) {
        return;
    }


    eventName.value =
        event.name;

    eventDate.value =
        event.date;

    eventTime.value =
        event.time;

    eventLocation.value =
        event.location;

    eventCapacity.value =
        event.capacity;

    eventPrice.value =
        event.price;

    eventType.value =
        event.type;

    eventDescription.value =
        event.description;


    editingEventId =
        event.id;


    showEventForm();
}


/*
   Delete event.
*/

function deleteEvent(id) {

    const event =
        getEventById(id);


    if (!event) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${event.name}"?`
        );


    if (!confirmed) {
        return;
    }


    events =
        events.filter(function (event) {
            return String(event.id) !== String(id);
        });


    /*
       Delete participants related to this event.
    */

    participants =
        participants.filter(function (participant) {
            return String(participant.eventId)
                !== String(id);
        });


    /*
       Delete tickets related to this event.
    */

    tickets =
        tickets.filter(function (ticket) {
            return String(ticket.eventId)
                !== String(id);
        });


    /*
       Delete attendance records related to this event.
    */

    attendance =
        attendance.filter(function (record) {
            return String(record.eventId)
                !== String(id);
        });


    saveData();

    renderEvents();

    updateAll();
}


/*
   Cancel event.
*/

function cancelEvent(id) {

    const event =
        getEventById(id);


    if (!event) {
        return;
    }


    event.status = "cancelled";


    saveData();

    renderEvents();

    updateAll();
}
//${participant.status}

 /* =========================================================
   6. PARTICIPANT FUNCTIONS
   ========================================================= */


function updateParticipantEventOptions() {

    participantEvent.innerHTML =
        `<option value="">Select an event</option>`;


    events.forEach(function (event) {

        if (event.status !== "cancelled") {

            const option =
                document.createElement("option");

            option.value =
                event.id;

            option.textContent =
                event.name;

            participantEvent.appendChild(option);
        }
    });
}


/*
   Render participants table.
*/

function renderParticipants() {

    participantTableBody.innerHTML = "";


    const searchText =
        participantSearch.value
            .toLowerCase()
            .trim();


    const selectedFilter =
        participantFilter.value;


    const filteredParticipants =
        participants.filter(function (participant) {

            const event =
                getEventById(
                    participant.eventId
                );


            const eventName =
                event
                    ? event.name.toLowerCase()
                    : "";


            const matchesSearch =
                participant.name
                    .toLowerCase()
                    .includes(searchText) ||

                participant.email
                    .toLowerCase()
                    .includes(searchText) ||

                eventName.includes(searchText);


            const matchesFilter =
                selectedFilter === "all" ||
                participant.status === selectedFilter;


            return matchesSearch && matchesFilter;
        });


    if (filteredParticipants.length === 0) {

        participantTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No participants found.
                </td>
            </tr>
        `;

        return;
    }


    filteredParticipants.forEach(
        function (participant) {

            const event =
                getEventById(
                    participant.eventId
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${participant.name}
                </td>

                <td>
                    ${participant.email}
                </td>

                <td>
                    ${participant.phone || "-"}
                </td>

                <td>
                    ${event ? event.name : "Unknown event"}
                </td>

                <td>
                    ${participant.status}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editParticipant('${participant.id}')">
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteParticipant('${participant.id}')">
                        Delete
                    </button>

                </td>
            `;


            participantTableBody.appendChild(row);
        }
    );
}


/*
   Show participant form.
*/

function showParticipantForm() {

    participantFormContainer.style.display =
        "block";

    participantForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/*
   Hide participant form.
*/

function hideParticipantForm() {

    participantFormContainer.style.display =
        "none";

    participantForm.reset();

    editingParticipantId = null;
}


/*
   Add or edit participant.
*/

participantForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            participantName.value.trim();

        const email =
            participantEmail.value.trim();

        const phone =
            participantPhone.value.trim();

        const eventId =
            participantEvent.value;

        const status =
            participantStatus.value;


        if (!eventId) {

            alert("Please select an event.");

            return;
        }


        const selectedEvent =
            getEventById(eventId);


        if (!selectedEvent) {

            alert("Selected event does not exist.");

            return;
        }


        /*
           Count current participants.
        */

        const currentParticipants =
            participants.filter(function (participant) {

                return (
                    String(participant.eventId)
                    === String(eventId) &&

                    participant.status
                    !== "cancelled"
                );
            });


        /*
           Check event capacity.
        */

        if (
            editingParticipantId === null &&
            currentParticipants.length
                >= Number(selectedEvent.capacity)
        ) {

            alert(
                "This event is full."
            );

            return;
        }


        /*
           Edit existing participant.
        */

        if (editingParticipantId !== null) {

            const participantToEdit =
                getParticipantById(
                    editingParticipantId
                );


            if (participantToEdit) {

                participantToEdit.name =
                    name;

                participantToEdit.email =
                    email;

                participantToEdit.phone =
                    phone;

                participantToEdit.eventId =
                    eventId;

                participantToEdit.status =
                    status;
            }


            saveData();

            renderParticipants();

            renderEvents();

            updateAll();

            hideParticipantForm();

            return;
        }


        /*
           Create new participant.
        */

        const newParticipant = {

            id: generateId(),

            name: name,

            email: email,

            phone: phone,

            eventId: eventId,

            status: status
        };


        participants.push(
            newParticipant
        );


        saveData();

        renderParticipants();

        renderEvents();

        updateAll();

        hideParticipantForm();
    }
);


/*
   Edit participant.
*/

function editParticipant(id) {

    const participant =
        getParticipantById(id);


    if (!participant) {
        return;
    }


    participantName.value =
        participant.name;

    participantEmail.value =
        participant.email;

    participantPhone.value =
        participant.phone;

    participantEvent.value =
        participant.eventId;

    participantStatus.value =
        participant.status;


    editingParticipantId =
        participant.id;


    showParticipantForm();
}


/*
   Delete participant.
*/

function deleteParticipant(id) {

    const confirmed =
        confirm(
            "Delete this participant?"
        );


    if (!confirmed) {
        return;
    }


    participants =
        participants.filter(
            function (participant) {

                return String(participant.id)
                    !== String(id);
            }
        );


    /*
       Also remove attendance record.
    */

    attendance =
        attendance.filter(
            function (record) {

                return String(record.participantId)
                    !== String(id);
            }
        );


    saveData();

    renderParticipants();

    renderAttendance();

    renderEvents();

    updateAll();
}
/* =========================================================
   7. ATTENDANCE
   ========================================================= */


/*
   Update event dropdown for attendance.
*/

function updateAttendanceEventOptions() {

    attendanceEvent.innerHTML =
        `<option value="">Select an event</option>`;


    events.forEach(function (event) {

        if (event.status !== "cancelled") {

            const option =
                document.createElement("option");

            option.value =
                event.id;

            option.textContent =
                event.name;

            attendanceEvent.appendChild(option);
        }
    });
}


/*
   Render attendance table.
*/

function renderAttendance() {

    attendanceTableBody.innerHTML = "";


    const selectedEvent =
        attendanceEvent.value;


    const selectedDate =
        attendanceDate.value;


    const filteredParticipants =
        participants.filter(
            function (participant) {

                const eventMatches =
                    !selectedEvent ||
                    String(participant.eventId)
                    === String(selectedEvent);


                return eventMatches &&
                    participant.status
                    !== "cancelled";
            }
        );


    if (filteredParticipants.length === 0) {

        attendanceTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No participants available.
                </td>
            </tr>
        `;

        return;
    }


    filteredParticipants.forEach(
        function (participant) {

            const event =
                getEventById(
                    participant.eventId
                );


            let record =
                attendance.find(
                    function (item) {

                        return (
                            String(item.participantId)
                            === String(participant.id)
                            &&
                            String(item.eventId)
                            === String(participant.eventId)
                            &&
                            item.date === selectedDate
                        );
                    }
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${participant.name}
                </td>

                <td>
                    ${event ? event.name : "-"}
                </td>

                <td>
                    ${
                        record
                            ? record.status
                            : "Not checked in"
                    }
                </td>

                <td>
                    ${
                        record && record.checkInTime
                            ? record.checkInTime
                            : "-"
                    }
                </td>

                <td>

                    <button
                        type="button"
                        onclick="checkInParticipant(
                            '${participant.id}'
                        )">

                        ${
                            record &&
                            record.status === "present"
                                ? "Checked In"
                                : "Check In"
                        }

                    </button>

                </td>
            `;


            attendanceTableBody.appendChild(row);
        }
    );
}


/*
   Check in participant.
*/

function checkInParticipant(
    participantId
) {

    const participant =
        getParticipantById(
            participantId
        );


    if (!participant) {
        return;
    }


    const date =
        attendanceDate.value ||
        new Date()
            .toISOString()
            .split("T")[0];


    const existingRecord =
        attendance.find(
            function (record) {

                return (
                    String(record.participantId)
                    === String(participantId)
                    &&
                    String(record.eventId)
                    === String(participant.eventId)
                    &&
                    record.date === date
                );
            }
        );


    const currentTime =
        new Date().toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    if (existingRecord) {

        existingRecord.status =
            "present";

        existingRecord.checkInTime =
            currentTime;

    } else {

        attendance.push({

            id: generateId(),

            participantId:
                participant.id,

            eventId:
                participant.eventId,

            date: date,

            status: "present",

            checkInTime: currentTime
        });
    }


    saveData();

    renderAttendance();

    updateAll();
}
/* =========================================================
   8. TICKETS
   ========================================================= */


/*
   Update ticket event dropdown.
*/

function updateTicketEventOptions() {

    ticketEvent.innerHTML =
        `<option value="">Select an event</option>`;


    events.forEach(function (event) {

        if (event.status !== "cancelled") {

            const option =
                document.createElement("option");

            option.value =
                event.id;

            option.textContent =
                event.name;

            ticketEvent.appendChild(option);
        }
    });
}


/*
   Render tickets.
*/

function renderTickets() {

    ticketList.innerHTML = "";


    const selectedEvent =
        ticketEvent.value;


    const filteredTickets =
        tickets.filter(
            function (ticket) {

                return (
                    !selectedEvent ||
                    String(ticket.eventId)
                    === String(selectedEvent)
                );
            }
        );


    if (filteredTickets.length === 0) {

        ticketList.innerHTML = `
            <div class="empty-state">
                <h3>No tickets found</h3>
                <p>Create a ticket type for an event.</p>
            </div>
        `;

        return;
    }


    filteredTickets.forEach(
        function (ticket) {

            const event =
                getEventById(
                    ticket.eventId
                );


            const card =
                document.createElement("div");


            card.className =
                "ticket-card";


            card.innerHTML = `

                <h3>
                    ${ticket.name}
                </h3>

                <p>
                    <strong>Event:</strong>
                    ${event ? event.name : "Unknown"}
                </p>

                <p>
                    <strong>Price:</strong>
                    ${formatCurrency(ticket.price)}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${ticket.capacity}
                </p>

                <p>
                    ${ticket.description || ""}
                </p>

                <div class="ticket-actions">

                    <button
                        type="button"
                        onclick="editTicket('${ticket.id}')">
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteTicket('${ticket.id}')">
                        Delete
                    </button>

                </div>
            `;


            ticketList.appendChild(card);
        }
    );
}


/*
   Show ticket form.
*/

function showTicketForm() {

    ticketFormContainer.style.display =
        "block";

    ticketForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/*
   Hide ticket form.
*/

function hideTicketForm() {

    ticketFormContainer.style.display =
        "null";

    ticketForm.reset();

    editingTicketId = null;
}


/*
   Add or edit ticket.
*/

ticketForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            ticketName.value.trim();

        const price =
            Number(ticketPrice.value) || 0;

        const capacity =
            Number(ticketCapacity.value);

        const description =
            ticketDescription.value.trim();

        const eventId =
            ticketEvent.value;


        if (!eventId) {

            alert("Please select an event.");

            return;
        }


        if (capacity < 1) {

            alert(
                "Ticket capacity must be at least 1."
            );

            return;
        }


        if (editingTicketId !== null) {

            const ticketToEdit =
                getTicketById(
                    editingTicketId
                );


            if (ticketToEdit) {

                ticketToEdit.name =
                    name;

                ticketToEdit.price =
                    price;

                ticketToEdit.capacity =
                    capacity;

                ticketToEdit.description =
                    description;

                ticketToEdit.eventId =
                    eventId;
            }


            saveData();

            renderTickets();

            updateAll();

            hideTicketForm();

            return;
        }


        const newTicket = {

            id: generateId(),

            name: name,

            price: price,

            capacity: capacity,

            description: description,

            eventId: eventId
        };


        tickets.push(
            newTicket
        );


        saveData();

        renderTickets();

        updateAll();

        hideTicketForm();
    }
);


/*
   Edit ticket.
*/

function editTicket(id) {

    const ticket =
        getTicketById(id);


    if (!ticket) {
        return;
    }


    ticketName.value =
        ticket.name;

    ticketPrice.value =
        ticket.price;

    ticketCapacity.value =
        ticket.capacity;

    ticketDescription.value =
        ticket.description;

    ticketEvent.value =
        ticket.eventId;


    editingTicketId =
        ticket.id;


    showTicketForm();
}


/*
   Delete ticket.
*/

function deleteTicket(id) {

    const confirmed =
        confirm(
            "Delete this ticket type?"
        );


    if (!confirmed) {
        return;
    }


    tickets =
        tickets.filter(
            function (ticket) {

                return String(ticket.id)
                    !== String(id);
            }
        );


    saveData();

    renderTickets();

    updateAll();
}


/* =========================================================
   9. DASHBOARD
   ========================================================= */


/*
   Update dashboard statistics.
*/

function updateDashboard() {

    const activeEvents =
        events.filter(
            function (event) {

                return getEventStatus(event)
                    === "upcoming";
            }
        );


    const activeParticipants =
        participants.filter(
            function (participant) {

                return participant.status
                    !== "cancelled";
            }
        );


    let availableTickets = 0;


    events.forEach(
        function (event) {

            const participantCount =
                participants.filter(
                    function (participant) {

                        return (
                            String(participant.eventId)
                            === String(event.id)
                            &&
                            participant.status
                            !== "cancelled"
                        );
                    }
                ).length;


            availableTickets +=
                Math.max(
                    Number(event.capacity)
                    - participantCount,
                    0
                );
        }
    );


    totalEventsElement.textContent =
        events.length;

    activeEventsElement.textContent =
        activeEvents.length;

    totalParticipantsElement.textContent =
        activeParticipants.length;

    availableTicketsElement.textContent =
        availableTickets;
/*
       Upcoming events preview.
    */

    const upcomingEvents =
        events.filter(
            function (event) {

                return getEventStatus(event)
                    === "upcoming";
            }
        );


    if (upcomingEvents.length === 0) {

        dashboardContent.innerHTML = `
            <div class="empty-state">
                <h3>No upcoming events</h3>
                <p>Your upcoming events will appear here.</p>
            </div>
        `;

        return;
    }


    dashboardContent.innerHTML = `
        <div class="dashboard-upcoming">

            <h2>Upcoming Events</h2>

            ${upcomingEvents
                .slice(0, 5)
                .map(function (event) {

                    return `
                        <div class="dashboard-event">

                            <h3>
                                ${event.name}
                            </h3>

                            <p>
                                ${formatDate(event.date)}
                                at ${event.time}
                            </p>

                            <p>
                                ${event.location}
                            </p>

                        </div>
                    `;

                })
                .join("")
            }

        </div>
    `;
}


/* =========================================================
   10. REPORTS
   ========================================================= */


function updateReports() {

    const totalParticipants =
        participants.filter(
            function (participant) {

                return participant.status
                    !== "cancelled";
            }
        ).length;


    const presentParticipants =
        attendance.filter(
            function (record) {

                return record.status
                    === "present";
            }
        ).length;


    let attendanceRate = 0;


    if (totalParticipants > 0) {

        attendanceRate =
            Math.round(
                (presentParticipants /
                    totalParticipants) * 100
            );
    }


    let totalRevenue = 0;


    participants.forEach(
        function (participant) {

            if (
                participant.status === "cancelled"
            ) {
                return;
            }


            const event =
                getEventById(
                    participant.eventId
                );


            if (event) {

                totalRevenue +=
                    Number(event.price) || 0;
            }
        }
    );


    reportTotalEvents.textContent =
        events.length;

    reportTotalParticipants.textContent =
        totalParticipants;

    reportAttendanceRate.textContent =
        `${attendanceRate}%`;

    reportTotalRevenue.textContent =
        formatCurrency(totalRevenue);


    /*
       Event report details.
    */

    if (events.length === 0) {

        reportContent.innerHTML = `
            <div class="empty-state">
                <h3>No report data</h3>
                <p>Create events and participants first.</p>
            </div>
        `;

        return;
    }


    reportContent.innerHTML = `

        <div class="detailed-reports">

            <h2>Event Details</h2>

            ${events
                .map(function (event) {

                    const count =
                        participants.filter(
                            function (participant) {

                                return (
                                    String(
                                        participant.eventId
                                    )
                                    === String(event.id)
                                    &&
                                    participant.status
                                    !== "cancelled"
                                );
                            }
                        ).length;


                    const remaining =
                        Math.max(
                            Number(event.capacity)
                            - count,
                            0
                        );


                    return `

                        <div class="report-row">

                            <h3>
                                ${event.name}
                            </h3>

                            <p>
                                Registrations:
                                ${count}
                            </p>

                            <p>
                                Capacity:
                                ${event.capacity}
                            </p>

                            <p>
                                Remaining:
                                ${remaining}
                            </p>

                            <p>
                                Status:
                                ${getEventStatus(event)}
                            </p>

                        </div>

                    `;

                })
                .join("")
            }

        </div>
    `;
}


/* =========================================================
   11. SETTINGS
   ========================================================= */


/*
   Load settings into the form.
*/

function loadSettings() {

    adminName.value =
        settings.adminName || "";

    theme.value =
        settings.theme || "light";

    currency.value =
        settings.currency || "usd";


    applyTheme();


    settingsContent.innerHTML = `

        <div class="settings-info">

            <p>
                ${
                    settings.adminName
                        ? `Welcome, ${settings.adminName}!`
                        : "Welcome to EventFlow."
                }
            </p>

        </div>
    `;
}


/*
   Apply selected theme.
*/
function applyTheme() {

    document.documentElement
        .setAttribute(
            "data-theme",
            settings.theme
        );
}


/*
   Save settings.
*/

settingsForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        settings.adminName =
            adminName.value.trim();

        settings.theme =
            theme.value;

        settings.currency =
            currency.value;


        saveData();

        applyTheme();

        loadSettings();

        renderEvents();

        renderTickets();

        updateReports();


        alert(
            "Settings saved successfully."
        );
    }
);


/* =========================================================
   12. EVENT LISTENERS
   ========================================================= */


/*
   Show event form.
*/

addEventButton.addEventListener(
    "click",
    showEventForm
);


/*
   Cancel event form.
*/

cancelEventButton.addEventListener(
    "click",
    function () {

        hideEventForm();
    }
);


/*
   Search events while typing.
*/

eventSearch.addEventListener(
    "input",
    renderEvents
);


/*
   Filter events.
*/

eventFilter.addEventListener(
    "change",
    renderEvents
);


/*
   Show participant form.
*/

addParticipantButton.addEventListener(
    "click",
    showParticipantForm
);


/*
   Search participants.
*/

participantSearch.addEventListener(
    "input",
    renderParticipants
);


/*
   Filter participants.
*/

participantFilter.addEventListener(
    "change",
    renderParticipants
);


/*
   Event selection for attendance.
*/

attendanceEvent.addEventListener(
    "change",
    renderAttendance
);


/*
   Attendance date selection.
*/

attendanceDate.addEventListener(
    "change",
    renderAttendance
);


/*
   Show ticket form.
*/

addTicketButton.addEventListener(
    "click",
    showTicketForm
);


/*
   Change selected ticket event.
*/

ticketEvent.addEventListener(
    "change",
    renderTickets
);


/* =========================================================
   13. UPDATE EVERYTHING
   ========================================================= */


function updateAll() {

    updateDashboard();

    updateReports();

    updateParticipantEventOptions();

    updateAttendanceEventOptions();

    updateTicketEventOptions();

    renderParticipants();

    renderAttendance();

    renderTickets();
}


/* =========================================================
   14. INITIALIZE APPLICATION
   ========================================================= */


/*
   Hide forms when the page first loads.
*/

hideEventForm();

hideParticipantForm();

hideTicketForm();


/*
   Set today's date for attendance.
*/

attendanceDate.value =
    new Date()
        .toISOString()
        .split("T")[0];


/*
   Load saved settings.
*/

loadSettings();


/*
   Render all application data.
*/

renderEvents();

updateAll();

function loadSettings() {
    const savedSettings = JSON.parse(
        localStorage.getItem("eventflow-settings")
    );
    settings = {
        adminName:"",
        theme: "light",
        currency: "usd",
        ...savedSettings
    };
    document.getElementById("admin-name").value =
    settings.adminName;
    document.getElementById("theme").value =
    settings.theme;
    document.getElementById("currency").value =
    settings.currency;
    applyTheme(settings.theme);
}