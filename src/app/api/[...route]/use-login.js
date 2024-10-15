import { useMutation } from "@tanstack/react-query";
import { client } from "@/src/lib/rpc";

export const useLogin = () => {
  //! to pass data and params to the mutate function use mutate({ json: formData, param: { userId: "123" } })
  const login = useMutation({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.auth.login.$post({
        json,
        param,
      });
      return res.json();
    },
  });
  return login;
};
