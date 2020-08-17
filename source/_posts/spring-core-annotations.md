---
title: Spring核心注解
date: 2020-08-06 09:27:00
tags:
    - Spring
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---
<a name="sGDYO"></a>

## 1. 概述
我们可以通过使用 ` org.springframework.beans.factory.annotation` 包和 `org.springframework.context.annotation` 包中的注解，来使用依赖注入功能。

<a name="gn773"></a>
## 2. DI注解
<a name="yJW7E"></a>
### 2.1 @Autowired
我们可以使用 `@Autowired` 来标记一个依赖项，这个依赖项是Spring要解决和注入的。我们可以将此注释与构造函数、setter或字段注入一起使用。

**构造函数注入**
```java
class Car {
    Engine engine;

    @Autowired
    Car(Engine engine) {
        this.engine = engine;
    }
}
```
**Setter注入**
```java
class Car {
    Engine engine;

    @Autowired
    void setEngine(Engine engine) {
        this.engine = engine;
    }
}

```
**字段注入**
```java
class Car {
    @Autowired
    Engine engine;
}
```
`@Autowired` 有一个布尔参数叫做 `required` ，默认值为 `true` 。当它找不到合适的bean进行连接时，它会对Spring的行为进行调优。当为真时，抛出异常，否则不连接任何内容。<br />注意，如果我们使用构造函数注入，所有构造函数参数都是强制的。<br />从4.3版本开始，我们不需要显式地用 `@Autowired` 注解构造函数，除非我们声明至少两个构造函数。

<a name="xtgAs"></a>
### 2.2. @Bean
`@Bean` 标记了一个工厂方法，它实例化一个Spring bean:
```java
@Bean
Engine engine() {
    return new Engine();
}
```
当需要返回类型的新实例时，Spring调用这些方法。

结果bean的名称与工厂方法相同。如果我们想要命名它不同，我们可以这样做的名称或该注释的值参数(参数值是参数名称的别名):
```java
@Bean("engine")
Engine getEngine() {
    return new Engine();
}
```
注意，所有用@Bean注释的方法都必须位于@Configuration类中。

<a name="wJm0r"></a>
### 2.3. @Qualifier
我们使用@Qualifier和@Autowired来提供我们想在不明确的情况下使用的bean id或bean名称。

例如，下面两个bean实现了相同的接口:
```java
class Bike implements Vehicle {}

class Car implements Vehicle {}
```
如果Spring需要注入一个Vehicle bean，它最终会得到多个匹配的定义。在这种情况下，我们可以使用@Qualifier注释显式地提供bean的名称。

使用构造函数注入:
```java
@Autowired
Biker(@Qualifier("bike") Vehicle vehicle) {
    this.vehicle = vehicle;
}
```
使用setter注入:
```java
@Autowired
void setVehicle(@Qualifier("bike") Vehicle vehicle) {
    this.vehicle = vehicle;
}
```
或者
```java
@Autowired
@Qualifier("bike")
void setVehicle(Vehicle vehicle) {
    this.vehicle = vehicle;
}
```
使用字段注入
```java
@Autowired
@Qualifier("bike")
Vehicle vehicle;
```
<a name="oEYFg"></a>
### 2.4. @Required
@Required在setter方法上标记我们想要通过XML填充的依赖:
```java
@Required
void setColor(String color) {
    this.color = color;
}
```
```xml
<bean class="com.baeldung.annotations.Bike">
    <property name="color" value="green" />
</bean>
```
否则，将抛出BeanInitializationException。

<a name="waEUd"></a>
###  2.5. @Value
我们可以使用@Value将属性值注入bean。它兼容构造函数、setter和字段注入。

- 构造函数注入
```java
Engine(@Value("8") int cylinderCount) {
    this.cylinderCount = cylinderCount;
}
```
setter方法注入
```java
@Autowired
void setCylinderCount(@Value("8") int cylinderCount) {
    this.cylinderCount = cylinderCount;
}
```
或者
```java
@Value("8")
void setCylinderCount(int cylinderCount) {
    this.cylinderCount = cylinderCount;
}
```

- 字段注入
```java
@Value("8")
int cylinderCount;
```
当然，注入静态值是没有用的。因此，我们可以在@Value中使用占位符字符串来连接在外部源(例如.properties或.yaml文件)中定义的值。

让我们假设下面的.properties文件:
```java
engine.fuelType=petrol
```
我们可以注入引擎的价值。燃料类型与以下:
```java
@Value("${engine.fuelType}")
String fuelType;
```
我们甚至可以在SpEL中使用@Value。

<a name="PCSdw"></a>
### 2.6. @DependsOn
我们可以使用这个注释使Spring在被注释的bean之前初始化其他bean。通常，该行为是自动的，基于bean之间显式的依赖关系。

我们只在依赖项是隐式的时候才需要这个注释，例如，JDBC驱动程序加载或静态变量初始化。

