import React, { useMemo, useState } from "react";
import { useData } from "../hooks/useData";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Products() {
  const { products, categories, suppliers, addProduct, updateProduct, deleteProduct } = useData();
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ id: "", name: "", category: categories[0], supplier: suppliers[0], stock: 0, price: 0 });

  const filtered = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())),
    [products, q]
  );

  const startAdd = () => setForm({ id: `P-${Math.floor(Math.random()*9000+1000)}`, name: "", category: categories[0], supplier: suppliers[0], stock: 0, price: 0 });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const exists = products.some(p => p.id === form.id);
    exists ? updateProduct(form.id, form) : addProduct(form);
    startAdd();
  };

  const edit = (p) => setForm(p);
  const remove = (id) => deleteProduct(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-2">
          <input
            className="w-64 rounded-xl border px-3 py-2"
            placeholder="Search by name or ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={startAdd} className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2">
            <Plus size={16}/> New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Supplier</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-right p-3">Price</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.supplier}</td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3 text-right">${p.price.toFixed(2)}</td>
                <td className="p-3 text-right">
                  <button onClick={() => edit(p)} className="inline-flex items-center gap-1 px-2 py-1 rounded-xl border mr-2"><Pencil size={14}/>Edit</button>
                  <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded-xl border text-red-600"><Trash2 size={14}/>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="p-6 text-center text-gray-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div className="bg-white border rounded-2xl p-4">
        <h3 className="font-medium mb-3">{products.some(p => p.id === form.id) ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={submit} className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs">ID</label>
            <input value={form.id} onChange={(e)=>setForm({...form,id:e.target.value})} className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="text-xs">Name</label>
            <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="text-xs">Category</label>
            <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="w-full border rounded-xl px-3 py-2">
              {categories.map(c=> <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs">Supplier</label>
            <select value={form.supplier} onChange={(e)=>setForm({...form,supplier:e.target.value})} className="w-full border rounded-xl px-3 py-2">
              {suppliers.map(s=> <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs">Stock</label>
            <input type="number" value={form.stock} onChange={(e)=>setForm({...form,stock:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="text-xs">Price</label>
            <input type="number" step="0.01" value={form.price} onChange={(e)=>setForm({...form,price:Number(e.target.value)})} className="w-full border rounded-xl px-3 py-2" />
          </div>
          <div className="md:col-span-3">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-2xl">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
