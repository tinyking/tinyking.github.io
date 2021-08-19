---
title: 当ThreadLocal碰上线程池
date: 2019-08-02 18:05:32
tags:
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---
ThreadLocal可以让线程拥有本地变量，在web环境中，为了方便代码解耦，我们通常用它来保存上下文信息，然后用一个util类提供访问入口，从controller层到service层可以很方便的获取上下文。下面我们通过代码来研究一下ThreadLocal。

新建一个ThreadContext类，用于保存线程上下文信息

```java
public class ThreadContext {
    private static ThreadLocal<UserObj> userResource = new ThreadLocal<UserObj>();

    public static UserObj getUser() {
        return userResource.get();
    }

    public static void bindUser(UserObj user) {
        userResource.set(user);
    }

    public static UserObj unbindUser() {
        UserObj obj = userResource.get();
        userResource.remove();
        return obj;
    }
}
```

新建一个sessionFilter ，用来操作线程变量

```java
@Override
public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    HttpServletRequest request = (HttpServletRequest) servletRequest;
    try {
        // 假设这里是从cookie拿token信息, 调用服务/或者从缓存查询用户信息
        // 为了避免后续逻辑中多次查询/请求缓存服务器, 这里拿到user后放到线程本地变量中
        UserObj user = ThreadContext.getUser();
        // 如果当前线程中没有绑定user对象,那么绑定一个新的user
        if (user == null) {
            ThreadContext.bindUser(new UserObj("usertest"));
        }

        filterChain.doFilter(servletRequest, servletResponse);
    } finally {
        // ThreadLocal的生命周期不等于一次request请求的生命周期
        // 每个request请求的响应是tomcat从线程池中分配的线程, 线程会被下个请求复用.
        // 所以请求结束后必须删除线程本地变量
        // ThreadContext.unbindUser();
    }
}
```

新建UserUtils工具类

```java
/**
 * 配合SessionFilter使用,从上下文中取user信息
 */
public class UserUtils {
    public static UserObj getCurrentUser() {
        return ThreadContext.getUser();
    }
}
```

新建一个servlet测试

```java
public class HelloworldServlet extends HttpServlet {

    private static Logger logger = LoggerFactory.getLogger(HelloworldServlet.class);
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        UserObj user = UserUtils.getCurrentUser();
        logger.info(user.getName() + user.hashCode());
        super.doGet(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }
}

```

循环请求servlet，控制台显示结果如下。可以发现tomcat线程池的初始大小是10个，后面的请求复用了前面的线程，ThreadContext中的user对象的hashcode也一样。

```java
2016-11-29 17:21:35.975  INFO 36672 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest818202673
2016-11-29 17:21:38.923  INFO 36672 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1582591702
2016-11-29 17:21:45.810  INFO 36672 --- [nio-8080-exec-4] com.zallds.xy.servlet.HelloworldServlet  : usertest55755037
2016-11-29 17:21:46.773  INFO 36672 --- [nio-8080-exec-5] com.zallds.xy.servlet.HelloworldServlet  : usertest1495466807
2016-11-29 17:21:47.345  INFO 36672 --- [nio-8080-exec-6] com.zallds.xy.servlet.HelloworldServlet  : usertest1149360245
2016-11-29 17:21:47.613  INFO 36672 --- [nio-8080-exec-7] com.zallds.xy.servlet.HelloworldServlet  : usertest518375339
2016-11-29 17:21:47.837  INFO 36672 --- [nio-8080-exec-8] com.zallds.xy.servlet.HelloworldServlet  : usertest92458992
2016-11-29 17:21:48.012  INFO 36672 --- [nio-8080-exec-9] com.zallds.xy.servlet.HelloworldServlet  : usertest944867034
2016-11-29 17:21:48.199  INFO 36672 --- [io-8080-exec-10] com.zallds.xy.servlet.HelloworldServlet  : usertest1410972809
2016-11-29 17:21:48.378  INFO 36672 --- [nio-8080-exec-1] com.zallds.xy.servlet.HelloworldServlet  : usertest805332046
2016-11-29 17:21:48.552  INFO 36672 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest818202673
2016-11-29 17:21:48.730  INFO 36672 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1582591702
2016-11-29 17:21:48.903  INFO 36672 --- [nio-8080-exec-4] com.zallds.xy.servlet.HelloworldServlet  : usertest55755037
2016-11-29 17:21:49.072  INFO 36672 --- [nio-8080-exec-5] com.zallds.xy.servlet.HelloworldServlet  : usertest1495466807
2016-11-29 17:21:49.247  INFO 36672 --- [nio-8080-exec-6] com.zallds.xy.servlet.HelloworldServlet  : usertest1149360245
2016-11-29 17:21:49.402  INFO 36672 --- [nio-8080-exec-7] com.zallds.xy.servlet.HelloworldServlet  : usertest518375339
```

