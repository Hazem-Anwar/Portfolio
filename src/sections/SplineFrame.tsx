import React from 'react';

const SplineFrame = () => {
    return (
        <section style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <iframe 
                src="https://app.spline.design/file/d65ef078-1694-4b61-8050-f380903f05d0?view=preview" 
                frameBorder="0" 
                width="100%" 
                height="100%"
                style={{ border: 'none', background: 'transparent' }}
            ></iframe>
        </section>
    );
};

export default SplineFrame;
