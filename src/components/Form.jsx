import React, { useState } from 'react';
import './form.css'; // Import the CSS file

const Form = ({ visible, onClose, personData, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: personData.first_name || '',
    middle_name: personData.middle_name || '',
    last_name: personData.last_name || '',
    surname_at_birth: personData.surname_at_birth || '',
    gender: personData.gender || '',
    is_living: personData.is_living || 'living',
    day_of_birth: personData.day_of_birth || '',
    month_of_birth: personData.month_of_birth || '',
    year_of_birth: personData.year_of_birth || '',
    place_of_birth: personData.place_of_birth || '',
    day_of_death: personData.day_of_death || '',
    month_of_death: personData.month_of_death || '',
    year_of_death: personData.year_of_death || '',
    place_of_death: personData.place_of_death || '',
    photo: personData.photo || '',
    notes: personData.notes || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className={`sliding-form ${visible ? 'visible' : ''}`}>
      <button onClick={onClose}>Close</button>
      <form onSubmit={handleSubmit}>
        {/* Photo section at the top */}
        <div className="photo-container">
          <div className="photo-icon">
            {formData.photo ? (
              <img src={formData.photo} alt="Profile" />
            ) : (
              <span>No Photo</span>
            )}
            <button
              className="change-photo-button"
              onClick={triggerFileInput}
              type="button"
            >
              +
            </button>
          </div>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Middle Name (optional):</label>
          <input
            type="text"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Surname at Birth:</label>
          <input
            type="text"
            name="surname_at_birth"
            value={formData.surname_at_birth}
            onChange={handleInputChange}
          />
        </div>
        <div className='select-fields'>
          <div className='gender-field'> 
            <label>Gender (optional):</label>
            <select
              className='selectors'
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className='is-living-field'>
            <label>Living/Deceased:</label>
            <select
              className='selectors'
              name="is_living"
              value={formData.is_living}
              onChange={handleInputChange}
            >
              <option value="living">Living</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>
        </div>
        <div className="inline-fields">
          <div className='dob-field'>
            <label>Date of Birth:</label>
            <div className='date-columns'>
              <div className='day-field'>
                <input
                  type="text"
                  name="day_of_birth"
                  placeholder='DD'
                  value={formData.day_of_birth}
                  onChange={handleInputChange}
                />
              </div>
              <div className='month-field'>
                <input
                  type="text"
                  name="month_of_birth"
                  placeholder='MM'
                  value={formData.month_of_birth}
                  onChange={handleInputChange}
                />
              </div>
              <div className='year-field'>
                <input
                  type="text"
                  name="year_of_birth"
                  placeholder='YYYY'
                  value={formData.year_of_birth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="wide-input">
            <label>Place of Birth:</label>
            <input
              className='place-birth-death'
              type="text"
              name="place_of_birth"
              value={formData.place_of_birth}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {formData.is_living === 'deceased' && (
          <>
            <div className="inline-fields">
              <div className='dod-field'>
                <label>Date of Death:</label>
                <div className='date-columns'>
                  <div className='day-field'>
                    <input
                      type="text"
                      name="day_of_death"
                      placeholder='DD'
                      value={formData.day_of_death}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='month-field'>
                    <input
                      type="text"
                      name="month_of_death"
                      placeholder='MM'
                      value={formData.month_of_death}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='year-field'>
                    <input
                      type="text"
                      name="year_of_death"
                      placeholder='YYYY'
                      value={formData.year_of_death}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="wide-input">
                <label>Place of Death:</label>
                <input
                  type="text"
                  name="place_of_death"
                  value={formData.place_of_death}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        )}
        <div>
          <label>Other information:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Form;