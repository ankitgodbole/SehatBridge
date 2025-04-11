import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../store/userContext';
import '../styles/HospitalPanal.css';
import { databaseUrls } from '../data/databaseUrls';

const HospitalAppointments = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${databaseUrls.hospitals.appointments}/${user._id}`);
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setError('Unable to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    if (user && isAuthenticated) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${databaseUrls.hospitals.appointments}/${id}`);
        setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
        alert('Appointment deleted successfully!');
      } catch (err) {
        console.error('Failed to delete appointment:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="error-message">
        Please log in to view your appointments.
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointment-container">
      <h1 className="title">Hospital Appointments</h1>
      <div className="appointment-list">
        {appointments.length > 0 ? (
          appointments.map((appointment) => {
            const { _id, reason, date, status, userId } = appointment;
            return (
              <div key={_id} className="appointment-card">
                <div className="card-content">
                  <h3 className="appointment-reason">{reason}</h3>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`status ${status}`}>{status}</span>
                  </p>
                  {userId && (
                    <>
                      <p>
                        <strong>Patient Name:</strong> {userId.name}
                      </p>
                      <p>
                        <strong>Patient Email:</strong> {userId.email}
                      </p>
                    </>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    className="delete-button"
                    onClick={() => deleteAppointment(_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-appointments">No appointments available.</div>
        )}
      </div>
    </div>
  );
};

export default HospitalAppointments;
