import React, { forwardRef } from 'react';
import { Box, Button, Link, SpaceBetween } from '@cloudscape-design/components';



export const TableNoMatchState = (props: any) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>No matches</b>
        <Box variant="p" color="inherit">
          We can't find a match.
        </Box>
      </div>
      <Button onClick={props.onClearFilter}>Clear filter</Button>
    </SpaceBetween>
  </Box>
);

export const TableEmptyState = ({ resourceName }: any) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>No {resourceName.toLowerCase()}s</b>
        <Box variant="p" color="inherit">
          No {resourceName.toLowerCase()}s associated with this resource.
        </Box>
      </div>
      <Button>Create {resourceName.toLowerCase()}</Button>
    </SpaceBetween>
  </Box>
);

export const CounterLink = ({ children }: any) => {
  return (
    <Link variant="awsui-value-large" href="#">
      {children}
    </Link>
  );
};
