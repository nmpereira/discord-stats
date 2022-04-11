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
const _limit = 3;

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
  console.log("running...");
  // let urlRes =
  return await getFetchAsync(`${url}${arg1}`);
}

const runner = async () => {
  let users = [];
  let _lastid = 0;
  const total = 26204;
  const iternations = Math.ceil(total / _limit);
  console.log("iternations", iternations);

  // first url
  for (let i = 0; i < 5; i++) {
    await urlCaller(get_users_in_guild, `&after=${_lastid}`).then((x) => {
      _lastid = x.slice(-1)[0].id;
      users.push(x);
      // console.log(users);
    });
    console.log("_lastid", _lastid);

    //   _lastid = grablastid(users);
    //   console.log("_lastid", _lastid);
    //   let call = await urlCaller(
    //     get_users_in_guild,
    //     `&after=${grablastid(users)}`
    //   );
    //   console;
  }

  function grablastid(arr) {
    let res;
    if (arr.length == 0) return 0;
    res = arr.slice(-1)[0].id;

    return res;
  }
};

runner();
