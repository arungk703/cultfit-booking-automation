require('dotenv').config();
const axios = require('axios');

// Constants
const API_URL = 'https://www.cult.fit/api/cult/classes';

const headers = {
    'apikey': process.env.API_KEY,
    'st': process.env.ST,
    'at': process.env.AT
};

const params = {
    center: '119',
    productType: 'FITNESS',
    pageType: 'classbooking',
    workoutId: '69',
    pageFrom: 'workoutPage'
};

async function fetchAndBook() {
    try {
        console.log("Inside fetch");
        const response = await axios.get(API_URL, {
            headers,
            params,
        }); 
        const data = response.data;
        const dateList = data?.classByDateList;
        if (!dateList || dateList.length === 0) throw new Error('No classByDateList found');

        const lastDay = dateList[dateList.length - 1];
        const timeList = lastDay.classByTimeList;

        if (!timeList || timeList.length < 4) throw new Error('Less than 4 sessions found');

        const classToBook = timeList[3];
        const classId = classToBook.classes[0].id;

        console.log(`Booking class ID: ${classId}`);

        // Step 2: Book class
        const BOOKING_URL = `https://www.cult.fit/api/cult/class/${classId}/book`;

        const bookingResponse = await axios.post(BOOKING_URL, {}, { headers });

        console.log('Booking response:', bookingResponse.data);
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

fetchAndBook();
