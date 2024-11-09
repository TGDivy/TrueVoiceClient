// {
//   "type": "doc",
//   "content": [
//     {
//       "type": "paragraph",
//       "content": [
//         {
//           "type": "text",
//           "text": "asd asd "
//         },
//         {
//           "type": "mention",
//           "attrs": {
//             "id": "65cf9fcb873eb07761560427",
//             "label": "Gow V2",
//             "type": "project"
//           }
//         },
//         {
//           "type": "text",
//           "text": " "
//         }
//       ]
//     }
//   ]
// }

// Extrac ids given a type from a Object
export const extractIds = (
  type: string,
  obj: {
    [key: string]: unknown;
  }
): string[] => {
  const ids: string[] = [];

  const extractIdsFromNode = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach((n) => extractIdsFromNode(n));
    } else if (typeof node === "object" && node !== null) {
      const nodeRecord = node as Record<string, unknown>;

      if (nodeRecord["type"] === type) {
        if (nodeRecord["id"] && typeof nodeRecord["id"] === "string")
          ids.push(nodeRecord["id"]);
      }
      Object.values(nodeRecord).forEach((n) => extractIdsFromNode(n));
    }
  };
  extractIdsFromNode(obj);
  return ids;
};
