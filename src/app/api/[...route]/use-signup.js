import { useMutation } from "@tanstack/react-query";

export const useSignUp = () => {
  const register = useMutation({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.auth.register.$post({
        json,
        param,
      });
      return res.json();
    },
  });
  return register;
};
