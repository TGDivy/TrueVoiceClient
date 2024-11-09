import { message, notification } from "antd";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import useUserStore from "src/stores/user_store";
import { auth } from "./firebase_init";
import useTopicStore from "src/stores/topics_store";
import { getTopics } from "../conversation";

const actionCodeSettings = {
  url: `${window.location.protocol}//${window.location.host}/`,
  handleCodeInApp: false,
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    // const uid = user.uid;
    message.success("You have successfully logged in!");
    useUserStore.getState().setUser(user);

    useTopicStore.getState().setLoading(true);
    // getUser(user.uid)
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch(() => {
    //     // message.error("Error getting user data");
    //     // create user
    //     createUser({
    //       uid: user.uid,
    //       email: user.email || "",
    //       deviceInfo: [],
    //     })
    //       .then(() => {
    //         // message.success("User created");
    //       })
    //       .catch(() => {
    //         message.error("Error creating user");
    //       });
    //   });
    getTopics()
      .then((topics) => {
        if (topics.length === 0) {
          notification.info({
            message: "Welcome to Focus!",
            description:
              "You can create a topic by typing @ followed by the project name",
            duration: 5,
            placement: "bottomRight",
          });
        }
        useTopicStore.getState().setTopics(topics);
      })
      .catch(() => {
        message.error("Error getting topics");
      })
      .finally(() => {
        useTopicStore.getState().setLoading(false);
      });

    useUserStore.getState().setUserInfo({
      name: user.displayName || "",
      email: user.email || "",
      profilePicture: user.photoURL || "",
    });
  } else {
    useUserStore.getState().resetUser();
  }
});

const provider = new GoogleAuthProvider();
export const onSignInWithGoogle = () => {
  signInWithPopup(auth, provider).then(() => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    // const user = result.user;
  });
  // ).catch((error) => {
};

export const onSignInWithEmail = (email: string) => {
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem("emailForSignIn", email);
      // ...
    })
    .catch((error) => {
      message.error("Error sending email" + error.message);
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
      // ...
    });
};

export const updateUserProfile = (props: {
  name?: string;
  photoURL?: string;
}) => {
  const { name, photoURL } = props;
  if (!auth.currentUser) return;
  updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: photoURL,
  })
    .then(() => {
      auth.currentUser?.reload();
    })
    .catch(() => {});
};

export const onSignUpWithEmailAndPassword = (
  email: string,
  password: string,
  name?: string
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Signed in
      // const user = userCredential.user;
      // ...
      updateUserProfile({ name });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        onSignInWithEmailAndPassword(email, password);
        return;
      }
      message.error(error.message);
    });
};

export const onSignInWithEmailAndPassword = (
  email: string,
  password: string
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Signed in
      // const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      message.error(error.message);
    });
};

if (isSignInWithEmailLink(auth, window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  let email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt("Please provide your email for confirmation");
    //   return;
  }
  if (!email) {
    message.error("Error signing in");
    throw new Error("No email provided");
  }
  // The client SDK will parse the code from the link for you.
  signInWithEmailLink(auth, email, window.location.href)
    .then(() => {
      // Clear email from storage.
      window.localStorage.removeItem("emailForSignIn");
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
    })
    .catch(() => {
      message.error("Error signing in");
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}

export const test = () => {};
