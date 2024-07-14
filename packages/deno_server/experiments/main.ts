import { Planigale } from "jsr:@codecat/planigale@0.1.4";

const app = new Planigale();

app.route({
  method: "GET",
  url: "/",
  handler: async (req, res) => {
    res.send({ok: true});
  }
});

app.serve({port: 8000});

