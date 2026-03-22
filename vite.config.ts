// oxlint-disable import/no-nodejs-modules
// oxlint-disable max-lines-per-function
import {resolve} from "node:path";
import {defineConfig, loadEnv} from "vite";

const moduleName = "ha-home-dashboard-strategy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_TARGET || "http://localhost:8123";

  return {
    appType: "custom",
    build: {
      lib: {
        entry: "src/index.ts",
        fileName: (_format): string => `${moduleName}.js`,
        formats: ["iife"],
        name: "HomeDashboardStrategy",
      },
      rolldownOptions: {
        external: ["home-assistant-js-websocket", "lit"],
      },
    },
    plugins: [
      {
        configureServer(server): void {
          server.middlewares.use(`/hacsfiles/${moduleName}/${moduleName}.js`, (req, res) => {
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(`console.log("${moduleName} has been substituted by vite")`);
          });
          server.middlewares.use("/sw-modern.js", (req, res) => {
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end('console.log("Service Worker has been substituted by vite")');
          });
        },
        handleHotUpdate(context): void {
          context.server.ws.send({
            type: "full-reload",
          });
        },
        name: "home-assistant",
      },
    ],
    resolve: {
      alias: {
        // oxlint-disable-next-line unicorn/prefer-module
        "@ha": resolve(__dirname, "homeassistant/src"),
      },
    },
    server: {
      cors: true,
      hmr: {
        path: "/@vite/hmr",
      },
      host: true,
      port: 5173,
      proxy: {
        "/api/websocket": {
          changeOrigin: true,
          secure: false,
          target,
          ws: true,
        },
        "^(?!/(src|@vite|@fs|node_modules|homeassistant)).*": {
          changeOrigin: true,
          configure: (proxy): void => {
            proxy.on("proxyRes", (proxyRes, req, res) => {
              if (proxyRes.headers["content-type"]?.includes("text/html")) {
                let body = Buffer.from([]);
                proxyRes.on("data", (chunk) => {
                  body = Buffer.concat([body, chunk]);
                });
                proxyRes.on("end", () => {
                  let html = body.toString("utf8");

                  const scripts = `
                                        <script type="module" src="/@vite/client"></script>
                                        <script type="module" src="/src/index.ts"></script>
                                    `;

                  html = html.replace("</body>", `${scripts}</body>`);

                  res.statusCode = proxyRes.statusCode || 200;
                  for (const key of Object.keys(proxyRes.headers)) {
                    if (key !== "content-length" && key !== "content-encoding") {
                      // oxlint-disable-next-line typescript/no-non-null-assertion
                      res.setHeader(key, proxyRes.headers[key]!);
                    }
                  }
                  res.end(html);
                });
              } else {
                delete proxyRes.headers["content-encoding"];
                res.statusCode = proxyRes.statusCode || 200;
                for (const key of Object.keys(proxyRes.headers)) {
                  // oxlint-disable-next-line typescript/no-non-null-assertion
                  res.setHeader(key, proxyRes.headers[key]!);
                }
                proxyRes.pipe(res);
              }
            });
          },
          headers: {
            "accept-encoding": "identity",
          },
          secure: false,
          selfHandleResponse: true,
          target,
          ws: false,
        },
      },
    },
  };
});
