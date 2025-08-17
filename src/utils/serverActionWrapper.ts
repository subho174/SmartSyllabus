import { initialStateType } from "../components/forms/HandleServerAction";
import getAuthenticatedUser from "./getAuthenticatedUser";

const serverActionWrapper = <TArgs extends any[]>(
  fn: (...args: TArgs) => Promise<initialStateType>
) => {
  return async (...args: TArgs): Promise<initialStateType> => {
    try {
      const user = await getAuthenticatedUser();
      if (!user) return { status: 401, message: "Unauthorized. Please Login" };

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
