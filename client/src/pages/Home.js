import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [parkingSlots, setParkingSlots] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/getTables');
            const { data } = response;

        await Promise.all(data.map(async (tableName) => {
          const tableResponse = await axios.post('http://localhost:8800/dbget', {tableName: tableName});
          const slotsData = processData(tableResponse.data, tableName);
          setParkingSlots(prevState => ({ ...prevState, ...slotsData }));
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processData = (data, tableName) => {
    const tableData = {};
  
    data.forEach(item => {
      const { slotNo, Name, phoneNo, carNo, created_at, State } = item;

      const slotData = {
        State: State,
        Name: Name,
        ContactNo: phoneNo,
        CarNo: carNo,
        EntryTime: created_at,
      };
  
      tableData[slotNo] = slotData;
    });
  
    return { [tableName]: tableData };
  };

  const handleSlotClick = async (tableName, slotNo) => {
    try {
      var a = parkingSlots[tableName][slotNo].EntryTime.replace('T', ' ')
      var a = a.replace('Z', '')
      console.log(a)
      const clickedSlot = {
        tableName: tableName,
        slotNo: slotNo,
        Name: parkingSlots[tableName][slotNo].Name,
        phoneNo: parkingSlots[tableName][slotNo].ContactNo,
        State: parkingSlots[tableName][slotNo].State,
        EntryTime: a,
        carNo: parkingSlots[tableName][slotNo].CarNo
      }

      console.log(clickedSlot)

      await axios.post('http://localhost:8800/dbmovhis',clickedSlot);

      await axios.post('http://localhost:8800/dbfree', {
        tableName: tableName,
        slotNo: slotNo,
        Name : null,
        phoneNo:null,
        carNo:null,
        State: 1,
      });
      
      const updatedSlots = { ...parkingSlots };
      updatedSlots[tableName][slotNo].State = 1;
      updatedSlots[tableName][slotNo].Name = null;
      updatedSlots[tableName][slotNo].ContactNo = null;
      updatedSlots[tableName][slotNo].CarNo = null;
      // updatedSlots[tableName][slotNo].EntryTime = null;
      setParkingSlots(updatedSlots);
    } catch (error) {
      console.error('Error updating slot state:', error);
    }
  };

  return (
    <div className='parking-spaces'>
      {Object.keys(parkingSlots).map((tableName) => (
        <div key={tableName} className='floor'>
          <h1>Floor {tableName}</h1>
          <div className='singlefloor'>
            {Object.keys(parkingSlots[tableName]).map((slotNo) => (
              <div key={slotNo} className={parkingSlots[tableName][slotNo].State ? 'slot occupied' : 'slot unoccupied'}>
                <p><span>Slot: </span>{slotNo}</p>
                <p><span>Name: </span>{parkingSlots[tableName][slotNo].Name}</p>
                <p><span>Contact No: </span>{parkingSlots[tableName][slotNo].ContactNo}</p>
                <p><span>Car No: </span>{parkingSlots[tableName][slotNo].CarNo}</p>
                <p><span>Entry Time: </span>{parkingSlots[tableName][slotNo].State ? "" : Date(parkingSlots[tableName][slotNo].EntryTime)}</p>
                {parkingSlots[tableName][slotNo].State ? "" : <button className='occupied-button' onClick={() => handleSlotClick(tableName, slotNo)}>Free</button> }
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
