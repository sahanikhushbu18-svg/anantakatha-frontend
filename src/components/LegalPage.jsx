import React from 'react';
import { Card } from './UI';
import { Seo } from './Seo';

export const LegalPage = ({ title, subtitle, sections, canonicalPath }) => {
  return (
    <>
      <Seo title={`${title} | AnantaKatha`} description={subtitle} canonicalPath={canonicalPath} />
      <div className="legal-page">
        <Card className="page-card legal-card">
          <p className="eyebrow">AnantaKatha policies</p>
          <h1 className="legal-title">{title}</h1>
          {subtitle ? <p className="page-subtitle legal-subtitle">{subtitle}</p> : null}
          {sections.map((section) => (
            <section key={section.title} className="legal-section">
              <h3>{section.title}</h3>
              {section.points ? (
                <ul className="legal-list">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.text}</p>
              )}
            </section>
          ))}
        </Card>
      </div>
    </>
  );
};