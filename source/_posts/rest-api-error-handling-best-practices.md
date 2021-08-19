---
title: REST API错误处理的最佳实践
date: 2020-08-17 18:27:00
tags:
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 1. 介绍

REST是一种无状态的架构，客户端可以在其中访问和操作服务器上的资源。通常，REST服务利用HTTP发布它们管理的一组资源，并提供允许客户机获取或更改这些资源状态的API。

在本教程中，我们将学习处理REST API错误的一些最佳实践，包括为用户提供相关信息的有用方法、来自大型网站的示例以及使用示例Spring REST应用程序的具体实现。

## 2. HTTP状态码

当客户端向HTTP服务器发出请求时——服务器成功接收到请求——服务器必须通知客户端请求是否被成功处理。HTTP完成这与五类状态代码:
- 10x(信息性): 服务器确认请求
- 20x(成功): 服务器按预期完成请求
- 30x(重定向): 客户端需要执行进一步的操作来完成请求
- 40x(客户端错误): 客户端发送了一个无效的请求
- 50x(服务器错误): 服务器由于服务器错误而无法满足有效请求

客户端可以根据响应代码推测特定请求的结果。

## 3.处理错误

处理错误的第一步是向客户机提供正确的状态码。此外，我们可能需要在响应体中提供更多信息。

### 3.1 基本响应

处理错误最简单的方法是使用适当的状态码进行响应。

一些常见的回应码包括:
- 400错误的请求: 客户端发送了一个无效的请求,例如缺少必需的请求体或参数
- 401未经授权: 客户端对服务器进行身份验证失败
- 403禁止: 经过身份验证的客户端，但没有访问请求资源的权限
- 404未找到: 所请求的资源不存在
- 412先决条件失败: 请求头字段中的一个或多个条件被评估为false
- 500内部服务器错误: 一个通用错误发生在服务器上
- 503服务不可用: 所请求的服务不可用

虽然很基本，但这些代码允许客户机了解所发生错误的广泛性质。例如，我们知道如果我们收到一个403错误，说明我们没有权限访问我们请求的资源。

然而，在许多情况下，我们需要在我们的答复中提供补充细节。

500错误表明服务器在处理请求时发生了一些问题或异常。一般来说，这个内部错误与我们的客户无关。

因此，为了尽量减少对客户机的响应，我们应该努力尝试处理或捕获内部错误，并在可能的情况下使用其他适当的状态代码进行响应。例如，如果由于请求的资源不存在而发生异常，我们应该将其公开为404错误，而不是500错误。

这并不是说不应该返回500，而是说应该将其用于阻止服务器执行请求的意外情况(如服务中断)。

### 3.2. 默认Spring错误响应

这些原则是如此普遍，以至于Spring已经在其默认的错误处理机制中编写了它们。

为了演示，假设我们有一个简单的Spring REST应用程序，它管理图书，有一个端点根据ID检索图书:

```
curl -X GET -H "Accept: application/json" http://localhost:8082/spring-rest/api/book/1
```

如果没有ID为1的书，我们期望控制器会抛出BookNotFoundException异常。在这个端点上执行GET，我们看到这个异常被抛出，响应体为:

```json
{
    "timestamp":"2019-09-16T22:14:45.624+0000",
    "status":500,
    "error":"Internal Server Error",
    "message":"No message available",
    "path":"/api/book/1"
}
```

注意，这个默认的错误处理程序包括错误发生时的时间戳、HTTP状态代码、标题(错误字段)、消息(默认为空)和错误发生时的URL路径。

这些字段为客户端或开发人员提供信息，以帮助解决问题，还构成了标准错误处理机制的一些字段。

另外，请注意，当BookNotFoundException被抛出时，Spring会自动返回一个HTTP状态码为500。尽管有些api会返回500状态码或其他通用代码，正如我们将在Facebook和Twitter api中看到的那样——为了简单起见，对于所有错误，最好尽可能使用最具体的错误代码。

在我们的示例中，我们可以添加一个@ControllerAdvice，这样当BookNotFoundException被抛出时，我们的API会返回一个状态404，表示没有找到，而不是500内部服务器错误。

### 3.3. 更多的响应细节

正如在上面的Spring示例中看到的，有时状态代码不足以显示错误的细节。在需要时，我们可以使用响应体向客户机提供附加信息。在提供详细回应时，我们应包括:

- 错误：错误的唯一标识符
- 消息：一个简短的人类可读的消息
- 细节: 对错误的更长的解释

例如，如果客户端发送了一个带有错误凭据的请求，我们可以发送一个包含以下内容的401响应:

```json
{
    "error": "auth-0001",
    "message": "Incorrect username and password",
    "detail": "Ensure that the username and password included in the request are correct"
}
```

