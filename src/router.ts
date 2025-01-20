// src/router.ts

export interface RouteContext {
  request: Request;
  env: any;
  params: Record<string, string>;
}

export class Router {
  private routes: Record<string, (ctx: RouteContext) => Promise<Response>> = {};

  on(path: string, handler: (ctx: RouteContext) => Promise<Response>) {
    this.routes[path] = handler;
  }

  async route(request: Request, env: any) {
    const url = new URL(request.url);
    const handler = this.routes[url.pathname];
    if (handler) {
      return handler({ request, env, params: {} });
    }
    return new Response("Not found", { status: 404 });
  }
}