去掉注释// ThreadContext.unbindUser(); 重新请求，每次从ThreadLocal中拿到的user对象完全不一样了。

```java
2016-11-29 17:30:37.150  INFO 36903 --- [nio-8080-exec-1] com.zallds.xy.servlet.HelloworldServlet  : usertest413138571
2016-11-29 17:30:42.932  INFO 36903 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest1402191945
2016-11-29 17:30:43.124  INFO 36903 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1957579173
2016-11-29 17:30:43.313  INFO 36903 --- [nio-8080-exec-4] com.zallds.xy.servlet.HelloworldServlet  : usertest1582591702
2016-11-29 17:30:43.501  INFO 36903 --- [nio-8080-exec-5] com.zallds.xy.servlet.HelloworldServlet  : usertest1917479582
2016-11-29 17:30:43.679  INFO 36903 --- [nio-8080-exec-6] com.zallds.xy.servlet.HelloworldServlet  : usertest772036767
2016-11-29 17:30:43.851  INFO 36903 --- [nio-8080-exec-7] com.zallds.xy.servlet.HelloworldServlet  : usertest162020761
2016-11-29 17:30:44.024  INFO 36903 --- [nio-8080-exec-8] com.zallds.xy.servlet.HelloworldServlet  : usertest682232950
2016-11-29 17:30:44.225  INFO 36903 --- [nio-8080-exec-9] com.zallds.xy.servlet.HelloworldServlet  : usertest2140650341
2016-11-29 17:30:44.419  INFO 36903 --- [io-8080-exec-10] com.zallds.xy.servlet.HelloworldServlet  : usertest1327601763
2016-11-29 17:30:44.593  INFO 36903 --- [nio-8080-exec-1] com.zallds.xy.servlet.HelloworldServlet  : usertest647738411
2016-11-29 17:30:44.787  INFO 36903 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest944867034
2016-11-29 17:30:45.045  INFO 36903 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1886154520
2016-11-29 17:30:45.317  INFO 36903 --- [nio-8080-exec-4] com.zallds.xy.servlet.HelloworldServlet  : usertest1592904273
2016-11-29 17:30:46.380  INFO 36903 --- [nio-8080-exec-5] com.zallds.xy.servlet.HelloworldServlet  : usertest1410972809
2016-11-29 17:30:46.524  INFO 36903 --- [nio-8080-exec-6] com.zallds.xy.servlet.HelloworldServlet  : usertest1705570689
2016-11-29 17:30:46.692  INFO 36903 --- [nio-8080-exec-7] com.zallds.xy.servlet.HelloworldServlet  : usertest1105134375
2016-11-29 17:30:46.802  INFO 36903 --- [nio-8080-exec-8] com.zallds.xy.servlet.HelloworldServlet  : usertest407377722
```

<a name="PAmaK"></a>
## ThreadLocal子线程场景
需求新增， 需要在原有的业务逻辑中增加一个给用户发送邮件的操作。发送邮件我们采用异步处理，新建一个线程来执行。

```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    UserObj user = UserUtils.getCurrentUser();
    logger.info(user.getName() + user.hashCode());

    SendEmailTask emailThread = new SendEmailTask();
    new Thread(emailThread).start();

    super.doGet(req, resp);
}

class SendEmailTask implements Runnable {

    @Override
    public void run() {
        UserObj user = UserUtils.getCurrentUser();
        logger.info("子线程中:" + (user == null ? "user为null" : user.getName() + user.hashCode()));
    }
}
```

主线程中创建异步线程，子线程中能拿到吗？通过测试发现是不能的