错误字段不应该与响应代码匹配。相反，它应该是应用程序特有的错误代码。通常，错误字段没有约定，希望它是唯一的。

通常，该字段只包含字母数字和连接字符，如破折号或下划线。例如，0001、auth-0001和incorrect-user-pass都是错误代码的典型示例。

通常认为主体的消息部分在用户界面上是可显示的。因此，如果我们支持国际化，就应该翻译这个标题。因此，如果客户端发送一个带有对应于法语的Accept-Language头的请求，则title值应该被翻译成法语。

细节部分是为客户端的开发人员而不是最终用户使用的，因此不需要进行翻译。

此外，我们还可以提供一个URL -如帮助字段-客户可以跟踪发现更多的信息:

```json
{
    "error": "auth-0001",
    "message": "Incorrect username and password",
    "detail": "Ensure that the username and password included in the request are correct",
    "help": "https://example.com/help/error/auth-0001"
}
```

有时，我们可能希望为一个请求报告多个错误。在这种情况下，我们应该返回一个列表中的错误:

```json
{
    "errors": [
        {
            "error": "auth-0001",
            "message": "Incorrect username and password",
            "detail": "Ensure that the username and password included in the request are correct",
            "help": "https://example.com/help/error/auth-0001"
        },
        ...
    ]
}
```

当出现单个错误时，我们使用包含一个元素的列表进行响应。注意，对于简单的应用程序来说，响应多个错误可能过于复杂。在许多情况下，使用第一个或最重要的错误来响应就足够了。

### 3.4. 标准响应体

虽然大多数REST api遵循类似的约定，但具体细节通常不同，包括字段的名称和响应体中包含的信息。这些差异使得库和框架很难统一地处理错误。

为了标准化REST API错误处理，IETF设计了RFC 7807，它创建了一个通用的错误处理模式。

这个方案由五部分组成:

- type — 对错误进行分类的URI标识符
- title — 一个简短的、人类可读的关于错误的消息
- status — HTTP响应码
- detail — 错误信息
- instance — 标识错误发生的特定位置的URI

而不是使用我们的自定义错误响应体，我们可以转换响应:

```json
{
    "type": "/errors/incorrect-user-pass",
    "title": "Incorrect username or password.",
    "status": 401,
    "detail": "Authentication failed due to incorrect username or password.",
    "instance": "/login/log/abc123"
}
```

请注意，type字段对错误类型进行分类，而instance分别以类似于类和对象的方式标识错误的特定发生。

通过使用uri，客户机可以按照这些路径查找有关错误的更多信息，就像使用HATEOAS链接导航REST API一样。

## 4. 示例

上述实践在一些最流行的REST api中很常见。虽然字段或格式的具体名称可能在不同的站点之间有所不同，但一般的模式几乎是通用的。

### 4.1. Twitter
例如，让我们发送一个GET请求而不提供必需的身份验证数据:

```
curl -X GET https://api.twitter.com/1.1/statuses/update.json?include_entities=true
```

Twitter API响应一个错误，如下正文:

```json
{
    "errors": [
        {
            "code":215,
            "message":"Bad Authentication data."
        }
    ]
}
```

此响应包括一个包含单个错误的列表，以及错误代码和消息。在Twitter的例子中，没有详细的信息，并且使用一个普遍的错误——而不是更具体的401错误——来表示认证失败。

有时更通用的状态代码更容易实现，我们将在下面的Spring示例中看到这一点。它允许开发人员捕获异常组，而不区分应该返回的状态代码。但是，在可能的情况下，应该使用最特定的状态代码。

### 4.2. Facebook
与Twitter类似，Facebook的Graph REST API也在响应中包含详细信息。

例如，让我们用Facebook Graph API执行一个POST请求来验证:

```
curl -X GET https://graph.facebook.com/oauth/access_token?client_id=foo&client_secret=bar&grant_type=baz
```

我们收到以下错误:

```json
{
    "error": {
        "message": "Missing redirect_uri parameter.",
        "type": "OAuthException",
        "code": 191,
        "fbtrace_id": "AWswcVwbcqfgrSgjG80MtqJ"
    }
}
```

像Twitter一样，Facebook也使用通用错误——而不是更具体的400级错误——来表示失败。除了消息和数字代码外，Facebook还包括一个类型字段，用于对错误进行分类，以及一个作为内部支持标识符的跟踪ID (fbtrace_id)。

## 5. 结论
在本文中，我们研究了一些REST API错误处理的最佳实践，包括:
- 提供特定状态码
- 在响应主体中包括附加信息
- 以统一的方式处理异常

虽然错误处理的细节因应用程序而异，但这些通用原则几乎适用于所有REST api，并且应该尽可能遵守。

这不仅允许客户机以一致的方式处理错误，而且还简化了我们在实现REST API时创建的代码。
