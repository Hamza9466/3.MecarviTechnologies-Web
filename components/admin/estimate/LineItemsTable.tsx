"use client";

import React from "react";

export type LineItem = {
  id: string;
  item: string;
  description: string;
  qty: number;
  unitPrice: number;
  taxType: string;
};

type Props = {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
};

export default function LineItemsTable({ items, onChange }: Props) {
  const updateItem = (id: string, patch: Partial<LineItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-end">
      <div className="col-span-3">
        <label className="block text-xs text-gray-500 mb-1">Item</label>
        <input
          className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
          value={items[0]?.item || ""}
          onChange={(e) => updateItem(items[0].id, { item: e.target.value })}
        />
      </div>

      <div className="col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <input
          className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
          value={items[0]?.description || ""}
          onChange={(e) => updateItem(items[0].id, { description: e.target.value })}
        />
      </div>

      <div className="col-span-1">
        <label className="block text-xs text-gray-500 mb-1">Qty</label>
        <input
          type="number"
          className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
          value={items[0]?.qty ?? 0}
          onChange={(e) => updateItem(items[0].id, { qty: Number(e.target.value) })}
        />
      </div>

      <div className="col-span-1">
        <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
        <input
          type="number"
          className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900"
          value={items[0]?.unitPrice ?? 0}
          onChange={(e) => updateItem(items[0].id, { unitPrice: Number(e.target.value) })}
        />
      </div>

      <div className="col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Tax Type</label>
        <select
          className="w-full h-9 px-3 border border-gray-300 rounded-sm text-sm text-gray-900 bg-white"
          value={items[0]?.taxType || ""}
          onChange={(e) => updateItem(items[0].id, { taxType: e.target.value })}
        >
          <option value="">Tax Type</option>
          <option value="none">None</option>
          <option value="vat">VAT</option>
        </select>
      </div>

      <div className="col-span-1">
        <label className="block text-xs text-gray-500 mb-1">Tax Rate</label>
        <input
          disabled
          className="w-full h-9 px-3 border border-gray-200 bg-gray-100 rounded-sm text-sm text-gray-900"
          value={0}
        />
      </div>

      <div className="col-span-1">
        <label className="block text-xs text-gray-500 mb-1">Sub Total</label>
        <input
          disabled
          className="w-full h-9 px-3 border border-gray-200 bg-gray-100 rounded-sm text-sm text-gray-900"
          value={(items[0]?.qty ?? 0) * (items[0]?.unitPrice ?? 0)}
        />
      </div>
    </div>
  );
}