我们可以在依赖类上使用@DependsOn来指定依赖bean的名称。注释的value参数需要一个包含依赖项bean名称的数组:
```java
@DependsOn("engine")
class Car implements Vehicle {}

```
另外，如果我们用@Bean注释定义一个bean，那么工厂方法应该用@DependsOn注释:
```java
@Bean
@DependsOn("fuel")
Engine engine() {
    return new Engine();
}
```
<a name="6M8m3"></a>
### 2.7. @Lazy
当我们想惰性地初始化我们的bean时，我们使用@Lazy。默认情况下，Spring会在应用程序上下文启动/引导时急切地创建所有单例bean。<br />但是，在某些情况下，我们需要在请求bean时创建它，而不是在应用程序启动时。

这个注释的行为取决于我们将其精确放置的位置。我们可以把它放在:

- 一个带@Bean注释的bean工厂方法，以延迟方法调用(因此创建了bean)
- 一个@Configuration类和所有包含的@Bean方法都会受到影响
- 一个@Component类(不是@Configuration类)将延迟初始化这个bean
- 一个@Autowired构造函数、setter或字段，用来惰性地加载依赖项本身(通过代理)



该注释有一个名为value的参数，默认值为true。重写默认行为是有用的。

例如，当全局设置是延迟的时候，将bean标记为急切加载，或者在一个@Configuration类中配置特定的@Bean方法来急切加载，这个@Configuration类标记为@Lazy:
```java
@Configuration
@Lazy
class VehicleFactoryConfig {

    @Bean
    @Lazy(false)
    Engine engine() {
        return new Engine();
    }
}
```
<a name="DGYVW"></a>
### 2.8. @Lookup
带有@Lookup注释的方法告诉Spring在我们调用该方法时返回该方法的返回类型的实例。

<a name="PNBUo"></a>
### 2.9. @Primary
有时我们需要定义相同类型的多个bean。在这些情况下，注入将不会成功，因为Spring不知道我们需要哪个bean。<br />我们已经看到了处理这个场景的一个选项:用@Qualifier标记所有连接点，并指定所需bean的名称。<br />然而，大多数时候我们需要一个特定的bean，很少需要其他bean。我们可以使用@Primary来简化这种情况:如果我们用@Primary标记最常用的bean，它将在不合格的注入点上被选择:
```java
@Component
@Primary
class Car implements Vehicle {}

@Component
class Bike implements Vehicle {}

@Component
class Driver {
    @Autowired
    Vehicle vehicle;
}

@Component
class Biker {
    @Autowired
    @Qualifier("bike")
    Vehicle vehicle;
}
```
在前面的示例中，Car是主要的车辆。因此，在Driver类中，Spring注入一个Car bean。当然，在Biker bean中，字段vehicle的值将是一个Bike对象，因为它是限定的。
<a name="voYNt"></a>
### 2.10. @Scope
我们使用@Scope来定义@Component类或@Bean定义的范围。它可以是单例、原型、请求、会话、全局会话或一些自定义范围。<br />例如:
```java
@Component
@Scope("prototype")
class Engine {}
```
<a name="cAupG"></a>
## 3. 上下文配置的注释
我们可以使用本节中描述的注释配置应用程序上下文。

<a name="GKi4n"></a>
### 3.1. @Profile
如果我们希望Spring仅在某个特定的配置文件处于活动状态时才使用@Component类或@Bean方法，我们可以用@Profile标记它。我们可以用注释的值参数来配置配置文件的名称:
```java
@Component
@Profile("sportDay")
class Bike implements Vehicle {}

```


<a name="pTKns"></a>
### 3.2. @Import
我们可以使用特定的@Configuration类，而无需对该注释进行组件扫描。我们可以为这些类提供@Import的value参数:
```java
@Import(VehiclePartSupplier.class)
class VehicleFactoryConfig {}

```
<a name="1CF5h"></a>
### 3.3. @ImportResource
我们可以使用这个注释导入XML配置。我们可以用locations参数指定XML文件的位置，或者用它的别名value参数:
```java
@Configuration
@ImportResource("classpath:/annotations.xml")
class VehicleFactoryConfig {}
```
<a name="4nf37"></a>
### 3.4. @PropertySource
通过这个注释，我们可以为应用程序设置定义属性文件:
```java
@Configuration
@PropertySource("classpath:/annotations.properties")
class VehicleFactoryConfig {}
```
@PropertySource利用了Java 8的重复注释功能，这意味着我们可以用它多次标记一个类:
```java
@Configuration
@PropertySource("classpath:/annotations.properties")
@PropertySource("classpath:/vehicle-factory.properties")
class VehicleFactoryConfig {}
```


<a name="OHAyR"></a>
### 3.5. @PropertySources
我们可以使用这个注释来指定多个@PropertySource配置:
```java
@Configuration
@PropertySources({
    @PropertySource("classpath:/annotations.properties"),
    @PropertySource("classpath:/vehicle-factory.properties")
})
class VehicleFactoryConfig {}
```
注意，自从Java 8以来，我们可以通过上面描述的重复注释功能实现相同的功能。

<a name="ZiR8M"></a>
## 4. 结论
在本文中，我们概述了最常见的Spring core注释。我们了解了如何配置bean连接和应用程序上下文，以及如何标记用于组件扫描的类。
