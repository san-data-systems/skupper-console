import { Suspense } from 'react';

import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Server } from 'miragejs';
import * as router from 'react-router';

import { ProcessPairsResponse, ProcessResponse } from '@API/REST.interfaces';
import { getTestsIds } from '@config/testIds';
import { Wrapper } from '@core/components/Wrapper';
import processesPairsData from '@mocks/data/PROCESS_PAIRS.json';
import processesData from '@mocks/data/PROCESSES.json';
import { loadMockServer } from '@mocks/server';
import LoadingPage from '@pages/shared/Loading';

import { ProcessesLabels, ProcessesRoutesPaths, ProcessPairsLabels } from '../Processes.enum';
import Process from '../views/Process';

const processResult = processesData.results[0] as ProcessResponse;
const processPairsResult = processesPairsData.results[2] as ProcessPairsResponse;

describe('Process component', () => {
  let server: Server;
  beforeEach(() => {
    server = loadMockServer() as Server;
    server.logging = false;
    // Mock URL query parameters and inject them into the component
    jest.spyOn(router, 'useParams').mockReturnValue({ id: `${processResult.name}@${processResult.identity}` });

    render(
      <Wrapper>
        <Suspense fallback={<LoadingPage />}>
          <Process />
        </Suspense>
      </Wrapper>
    );
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it('should render the Process view after the data loading is complete', async () => {
    // Wait for all queries to resolve
    expect(screen.getByTestId(getTestsIds.loadingView())).toBeInTheDocument();
    // Wait for the loading page to disappear before continuing with the test.
    await waitForElementToBeRemoved(() => screen.getByTestId(getTestsIds.loadingView()));

    expect(screen.getByTestId(getTestsIds.processView(processResult.identity))).toBeInTheDocument();
  });

  it('should render the title, description data and processes associated the data loading is complete', async () => {
    await waitForElementToBeRemoved(() => screen.getByTestId(getTestsIds.loadingView()));

    fireEvent.click(screen.getByText(ProcessesLabels.Details));

    expect(screen.getAllByRole('sk-heading')[0]).toHaveTextContent(processResult.name);
    expect(screen.getByText(processResult.parentName)).toHaveTextContent('site 1');
    expect(screen.getByText(processResult.groupName)).toHaveTextContent('component 1');
    expect(screen.getByText(processResult.hostName)).toHaveTextContent('10.242.0.5');
    expect(screen.getByText(processResult.sourceHost)).toHaveTextContent('172.17.63.163');
  });

  it('Should ensure the Process associated renders with correct link href after loading page', async () => {
    await waitForElementToBeRemoved(() => screen.getByTestId(getTestsIds.loadingView()));

    fireEvent.click(screen.getByText(ProcessesLabels.ProcessPairs));

    expect(screen.getByRole('link', { name: processesData.results[3].name })).toHaveAttribute(
      'href',
      `#${ProcessesRoutesPaths.Processes}/${processPairsResult.sourceName}@${processPairsResult.sourceId}/${ProcessPairsLabels.Title}@${processPairsResult.identity}@${processPairsResult.protocol}`
    );
  });
});
