export const validateAddMemberToTeamFields = async (
  email,
  authenticatedUser,
  teamId,
  User,
  Member
) => {
  const errors = [];

  if (!email) errors.push({ path: "email", message: "Email is required!" });

  const findExistingUser = await User.findOne({ email });
  if (!errors.length && !findExistingUser)
    errors.push({
      path: "email",
      message: "User associated with this email not exist!"
    });

  const findExistingMember = await Member.findOne({
    user: findExistingUser && findExistingUser.id,
    team: teamId
  });

  if (!errors.length && findExistingMember)
    errors.push({
      path: "email",
      message: "User already a member of this team!"
    });

  if (!errors.length && findExistingUser.id === authenticatedUser.id)
    errors.push({
      path: "email",
      message: "As the owner of this team you can't invite yourself!"
    });

  return { isValid: !errors.length > 0, errors, user: findExistingUser };
};
