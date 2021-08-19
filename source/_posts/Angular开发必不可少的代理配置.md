---
title: Angular开发必不可少的代理配置
date: 2019-08-02 18:07:30
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


此处说的代理是 `ng serve` 提供的代理服务。

在开发环境中，Angular应用与后端服务联调测试时，Chrome浏览器会对发请求进行跨域检测。通过代理服务，来解决开发模式下的跨域问题。

接下来我们通过代理服务实现请求 `http://localhost:4200/api`  时代理到后端服务`http://localhost:8080/api` 

<a name="WehaY"></a>
## 基本代理
首先我们需要在项目更目录下创建一个名为 `proxy.conf.json` 的代理配置文件，内容如下：

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

我们通过 `--proxy-config` 参数来加载代理配置文件：

```bash
ng serve --proxy-config=proxy.conf.json
```

我们还可以在 `angular.json` 中通过 `proxyConfig` 属性来设置代理：

```json
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "proxy.conf.json"
    },
```

> `angular.json` 是Angular CLI的配置文件

<a name="B8I6W"></a>
## 路径重写

在基本代理中，我们配置了`http://localhost:4200/api` 代理后端服务 `http://localhost:8080/api`。而在实际开发中，我们的后端服务可能没有提供 `/api` 前缀，实际的后端服务可能是这样的：

```
http://localhost:8080/users
http://localhost:8080/orders
```

在这种情况下，上面配置的基本代理就无法满足我们的需求了，因此后端不存在 `http://localhost:8080/api/users` 服务。幸运的是， `Angular CLI` 代理提供了路径重写功能。

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

此时我们在浏览器访问 `http://localhost:4200/api/users` , 代理服务会给我们代理到后端服务 `http://localhost:8080/users` 上。

路径重写功能可以让我们很好的区分前端路由和后端服务。可以一目了然的知道`http://localhost:4200/api/users`访问的是一个后端服务。

<a name="5vMiu"></a>
## 非本地域
随着互联技术的发展，前后端分工越来越明确。前后端的交互就是REST接口。在这样的实际环境中，我们的前端工程师的本地不会运行后端服务，而是使用后端工程师提供的服务，此时，我们的后端服务的域就不会是 `localhost` , 而可能是 `http://test.domain.com/users` 。

此时我们就需要用的代理的另一个参数 `changeOrigin` 来满足我们的需求：

```json
{
  "/api": {
    "target": "http://test.domain.com",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "changeOrigin": true
  }
}
```

这样，我们访问 `http://localhost:4200/api/users` 就会被代理到`http://test.domain.com/users` 。

<a name="P0aeg"></a>
## 代理日志
在使用前端代理的过程中，如果想要调试代理是否正常工作，还可以添加 `logLevel` 选项：

```json
{
  "/api": {
    "target": "http://test.domain.com",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "logLevel": "debug"
  }
}
```

`logLevel` 支持的级别选项有 `debug` , `info` , `warn` , `silent` ，默认是 `info` 级别.

<a name="n4saq"></a>
## 多代理入口
如果前端需要配置多个入口代理到同一个后端服务，不想使用前面的路径重写方式，我们可以创建一个 `proxy.conf.js` 文件来替代我们上面的 `proxy.conf.json` ：

```javascript
const PROXY_CONFIG = [
    {
        context: [
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target: "http://localhost:3000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
```

修改我们的 `angular.json` 中的 `proxyConfig` 为 `proxy.conf.js` ：

```json
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "proxy.conf.js"
    },
```


![](https://user-gold-cdn.xitu.io/2019/7/23/16c1ed307173ecee?w=900&h=450&f=png&s=153639)
