let BASE_URL;

if (window.location.hostname === 'localhost') {
  BASE_URL = 'http://localhost:8080';
} else {
  BASE_URL = 'https://medi-connect-f671.onrender.com';
}

const adjustUrl = (url) => {
  if (window.location.hostname !== 'localhost' && url.includes('localhost:8080')) {
    return url.replace('localhost:8080', 'https://medi-connect-f671.onrender.com');
  }
  return url;
};

export const databaseUrls = {
  auth: {
    login: adjustUrl(`${BASE_URL}/auth/login`),
    register: adjustUrl(`${BASE_URL}/auth/register`),
    profile: adjustUrl(`${BASE_URL}/auth/profile`),
    editProfile: adjustUrl(`${BASE_URL}/auth/profile/editprofile`),
    addDoctor: adjustUrl(`${BASE_URL}/auth/profile/adddoctor`),
  },
  hospitals: {
    all: adjustUrl(`${BASE_URL}/hospitalapi`),
    fromId: adjustUrl(`${BASE_URL}/hospitalapi/_id`),
    bookHospital: adjustUrl(`${BASE_URL}/hospitalapi/hospitals/_id/book`),
    appointments: adjustUrl(`${BASE_URL}/hospitalapi/appointments`),
    emergency: adjustUrl(`${BASE_URL}/hospitalapi/emergency`),
  },
  patient: {
    appointments: adjustUrl(`${BASE_URL}/patientapi/appointments`),
  },
};
