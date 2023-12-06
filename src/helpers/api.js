import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
const KEY = '8d1ec8e38145068b58583c221763848e';

monday.setToken('eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMwMDc4NzcwNCwiYWFpIjoxMSwidWlkIjo1Mjc2MTI5MywiaWFkIjoiMjAyMy0xMi0wNVQxNjowODo1NS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjAxMzkzODcsInJnbiI6ImV1YzEifQ.KPLsLuobUCRNKn6MSJo7MGLltAwx3jfZVMZFaaP7jkU');

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
    `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(
      url
    )}&key=${KEY}&iframe=1&omit_script=1`
  );
  const data = await response.json();
  console.log("PG_EA:: fetchIframelyData", data);
  return data.html;
};
