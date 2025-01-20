// src/router.ts

export interface RouteContext {
  request: Request;
  env: any;
  params: Record<string, string>;
}

type RouteHandler = (ctx: RouteContext) => Promise<Response>;

export class Router {
  private routes: Record<string, RouteHandler> = {};

  on(path: string, handler: RouteHandler) {
    this.routes[path] = handler;
  }

  async route(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const handler = this.routes[url.pathname];

    if (handler) {
      return handler({ request, env, params: {} });
    }

    return new Response("Not found", { status: 404 });
  }
}
