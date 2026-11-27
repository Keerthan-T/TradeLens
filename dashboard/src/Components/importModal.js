import React, { useState } from 'react';
import { Upload, X, FileSpreadsheet, FileText } from 'lucide-react';

export default function ImportModal({ onClose, onImport }) {

  const [brokerText, setBrokerText] = useState('');
  const [cmpText, setCmpText] = useState('');

  const [brokerName, setBrokerName] = useState('');
  const [cmpName, setCmpName] = useState('');

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Read uploaded CSV file
  const handleFile = async (e, setText, setName) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }

    try {
      const text = await file.text();

      if (!text.trim()) {
        setError('The uploaded file is empty.');
        return;
      }

      setText(text);
      setName(file.name);
      setError('');

    } catch {
      setError('Unable to read the file.');
    }
  };


  // Submit both CSV files to App
  const handleSubmit = () => {

    if (!brokerText || !cmpText) {
      setError('Please upload both CSV files.');
      return;
    }

    try {
      onImport(
        brokerText,
        cmpText,
        brokerName,
        cmpName
      );

    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1050,
        backdropFilter: 'blur(5px)'
      }}
    >

      <div
        className="card border-secondary rounded-4 shadow-lg p-4 w-100"
        style={{
          maxWidth: '600px',
          backgroundColor: '#111827',
          color: '#f1f5f9',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >

        {/* Modal Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h5 className="fw-bold mb-0">
            Import Trade Data
          </h5>

          <button
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </div>


        {/* Step Buttons */}

        <div className="row g-2 mb-4">

          <div className="col-6">

            <button
              className={`btn w-100 ${
                step === 1
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setStep(1)}
            >
              <FileSpreadsheet size={16} />
              {' '}Broker CSV
            </button>

          </div>

          <div className="col-6">

            <button
              className={`btn w-100 ${
                step === 2
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setStep(2)}
            >
              <FileText size={16} />
              {' '}CMP CSV
            </button>

          </div>

        </div>


        {/* Broker CSV */}

        {step === 1 && (

          <div>

            <div className="border border-secondary rounded-3 p-4 text-center mb-3">

              <Upload size={32} className="text-primary mb-3" />

              <h6>Upload Broker Trade History</h6>

              <input
                type="file"
                accept=".csv"
                className="form-control mt-3"
                onChange={(e) =>
                  handleFile(
                    e,
                    setBrokerText,
                    setBrokerName
                  )
                }
              />

              <p className="small text-success mt-2 mb-0">
                {brokerName}
              </p>

            </div>

            <textarea
              className="form-control bg-dark text-light font-monospace"
              rows={5}
              value={brokerText}
              readOnly
              placeholder="CSV preview"
            />

          </div>

        )}


        {/* CMP CSV */}

        {step === 2 && (

          <div>

            <div className="border border-secondary rounded-3 p-4 text-center mb-3">

              <Upload size={32} className="text-success mb-3" />

              <h6>Upload Current Market Prices</h6>

              <input
                type="file"
                accept=".csv"
                className="form-control mt-3"
                onChange={(e) =>
                  handleFile(
                    e,
                    setCmpText,
                    setCmpName
                  )
                }
              />

              <p className="small text-success mt-2 mb-0">
                {cmpName}
              </p>

            </div>

            <textarea
              className="form-control bg-dark text-light font-monospace"
              rows={5}
              value={cmpText}
              readOnly
              placeholder="CMP CSV preview"
            />

          </div>

        )}


        {/* Error Message */}

        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}


        {/* Bottom Buttons */}

        <div className="d-flex justify-content-between mt-4">

          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              step === 1 ? onClose() : setStep(1)
            }
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step === 1 ? (

            <button
              className="btn btn-primary"
              disabled={!brokerText}
              onClick={() => setStep(2)}
            >
              Next
            </button>

          ) : (

            <button
              className="btn btn-success"
              disabled={!brokerText || !cmpText}
              onClick={handleSubmit}
            >
              Process & Build Analytics
            </button>

          )}

        </div>

      </div>

    </div>
  );
}