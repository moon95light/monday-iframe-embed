import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export const fetchBoardData = async (boardId, itemId) => {
  const query = `
    query {
      boards(ids:[${boardId}]) {
        columns { type title id }
        items(ids:[${itemId}]) {
          column_values { id text }
        }
      }
    }
  `;
  const response = await monday.api(query);
  console.log("PG_EA:: fetchBoardData", response);
  return response.data.boards[0];
};

export const fetchIframelyData = async (url) => {
  const response = await fetch(
    `https://iframe.ly/api/iframely?url=${encodeURIComponent(
      url
    )}&api_key=2f2cd213b6cd7f38089c48`
  );
  const data = await response.json();
  console.log("PG_EA:: fetchIframelyData", data);
  return data.html;
};
