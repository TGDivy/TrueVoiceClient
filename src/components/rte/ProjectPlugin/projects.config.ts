import { MentionOptions } from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import Fuse from "fuse.js";
import { RefAttributes } from "react";
import useProjectStore from "src/stores/projects_store";
import tippy, { GetReferenceClientRect, Instance, Props } from "tippy.js";
import MentionList, { MentionListProps, MentionListRef } from "./MentionList";

export const projectsConfig: Partial<MentionOptions> = {
  suggestion: {
    char: "+",
    allowSpaces: true,

    items: ({ query }) => {
      const projects = useProjectStore.getState().projects;
      if (!query) {
        return projects;
      }
      const fuse = new Fuse(projects, {
        keys: ["title", "description"],
      });
      return fuse.search(query, { limit: 5 }).map((result) => result.item);
    },

    command: ({ editor, range, props }) => {
      // increase range.to by one when the next node is of type "text"
      // and starts with a space character
      const nodeAfter = editor.view.state.selection.$to.nodeAfter;
      const overrideSpace = nodeAfter?.text?.startsWith(" ");

      if (overrideSpace) {
        range.to += 1;
      }

      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: "mention",
            attrs: {
              id: props._id,
              label: props.title,
              type: "project",
            },
          },
          {
            type: "text",
            text: " ",
          },
        ])
        .run();

      window.getSelection()?.collapseToEnd();
      // editor
      //   .chain()
      //   .focus()
      //   .deleteRange(range)
      //   .insertContent({
      //     type: "mention",
      //     // add type to the attrs (note the keyword type is not allowed)
      //     attrs: {
      //       id: props._id,
      //       label: props.title,
      //       type: "project",
      //       level: 1,
      //     },
      //   })
      //   .run();
    },

    render: () => {
      let component: ReactRenderer<
        MentionListRef,
        MentionListProps & RefAttributes<MentionListRef>
      >;
      let popup: Instance<Props>[];

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionList, {
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

  renderHTML({ options, node }) {
    const elem = document.createElement("a");

    Object.entries(options.HTMLAttributes).forEach(([attr, val]) =>
      elem.setAttribute(attr, val)
    );

    elem.setAttribute("href", `/projects/${node.attrs.id}`);
    // elem.setAttribute("target", "_blank");
    elem.textContent = `${options.suggestion.char}${
      node.attrs.label ?? node.attrs.id
    }`;

    elem.onclick = (e) => {
      e.stopPropagation();
    };

    return elem;
  },
};
