import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const target = env.VITE_TARGET || "http://localhost:8123";

    return {
        plugins: [
            {
                name: 'sw-hot-reload',
                handleHotUpdate(context) {
                    context.server.ws.send({
                        type: 'full-reload'
                    });
                }
            }
        ],
        build: {
            lib: {
                entry: "src/index.ts",
                formats: ["iife"],
                name: "HomeDashboardStrategy",
                fileName: (format) => `ha-home-dashboard-strategy.js`
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
              path: '/@vite/hmr'
            },
            proxy: {
                "/api": {
                    target,
                    changeOrigin: true,
                    secure: false,
                    ws: true,
                },
                "^(?!\/(src|@vite|@fs|node_modules)).*": {
                    target,
                    changeOrigin: true,
                    secure: false,
                    ws: true,
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