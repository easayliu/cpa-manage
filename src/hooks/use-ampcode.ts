import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ampcode } from "@/api/management-api";
import type { AmpCode, AmpModelMapping, AmpUpstreamAPIKeyEntry, StatusResponse } from "@/api/types";

export function useAmpcode() {
  return useQuery<AmpCode>({
    queryKey: ["ampcode"],
    queryFn: () => ampcode.get(),
  });
}

// Upstream URL
export function useAmpcodeUpstreamUrl() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["ampcode-upstream-url"],
    queryFn: () => ampcode.upstreamUrl.get(),
  });
  const setMutation = useMutation({
    mutationFn: (value: string) => ampcode.upstreamUrl.set(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-upstream-url"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => ampcode.upstreamUrl.delete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-upstream-url"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  return { ...query, set: setMutation.mutate, remove: deleteMutation.mutate, setMutation, deleteMutation };
}

// Upstream API Key
export function useAmpcodeUpstreamApiKey() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["ampcode-upstream-api-key"],
    queryFn: () => ampcode.upstreamApiKey.get(),
  });
  const setMutation = useMutation({
    mutationFn: (value: string) => ampcode.upstreamApiKey.set(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-upstream-api-key"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => ampcode.upstreamApiKey.delete(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-upstream-api-key"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  return { ...query, set: setMutation.mutate, remove: deleteMutation.mutate, setMutation, deleteMutation };
}

// Restrict Management to Localhost
export function useAmpcodeRestrictLocalhost() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["ampcode-restrict-localhost"],
    queryFn: () => ampcode.restrictManagementToLocalhost.get(),
  });
  const mutation = useMutation({
    mutationFn: (value: boolean) => ampcode.restrictManagementToLocalhost.set(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-restrict-localhost"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  return { ...query, toggle: () => mutation.mutate(!query.data), mutation };
}

// Force Model Mappings
export function useAmpcodeForceModelMappings() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["ampcode-force-model-mappings"],
    queryFn: () => ampcode.forceModelMappings.get(),
  });
  const mutation = useMutation({
    mutationFn: (value: boolean) => ampcode.forceModelMappings.set(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-force-model-mappings"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  return { ...query, toggle: () => mutation.mutate(!query.data), mutation };
}

// Model Mappings
export function useAmpcodeModelMappings() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["ampcode-model-mappings"],
    queryFn: () => ampcode.modelMappings.get(),
  });
  const setMutation = useMutation<StatusResponse, Error, AmpModelMapping[]>({
    mutationFn: (value) => ampcode.modelMappings.set(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-model-mappings"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  const addMutation = useMutation<StatusResponse, Error, AmpModelMapping[]>({
    mutationFn: (value) => ampcode.modelMappings.patch(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-model-mappings"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  const deleteMutation = useMutation<StatusResponse, Error, string[]>({
    mutationFn: (value) => ampcode.modelMappings.delete(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-model-mappings"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  return { ...query, set: setMutation.mutate, add: addMutation.mutate, remove: deleteMutation.mutate, setMutation, addMutation, deleteMutation };
}

// Upstream API Keys
export function useAmpcodeUpstreamApiKeys() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["ampcode-upstream-api-keys"],
    queryFn: () => ampcode.upstreamApiKeys.get(),
  });
  const setMutation = useMutation<StatusResponse, Error, AmpUpstreamAPIKeyEntry[]>({
    mutationFn: (value) => ampcode.upstreamApiKeys.set(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-upstream-api-keys"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  const addMutation = useMutation<StatusResponse, Error, AmpUpstreamAPIKeyEntry[]>({
    mutationFn: (value) => ampcode.upstreamApiKeys.patch(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-upstream-api-keys"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  const deleteMutation = useMutation<StatusResponse, Error, string[]>({
    mutationFn: (value) => ampcode.upstreamApiKeys.delete(value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ampcode-upstream-api-keys"] });
      qc.invalidateQueries({ queryKey: ["ampcode"] });
    },
  });
  return { ...query, set: setMutation.mutate, add: addMutation.mutate, remove: deleteMutation.mutate, setMutation, addMutation, deleteMutation };
}
