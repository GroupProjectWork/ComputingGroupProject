import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    time: '',
    date: '',
    description: '',
    image: null, // Initialize image state to null
    clubName: '' // Initialize club name state
  });

   const clubNames = ['FOSS', 'IEEE', 'CSSL', 'ISACA'];// State to hold club names

  useEffect(() => {
    // Fetch club names from the database when component mounts
    const database = getDatabase();
    const clubNamesRef = ref(database, 'clubNames');
    get(clubNamesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const clubNamesData = snapshot.val();
          const clubNamesList = Object.keys(clubNamesData).map((key) => clubNamesData[key]);
          setClubNames(clubNamesList);
        }
      })
      .catch((error) => {
        console.error('Error fetching club names: ', error);
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, image: e.target.files[0] }); // Store the selected file
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!"); // Check if form submission is triggered
  
    const database = getDatabase();
    const storage = getStorage();
  
    const imagesRef = storageRef(storage, 'images/' + formData.image.name);
  
    uploadBytes(imagesRef, formData.image)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((imageUrl) => {
        return push(ref(database, 'events'), {
          eventName: formData.eventName,
          time: formData.time,
          date: formData.date,
          description: formData.description,
          imageUrl: imageUrl,
          clubName: formData.clubName
        });
      })
      .then(() => {
        console.log('Data successfully submitted!');
        setFormData({ eventName: '', time: '', date: '', description: '', image: null, clubName: '' });
      })
      .catch((error) => {
        console.error('Error submitting data: ', error);
      });
  };

  return (
    <div
      style={{
        backgroundImage: `url("https://www.nsbm.ac.lk/wp-content/uploads/2021/08/About-Tab-1.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      className="min-h-screen flex flex-col justify-center py-8"
    >
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg mx-auto max-w-md md:max-w-4xl m-20">
        <h1 className="text-2xl md:text-4xl font-bold text-green-800 mb-6 text-center">Add an Event</h1>
        
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              id="eventName" 
              value={formData.eventName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
              style={{ width: '100%', height: '62.5px', fontSize: '1.5rem', maxWidth: '100%' }}
              placeholder="Enter event name"
              required
            />
          </div>
          <div>
          <label htmlFor="clubName" class="m-3">Club Name</label>
          <select
            id="clubName"
            value={formData.clubName}
            onChange={handleChange}
            required
          >
            <option value="">Select Club</option>
            {clubNames.map((clubName, index) => (
              <option key={index} value={clubName}>{clubName}</option>
            ))}
          </select>
        </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              id="time"  
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
              style={{ width: '100%', height: '62.5px', fontSize: '1.5rem', maxWidth: '100%' }}
              placeholder="Enter event time"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"  
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
              style={{ width: '100%', height: '62.5px', fontSize: '1.5rem', maxWidth: '100%' }}
              placeholder="Enter event date"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
              style={{ width: '100%', height: '187.5px', fontSize: '1.5rem', maxWidth: '100%' }}
              placeholder="Enter event description"
            ></textarea>
          </div>
          <div>
          <label htmlFor="image"class = "m-3" >Image</label>
          <input
            type="file"
            id="image"  
            onChange={handleChange}
            accept="image/*" // Limit to only image files
            required
          />
        </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Add Event
          </button>
        </form>

      </div>
    </div>
  );
}

export default CreateListing;