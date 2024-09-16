import { FC } from 'react';

import SkTable from '@core/components/SkTable';
import { CustomProcessCells, processesTableColumns } from '@pages/Processes/Processes.constants';
import { ProcessesLabels } from '@pages/Processes/Processes.enum';
import { SiteResponse } from '@sk-types/REST.interfaces';

import { useSiteProcessListData } from '../hooks/useSiteProcessListData';

interface ProcessListProps {
  site: SiteResponse;
}

const ProcessList: FC<ProcessListProps> = function ({ site: { identity: id } }) {
  const { processes } = useSiteProcessListData(id);

  return (
    <SkTable
      title={ProcessesLabels.Section}
      columns={processesTableColumns}
      rows={processes}
      customCells={{
        linkCell: CustomProcessCells.linkCell,
        linkComponentCell: CustomProcessCells.linkComponentCell,
        TimestampCell: CustomProcessCells.TimestampCell,
        ExposureCell: CustomProcessCells.ExposureCell
      }}
    />
  );
};

export default ProcessList;
