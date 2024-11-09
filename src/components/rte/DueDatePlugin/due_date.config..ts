import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import dayjs from "dayjs";
import { RefAttributes } from "react";
import tippy, { GetReferenceClientRect, Instance, Props } from "tippy.js";
import DueDateList, { DueDateListProps, DueDateListRef } from "./DueDateList";
import { DueDateOptions } from "./due_date.plugin";
import Fuse from "fuse.js";
import { extractIds } from "src/utils/extract_data";
import { message } from "antd";

export const DueDatePluginKey = new PluginKey("dueDate");

// today: dayjs(),
// tomorrow: dayjs().add(1, "day"),
// "in 3 days": dayjs().add(3, "day"),
// "end of week": dayjs().endOf("week"),
// "end of month": dayjs().endOf("month"),

const relativeDates = [
  // essentials
  { label: "today", date: dayjs() },
  { label: "tomorrow", date: dayjs().add(1, "day") },
  { label: "in 3 days", date: dayjs().add(3, "day") },
  { label: "end of week", date: dayjs().endOf("week") },
  { label: "end of month", date: dayjs().endOf("month") },

  // additional
  { label: "in 1 week", date: dayjs().add(1, "week") },
  { label: "in 2 weeks", date: dayjs().add(2, "week") },
  { label: "in 1 month", date: dayjs().add(1, "month") },
  { label: "in 3 months", date: dayjs().add(3, "month") },
  { label: "in 6 months", date: dayjs().add(6, "month") },
  { label: "in 1 year", date: dayjs().add(1, "year") },
  { label: "in 2 years", date: dayjs().add(2, "year") },
  { label: "in 5 years", date: dayjs().add(5, "year") },

  // past
  { label: "yesterday", date: dayjs().subtract(1, "day") },
  { label: "3 days ago", date: dayjs().subtract(3, "day") },
  { label: "start of week", date: dayjs().startOf("week") },
  { label: "start of month", date: dayjs().startOf("month") },
  { label: "start of year", date: dayjs().startOf("year") },
  { label: "last week", date: dayjs().subtract(1, "week") },
  { label: "last month", date: dayjs().subtract(1, "month") },
  { label: "last year", date: dayjs().subtract(1, "year") },
];

export const dueDateConfig: Partial<DueDateOptions> = {
  suggestion: {
    char: "due:",
    pluginKey: DueDatePluginKey,
    allowSpaces: true,

    items: ({ query, editor }) => {
      // if editor already has a due date, don't show suggestions
      if (extractIds("dueDate", editor.getJSON()).length > 0) {
        message.warning("You can only have one due date per task");
        return [];
      }

      if (!query) {
        return relativeDates.slice(0, 5);
      }

      // Example 19.07.2021 should be parsed as 2021-07-19
      // Example 19.07.21 should be parsed as 2021-07-19
      // Example 19.07 should be parsed as currentyear-07-19
      // Example 19 should be parsed as currentyear-currentmonth-19
      // Example tomorrow should be parsed as currentyear-currentmonth-currentday+1
      const parsedDate = dayjs(
        query,
        [
          "DD.MM.YY",
          "DD.MM.YYYY",
          "DD/MM/YY",
          "DD/MM/YYYY",
          "DD-MM-YY",
          "DD-MM-YYYY",
        ],
        true
      );

      if (parsedDate.isValid()) {
        return [{ date: parsedDate }];
      }

      // If the parsed date is not valid, generate a list of possible dates

      // count the number of separators in the query (dots, slashes, dashes)
      const separatorCount = query
        .split("")
        .filter((c) => c === "." || c === "/" || c === "-").length;

      // If there is no separator, the query is a day
      // If there is one separator, the query is a day and a month
      // If there are two separators, the query is a day, a month and a year

      const possibleDates = [];
      let day: number;
      let month: number;

      switch (separatorCount) {
        case 0:
          // push 12 months into the future starting from the current month
          day = Number(query);
          if (!isNaN(day) && day > 0 && day < 32) {
            for (let month = 0; month < 12; month++) {
              possibleDates.push({
                date: dayjs()
                  .month(dayjs().month() + month)
                  .date(day),
              });
            }
          }
          break;
        case 1:
        case 2:
          // push 5 years into the future
          // separator can be a dot, a slash or a dash
          day = Number(query.split(/[.-/]/)[0]);
          month = Number(query.split(/[.-/]/)[1]);
          if (
            !isNaN(day) &&
            day > 0 &&
            day < 32 &&
            !isNaN(month) &&
            month >= 0 &&
            month < 13
          ) {
            if (month === 0) month = dayjs().month() + 1;
            for (let year = 0; year < 5; year++) {
              possibleDates.push({
                date: dayjs()
                  .year(dayjs().year() + year)
                  .date(day)
                  .month(month - 1),
              });
            }
          }
          break;
        default:
          break;
      }

      if (!parsedDate.isValid()) {
        // handle synonyms like "tomorrow", "in a week", "end of month", etc.
      }

      if (possibleDates.length > 0) {
        return possibleDates;
      }

      const fuse = new Fuse(relativeDates, {
        keys: ["label"],
      });

      return fuse.search(query, { limit: 5 }).map((result) => result.item);
    },

    command: ({ editor, range, props }) => {
      const nodeAfter = editor.view.state.selection.$to.nodeAfter;
      const overrideSpace = nodeAfter?.text?.startsWith(" ");

      const dayJS = props.date as dayjs.Dayjs;

      const date = dayJS.format("ddd, MMM D, YYYY");
      const dateISO = dayJS.toISOString();

      if (overrideSpace) {
        range.to += 1;
      }

      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: "dueDate",
            attrs: {
              id: dateISO,
              label: ` ${date}`,
              type: "dueDate",
            },
          },
          {
            type: "text",
            text: " ",
          },
        ])
        .run();

      window.getSelection()?.collapseToEnd();
    },

    render: () => {
      let component: ReactRenderer<
        DueDateListRef,
        DueDateListProps & RefAttributes<DueDateListRef>
      >;
      let popup: Instance<Props>[];

      return {
        onStart: (props) => {
          component = new ReactRenderer(DueDateList, {
            props,
            editor: props.editor,
          });

          if (!props?.clientRect) {
            return;
          }

          const getReferenceClientRect: GetReferenceClientRect = () => {
            if (!props?.clientRect) {
              throw new Error("clientRect is not available");
            }
            const val = props.clientRect();
            if (!val) {
              throw new Error("clientRect is not available");
            }
            return val;
          };

          const tippyProps: Partial<Props> = {
            getReferenceClientRect: getReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          };

          popup = tippy("body", tippyProps);
        },

        onUpdate(props) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          const getReferenceClientRect: GetReferenceClientRect = () => {
            if (!props?.clientRect) {
              throw new Error("clientRect is not available");
            }
            const val = props.clientRect();
            if (!val) {
              throw new Error("clientRect is not available");
            }
            return val;
          };

          popup[0].setProps({
            getReferenceClientRect: getReferenceClientRect,
          });
        },

        onKeyDown(props) {
          if (props.event?.key === "Escape") {
            popup[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  },

  HTMLAttributes: {
    class: "mention",
  },
};
