import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

export default function Orders() {
  const { orders } = useContext(ShopContext);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/30">
        <h3 className="font-bold text-gray-800 text-sm">Historical Transaction User</h3>
      </div>
      <div className="overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 font-semibold border-b border-gray-100 uppercase tracking-wider text-[10px]"><th className="px-5 py-3">Order Token</th><th className="px-5 py-3">Buyer Name</th><th className="px-5 py-3">Timestamp</th><th className="px-5 py-3">Invoiced Value</th><th className="px-5 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50/40 transition">
                <td className="px-5 py-3 font-mono text-indigo-600 font-bold">{order.id}</td>
                <td className="px-5 py-3 text-gray-900">{order.customer}</td>
                <td className="px-5 py-3 text-gray-400">{order.date}</td>
                <td className="px-5 py-3 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}