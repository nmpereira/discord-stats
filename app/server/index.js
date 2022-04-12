const express = require("express");
const port = process.env.PORT || 3004;
const app = express();
const dotenv = require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
const UserModel = require("./models/users");

const NODE_ENV = process.env.NODE_ENV || "Local";
const authorize_token = process.env.authorize_token;
const mongoose = require("mongoose");
mongoose.connect(process.env.db_devdash);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.error("Connected to db"));

app.listen(port, () => console.log(`The app is running on port ${port}!`));
console.log("Env:", NODE_ENV);

app
  .get("/", async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
      // res.redirect("/");
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  })
  .get("/users", async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
      // res.redirect("/");
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  })
  .set("json spaces", 2);

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
const _mainChannel = "737445530162167838";

// const _channels = "channels";
const _id_channel = "955259436111388722";

// https://discord.com/api/v9/guilds/735923219315425401/messages/search?author_id=548302698752245780
// https://discord.com/api/v9/channels/737445530162167838/messages/737491428472520804/reactions/%E2%9C%85?limit=100&after=87656785241980928
// https://discord.com/api/v9/channels/737445530162167838/messages

const get_channels = `${base_uri}${_guilds}/${_id_guild}${_channel}`;
const get_messages_in_channel = `${base_uri}${_channel}/${_id_channel}${_messages}`;
const get_messages_by_user = `${base_uri}${_guilds}/${_id_guild}${_messages}`;
const get_users_in_guild = `${base_uri}${_channel}/${_getAllUsers}`;
const get_user_count = `${base_uri}${_channel}/${_mainChannel}${_messages}`;

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

    const data = await res.json();
    const status = res.status;
    return { data, status };
  } catch (err) {
    console.log("error:", err);
  }
};

async function urlCaller(url, arg1) {
  console.log("running...", `${url}${arg1}`);
  // let urlRes =
  return await getFetchAsync(`${url}${arg1}`);
}

const runner = async () => {
  let users = [];
  let users_db = [];
  let _lastid = 0;
  let total;
  let userBool = true;
  let _limit = 100; //default: 100
  let count_failure = 0;
  let time_between_requests = 750; //ms
  let run_get_members = true;
  let run_get_messages_by_user = true;
  let start_time = Date.now();
  const time_since_start = (time) => {
    return ((Date.now() - time) / 1000).toFixed(2);
  };

  await urlCaller(get_user_count, "").then(({ data, status }) => {
    total = data[0].reactions[0].count;
  });
  console.log("total", total);
  let iterations = Math.ceil(total / _limit);
  console.log("iterations", iterations);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  iterations = 2; //if override,specify. Default 'iterations' variable
  if (run_get_members) {
    for (let i = 0; i < iterations; i++) {
      await sleep(time_between_requests);
      const { data, status } = await urlCaller(
        get_users_in_guild,
        `?limit=${_limit}&after=${_lastid}`
      );

      console.log(
        "Number of users found:",
        data.length,
        "Time Elapsed:",
        time_since_start(start_time)
      );
      if (data.length == 0) {
        userBool = false;
        return;
      }
      _lastid = data.slice(-1)[0].id;
      data.map((data_user) => {
        users.push(data_user);
        users_db.push({
          updateOne: {
            filter: { id: data_user.id },
            update: {
              $set: data_user,
            },
            upsert: true, // <<==== upsert in every document
          },
        });
      });
    }
    // console.log("users", users);
    // const User = new UserModel({
    //   user: users,
    // });
    try {
      await UserModel.collection.bulkWrite(users_db);
      // const writeDb = await User.insertMany();
    } catch (err) {
      console.log("db error:", err);
    }
  }
  if (run_get_messages_by_user) {
    let Get_Message_start_time = Date.now();
    for (let i = 0; i < users.length; i++) {
      const e = users[i];
      await sleep(time_between_requests);
      if (count_failure >= 10) {
        throw new Error(`Too many failed requests: ${count_failure}`);
      }
      try {
        const { data, status } = await urlCaller(
          get_messages_by_user,
          `/search?author_id=${e.id}`
        );
        // update the db with this
        const message_obj = {
          id: e.id,
          total_messages: data.total_results,
          messages: data.messages,
        };

        console.log(
          `Number of messages for ${message_obj.id}:${
            message_obj.total_messages
          }. Time Elapsed: ${time_since_start(
            start_time
          )} | Time Elapsed (Message Count): ${time_since_start(
            Get_Message_start_time
          )}`
        );
        users_db.push({
          updateOne: {
            filter: { id: message_obj.id },
            update: {
              $set: message_obj,
            },
            upsert: true, // <<==== upsert in every document
          },
        });
        try {
          await UserModel.collection.bulkWrite(users_db);
          // const writeDb = await User.insertMany();
        } catch (err) {
          console.log("db error:", err);
        }

        if (status >= 300) {
          count_failure++;
          console.log("Error message:", status, data.message);
          if (status == 429) {
            console.log(
              "Rate limit error:",
              data.message,
              "Code:",
              status,
              "retry after:",
              data.retry_after
            );
            i = i - 1;
            const retry_ms = Math.ceil(data.retry_after + 1) * 1000;
            await sleep(retry_ms);
          } else {
            console.log(
              "Error message (Non 429 code):",
              status,
              "message:",
              data.message
            );
          }

          continue;
        }
        count_failure = 0;
      } catch (err) {
        console.log("err:", err);
        await sleep(10000);
        count_failure++;
        i = i - 1;
      }
    }
    console.log("donezo!");
  }
};
runner();
