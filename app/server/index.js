const express = require("express");
const port = process.env.PORT || 3004;
const app = express();
const dotenv = require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");

const NODE_ENV = process.env.NODE_ENV || "Local";
const authorize_token = process.env.authorize_token;

app.listen(port, () => console.log(`The app is running on port ${port}!`));
console.log("Env:", NODE_ENV);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (authorize_token) {
  console.log("It is set!");
} else {
  console.log("Not set!");
}
if (false) {
  const content = ["f", "a", "b", "c", "d", "e", "f"];
  fs.readFile("./app/content.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });
  var file = fs.createWriteStream("./app/content.txt");
  file.on("error", function (err) {
    /* error handling */
  });
  content.forEach(function (v) {
    // file.write(v.join(", ") + "\n");
    file.write(v + "\n");
  });
  file.end();
}

if (true) {
  const base_uri = "https://discord.com/api/v9/";

  const _guilds = "guilds";
  const _id_guild = "735923219315425401";
  const _channel = "/channels";
  const _messages = "/messages";
  const _getAllUsers =
    "737445530162167838/messages/737491428472520804/reactions/%E2%9C%85";

  const _channels = "channels";
  const _id_channel = "955259436111388722";
  const _author = "548302698752245780";
  const _limit = 5;

  // https://discord.com/api/v9/guilds/735923219315425401/messages/search?author_id=548302698752245780
  // https://discord.com/api/v9/channels/737445530162167838/messages/737491428472520804/reactions/%E2%9C%85?limit=100&after=87656785241980928

  const get_channels = `${base_uri}${_guilds}/${_id_guild}${_channel}`;
  const get_messages_in_channel = `${base_uri}${_channels}/${_id_channel}${_messages}`;
  const get_messages_by_user = `${base_uri}${_guilds}/${_id_guild}${_messages}/search?author_id=${_author}`;
  const get_users_in_guild = `${base_uri}${_channel}/${_getAllUsers}?limit=${_limit}`;

  // console.log(get_channels);
  // let result = [];
  // const getFetch = (url, arg1) => {
  //   // function getFetch() {
  //   //   const choice = document.querySelector("input").value;
  //   //   const url = discord_uri;
  //   console.log("url", url);
  //   fetch(url, {
  //     method: "get",
  //     headers: {
  //       Authorization: authorize_token,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   })
  //     .then((res) => res.json()) // parse response as JSON
  //     .then((data) => {
  //       console.log("data", data, data.total_results);
  //       result = data.map((e, i, a) => {
  //         return { name: e.name, id: e.id };
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(`error ${err}`);
  //     });
  // };

  const getFetchAsync = async (url) => {
    try {
      // console.log(url);
      const res = await fetch(url, {
        method: "get",
        headers: {
          Authorization: authorize_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const resData = await res.json();
      // console.log("resData", resData);

      return resData;
    } catch (err) {
      console.log("error:", err);
    }
  };

  async function urlCaller(url, arg1) {
    let urlRes = await getFetchAsync(`${url}${arg1}`);
    return urlRes;
  }

  let _after = "0";
  const total = 26204;
  const iternations = Math.ceil(total / _limit);
  let users = [];
  let holder = urlCaller(get_users_in_guild, `&after=${_after}`).then(
    (arrOfUsers) => {
      // console.log("arrOfUsers", typeof arrOfUsers, arrOfUsers);
      arrOfUsers.forEach((user) => {
        users.push([user.id, user.username]);
      });

      _after = arrOfUsers.slice(-1)[0].id;
      return users;
    }
  );
  console.log("iternations", iternations);

  for (let i = 0; i < 3; i++) {
    // console.log("_after", holder);
    holder.then((x) => x.slice(-1)[0][0]);
    console.log(holder);
  }
  // _after.then((x) => console.log("after2", x));
}

// }
// urlCaller(get_users_in_guild, `&after=${_after}`).then((x) => {
//   let res = x.map((x) => [x.id, x.username]);
//   console.log("res", res, res[res.length - 1][0]);
//   return res;
// });

// console.log(
//   "name",
//   name.map((x) => [x.id, x.username])
// );

// console.log(urlCaller);
// };
// runner();
// const runner = async () => {
// console.log("result2", result);
// urlCaller(get_channels);
// urlCaller(get_messages_in_channel);
// urlCaller(get_messages_by_user);
// let res = arrOfUsers.map((user) => [user.id, user.username]);
// // console.log("res", res, res[res.length - 1][0]);
// res.forEach((x) => users.push(x));
// console.log("users2", users);
// return users.push(res);
