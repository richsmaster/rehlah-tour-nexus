
import { AdvancedProgramsManagement } from '@/components/advanced/AdvancedProgramsManagement';

interface ProgramsManagementProps {
  currentUser: any;
}

export const ProgramsManagement = ({ currentUser }: ProgramsManagementProps) => {
  return <AdvancedProgramsManagement currentUser={currentUser} />;
};
