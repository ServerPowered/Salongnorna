// Globala variabler för aktuell månad och år
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Funktion för att generera kalendern
function generateCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    const dateInput = document.getElementById('date');
    const monthYearHeader = document.getElementById('month-year');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Nollställ tid för jämförelse

    // Sätt månad och år i headern
    const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
    monthYearHeader.textContent = `${monthNames[month]} ${year}`;

    // Rensa tidigare kalender
    calendar.innerHTML = '';

    // Hämta första och sista dagen i månaden
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Veckodag för första dagen i månaden (0-6, där måndag är 0)
    const startDay = (firstDay.getDay() + 6) % 7;

    // Lägg till veckodagar
    const weekdays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    for (let i = 0; i < weekdays.length; i++) {
        const weekdayCell = document.createElement('div');
        weekdayCell.classList.add('calendar-day', 'weekday');
        weekdayCell.textContent = weekdays[i];
        calendar.appendChild(weekdayCell);
    }

    // Fyll i tomma celler före första dagen
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'disabled');
        calendar.appendChild(emptyCell);
    }

    // Exempel på bokade datum (simulerad data)
    const bookedDates = [];

    // Markera de kommande tre dagarna som fullbokade
    for (let i = 0; i < 3; i++) {
        const fullBookedDate = new Date(today);
        fullBookedDate.setDate(today.getDate() + i);
        if (fullBookedDate.getMonth() === month && fullBookedDate.getFullYear() === year) {
            const dateString = fullBookedDate.toISOString().split('T')[0];
            bookedDates.push(dateString);
        }
    }

    // Generera dagar i månaden
    for (let date = 1; date <= lastDay.getDate(); date++) {
        const dateObj = new Date(year, month, date);
        dateObj.setHours(0, 0, 0, 0);
        const dateString = dateObj.toISOString().split('T')[0];
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = date;

        // Om datumet är tidigare än idag, inaktivera det
        if (dateObj < today) {
            dayCell.classList.add('disabled');
        }

        // Om datumet är fullbokat
        if (bookedDates.includes(dateString)) {
            dayCell.classList.add('fullbooked');
            dayCell.title = "Fullbokat";
        }

        // Klickhändelse för att välja datum
        if (!dayCell.classList.contains('disabled')) {
            dayCell.addEventListener('click', () => {
                // Ta bort tidigare markerat datum
                const selectedDay = document.querySelector('.calendar-day.selected');
                if (selectedDay) {
                    selectedDay.classList.remove('selected');
                }
                // Markera valt datum
                dayCell.classList.add('selected');
                // Sätt valt datum i det dolda inputfältet
                dateInput.value = dateString;
                // Uppdatera tillgängliga tider
                generateTimes();
            });
        }

        calendar.appendChild(dayCell);
    }
}

// Funktion för att generera tider baserat på valt datum
function generateTimes() {
    const timeSelect = document.getElementById('time');
    const dateInput = document.getElementById('date');
    const selectedDate = dateInput.value;

    // Rensa tidigare tider
    timeSelect.innerHTML = '';

    if (!selectedDate) {
        // Inget datum valt
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Välj datum först';
        timeSelect.appendChild(option);
        timeSelect.disabled = true;
        return;
    } else {
        timeSelect.disabled = false;
    }

    // Kontrollera om datumet är fullbokat
    const isFullBooked = document.querySelector(`.calendar-day.selected`).classList.contains('fullbooked');

    // Generera tider från 10:00 till 21:00
    for (let hour = 10; hour <= 21; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const option = document.createElement('option');
        option.value = time;

        // Lägg till " - Fullbokad" efter tiden om datumet är fullbokat
        if (isFullBooked) {
            option.textContent = `${time} - Fullbokad`;
        } else {
            // Lämna tiderna 16, 17, 20 och 21 obokade, resten kan vara bokade
            if ([16, 17, 20, 21].includes(hour)) {
                // Tider som oftast är lediga
                option.textContent = time;
            } else {
                // Slumpmässigt bestämma om tiden är bokad
                if (Math.random() > 0.5) {
                    option.textContent = `${time} - Fullbokad`;
                } else {
                    option.textContent = time;
                }
            }
        }

        timeSelect.appendChild(option);
    }
}

// Funktion för att beräkna totalpriset (du kan anpassa priserna här)
function calculateTotalPrice() {
    const massageTypeSelect = document.getElementById('massage-type');
    const durationSelect = document.getElementById('duration');
    const totalPriceInput = document.getElementById('total-price');

    // Exempel på priser (anpassa efter behov)
    const massagePrices = {
        'sensuell': 499,
        'tantra': 999
    };

    const durationPrices = {
        '30': 0,
        '60': 300,
        '90': 600
    };

    const massagePrice = massagePrices[massageTypeSelect.value];
    const durationPrice = durationPrices[durationSelect.value];

    const totalPrice = massagePrice + durationPrice;

    totalPriceInput.value = totalPrice + ' kr';
}

// Lägg till eventlyssnare
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar(currentMonth, currentYear);
    calculateTotalPrice();

    // Navigeringsknappar för kalendern
    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
});

document.getElementById('massage-type').addEventListener('change', () => {
    calculateTotalPrice();
});

document.getElementById('duration').addEventListener('change', () => {
    calculateTotalPrice();
});

// Hantera formulärets submit
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Hämta användarens val
    const massageType = document.getElementById('massage-type').value;
    const duration = document.getElementById('duration').value;

    // Mappning av kombinationer till länkar
    const linkMapping = {
        'sensuell_30': 'https://buymeacoffee.com/Estellesaad/e/314587',
        'sensuell_60': 'https://buymeacoffee.com/Estellesaad/e/314590',
        'sensuell_90': 'https://buymeacoffee.com/Estellesaad/e/314593',
        'tantra_30': 'https://buymeacoffee.com/Estellesaad/e/314588',
        'tantra_60': 'https://buymeacoffee.com/Estellesaad/e/314589',
        'tantra_90': 'https://buymeacoffee.com/Estellesaad/e/314592'
    };

    // Skapa nyckel för mappningen
    const key = `${massageType}_${duration}`;

    // Hämta länken baserat på nyckeln
    const redirectLink = linkMapping[key];

    if (redirectLink) {
        // Omdirigera användaren till länken
        window.location.href = redirectLink;
    } else {
        // Om kombinationen inte finns, visa ett felmeddelande
        alert('Kunde inte hitta rätt länk för din bokning. Vänligen försök igen.');
    }
});