```java
2016-11-29 18:09:16.482  INFO 38092 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest1425505918
2016-11-29 18:09:16.483  INFO 38092 --- [       Thread-4] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:user为null
2016-11-29 18:09:20.995  INFO 38092 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1280373552
2016-11-29 18:09:20.996  INFO 38092 --- [       Thread-5] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:user为null
```

子线程怎么拿到父线程的ThreadLocal数据？jdk给我们提供了解决办法，ThreadLocal有一个子类InheritableThreadLocal，创建ThreadLocal时候我们采用InheritableThreadLocal类可以实现子线程获取到父线程的本地变量。

```java
private static ThreadLocal<UserObj> userResource = new InheritableThreadLocal<UserObj>();
```

然后子线程中就可以正常拿到user对象了

```java
2016-11-29 19:07:01.518  INFO 39644 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest495550128
2016-11-29 19:07:01.518  INFO 39644 --- [       Thread-4] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest495550128
2016-11-29 19:07:05.839  INFO 39644 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1851717404
2016-11-29 19:07:05.840  INFO 39644 --- [       Thread-5] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest1851717404
```

<a name="I3PZJ"></a>
## ThreadLocal 子线程传递－线程池场景
当我们执行异步任务时，大多会采用线程池的机制(如Executor)。这样就会存在一个问题，即使父线程已经结束，子线程依然存在并被池化。这样，线程池中的线程在下一次请求被执行的时候，ThreadLocal的get()方法返回的将不是当前线程中设定的变量，因为池中的“子线程”根本不是当前线程创建的，当前线程设定的ThreadLocal变量也就无法传递给线程池中的线程。<br />我们修改一下发送邮件的代码，改用线程池来实现。

```java
2016-11-29 19:51:51.973  INFO 40937 --- [nio-8080-exec-1] com.zallds.xy.servlet.HelloworldServlet  : usertest1417641261
2016-11-29 19:51:51.974  INFO 40937 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest1417641261
2016-11-29 19:51:55.746  INFO 40937 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest1116537955
2016-11-29 19:51:55.746  INFO 40937 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest1417641261
2016-11-29 19:51:58.825  INFO 40937 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1489938856
2016-11-29 19:51:58.826  INFO 40937 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest1417641261
```

可以发现发送邮件的任务三次用的都是同一个线程[pool-1-thread-1]，第一次子线程和父线程中的user对象相同，后面的“子线程”（前面提到过，后面的已经不是子线程了）中的user对象都是和第一个父线程中的相同。<br />那么在线程池的场景下，怎么能让“子线程”正常拿到父线程传递过来的变量呢？如果我们能在创建task的时候主动传递过去就好了。按照这个想法我们来实施一下。<br />继续修改代码

```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    UserObj user = UserUtils.getCurrentUser();
    logger.info(user.getName() + user.hashCode());

    SendEmailTask emailThread = new SendEmailTask();

    executor.execute(new UserRunnable(emailThread, user));
    super.doGet(req, resp);
}

/**
 * 做一个wrapper, 将目标任务做一层包装, 在run方法中传递线程本地变量
 */
class UserRunnable implements Runnable {
    /**
     * 目标任务对象
     */
    Runnable runnable;
    /**
     * 要绑定的user对象
     */
    UserObj user;

    public UserRunnable(Runnable runnable, UserObj user) {
        this.runnable = runnable;
        this.user = user;
    }

    @Override
    public void run() {
        ThreadContext.bindUser(user);
        runnable.run();
        ThreadContext.unbindUser();
    }
}

class SendEmailTask implements Runnable {

    @Override
    public void run() {
        UserObj user = UserUtils.getCurrentUser();
        logger.info("子线程中:" + (user == null ? "user为null" : user.getName() + user.hashCode()));
    }
}
```

重新请求，得到我们想要的结果

```java
2016-11-29 20:04:12.153  INFO 41258 --- [nio-8080-exec-1] com.zallds.xy.servlet.HelloworldServlet  : usertest1565180744
2016-11-29 20:04:12.154  INFO 41258 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest1565180744
2016-11-29 20:04:14.142  INFO 41258 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest481396704
2016-11-29 20:04:14.142  INFO 41258 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest481396704
2016-11-29 20:04:15.248  INFO 41258 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest400717395
2016-11-29 20:04:15.249  INFO 41258 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest400717395
```

到此为止，ThreadLocal常见的场景和对应解决方案应该可以满足了。接下来就是怎么在实际应用中运用了。

