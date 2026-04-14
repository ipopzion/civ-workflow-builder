import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route('/builder', 'routes/builder.tsx'),
  route('/execution-log/:id', 'routes/execution-log-entry.tsx'),
  route('/execution-log', 'routes/execution-log.tsx'),
] satisfies RouteConfig
