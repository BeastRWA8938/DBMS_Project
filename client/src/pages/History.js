import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

function History() {
  const [parkingSlots, setParkingSlots] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tableName = 'history';
        const rowResponse = await axios.post('http://localhost:8800/dbget', { tableName: tableName });
        setParkingSlots(rowResponse.data); // Assuming the response data is an object containing parking slots data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = dateTime => new Date(dateTime).toLocaleString();

  return (
    <div className='History'>
      <div className='slot-list'>
        {Object.keys(parkingSlots).map(slotNo => (
          <div key={slotNo} className='Hslot'>
            <p>Slot No: {parkingSlots[slotNo].slotNo}</p>
            <p>Name: {parkingSlots[slotNo].Name}</p>
            <p>Car No: {parkingSlots[slotNo].carNo}</p>
            <p>Contact No: {parkingSlots[slotNo].phoneNo}</p>
            <p>Entry Time: {formatDateTime(parkingSlots[slotNo].created_at)}</p>
            <p>Out Time: {formatDateTime(parkingSlots[slotNo].left_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
