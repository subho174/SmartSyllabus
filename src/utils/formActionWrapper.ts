import z from "zod";
import { initialStateType } from "../components/forms/HandleServerAction";

const formActionWrapper = (
  fn: (
    prevState: initialStateType,
    formData: FormData
  ) => Promise<initialStateType>
) => {
  return async (
    prevState: initialStateType,
    formData: FormData
  ): Promise<initialStateType> => {
    try {
      return await fn(prevState, formData);
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        return {
          status: 400,
          message: error.issues[0]?.message || "Validation failed",
        };
      }

      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  };
};

export default formActionWrapper;
