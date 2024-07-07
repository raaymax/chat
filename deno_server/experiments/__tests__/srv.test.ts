import { assertEquals, assert } from "asserts";
import { Application } from "../srv.ts";


Deno.test("Basic functions", async () => {
  const app = new Application();
  app.route({
    method: "GET",  
    url: "/users/:id",
    schema: {

    },
    handler: async (req, res) => {
      assertEquals(req.params.id, "oko");
      assertEquals(req.query.sad, "123");
      assertEquals(req.query.zxc, "432");
      assertEquals(req.url, "http://localhost/users/oko?sad=123&zxc=432");
      assertEquals(req.method, "GET");
      assertEquals(req.path, "/users/oko");
      res.send({ok: true});
    }
  })
  const req = new Request("http://localhost/users/oko?sad=123&zxc=432", {
    method: "GET",
  });
  const res = await app.handle(req);
  assertEquals(res.status, 200);
  assertEquals(res.headers.get('content-type'), 'application/json');
  assertEquals(await res.json(), { ok: true });
})

Deno.test("Body validation", async () => {
  const app = new Application();
  app.route({
    method: "POST",  
    url: "/body",
    schema: {
      body: {
        type: "object",
        required: ["data"],
        properties: {
          data: { type: "string" }
        }
      }
    },
    handler: async (req, res) => {
      assertEquals(req.body.data, "oko");
      res.send({ok: true});
    }
  })
  const req = new Request("http://localhost/body", {
    method: "POST",
    body: JSON.stringify({ data: "oko" }),
  });
  const res = await app.handle(req);
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { ok: true });
})

Deno.test("Body validation failed", async () => {
  const app = new Application();
  app.route({
    method: "POST",  
    url: "/body",
    schema: {
      body: {
        type: "object",
        required: ["data", 'asd'],
        properties: {
          data: { type: "string" },
          asd: { type: "number" }
        }
      } as const
    },
    handler: async (req, res) => {
      assert(false);
    }
  })
  const req = new Request("http://localhost/body", {
    method: "POST",
    body: JSON.stringify({ other: "oko", asd: "zxc" }),
  });
  const res = await app.handle(req);
  assertEquals(res.status, 400);
  assertEquals(await res.json(), [
    {
      block: "body",
      instancePath: "",
      keyword: "required",
      message: "must have required property 'data'",
      params: {
        missingProperty: "data",
      },
      schemaPath: "#/required",
    },
    {
      block: "body",
      instancePath: "/asd",
      keyword: "type",
      message: "must be number",
      params: {
        type: "number",
      },
      schemaPath: "#/properties/asd/type",
    },
  ]);
})

Deno.test("Validation error aggregation", async () => {
  const app = new Application();
  app.route({
    method: "POST",  
    url: "/validation/:id",
    schema: {
      body: {
        type: "object",
        required: ["data"],
        properties: {
          data: { type: "string" },
        }
      },
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "number" }
        }
      },
      headers: {
        type: "object",
        required: ["authorization"],
        properties: {
          authorization: { 
            type: "string",
            pattern: "[Bb]earer .*"
          }
        }
      },
      query: {
        type: "object",
        required: ["asd"],
        properties: {
          asd: { type: "number" }
        }
      }
    },
    handler: async (req, res) => {
      assert(false);
    }
  })
  const req = new Request("http://localhost/validation/asd?asd=test", {
    method: "POST",
    body: JSON.stringify({ other: "oko" }),
    headers: {
      authorization: "token"
    }
  });
  const res = await app.handle(req);
  assertEquals(res.status, 400);
  assertEquals(await res.json(), [
    {
      block: "body",
      instancePath: "",
      keyword: "required",
      message: "must have required property 'data'",
      params: {
        missingProperty: "data",
      },
      schemaPath: "#/required",
    },
    {
      block: "params",
      instancePath: "/id",
      keyword: "type",
      message: "must be number",
      params: {
        type: "number",
      },
      schemaPath: "#/properties/id/type",
    },
    {
      block: "query",
      instancePath: "/asd",
      keyword: "type",
      message: "must be number",
      params: {
        type: "number",
      },
      schemaPath: "#/properties/asd/type",
    },
    {
      block: "headers",
      instancePath: "/authorization",
      keyword: "pattern",
      message: 'must match pattern "[Bb]earer .*"',
      params: {
        pattern: "[Bb]earer .*",
      },
      schemaPath: "#/properties/authorization/pattern",
    }
  ]);
})

Deno.test("Middlewares", async () => {
  const app = new Application();
  app.use(async (req, res, next) => {
    req.state.data = "middleware";
    await next();
    res.headers.set("x-middleware", "true");
  });
  app.route({
    method: "GET",  
    url: "/users/:id",
    schema: {},
    handler: async (req, res) => {
      res.send({ok: req.state.data});
    }
  })
  const req = new Request("http://localhost/users/oko?sad=123&zxc=432", {
    method: "GET",
  });
  const res = await app.handle(req);
  assertEquals(res.status, 200);
  assertEquals(await res.json(), { ok: "middleware" });
  assertEquals(res.headers.get("x-middleware"), "true");
})
