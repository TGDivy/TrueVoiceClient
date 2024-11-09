import { message, notification } from "antd";
import {
  SessionDocumentType,
  createFocusSession,
  getFocusSession,
  stopFocusSession,
  updateFocusSession,
} from "src/api/focus_sessions";
import { notificationSound } from "src/utils/constants";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface focusSessionStoreType {
  session?: SessionDocumentType;
  setDuration: (duration: number) => void;
  setSessionMode: (mode: SessionDocumentType["mode"]) => void;
  toggleSession: () => Promise<void>;
  loading: boolean;
  getAndSetSession: () => Promise<SessionDocumentType>;
  sessionCompleted: boolean;
  setSessionCompleted: (completed: boolean) => void;
  setTasks: (tasks: string[]) => void;
}

export const userInfoDefault = {};

const useFocusSessionStore = create<focusSessionStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        loading: false,
        session: undefined,
        getAndSetSession: async () => {
          set({ loading: true });
          try {
            const session = await getFocusSession();
            if (!session) {
              throw new Error("Session not found");
            }
            if (session.active && session.startTime && session.duration) {
              const deadline =
                session.startTime.getTime() + session.duration * 1000;
              if (session.active && deadline < Date.now()) {
                get().setSessionCompleted(true);
              }
            }
            set({ loading: false, session });
            return session;
          } catch (error) {
            const session = await createFocusSession({
              duration: 25 * 60,
              active: false,
            });
            set({ session, loading: false });
            return session;
          }
        },
        setDuration: (duration) => {
          const session = get().session;
          if (!session) {
            return;
          }
          set({ session: { ...session, duration } });
        },
        setTasks: (tasks) => {
          const session = get().session;
          if (!session) {
            console.error("Session not found");
            return;
          }
          set({
            session: {
              ...session,
              linkedEntities: {
                ...session.linkedEntities,
                tasks: tasks,
              },
            },
          });
        },
        setSessionMode: (mode) => {
          const session = get().session;
          if (!session) {
            return;
          }
          set({ session: { ...session, mode } });
        },
        toggleSession: async () => {
          const session = get().session;
          if (!session) {
            return;
          }
          const newSession = {
            ...session,
            startTime: new Date().toISOString(),
            active: !session.active,
          };
          try {
            if (!session.active) {
              const s = await updateFocusSession(newSession);
              set({ session: s, sessionCompleted: false });
            } else {
              const s = await stopFocusSession();
              set({ session: s, sessionCompleted: false });
            }
          } catch (error) {
            if (error instanceof Error) {
              message.error(error.message);
            }
          }
        },
        sessionCompleted: false,
        setSessionCompleted: (completed) => {
          set({ sessionCompleted: completed });
          if (completed) {
            notificationSound().play();
            notification.success({
              message: "Congratulations!",
              description: "You have completed your focus session!",
              onClose() {
                if (get().session?.active) get().toggleSession();
              },
            });
          }
        },
      }),
      { name: "focusStore" }
    )
  )
);

export default useFocusSessionStore;
