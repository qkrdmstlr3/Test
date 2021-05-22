import { CheckPostStatusType } from '../types/enum';

function getStatusClass(status: CheckPostStatusType): string {
  const statusList = {
    [CheckPostStatusType.todo]: 'status__todo',
    [CheckPostStatusType.doing]: 'status__doing',
    [CheckPostStatusType.done]: 'status__done',
  };

  return statusList[status];
}

export default getStatusClass;
