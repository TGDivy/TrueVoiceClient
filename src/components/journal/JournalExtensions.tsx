import { Extensions } from "@tiptap/react";
import { dueDateConfig } from "../rte/DueDatePlugin/due_date.config.";
import { DueDate } from "../rte/DueDatePlugin/due_date.plugin";
import { Mention } from "../rte/mention";
import { projectsConfig } from "../rte/ProjectPlugin/projects.config";

import Block from "@tiptap/extension-blockquote";
import { BulletList } from "../rte/bullet_list";
import { CodeBlock } from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { Bold } from "@tiptap/extension-bold";
import { Code } from "@tiptap/extension-code";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";

import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { History } from "@tiptap/extension-history";

import CharacterCount from "@tiptap/extension-character-count";
import { Placeholder } from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";

export const journalExtensions: Extensions = [
  Block,
  BulletList.configure({}),
  CodeBlock,
  Document,
  HardBreak,
  Heading,
  HorizontalRule,
  ListItem,
  OrderedList,
  Paragraph,
  Text,

  Bold,
  Code,
  Italic,
  Strike,

  Dropcursor,
  Gapcursor,
  History,

  Mention.configure(projectsConfig),
  DueDate.configure(dueDateConfig),
  CharacterCount,
  Typography,
  Placeholder.configure({
    placeholder: "Enter your thoughts here …",
  }),
];
