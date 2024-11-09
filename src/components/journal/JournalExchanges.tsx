import { createJournalSessionInput } from "@server/schema/journal.schema";
import Markdown from "react-markdown";
import { useToken } from "src/utils/antd_components";

type Props = {
  exchanges: createJournalSessionInput["body"]["exchanges"];
};

const JournalExchanges = (props: Props) => {
  const { exchanges } = props;
  const { token } = useToken();

  if (!exchanges) return null;

  return exchanges.map((exchange) => (
    <div
      style={{
        marginBottom: "20px",
        backgroundColor:
          exchange.speaker !== "user"
            ? token.colorInfoBg
            : token.colorFillTertiary,
        border: `2px solid ${
          exchange.speaker !== "user"
            ? token.colorInfoBorder
            : token.colorFillQuaternary
        }`,
      }}
      className={`tiptapJournal ${
        exchange.speaker === "user" ? "userResponse" : "systemResponse"
      }`}
    >
      {exchange.htmlString ? (
        <div
          dangerouslySetInnerHTML={{
            __html: exchange.htmlString || exchange.rawText,
          }}
        />
      ) : (
        <Markdown>{exchange.rawText}</Markdown>
      )}
    </div>
  ));
};

export default JournalExchanges;
