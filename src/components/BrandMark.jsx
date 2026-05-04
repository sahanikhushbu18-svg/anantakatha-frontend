import React from 'react';

export const BrandMark = ({ compact = false }) => {
  return (
    <div className={`brand-mark ${compact ? 'compact' : ''}`.trim()}>
      <img src="/assets/anantakatha-logo-main.png" alt="AnantaKatha" />
      <div>
        <strong>AnantaKatha</strong>
        {!compact ? <span>Stories, shaped with AI</span> : null}
      </div>
    </div>
  );
};