// initial
connectToDatabase().then((database) => {
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

// I'm assuming that this file is a script ran internally. Had that not been the case, I'd need to verify that connected user to the db has admin role himself

const { setAdminRole, getUser, notifyUser, notifyAdmins } = require("./api");

const USER_ROLE_UPDATED = "USER_ROLE_UPDATED";
const ADMIN_ROLE = "ADMIN";

const setAdminRole = async (id) => {
  try {
    await setRole(id, ADMIN_ROLE);
  } catch (error) {
    console.log("Failed to set the role ", error);
    throw new Error(error);
  }
};

const getUser = async () => {
  let user;
  try {
    // NOTE: user settings are not used at all, hence I ommited this call. However, if there was a need to do that we could have getUserWithSettings func that would
    // combine getUser and getUserSettings into one http call. That would be achieable with a join on the query whenever user.id is retrieved by the db
    // (that is assuming that user settings are different tables and are not part of user object initially)
    user = await getUser("email@email.com");
  } catch (error) {
    console.log(error);
    throw new Error("Couldnt fetch user!");
  }
  if (!user)
    throw new Error(
      `User has to be truthy in order to set role, but is: ${user}`
    );
  return user;
};

const createAdmin = async () => {
  const user = await getUser();
  await setAdminRole(user.id);

  const promises = [
    // assumption: notify sends notification to a device of some kind and throws if it fails
    // notify could also have more flexible signature. possible inspiration: https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/sns/src/sns_publishsms.js#L31
    notifyUser(user.id, USER_ROLE_UPDATED, notifyAdmins(USER_ROLE_UPDATED)),
  ];
  const results = await Promise.allSettled(promises);

  results.forEach(({ status, value, reason }) => {
    if (status === "rejected") {
      console.log(reason);
    }
  });
};

createAdmin();
