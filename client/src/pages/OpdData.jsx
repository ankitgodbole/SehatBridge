import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const OpdData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const tableRef = useRef();

  // Fetch data on initial load
  useEffect(() => {
    axios.get('http://localhost:8080/api/opd/all')
      .then((response) => {
        console.log(response.data);  // Check the response structure
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching OPD data:', error);
        setError('Failed to load OPD data.');
        setLoading(false);
      });
  }, []);

  // Handle filtering logic
  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(term) ||
        entry.email.toLowerCase().includes(term) ||
        entry.department.toLowerCase().includes(term)
      );
    }

    if (startDate) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(endDate));
    }

    setFilteredData(filtered);
  }, [searchTerm, startDate, endDate, data]);

  // Download filtered data as Excel
  const downloadExcel = () => {
    if (!filteredData.length) return;

    // Log the filtered data to check if opdRegistrationNumber exists
    console.log(filteredData);  // Debugging

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OPD Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'opd_data.xlsx');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p className="text-center mt-[120px] text-lg font-semibold text-blue-600">Loading registered OPD data...</p>;
  if (error) return <p className="text-center mt-[120px] text-red-600 font-medium">{error}</p>;

  return (
    <div className="mt-[120px] px-6">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">Registered OPD Data</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search by name, email, or department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3"
        />
        <div className="flex space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Table */}
      <div ref={tableRef} className="overflow-x-auto shadow-xl rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
            <tr>
              <th className="w-[10%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">OPD Registration Number</th>
              <th className="w-[12%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Name</th>
              <th className="w-[16%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Email</th>
              <th className="w-[6%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Age</th>
              <th className="w-[8%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Gender</th>
              <th className="w-[12%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Contact</th>
              <th className="w-[14%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Department</th>
              <th className="w-[12%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Date</th>
              <th className="w-[20%] px-4 py-3 text-left text-sm font-bold text-indigo-900 border-b">Reason</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">No data available.</td>
              </tr>
            ) : (
              filteredData.map((entry, index) => (
                <tr key={index} className="hover:bg-indigo-50 transition-colors duration-200">
                  <td className="px-4 py-2 text-gray-800">
                    {entry.registrationId || 'N/A'} {/* Ensure fallback if data is missing */}
                  </td>
                  <td className="px-4 py-2 text-gray-800 break-words">{entry.name}</td>
                  <td className="px-4 py-2 text-gray-800 break-words">{entry.email}</td>
                  <td className="px-4 py-2 text-gray-800">{entry.age}</td>
                  <td className="px-4 py-2 text-gray-800">{entry.gender}</td>
                  <td className="px-4 py-2 text-gray-800">{entry.contact}</td>
                  <td className="px-4 py-2 text-gray-800">{entry.department}</td>
                  <td className="px-4 py-2 text-gray-800">{entry.date}</td>
                  <td className="px-4 py-2 text-gray-800 break-words">{entry.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons - Centered at the Bottom */}
      <div className="mt-6 flex justify-center space-x-4 mb-6">
        <button
          onClick={downloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow-md"
        >
          Download as Excel
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md"
        >
          Print Table
        </button>
      </div>
    </div>
  );
};

export default OpdData;
