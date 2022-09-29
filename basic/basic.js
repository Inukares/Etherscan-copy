// initial
connectToDatabase() //
  .then((database) => {
    return getUser(database, "email@email.com").then((user) => {
      return getUserSettings(database, user.id).then((settings) => {
        return setRole(database, user.id, "ADMIN").then((success) => {
          return notifyUser(user.id, "USER_ROLE_UPDATED").then((success) => {
            return notifyAdmins("USER_ROLE_UPDATED");
          });
        });
      });
    });
  });

// upon connecting to the db the connection should be stored
// each and every single call should be wrapped with error handling
// perhaps could get settings in one call alongside the get user
// calls could be written with async await so that it's more readable

// notifications could be done in parralel as one does not depend on the other

// I'm assuming that this file is a script ran internally. Had that not been the case, I'd need to verify that connected user to the db has admin role himself

const setAdminRole = async (id) => {
  let setRoleSuccessfully = false;
  try {
    await setRole(id, "ADMIN");
    setRoleSuccessfully = true;
  } catch (error) {
    console.log("Failed to set the role");
    setRoleSuccessfully = false;
  }

  return setRoleSuccessfully;
};

const SUCCESS_UPDATE = "USER_ROLE_UPDATED";

const createAdmin = async () => {
  let user;
  try {
    // NOTE: user settings are not used at all, hence I ommited this call. However, if there was a need to do that we could have getUserWithSettings func that would
    // combine getUser and getUserSettings into one http call. That would be achieable with a join on the query whenever user.id is retrieved by the db
    // (that is assuming that user settings are different tables and are not part of user object initially)
    user = await getUser("email@email.com");
  } catch (error) {
    console.log(error);
  }
  if (!user) throw new Error(`Couldn't fetch user`);
  const setRoleSuccessfully = await setAdminRole(user.id);
  if (setRoleSuccessfully) {
    const promises = [notifyUser(user.id, SUCCESS_UPDATE)§];
    await p;
  }
};

createAdmin();
