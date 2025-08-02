import { auth } from "../app/api/auth/[...nextauth]/options";

const getAuthenticatedUser = async () => {
  const session = await auth();
  if (!session?.user) return null;

  return session.user;
};

export default getAuthenticatedUser;
