import React, { useEffect, useRef, useState } from 'react';
import { FileSpreadsheet, Upload, X, AlertCircle } from 'lucide-react';

const panelBg = '#111827';
const innerBg = '#0b0f19';

export default function ImportModal({ onClose, onExcelImport, onCsvImport }) {
  const [mode, setMode] = useState('excel');
  const [excelFile, setExcelFile] = useState(null);
  const [brokerFile, setBrokerFile] = useState(null);
  const [cmpFile, setCmpFile] = useState(null);
  const [useTestPrices, setUseTestPrices] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const busyRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Keep keyboard focus inside the modal and restore it after closing.
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!busyRef.current) onCloseRef.current();
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), [tabindex="0"]'
      )].filter((node) => node.getClientRects().length > 0);
      if (!items.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!dialogRef.current.contains(document.activeElement) || document.activeElement === dialogRef.current) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  const close = () => {
    if (!busyRef.current) onClose();
  };

  const selectFile = (event, extension, setter) => {
    const file = event.target.files?.[0] || null;
    setError('');
    if (file && !file.name.toLowerCase().endsWith(extension)) {
      setter(null);
      event.target.value = '';
      setError(`Choose a valid ${extension} file.`);
      return;
    }
    setter(file);
  };

  const switchMode = () => {
    if (busyRef.current) return;
    setMode((current) => current === 'excel' ? 'csv' : 'excel');
    setExcelFile(null);
    setBrokerFile(null);
    setCmpFile(null);
    setUseTestPrices(false);
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busyRef.current) return;
    if (mode === 'excel' && !excelFile) {
      setError('Select your Groww order history workbook first.');
      return;
    }
    if (mode === 'csv' && (!brokerFile || !cmpFile)) {
      setError('Select both CSV files for the optional legacy import.');
      return;
    }
    busyRef.current = true;
    setBusy(true);
    setError('');
    try {
      if (mode === 'excel') {
        await onExcelImport(excelFile, { useTestPrices });
      } else {
        const [brokerText, cmpText] = await Promise.all([brokerFile.text(), cmpFile.text()]);
        await onCsvImport(brokerText, cmpText, brokerFile.name, cmpFile.name);
      }
    } catch (err) {
      setError(err?.message || 'Import failed. Check the report and try again.');
      busyRef.current = false;
      setBusy(false);
      return;
    }
    busyRef.current = false;
    onCloseRef.current();
  };

  return (
    <div className="d-flex align-items-center justify-content-center p-3" style={{
      position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(3, 7, 18, 0.78)',
      backdropFilter: 'blur(4px)', overflowY: 'auto'
    }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="tl-import-title"
        tabIndex={-1} aria-busy={busy} className="card rounded-4 border-secondary shadow-lg text-light w-100"
        style={{ maxWidth: 560, maxHeight: 'calc(100dvh - 2rem)', overflowY: 'auto', backgroundColor: panelBg }}>
        <div className="card-header border-secondary d-flex align-items-center justify-content-between gap-3 p-4" style={{ backgroundColor: '#0d1322' }}>
          <div className="d-flex align-items-center gap-3">
            <span className="p-2 rounded-3 border border-success bg-success bg-opacity-10 text-success"><FileSpreadsheet size={22} /></span>
            <div>
              <h2 id="tl-import-title" className="h5 fw-bold mb-1">Import trade data</h2>
              <p className="small text-secondary mb-0">{mode === 'excel' ? 'Groww order history' : 'Legacy CSV import'}</p>
            </div>
          </div>
          <button ref={closeRef} type="button" className="btn btn-outline-secondary btn-sm" aria-label="Close import dialog" disabled={busy} onClick={close}><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="card-body p-4">
          {mode === 'excel' ? (
            <>
              <div className="rounded-3 border border-secondary p-3 mb-3" style={{ backgroundColor: innerBg }}>
                <label htmlFor="tl-groww-file" className="form-label fw-semibold">Groww order history (.xlsx)</label>
                <input id="tl-groww-file" type="file" accept=".xlsx" disabled={busy}
                  className="form-control bg-dark text-light border-secondary"
                  onChange={(event) => selectFile(event, '.xlsx', setExcelFile)} />
                <div className="small text-secondary mt-2">Use the original Groww order history workbook, including its headings. No CMP CSV is needed.</div>
              </div>
              <div className="rounded-3 border border-secondary p-3 mb-3" style={{ backgroundColor: innerBg }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                  <span className="fw-semibold small">Market prices</span>
                  <span className="badge bg-secondary">API not connected</span>
                </div>
                <p className="small text-secondary mb-3">Realized P&amp;L and trade history use your report. Until the market API is connected, CMP and dependent metrics will show N/A where unavailable.</p>
                <div className="form-check">
                  <input id="tl-test-prices" className="form-check-input" type="checkbox" checked={useTestPrices}
                    disabled={busy} onChange={(event) => setUseTestPrices(event.target.checked)} />
                  <label htmlFor="tl-test-prices" className="form-check-label small text-warning">Use fictional CMP values for UI testing only</label>
                </div>
                {useTestPrices && <p className="small text-warning mt-2 mb-0">Test prices are not market quotes. Do not use them for financial decisions.</p>}
              </div>
            </>
          ) : (
            <div className="rounded-3 border border-secondary p-3 mb-3" style={{ backgroundColor: innerBg }}>
              <label htmlFor="tl-broker-csv" className="form-label fw-semibold">Custom broker CSV</label>
              <input id="tl-broker-csv" type="file" accept=".csv" disabled={busy} className="form-control bg-dark text-light border-secondary mb-3"
                onChange={(event) => selectFile(event, '.csv', setBrokerFile)} />
              <label htmlFor="tl-cmp-csv" className="form-label fw-semibold">Custom CMP CSV</label>
              <input id="tl-cmp-csv" type="file" accept=".csv" disabled={busy} className="form-control bg-dark text-light border-secondary"
                onChange={(event) => selectFile(event, '.csv', setCmpFile)} />
              <p className="small text-secondary mt-2 mb-0">Only for the existing paired-trade CSV format. These prices are not live market quotes.</p>
            </div>
          )}

          <button type="button" className="btn btn-link text-info text-decoration-none p-0 small mb-3" onClick={switchMode} disabled={busy}>
            {mode === 'excel' ? 'Optional: use legacy CSV files instead' : 'Back to Groww Excel import'}
          </button>
          {error && <div className="alert alert-danger py-2 px-3 d-flex align-items-start gap-2 small" role="alert"><AlertCircle size={17} className="flex-shrink-0 mt-1" /><span>{error}</span></div>}
          {busy && <p className="small text-info" role="status">Reading and validating your report…</p>}
          <p className="small text-secondary mb-3">Files are processed in your browser. A successful import replaces the current dashboard data; a failed import leaves it unchanged.</p>
          <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary">
            <button type="button" className="btn btn-outline-secondary" disabled={busy} onClick={close}>Cancel</button>
            <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={busy || (mode === 'excel' ? !excelFile : !brokerFile || !cmpFile)}>
              {busy ? <span className="spinner-border spinner-border-sm" aria-hidden="true" /> : <Upload size={17} />}
              {busy ? 'Importing…' : 'Import data'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
