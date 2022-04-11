// const base_uri = "https://discord.com/api/v9/";
// const authorize_token =
//   "NjkzNjk0MzQ3MjY2NDkwNDA5.YlNtuA.5bN2Eg6FBmOojYXGFTOF93jGZE4";
// const _endpoint_uri_guilds = "guilds";
// const _id_guild = "735923219315425401";
// const _channel = "/channels";
// const _messages = "/messages";

// const _endpoint_uri_channels = "channels";
// const _id_channel = "955259436111388722";
// const _author = "548302698752245780";

// // https://discord.com/api/v9/guilds/735923219315425401/messages/search?author_id=548302698752245780
// const get_channels = `${base_uri}${_endpoint_uri_guilds}/${_id_guild}${_channel}`;
// const get_messages_in_channel = `${base_uri}${_endpoint_uri_channels}/${_id_channel}${_messages}`;
// const get_messages_by_user = `${base_uri}${_endpoint_uri_guilds}/${_id_guild}${_messages}/search?author_id=${_author}`;

// console.log(get_channels);

// const getFetch = (url) => {
//   // function getFetch() {
//   //   const choice = document.querySelector("input").value;
//   //   const url = discord_uri;
//   console.log("url", url);
//   fetch(url, {
//     method: "get",
//     headers: new Headers({
//       Authorization: authorize_token,
//       "Content-Type": "application/x-www-form-urlencoded",
//     }),
//   })
//     .then((res) => res.json()) // parse response as JSON
//     .then((data) => {
//       console.log("data", data);
//       const result = data.map((e, i, a) => {
//         return { name: e.content, id: e.id };
//       });
//       console.log("result", result);
//     })
//     .catch((err) => {
//       console.log(`error ${err}`);
//     });
// };

// // getFetch(get_channels);
// // getFetch(get_messages_in_channel);
// getFetch(get_messages_by_user);
// Requiring fs module in which
// writeFile function is defined.
const fs = require("fs");

// Data which will write in a file.
let data = "Learning how to write in a file.";

// Write data in 'Output.txt' .
fs.writeFile("Output.txt", data, (err) => {
  // In case of a error throw err.
  if (err) throw err;
});
