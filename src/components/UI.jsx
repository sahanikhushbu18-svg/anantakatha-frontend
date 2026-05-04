import React, { useState } from 'react';

export const Card = ({ children, className = '' }) => {
  return <section className={`card ${className}`.trim()}>{children}</section>;
};

export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  return (
    <button className={`button ${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export const Field = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <label className={`field ${className}`.trim()}>
      {label ? <span className="field-label">{label}</span> : null}
      <input ref={ref} className={`control ${error ? 'control-error' : ''}`.trim()} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
});

Field.displayName = 'Field';

export const TextArea = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <label className={`field ${className}`.trim()}>
      {label ? <span className="field-label">{label}</span> : null}
      <textarea ref={ref} className={`control textarea ${error ? 'control-error' : ''}`.trim()} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
});

TextArea.displayName = 'TextArea';

export const Select = React.forwardRef(({ label, error, children, className = '', ...props }, ref) => {
  return (
    <label className={`field ${className}`.trim()}>
      {label ? <span className="field-label">{label}</span> : null}
      <select ref={ref} className={`control ${error ? 'control-error' : ''}`.trim()} {...props}>
        {children}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
});

Select.displayName = 'Select';

export const PasswordField = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <label className={`field ${className}`.trim()}>
      {label ? <span className="field-label">{label}</span> : null}
      <div className="password-field">
        <input ref={ref} type={visible ? 'text' : 'password'} className={`control password-input ${error ? 'control-error' : ''}`.trim()} {...props} />
        <button type="button" className="password-toggle" onClick={() => setVisible((current) => !current)}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
});

PasswordField.displayName = 'PasswordField';

export const Badge = ({ children, tone = 'neutral' }) => {
  return <span className={`badge ${tone}`.trim()}>{children}</span>;
};