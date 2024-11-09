import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import "./MentionList.scss";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ProjectDocument } from "@server/models/project.model";

export interface MentionListProps {
  items: ProjectDocument[];
  command: (item: ProjectDocument) => void;
}

export interface MentionListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command(item);
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (e) => {
        const event = e.event;
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <>
        <div className="items css-var-r0">
          {props.items.length ? (
            props.items.map((item, index) => (
              <button
                className={`item ${
                  index === selectedIndex ? "is-selected" : ""
                }`}
                key={index}
                onClick={() => selectItem(index)}
              >
                {item.title}
              </button>
            ))
          ) : (
            <div className="item">No result</div>
          )}
        </div>
      </>
    );
  }
);

export default MentionList;
