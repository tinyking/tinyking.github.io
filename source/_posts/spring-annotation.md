---
title: Spring常用Annotation详解
date: 2018-01-26 09:16:06
tags:
    - Spring
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---


# Annotation介绍

---


# Spring项目开发常用Annotation

## Java
### @Resource
Resource 注释标记应用程序所需的资源。此注释可以应用于应用程序组件类，或者该组件类的字段或方法。如果将该注释应用于一个字段或方法，那么初始化应用程序组件时容器将把所请求资源的一个实例注入其中。如果将该注释应用于组件类，则该注释将声明一个应用程序在运行时将查找的资源。

即使此注释没有被标记为Inherited，部署工具仍然需要检查任意组件类的所有超类，以发现这些超类中所有使用此注释的地方。所有此类注释实例都指定了应用程序组件所需的资源。注意，此注释可能出现在超类的 private 字段和方法上；在这种情况下容器也需要执行注入操作。

在Spring中使用该注解，表示按name注入。


## Spring
### @Required
此注解用于JavaBean的setter方法上，表示此属性是必须的，必须在配置阶段注入，否则会抛出`BeanInitializationException`。

### @Autowired
此注解用于构造方法、字段、setter方法和注解类型。显示声明依赖，根据type来autowiring, 默认注入是必须的。

```java
@Target({ElementType.CONSTRUCTOR, ElementType.FIELD, ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {

	/**
	 * Declares whether the annotated dependency is required.
	 * <p>Defaults to {@code true}.
	 */
	boolean required() default true;

}
```

在构造方法上使用此注解时，需要注意的是，一个类只允许有一个构造方法使用此注解。==此外，在Spring4.3后，如果一个类仅仅只有一个构造方法，那么即使不使用此注解，spring也会自动注入相关的bean。==

```
@Componentpublic class User {
    private Address address;
    public User(Address address) {
        this.address=address;     
    }

}

<bean id="user" class="xx.User"/>
```


### @Qualifier
此注解是和`@Autowired`一起使用的。使用此注解可以让你对注入的过程有更多的控制，用@Qulifier指定要绑定的bean的名称。当一个type有多个bean时，使用@Autowired的时候需要配合上@Qulifier才能正常。


```
@Componentpublic class User {
    @Autowired    
    @Qualifier("address1")    
    private Address address;    

    ...

}
```


### @Configuration
此注解一般和@Configuration注解一起使用，指定Spring扫描注解的package。如果没有指定包，那么默认会扫描此配置类所在的package。

```
@Configuartion
public class SpringCoreConfig {
    @Bean    
    public AdminUser adminUser() {
        AdminUser adminUser = new AdminUser();
        return adminUser;    

    }

}
```

### @Lazy
此注解使用在Spring的组件类上。默认的，Spring中Bean的依赖一开始就被创建和配置。如果想要延迟初始化一个bean，那么可以在此类上使用Lazy注解，表示此bean只有在第一次被使用的时候才会被创建和初始化。此注解也可以使用在被@Configuration注解的类上，表示其中所有被@Bean注解的方法都会延迟初始化。

### @Value
此注解使用在字段、构造器参数和方法参数上。@Value可以指定属性取值的表达式，支持通过#{}使用SpringEL来取值，也支持使用${}来将属性来源中(Properties文件呢、本地环境变量、系统属性等)的值注入到bean的属性中。此注解的注入时发生在AutowiredAnnotationBeanPostProcessor中。

## Stereotype注解
### @Component
此注解使用在class上来声明一个Spring组件(Bean), 将其加入到应用上下文中。
### @Controller
此注解使用在class上声明此类是一个Spring controller，是@Component注解的一种具体形式。
### @Service
此注解使用在class上，声明此类是一个服务类，执行业务逻辑、计算、调用内部api等。是@Component注解的一种具体形式。
### @Repository
此类使用在class上声明此类用于访问数据库，一般作为DAO的角色。
此注解有自动翻译的特性，例如：当此种component抛出了一个异常，那么会有一个handler来处理此异常，无需使用try-catch块。

## Spring Boot注解
### @EnableAutoConfiguration
此注解通常被用在主应用class上，告诉`Spring Boot` 自动基于当前包添加Bean、对bean的属性进行设置等。
### @SpringBootApplication
此注解用在Spring Boot项目的应用主类上（此类需要在base package中）。使用了此注解的类首先会让Spring Boot启动对base package下以及其sub-pacakages的类进行component scan。

此注解同时添加了以下几个注解：
- @Configuration
- @EnableAutoConfiguration
- @ComponentScan


## Spring MVC和REST注解
### @Controller
上述已经提到过此注解。
### @RequestMapping

此注解可以用在class和method上，用来映射web请求到某一个handler类或者handler方法上。当此注解用在Class上时，就创造了一个基础url，其所有的方法上的@RequestMapping都是在此url之上的。

可以使用其method属性来限制请求匹配的http method。

此外，Spring4.3之后引入了一系列@RequestMapping的变种。如下：c
- @GetMapping
- @PostMapping
- @PutMapping
- @PatchMapping
- @DeleteMapping

