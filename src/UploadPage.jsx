import React, { useState, useEffect } from 'react';

export default function UploadPage() {
  const [vin, setVin] = useState('');
  const [stock, setStock] = useState('');
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [insuranceUploaded, setInsuranceUploaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVin(params.get('vin') || '');
    setStock(params.get('stock') || '');
  }, []);

  const handleUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (type === 'id') setIdUploaded(true);
      if (type === 'selfie') setSelfieUploaded(true);
      if (type === 'insurance') setInsuranceUploaded(true);
    };
    input.click();
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-left">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Required Items</h1>
      <p className="mb-4 text-gray-700 text-center">
        To complete your contactless test drive request, please upload the following. If you don't have a physical copy, you may upload a file or screenshot.
      </p>

      <div className="space-y-4">
        <div>
          <button
            onClick={() => handleUpload('id')}
            className="bg-gray-200 px-4 py-2 rounded w-full text-left"
          >
            {idUploaded ? '✔ ID Uploaded' : 'Upload Driver’s License or State ID'}
          </button>
        </div>

        <div>
          <button
            onClick={() => handleUpload('selfie')}
            className="bg-gray-200 px-4 py-2 rounded w-full text-left"
          >
            {selfieUploaded ? '✔ Selfie Uploaded' : 'Upload Selfie'}
          </button>
        </div>

        <div>
          <button
            onClick={() => handleUpload('insurance')}
            className="bg-gray-200 px-4 py-2 rounded w-full text-left"
          >
            {insuranceUploaded ? '✔ Insurance Uploaded' : 'Upload Insurance Card'}
          </button>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-600 border-t pt-4">
        By submitting, you acknowledge that your information will be securely shared with the dealership for the purpose of verifying your identity and insurance coverage. No information will be stored or used beyond this transaction.
      </div>
    </div>
  );
}
