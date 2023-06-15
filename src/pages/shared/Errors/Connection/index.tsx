import { Brand, Grid, GridItem, TextContent, Text, TextVariants, List, ListItem, Button } from '@patternfly/react-core';
import { useLocation, useNavigate } from 'react-router-dom';

import { brandImg } from '@config/config';

import { Labels } from './Connection.enum';
import { ErrorLabels } from '../Errors.enum';

const ErrorConnection = function () {
  const navigate = useNavigate();
  const { state } = useLocation();

  function handleRetryConnection() {
    navigate(state?.pathname || -1);
  }

  return (
    <Grid className=" pf-u-p-4xl">
      <GridItem span={6} className=" pf-u-p-2xl">
        <TextContent className="pf-u-text-align-center pf-u-mb-4xl">
          <Text component={TextVariants.h1}>{Labels.ErrorTitle}</Text>
          {`${state?.code}:  ${state?.message}`}
        </TextContent>

        <TextContent className="pf-u-mb-4xl">
          <Text component={TextVariants.h4}>
            To help us resolve the issue quickly, we recommend following these steps using the DevTool browser
          </Text>
          <List>
            <ListItem>Open the DevTool browser (F12)</ListItem>
            <ListItem>
              Navigate to the "Network" and "Console" tab. Look for any error messages or red-highlighted lines. These
              will provide essential clues about what went wrong
            </ListItem>
            <ListItem>
              Capture screenshots of the error and any relevant details displayed in the console. This will help our
              development team better understand the problem
            </ListItem>
          </List>
        </TextContent>

        <Button id="sk-try-again" variant="primary" onClick={handleRetryConnection}>
          Try again
        </Button>
      </GridItem>
      <GridItem span={6} className=" pf-u-p-2xl">
        <Brand src={brandImg} alt="brand" />
        <TextContent>
          <Text>{ErrorLabels.Description}</Text>
        </TextContent>
      </GridItem>
    </Grid>
  );
};

export default ErrorConnection;
