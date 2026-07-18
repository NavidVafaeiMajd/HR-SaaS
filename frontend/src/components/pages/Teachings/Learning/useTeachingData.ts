import { useGetData } from '../../../../hook/useGetData';
import { useMemo } from 'react';

export type Skill = {
  id: number;
  name: string;
};

export type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

export const useTeachingData = () => {
  const { data: skills, isPending: skillsLoading } = useGetData<Skill[]>("skills");
  const { data: teachers, isPending: teachersLoading } = useGetData<Teacher[]>("teachers");

  const skillsMapped = useMemo(() => 
    skills?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [], 
    [skills]
  );

  const teachersMapped = useMemo(() => 
    teachers?.map((item) => ({
      value: String(item.id),
      label: item.first_name + " " + item.last_name,
    })) || [], 
  [teachers]
  );

  return {
    skills: skillsMapped,
    teachers: teachersMapped,
    isLoading: skillsLoading || teachersLoading,
  };
};
