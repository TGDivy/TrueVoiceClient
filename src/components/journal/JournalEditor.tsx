import { SendOutlined } from "@ant-design/icons";
// import { JournalSessionDocument } from "@server/models/journal.model";
import { EditorContent, useEditor } from "@tiptap/react";
import { Button, message, Typography } from "antd";
import { useState } from "react";
// import { updateJournalSession } from "src/api/journal.api";
import { useToken } from "src/utils/antd_components";
import { journalExtensions } from "./JournalExtensions";

interface Props {
  loading: boolean;
  // journalSession: any | null;
  // setJournalSession: (journalSession: any) => void;
}

// const getNextPromptAndUpdate = async (
//   journalSession: JournalSessionDocument,
//   setExchange: journalStoreType["setStreamingExchange"],
//   setJournalSession: (journalSession: JournalSessionDocument) => void
// ) => {
//   const user = useUserStore.getState().user;
//   if (!user) return;

//   const bearerToken = `Bearer ${await user.getIdToken(false)}`;
//   const response = await fetch(API_DOMAIN + "journal/delphi/1", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: bearerToken,
//     },
//     method: "GET",
//   });

//   const reader = response?.body?.getReader();

//   let textSoFar = "";
//   while (reader) {
//     const { done, value } = await reader.read();
//     if (done) {
//       break;
//     }
//     const text = new TextDecoder().decode(value);
//     textSoFar += text;
//     setExchange({
//       rawText: textSoFar,
//       speaker: "assistant",
//       timestamp: new Date(),
//     });

//     await new Promise((resolve) => setTimeout(resolve, 10));
//     console.log(text);
//   }

//   const newJournalSession = await updateJournalSession(journalSession._id, {
//     exchanges: [
//       {
//         rawText: textSoFar,
//         speaker: "assistant",
//         timestamp: new Date(),
//       },
//     ],
//   });

//   setJournalSession(newJournalSession);
//   setExchange(undefined);
// };

const JournalEditor = (props: Props) => {
  const { loading: initLoading } = props;
  const [loading, setLoading] = useState(initLoading);

  const journalContent = localStorage.getItem("journalContent");

  const { token } = useToken();

  const editor = useEditor({
    extensions: journalExtensions,
    editorProps: {
      attributes: {
        class: "tiptapJournal",
      },
    },
    content: journalContent ? JSON.parse(journalContent) : null,

    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      localStorage.setItem("journalContent", JSON.stringify(json));
    },
  });

  if (!editor) return null;

  const onSubmitHandler = async () => {
    // if words are less than 40, return
    if (editor.storage.characterCount.words() < 10) {
      message.error("Journal entry must be at least 10 words");
      return;
    }
    // if (!journalSession) {
    //   message.error("Journal session not found");
    //   return;
    // }
    setLoading(true);

    const json = editor.getJSON();
    try {
      // const projects = extractIds("project", json);
      // const dueDates = extractIds("dueDate", json);

      // const newJournalSession = await updateJournalSession(journalSession._id, {
      //   exchanges: [
      //     ...journalSession.exchanges,
      //     {
      //       speaker: "user",
      //       rawText: editor.getText(),
      //       jsonString: JSON.stringify(json),
      //       htmlString: editor.getHTML(),
      //       timestamp: new Date(),
      //     },
      //   ],
      // });
      // setJournalSession(newJournalSession);
      editor.commands.clearContent();
      localStorage.removeItem("journalContent");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <EditorContent
        editor={editor}
        style={{
          position: "relative",
        }}
      >
        <Typography.Text
          style={{
            textAlign: "end",
            position: "absolute",
            bottom: "0",
            right: "0",
            marginRight: "40px",
            color: token.colorTextDescription,
            fontSize: token.fontSizeSM,
          }}
        >
          {editor.storage.characterCount.words()} words
        </Typography.Text>
        <Button
          type="primary"
          style={{
            position: "absolute",
            bottom: "0",
            transform: "translateY(-100%)",
            right: "0",
            zIndex: 1,
            marginRight: "8px",
          }}
          shape="round"
          loading={loading}
          onClick={onSubmitHandler}
        >
          <SendOutlined />
        </Button>
      </EditorContent>
    </>
  );
};

export default JournalEditor;
