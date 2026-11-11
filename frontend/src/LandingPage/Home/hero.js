import React from 'react';

function Hero() {
  return (
    <section id="overview" className="bg-dark text-white py-5">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-xl-8">

            {/* <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4 rounded-pill border border-secondary bg-black bg-opacity-50">
              <span className="spinner-grow spinner-grow-sm text-success" role="status" aria-hidden="true"></span>
              <span className="small fw-medium text-light">Post-Trade Analytics Engine</span>
              <span className="text-secondary">|</span>
              <span className="small font-monospace text-success fw-medium">v2.4 Live</span>
            </div> */}

            <h1 className="display-4 fw-bold mb-4 mt-6">
              Your trade doesn't end <br className="d-none d-sm-inline" />
              <span className="text-success">when you sell.</span>
            </h1>

            <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: 672 }}>
              Track what you earned, discover what you missed, and understand whether your selling decisions were actually good.
            </p>

            <div className="row justify-content-center g-3 mb-5">
              <div className="col-12 col-sm-auto">
                <a href="#dashboard-preview" className="btn btn-success btn-lg w-100 fw-semibold px-5">
                  Get Started 
                </a>
              </div>
              <div className="col-12 col-sm-auto">
                <a href="#signature-chart" className="btn btn-outline-light btn-lg w-100 fw-semibold px-4">
                  Explore Selling Graph
                </a>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-3 g-3 justify-content-center pt-4 border-top border-secondary text-secondary small fw-medium">
              <div className="col d-flex align-items-center justify-content-center gap-2">
                <span className="text-success">✔</span>
                <span>Zerodha &amp; Groww CSV Import</span>
              </div>
              <div className="col d-flex align-items-center justify-content-center gap-2">
                <span className="text-success">✔</span>
                <span>NSE / BSE Real-time Feed</span>
              </div>
              <div className="col d-flex align-items-center justify-content-center gap-2">
                <span className="text-success">✔</span>
                <span>Zero Trading Execution Risk</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;