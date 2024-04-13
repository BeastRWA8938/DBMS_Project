import React, { useState,useEffect } from 'react';
import './Entry.css';
import axios from 'axios'; // Add axios for making HTTP requests

function Entry() {
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
  
      // Parse the created_at datetime string into a Date object
      // const entryTime = new Date(created_at);
  
      const slotData = {
        State: State,
        Name: Name,
        ContactNo: phoneNo,
        CarNo: carNo,
        EntryTime: created_at, // Use the parsed Date object
      };
  
      tableData[slotNo] = slotData;
    });
  
    return { [tableName]: tableData };
  };
  
  
  const [formData, setFormData] = useState({
    slot: '',
    name: '',
    contactNo: '',
    carNo: '',
    timestamp: '',
  });
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure formData.slot is properly set with the selected slot
      if (!selectedSlot) {
        console.error('Please select a slot.');
        return;
      }

      // Make HTTP request to insert data into the database
      const change = {
        tableName: selectedSlot[0], // Adjust if needed
        slotNo: selectedSlot,
        Name: formData.name,
        phoneNo: formData.contactNo,
        carNo: formData.carNo,
        State: 0, // Assuming State is always true for entry
      }
      console.log(change)
      await axios.post('http://localhost:8800/dbupdate', change);

      // Reset form data
      setFormData({
        slot: '',
        name: '',
        contactNo: '',
        carNo: '',
        timestamp: '',
      });

      // Log success message
      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSlotChange = (e) => {
    const slot = e.target.value;
    setSelectedSlot(slot);
  };

  return (
    <div className='entryMain'>
      <h2>Entry Form</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="slot">Slot:</label>
          <select id="slot" name="slot" value={`${selectedSlot}`} onChange={handleSlotChange}>
            <option value="">Select Slot</option>
            {Object.keys(parkingSlots).map((floor) =>
              Object.keys(parkingSlots[floor]).map((slot) => {
                const slotData = parkingSlots[floor][slot];
                // Check if the slot is available (State is false)
                if (slotData.State) {
                  return <option key={slot} value={`${slot}`}>{`${slot}`}</option>;
                }
                return null; // Return null if the slot is occupied
              })
            )}
          </select>
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="contactNo">Contact No:</label>
          <input type="text" id="contactNo" name="contactNo" value={formData.contactNo} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="carNo">Car No:</label>
          <input type="text" id="carNo" name="carNo" value={formData.carNo} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="timestamp">Timestamp:</label>
          <input type="datetime-local" id="timestamp" name="timestamp" value={formData.timestamp} onChange={handleInputChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Entry;