分别对应了相应method的RequestMapping配置。

### @CrossOrigin
此注解用在class和method上用来支持跨域请求，是Spring 4.2后引入的。

```
CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/users")
public class AccountController {    
    @CrossOrigin(origins = "http://xx.com")
    @RequestMapping("/login")
    public Result userLogin() {
        // ...    

    }

}
```
### @ExceptionHandler
此注解使用在方法级别，声明对Exception的处理逻辑。可以指定目标Exception。
### @InitBinder
此注解使用在方法上，声明对WebDataBinder的初始化(绑定请求参数到JavaBean上的DataBinder)。在controller上使用此注解可以自定义请求参数的绑定。
### @MatrixVariable
此注解使用在请求handler方法的参数上，Spring可以注入matrix url中相关的值。这里的矩阵变量可以出现在url中的任何地方，变量之间用;分隔。如下：


```
// GET /pets/42;q=11;r=22@RequestMapping(value = "/pets/{petId}")public void findPet(@PathVariable String petId, @MatrixVariable int q) {    // petId == 42    // q == 11}
```
需要注意的是默认Spring mvc是不支持矩阵变量的，需要开启。

```xml
<mvc:annotation-driven enable-matrix-variables="true" />
```

注解配置则需要如下开启：

```
@Configurationpublic class WebConfig extends WebMvcConfigurerAdapter {     @Override    public void configurePathMatch(PathMatchConfigurer configurer) {        UrlPathHelper urlPathHelper = new UrlPathHelper();        urlPathHelper.setRemoveSemicolonContent(false);        configurer.setUrlPathHelper(urlPathHelper);    }}
```
### @PathVariable
此注解使用在请求handler方法的参数上。@RequestMapping可以定义动态路径，如:


```
RequestMapping("/users/{uid}")
public String execute(@PathVariable("uid") String uid){
}
```

### @RequestAttribute
此注解用在请求handler方法的参数上，用于将web请求中的属性(requst attributes，是服务器放入的属性值)绑定到方法参数上。
### @RequestBody
此注解用在请求handler方法的参数上，用于将http请求的Body映射绑定到此参数上。HttpMessageConverter负责将对象转换为http请求。
### @RequestHeader
此注解用在请求handler方法的参数上，用于将http请求头部的值绑定到参数上。
### @RequestParam
此注解用在请求handler方法的参数上，用于将http请求参数的值绑定到参数上。
### @RequestPart
此注解用在请求handler方法的参数上，用于将文件之类的multipart绑定到参数上。
### @ResponseBody
此注解用在请求handler方法上。和@RequestBody作用类似，用于将方法的返回对象直接输出到http响应中。
### @ResponseStatus
此注解用于方法和exception类上，声明此方法或者异常类返回的http状态码。可以在Controller上使用此注解，这样所有的@RequestMapping都会继承。
### @ControllerAdvice
此注解用于class上。前面说过可以对每一个controller声明一个ExceptionMethod。这里可以使用@ControllerAdvice来声明一个类来统一对所有@RequestMapping方法来做@ExceptionHandler, @InitBinder, and @ModelAttribute处理。
### @RestController
此注解用于class上，声明此controller返回的不是一个视图而是一个领域对象。其同时引入了@Controller and @ResponseBody两个注解。
### @RestControllerAdvice
此注解用于class上，同时引入了@ControllerAdvice and @ResponseBody两个注解。
### @SessionAttribute
此注解用于方法的参数上，用于将session中的属性绑定到参数。
### @SessionAttributes
此注解用于type级别，用于将JavaBean对象存储到session中。一般和@ModelAttribute注解一起使用。如下：

```
@ModelAttribute("user")
public PUser getUser() {}

// controller和上面的代码在同一controller中
@Controller
@SessionAttributes(value = "user", types = {
    User.class
})
public class UserController {}
```


## 数据访问注解
### @Transactional
此注解使用在接口定义、接口中的方法、类定义或者类中的public方法上。需要注意的是此注解并不激活事务行为，它仅仅是一个元数据，会被一些运行时基础设施来消费。
## 任务执行、调度注解
### @Scheduled
此注解使用在方法上，声明此方法被定时调度。使用了此注解的方法返回类型需要是Void，并且不能接受任何参数。

```
@Scheduled(fixedDelay=1000)
public void schedule() {}

@Scheduled(fixedRate=1000)
public void schedulg() {
}
```

第二个与第一个不同之处在于其不会等待上一次的任务执行结束。
### @Async
此注解使用在方法上，声明此方法会在一个单独的线程中执行。不同于Scheduled注解，此注解可以接受参数。
使用此注解的方法的返回类型可以是Void也可是返回值。但是返回值的类型必须是一个Future。
## 测试注解
### @ContextConfiguration
此注解使用在Class上，声明测试使用的配置文件，此外，也可以指定加载上下文的类。

此注解一般需要搭配SpringJUnit4ClassRunner使用。

```
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringCoreConfig.class)
public class UserServiceTest {}
```
