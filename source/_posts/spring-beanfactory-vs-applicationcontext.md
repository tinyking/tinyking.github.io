---
title: BeanFactory和ApplicationContext的区别
date: 2020-08-13 18:27:00
tags:
    - Spring
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 1. 概述

Spring框架附带了两个IOC容器—BeanFactory和ApplicationContext。BeanFactory是IOC容器的最基本版本，ApplicationContext扩展了BeanFactory的特性。

在这个快速教程中，我们将通过实际示例了解这两种IOC容器之间的显著差异。

## 2. 延迟加载与即时加载

BeanFactory按需加载bean，而ApplicationContext在启动时加载所有bean。因此，与ApplicationContext相比，BeanFactory是轻量级的。让我们用一个例子来理解它。

### 2.1. 使用BeanFactory延迟加载
让我们假设我们有一个名为Student的单例bean类，它只有一个方法:

```java
public class Student {
    public static boolean isBeanInstantiated = false;

    public void postConstruct() {
        setBeanInstantiated(true);
    }

    //standard setters and getters
}
```

我们将在我们的BeanFactory配置文件中定义postConstruct()方法作为init-method, ioc-container-difference-example.xml

```xml
<bean id="student" class="com.baeldung.ioccontainer.bean.Student" init-method="postConstruct"/>
```

现在，让我们编写一个创建BeanFactory的测试用例来检查它是否加载了Student bean:

```java
@Test
public void whenBFInitialized_thenStudentNotInitialized() {
    Resource res = new ClassPathResource("ioc-container-difference-example.xml");
    BeanFactory factory = new XmlBeanFactory(res);

    assertFalse(Student.isBeanInstantiated());
}
```

这里，Student对象没有初始化。换句话说，只有BeanFactory被初始化。只有当我们显式地调用getBean()方法时，BeanFactory中定义的bean才会被加载。

让我们检查一下我们手动调用getBean()方法的学生bean的初始化:

```java
@Test
public void whenBFInitialized_thenStudentInitialized() {
    Resource res = new ClassPathResource("ioc-container-difference-example.xml");
    BeanFactory factory = new XmlBeanFactory(res);
    Student student = (Student) factory.getBean("student");

    assertTrue(Student.isBeanInstantiated());
}
```

在这里，Student bean成功加载。因此，BeanFactory只在需要时加载bean。

### 2.2. 使用ApplicationContext进行即时加载

现在，让我们在BeanFactory的位置使用ApplicationContext。

我们将只定义ApplicationContext，它将使用快速加载策略立即加载所有bean:
```java
@Test
public void whenAppContInitialized_thenStudentInitialized() {
    ApplicationContext context = new ClassPathXmlApplicationContext("ioc-container-difference-example.xml");

    assertTrue(Student.isBeanInstantiated());
}
```

在这里，即使我们没有调用getBean()方法，也会创建Student对象。

ApplicationContext被认为是一个重IOC容器，因为它的快速加载策略在启动时加载所有bean。相比之下，BeanFactory是轻量级的，在内存受限的系统中非常方便。尽管如此，我们将在下一节中看到为什么ApplicationContext在大多数用例中是首选。

## 3.企业应用程序功能

ApplicationContext以更加面向框架的风格增强了BeanFactory，并提供了几个适合企业应用程序的特性。

例如，它提供消息传递(i18n或国际化)功能、事件发布功能、基于注释的依赖注入，以及与Spring AOP特性的轻松集成。

除此之外，ApplicationContext几乎支持所有类型的bean作用域，但是BeanFactory只支持两种作用域—单例和原型。因此，在构建复杂的企业应用程序时，最好使用ApplicationContext。

## 4. 自动注册BeanFactoryPostProcessor和BeanPostProcessor
ApplicationContext在启动时自动注册BeanFactoryPostProcessor和BeanPostProcessor。另一方面，BeanFactory不会自动注册这些接口。

### 4.1. 注册BeanFactory

为了便于理解，我们来写两个类。

首先，我们有CustomBeanFactoryPostProcessor类，它实现了BeanFactoryPostProcessor:

```java
public class CustomBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    private static boolean isBeanFactoryPostProcessorRegistered = false;

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory){
        setBeanFactoryPostProcessorRegistered(true);
    }

    // standard setters and getters
}
```

