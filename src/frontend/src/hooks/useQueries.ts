import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GlobalStats, Project, RestorationSubmission } from "../backend";
import type { ExternalBlob, ProjectStatus } from "../backend";
import { useActor } from "./useActor";

export function useProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProject(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Project | undefined>({
    queryKey: ["project", String(id)],
    queryFn: async () => {
      if (!actor) return undefined;
      const result = await actor.getProject(id);
      if (!result) return undefined;
      return result[0] ?? undefined;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGreenMap() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["greenMap"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGreenMap();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGlobalStats() {
  const { actor, isFetching } = useActor();
  return useQuery<GlobalStats>({
    queryKey: ["globalStats"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalCreditsIssued: BigInt(0),
          totalLandRestored: 0,
          countriesActive: BigInt(0),
          projectsVerified: BigInt(0),
        };
      }
      return actor.getGlobalStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<RestorationSubmission[]>({
    queryKey: ["adminSubmissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      ownerName: string;
      country: string;
      projectType: string;
      landAreaHectares: number;
      gpsCoordinates: string;
      startDate: string;
      endDate: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitProject(
        args.ownerName,
        args.country,
        args.projectType,
        args.landAreaHectares,
        args.gpsCoordinates,
        args.startDate,
        args.endDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function usePurchaseCredits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { projectId: bigint; amount: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.purchaseCredits(args.projectId, args.amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useSubmitRestoration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      projectId: bigint;
      description: string;
      completionDate: string;
      files: ExternalBlob[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitRestoration(
        args.projectId,
        args.description,
        args.completionDate,
        args.files,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubmissions"] });
    },
  });
}

export function useApproveRestoration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveRestoration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useRejectRestoration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; note: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectRestoration(args.id, args.note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubmissions"] });
    },
  });
}

export function useUpdateProjectStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; status: ProjectStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProjectStatus(args.id, args.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
