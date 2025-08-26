import React, { useState } from "react";
import { useData } from "../hooks/useData";

export default function Purchases() {
  const { products, purchases, recordPurchase } = useData();
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState(1);
  const [cost, setCost] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    if (!productId || qty < 1 || cost < 0) return;
    recordPurchase({ productId, qty, cost });
    setQty(1);
    setCost(0);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Purchases</h2>

      <div className="bg-white border rounded-2xl p-4">
        <form onSubmit={submit} className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs">Product</label>
            <select className="w-full border rounded-xl px-3 py-2" value={productId} onChange={(e)=>setProductId(e.target.value)}>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs">Quantity</label>
            <input type="number" className="w-full border rounded-xl px-3 py-2" value={qty} min={1} onChange={(e)=>setQty(Number(e.target.value))}/>
          </div>
          <div>
            <label className="text-xs">Total Cost</label>
            <input type="number" step="0.01" className="w-full border rounded-xl px-3 py-2" value={cost} onChange={(e)=>setCost(Number(e.target.value))}/>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-2xl">Record Purchase</button>
          </div>
        </form>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Product</th>
              <th className="text-right p-3">Qty</th>
              <th className="text-right p-3">Cost</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purch) => {
              const product = products.find((pp)=>pp.id===purch.productId);
              return (
                <tr key={purch.id} className="border-t">
                  <td className="p-3">{new Date(purch.date).toLocaleString()}</td>
                  <td className="p-3">{product?.name || purch.productId}</td>
                  <td className="p-3 text-right">{purch.qty}</td>
                  <td className="p-3 text-right">${purch.cost.toFixed(2)}</td>
                </tr>
              );
            })}
            {purchases.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-gray-500">No purchases yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
