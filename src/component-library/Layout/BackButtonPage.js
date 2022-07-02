import React from 'react';

const BackButtonPage = ({ children, onBack }) => (
  <div style={styles.container}>
    <button onClick={onBack}>BACK</button>
    {children}
  </div>
);

const styles = {
  container: { flexDirection: 'column', padding: '12px 12px' },
};

export default BackButtonPage;
