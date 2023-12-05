// src/helpers/utils.js
export const generateStorageKey = (context, linkColumnId) => {
    const { instanceType, boardId, itemId } = context;
    return `iframeSrc-${instanceType}-${boardId}-${itemId || "board"}-${linkColumnId}`;
  };
  