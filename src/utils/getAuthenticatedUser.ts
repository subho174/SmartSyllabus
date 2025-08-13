import { auth } from "../app/api/auth/[...nextauth]/options";

const getAuthenticatedUser = async () => {
  const session = await auth();
  if (!session?.user) return null;
  console.log(session);

  return session.user;
};

export default getAuthenticatedUser;
