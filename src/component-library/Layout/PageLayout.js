import React from 'react';

const PageLayout = ({children}) => (
  <div style={styles.container}>{children}</div>
);

const styles = {
  container: {padding: '12px 12px'},
};

export default PageLayout;