在这里，我们覆盖了postProcessBeanFactory()方法以检查其注册。

其次，我们有另一个类CustomBeanPostProcessor，它实现了BeanPostProcessor:
```java
public class CustomBeanPostProcessor implements BeanPostProcessor {
    private static boolean isBeanPostProcessorRegistered = false;

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName){
        setBeanPostProcessorRegistered(true);
        return bean;
    }

    //standard setters and getters
}
```

在这里，我们覆盖了postprocessbeforeinitialize()方法来检查其注册。

同时，我们已经在我们的ioc-container-difference-example.xml配置文件中配置了两个类:

```xml
<bean id="customBeanPostProcessor"
  class="com.baeldung.ioccontainer.bean.CustomBeanPostProcessor" />
<bean id="customBeanFactoryPostProcessor"
  class="com.baeldung.ioccontainer.bean.CustomBeanFactoryPostProcessor" />
```

让我们看一个测试用例来检查这两个类在启动时是否被自动注册:

```java
@Test
public void whenBFInitialized_thenBFPProcessorAndBPProcessorNotRegAutomatically() {
    Resource res = new ClassPathResource("ioc-container-difference-example.xml");
    ConfigurableListableBeanFactory factory = new XmlBeanFactory(res);

    assertFalse(CustomBeanFactoryPostProcessor.isBeanFactoryPostProcessorRegistered());
    assertFalse(CustomBeanPostProcessor.isBeanPostProcessorRegistered());
}
```

从我们的测试中可以看出，自动注册并没有发生。

现在，让我们来看一个在BeanFactory中手动添加它们的测试用例:

```java
@Test
public void whenBFPostProcessorAndBPProcessorRegisteredManually_thenReturnTrue() {
    Resource res = new ClassPathResource("ioc-container-difference-example.xml");
    ConfigurableListableBeanFactory factory = new XmlBeanFactory(res);

    CustomBeanFactoryPostProcessor beanFactoryPostProcessor
      = new CustomBeanFactoryPostProcessor();
    beanFactoryPostProcessor.postProcessBeanFactory(factory);
    assertTrue(CustomBeanFactoryPostProcessor.isBeanFactoryPostProcessorRegistered());

    CustomBeanPostProcessor beanPostProcessor = new CustomBeanPostProcessor();
    factory.addBeanPostProcessor(beanPostProcessor);
    Student student = (Student) factory.getBean("student");
    assertTrue(CustomBeanPostProcessor.isBeanPostProcessorRegistered());
}
```
在这里，我们使用postProcessBeanFactory()方法注册CustomBeanFactoryPostProcessor，使用addBeanPostProcessor()方法注册CustomBeanPostProcessor。在本例中，它们都成功注册。

### 4.2. 注册ApplicationContext
如前所述，ApplicationContext自动注册这两个类而不需要编写额外的代码。

让我们在单元测试中验证这个行为:

```java
@Test
public void whenAppContInitialized_thenBFPostProcessorAndBPostProcessorRegisteredAutomatically() {
    ApplicationContext context
      = new ClassPathXmlApplicationContext("ioc-container-difference-example.xml");

    assertTrue(CustomBeanFactoryPostProcessor.isBeanFactoryPostProcessorRegistered());
    assertTrue(CustomBeanPostProcessor.isBeanPostProcessorRegistered());
}
```

我们可以看到，在这个例子中，两个类的自动注册都是成功的。

因此，使用ApplicationContext总是明智的，因为Spring 2.0(及以上版本)大量使用BeanPostProcessor。

还值得注意的是，如果您使用的是普通的BeanFactory，那么事务和AOP等特性将不会生效(至少在不编写额外代码的情况下不会)。这可能会导致混淆，因为配置看起来没有任何问题。

## 5. 结论
在本文中，我们通过实际示例看到了ApplicationContext和BeanFactory之间的关键区别。

ApplicationContext提供了高级特性，包括几个面向企业应用程序的特性，而BeanFactory只提供基本特性。因此，通常建议使用ApplicationContext，并且只有在内存消耗非常严重的情况下才应该使用BeanFactory。
