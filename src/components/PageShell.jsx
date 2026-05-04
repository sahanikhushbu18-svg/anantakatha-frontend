import React from 'react';
import { Card } from './UI';

export const PageShell = ({ eyebrow, title, subtitle, action, children }) => {
  return (
    <div className="page-grid">
      <div className="page-hero">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        {action ? <div className="page-action">{action}</div> : null}
      </div>
      <Card className="page-card">{children}</Card>
    </div>
  );
};