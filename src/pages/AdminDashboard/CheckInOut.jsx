import React from 'react';
import { ShopContext } from '../../context/ShopContext';
export default function CheckInOut() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Check-In / Check-Out Log</h2>
      <p className="text-sm text-gray-500 mb-6">Monitor shift timing logs, attendance tracking, or device routing states.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <span className="text-xs font-bold uppercase text-green-800 tracking-wider">Active Check-Ins</span>
          <p className="text-2xl font-bold text-green-900 mt-1">14</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Completed Shifts</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">42</p>
        </div>
      </div>
    </div>
  );
}