/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProjectDocument } from "@server/models/project.model";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface projectStoreType {
  loading: boolean;
  projects: ProjectDocument[];
  setProjects: (projects: ProjectDocument[]) => void;
  setLoading: (loading: boolean) => void;
  addProject: (project: ProjectDocument) => void;
  updateProject: (project: ProjectDocument) => void;
}

const initialValues = {
  projects: [],
  loading: false,
};

const useProjectStore = create<projectStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, _get) => ({
        ...initialValues,
        setProjects: (projects: ProjectDocument[]) =>
          set({ projects, loading: false }),
        setLoading: (loading: boolean) => set({ loading }),
        addProject: (project: ProjectDocument) =>
          set((state) => ({ projects: [...state.projects, project] })),
        updateProject: (project: ProjectDocument) =>
          set((state) => ({
            projects: state.projects.map((p) =>
              p._id === project._id ? project : p
            ),
          })),
      }),
      { name: "projectStore" }
    )
  )
);

export default useProjectStore;
