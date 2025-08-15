import { initialStateType } from "../components/forms/HandleServerAction";

const serverActionWrapper = <TArgs extends any[]>(
  fn: (...args: TArgs) => Promise<initialStateType>
) => {
  return async (...args: TArgs): Promise<initialStateType> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  };
};

export default serverActionWrapper;
