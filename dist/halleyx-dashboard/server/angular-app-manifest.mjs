
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/configure-dashboard"
  },
  {
    "renderMode": 2,
    "route": "/orders"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24645, hash: '383bcab2b807dcd914db937d72159bbbff7c8f89cf228d77e5607dc3ad151e1e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17161, hash: '5cd7463a9d6e72b172c04bc657a44a21190db3e748dc0a737d11b0e4605d440f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 33987, hash: 'a956aa123d59a1d7c98e44a04782d78087e4093b0cb95ffdae490b750a1abae0', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'configure-dashboard/index.html': {size: 38397, hash: 'f933c14d81e3f95ef113272b38c56fa8272e45200caddfa9a1c3ffdbb29a3ba7', text: () => import('./assets-chunks/configure-dashboard_index_html.mjs').then(m => m.default)},
    'orders/index.html': {size: 64241, hash: 'd6e8cae0cda1c3d11c15d35850da3907b7bd982cbb2799ad1e6cfbeb0383af55', text: () => import('./assets-chunks/orders_index_html.mjs').then(m => m.default)},
    'styles-4KNJEDFK.css': {size: 8043, hash: 'tbl85N9iC0k', text: () => import('./assets-chunks/styles-4KNJEDFK_css.mjs').then(m => m.default)}
  },
};
