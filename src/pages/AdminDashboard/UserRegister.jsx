import React from 'react';

export default function UserRegister() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-2">User Registration Records</h2>
      <p className="text-sm text-gray-500 mb-6">View and manage registered user accounts and membership profiles.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 font-medium">
              <th className="pb-3">User ID</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y divide-gray-100">
            <tr>
              <td className="py-3 font-mono text-xs">#USR-9021</td>
              <td className="py-3">Phy Sopheak</td>
              <td className="py-3">Admin</td>
              <td className="py-3"><span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}