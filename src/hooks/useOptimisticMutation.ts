"use client";

import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";

interface OptimisticMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  queryKey: unknown[];
  updater: (oldData: any, newData: TVariables) => any;
}

export function useOptimisticMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>({ queryKey, updater, ...options }: OptimisticMutationOptions<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => updater(old, variables));

      // Return a context object with the snapshotted value
      if (options.onMutate) {
        const customContext = await options.onMutate(variables);
        return { previousData, ...(customContext || {}) };
      }
      return { previousData } as any;
    },
    onError: (err, variables, context: any) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      if (options.onError) {
        options.onError(err, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success to ensure synchronization
      queryClient.invalidateQueries({ queryKey });
      if (options.onSettled) {
        options.onSettled(data, error, variables, context);
      }
    },
  });
}
