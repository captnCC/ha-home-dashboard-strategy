import { defineConfig, loadEnv } from "vite";

const moduleName = "ha-home-dashboard-strategy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_TARGET || "http://localhost:8123";

  return {
    plugins: [
      {
        name: "home-assistant",
        handleHotUpdate(context) {
          context.server.ws.send({
            type: "full-reload"
          });
        },
        configureServer(server) {
          server.middlewares.use(`/hacsfiles/${moduleName}/${moduleName}.js`, (req, res) => {
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(`console.log("${moduleName} has been substituted by vite")`);
          });
          server.middlewares.use("/sw-modern.js", (req, res) => {
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end("console.log(\"Service Worker has been substituted by vite\")");
          });

        },
      },
    ],
    build: {
      lib: {
        entry: "src/index.ts",
        formats: ["iife"],
        name: "HomeDashboardStrategy",
        fileName: (_format) => `${moduleName}.js`
      },
      rolldownOptions: {
        external: [
          "home-assistant-js-websocket",
          "lit",
          /^home-assistant-frontend-types\/.*/
        ]
      }
    },
    server: {
      host: true,
      port: 5173,
      cors: true,
      hmr: {
        path: "/@vite/hmr"
      },
      proxy: {
        "/api/websocket": {
          target,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        "^(?!/(src|@vite|@fs|node_modules)).*": {
          target,
          changeOrigin: true,
          secure: false,
          ws: false,
          selfHandleResponse: true,
          headers: {
            "accept-encoding": "identity",
          },
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes, req, res) => {
              if (proxyRes.headers["content-type"]?.includes("text/html")) {
                let body = Buffer.from([]);
                proxyRes.on("data", (chunk) => {
                  body = Buffer.concat([body, chunk]);
                });
                proxyRes.on("end", () => {
                  let html = body.toString("utf-8");
                                    
                  const scripts = `
                                        <script type="module" src="/@vite/client"></script>
                                        <script type="module" src="/src/index.ts"></script>
                                    `;

                  html = html.replace("</body>", `${scripts}</body>`);

                  res.statusCode = proxyRes.statusCode || 200;
                  Object.keys(proxyRes.headers).forEach((key) => {
                    if (key !== "content-length" && key !== "content-encoding") {
                      res.setHeader(key, proxyRes.headers[key]!);
                    }
                  });
                  res.end(html);
                });
              } else {
                delete proxyRes.headers["content-encoding"];
                res.statusCode = proxyRes.statusCode || 200;
                Object.keys(proxyRes.headers).forEach((key) => {
                  res.setHeader(key, proxyRes.headers[key]!);
                });
                proxyRes.pipe(res);
              }
            });
          },
        },
      },
    },
    appType: "custom"
  };
});