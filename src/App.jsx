import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import app from './firebase';

export default function App() {
  const [vin, setVin] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVin(params.get('vin') || '');
    setStock(params.get('stock') || '');
  }, []);

  return (
    <div className="p-6 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👋 Welcome to DrivePath</h1>
      <p className="mb-4 text-gray-700">Where you're in control of your experience.</p>
      <p className="mb-6 text-gray-700">
        If you would like a <strong>contactless test drive</strong>, all you'll need to do is upload a few items. A guest assistant will bring you the keys — and you'll be on your way.
      </p>

      <div className="space-y-4">
        <button
          onClick={() => window.location.href = `/upload?vin=${vin}&stock=${stock}`}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full"
        >
          🚗 Request a Test Drive
        </button>

        <button
          onClick={() => alert('Info request flow coming soon.')}
          className="bg-gray-300 text-black px-6 py-2 rounded w-full"
        >
          📩 Request Information
        </button>
      </div>
    </div>
  );
}