为了引出此文的初衷以及后面要讲的东西，针对最后一个解决方案，我们可以进一步完善一下。

```java
ThreadContext.bindUser(user);
runnable.run();
ThreadContext.unbindUser();
```

这个地方在bind的时候是直接覆盖，无法对线程之前的状态进行保存和恢复。要实现这一点，我们可以抽象一个ThreadState来保存线程的状态，在bind之前保存original，任务执行完以后进行restore。

```java
public interface ThreadState {
    void bind();

    void restore();

    void clear();
}

public class UserThreadState implements ThreadState {
    private UserObj original;

    private UserObj user;

    public UserThreadState(UserObj user) {
        this.user = user;
    }

    @Override
    public void bind() {
        this.original = ThreadContext.getUser();

        ThreadContext.bindUser(this.user);
    }

    @Override
    public void restore() {
        ThreadContext.bindUser(this.original);
    }

    @Override
    public void clear() {
        ThreadContext.unbindUser();
    }
}


protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    UserObj user = UserUtils.getCurrentUser();
    logger.info(user.getName() + user.hashCode());

    SendEmailTask emailThread = new SendEmailTask();

    executor.execute(new UserRunnable(emailThread, new UserThreadState(user)));
    super.doGet(req, resp);
}

/**
 * 做一个wrapper, 将目标任务做一层包装, 在run方法中传递线程本地变量
 */
class UserRunnable implements Runnable {
    /**
     * 目标任务对象
     */
    Runnable runnable;
    /**
     * 要绑定的user对象
     */
    UserThreadState userThreadState;

    public UserRunnable(Runnable runnable, UserThreadState userThreadState) {
        this.runnable = runnable;
        this.userThreadState = userThreadState;
    }

    @Override
    public void run() {
        userThreadState.bind();
        runnable.run();
        userThreadState.restore();
        UserObj userOrig = UserUtils.getCurrentUser();
        logger.info("original:" + userOrig.getName() + userOrig.hashCode());
    }
}

class SendEmailTask implements Runnable {

    @Override
    public void run() {
        UserObj user = UserUtils.getCurrentUser();
        logger.info("子线程中:" + (user == null ? "user为null" : user.getName() + user.hashCode()));
    }
}
```

实现效果是相同的，至于为什么三次的original对象都是一样的，通过前面的说明应该能够理解

```java
2016-11-29 20:19:48.694  INFO 41671 --- [nio-8080-exec-1] com.zallds.xy.servlet.HelloworldServlet  : usertest114760676
2016-11-29 20:19:48.699  INFO 41671 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest114760676
2016-11-29 20:19:48.700  INFO 41671 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : original:usertest114760676
2016-11-29 20:19:57.123  INFO 41671 --- [nio-8080-exec-2] com.zallds.xy.servlet.HelloworldServlet  : usertest941302199
2016-11-29 20:19:57.123  INFO 41671 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest941302199
2016-11-29 20:19:57.123  INFO 41671 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : original:usertest114760676
2016-11-29 20:20:04.385  INFO 41671 --- [nio-8080-exec-3] com.zallds.xy.servlet.HelloworldServlet  : usertest1489938856
2016-11-29 20:20:04.385  INFO 41671 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : 子线程中:usertest1489938856
2016-11-29 20:20:04.385  INFO 41671 --- [pool-1-thread-1] com.zallds.xy.servlet.HelloworldServlet  : original:usertest114760676
```

由于在使用shiro框架的SecurityUtils.getSubject()过程中碰到问题，才有了本文的示例，例子中的部分代码参考了shiro框架的实现机制。后面会再研究一下shiro的subject相关设计。

[http://shiro.apache.org/subject.html](http://shiro.apache.org/subject.html)


> 作者： 99793933e682
> 原文地址： [https://www.jianshu.com/p/85d96fe9358b](https://www.jianshu.com/p/85d96fe9358b)


---

![微信图片_20190719095938.jpg](https://cdn.nlark.com/yuque/0/2019/jpeg/269363/1564727847078-00283633-d15e-4603-833c-be0c4c7ad83b.jpeg#align=left&display=inline&height=450&name=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190719095938.jpg&originHeight=450&originWidth=900&size=36931&status=done&width=900)
