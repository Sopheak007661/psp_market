import React from 'react';
import { ShopContext } from '../../context/ShopContext';
export default function EvaluatePerformance() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Performance Evaluation</h2>
      <p className="text-sm text-gray-500 mb-6">Assess system logs, process efficiency rates, and optimization parameters.</p>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-700 text-sm">System Process Efficiency</p>
            <p className="text-xs text-gray-400">Target score: greater than 90%</p>
          </div>
          <span className="text-lg font-bold text-blue-600">94.2%</span>
        </div>
      </div>
    </div>
  );
}