// import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { User } from "firebase/auth";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface userStoreType {
  user?: null | User;
  userInfo: {
    name?: string;
    email?: string;
    profilePicture?: string;
  };

  setUser: (user: null | User) => void;
  setUserInfo: (userInfo: userStoreType["userInfo"]) => void;

  resetUser: () => void;

  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const userInfoDefault = {
  name: "Guest",
  email: undefined,
  profilePicture:
    "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
};

const useUserStore = create<userStoreType>()(
  subscribeWithSelector(
    devtools(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (set, _get) => ({
        user: undefined,
        userInfo: userInfoDefault,

        setUser: (user: null | User) => set({ user }),
        setUserInfo: (userInfo: userStoreType["userInfo"]) => set({ userInfo }),

        resetUser: () => {
          set({ user: null, userInfo: userInfoDefault });
        },

        // get them from local storage, or check the system theme
        theme: !window.localStorage.getItem("theme")
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : (window.localStorage.getItem("theme") as "light" | "dark"),

        setTheme: (theme: "light" | "dark") => {
          set({ theme });
          window.localStorage.setItem("theme", theme);
        },
      }),
      { name: "userStore" }
    )
  )
);

export default useUserStore;
