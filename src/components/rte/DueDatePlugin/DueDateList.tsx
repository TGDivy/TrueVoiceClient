import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import "./DueDate.scss";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";
import { formatText } from "src/utils/text";
import { Typography } from "antd";

export interface DueDate {
  date: dayjs.Dayjs;
  label?: string;
}

export interface DueDateListProps {
  items: DueDate[];
  command: (item: DueDate) => void;
}

export interface DueDateListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const DueDateList = forwardRef<DueDateListRef, DueDateListProps>(
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
          {/* <div className="item header">Format: DD.MM.YYYY</div> */}
          <div className="container">
            {props.items.length ? (
              props.items.map((item, index) => (
                <button
                  className={`item ${
                    index === selectedIndex ? "is-selected" : ""
                  }`}
                  key={index}
                  onClick={() => selectItem(index)}
                >
                  {item.label
                    ? formatText(item.label)
                    : item.date.format("ddd, MMM D, YYYY")}
                </button>
              ))
            ) : (
              <>
                <div className="item">No results found</div>
                <div className="item">
                  <Typography.Text strong>Tip: </Typography.Text>
                  <Typography.Text>
                    Follow the format: DD.MM.YYYY
                  </Typography.Text>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default DueDateList;
