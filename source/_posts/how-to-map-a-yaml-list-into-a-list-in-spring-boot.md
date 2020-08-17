---
title: 如何将YAML中的列表映射到Java List
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
在这个简短的教程中，我们将进一步了解如何在Spring Boot中将YAML列表映射到列表中。

我们首先介绍一些如何在YAML中定义列表的背景知识。然后，我们将深入研究如何将YAML列表绑定到对象列表。

## 2. 快速回顾一下YAML中的列表
简而言之，YAML是一种人类可读的数据序列化标准，它提供了一种简洁而清晰的方式来编写配置文件。YAML的优点是它支持多种数据类型，如列表、映射和标量类型。

YAML列表中的元素使用“-”字符定义，它们共享相同的缩进级别:

```yml
yamlconfig:
  list:
    - item1
    - item2
    - item3
    - item4

```

与properties对比:

```
yamlconfig.list[0]=item1
yamlconfig.list[1]=item2
yamlconfig.list[2]=item3
yamlconfig.list[3]=item4
```

事实上，与属性文件相比，YAML的层次性显著增强了可读性。YAML的另一个有趣的特性是可以为不同的Spring配置文件定义不同的属性。

值得一提的是，Spring引导为YAML配置提供了开箱即用的支持。按照设计，Spring引导从应用程序加载配置属性。yml启动，没有任何额外的工作。

## 3.将一个YAML列表绑定到一个简单的对象列表

Spring Boot提供了@ConfigurationProperties注释来简化将外部配置数据映射到对象模型的逻辑。

在本节中，我们将使用@ConfigurationProperties将一个YAML列表绑定到list <Object>中。

我们首先在application.yml中定义一个简单的列表:

```yml
application:
  profiles:
    - dev
    - test
    - prod
    - 1
    - 2
```

然后，我们将创建一个简单的ApplicationProps POJO来保存将YAML列表绑定到对象列表的逻辑:

```java
@Component
@ConfigurationProperties(prefix = "application")
public class ApplicationProps {

    private List<Object> profiles;

    // getter and setter

}
```

ApplicationProps类需要用@ConfigurationProperties进行装饰，以表达将所有带有指定前缀的YAML属性映射到ApplicationProps对象的意图。

要绑定profiles列表，我们只需要定义一个list类型的字段，其余的由@ConfigurationProperties注释处理。

注意，我们使用@Component将ApplicationProps类注册为一个普通的Spring bean。因此，我们可以以与任何其他Spring bean相同的方式将其注入到其他类中。

最后，我们将ApplicationProps bean注入到一个测试类中，并验证我们的概要文件YAML列表是否被正确注入为list <Object>:

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(initializers = ConfigFileApplicationContextInitializer.class)
@EnableConfigurationProperties(value = ApplicationProps.class)
class YamlSimpleListUnitTest {

    @Autowired
    private ApplicationProps applicationProps;

    @Test
    public void whenYamlList_thenLoadSimpleList() {
        assertThat(applicationProps.getProfiles().get(0)).isEqualTo("dev");
        assertThat(applicationProps.getProfiles().get(4).getClass()).isEqualTo(Integer.class);
        assertThat(applicationProps.getProfiles().size()).isEqualTo(5);
    }
}
```

## 4. 将YAML列表绑定到复杂列表

现在，让我们进一步了解如何将嵌套的YAML列表注入到复杂的结构化列表中。

首先，让我们添加一些嵌套列表到application.yml:

```yml
application:
  // ...
  props:
    -
      name: YamlList
      url: http://yamllist.dev
      description: Mapping list in Yaml to list of objects in Spring Boot
    -
      ip: 10.10.10.10
      port: 8091
    -
      email: support@yamllist.dev
      contact: http://yamllist.dev/contact
  users:
    -
      username: admin
      password: admin@10@
      roles:
        - READ
        - WRITE
        - VIEW
        - DELETE
    -
      username: guest
      password: guest@01
      roles:
        - VIEW
```

在这个例子中，我们将道具属性绑定到一个 List<Map<String, Object>>.。类似地，我们将把用户映射到User对象列表中。

但是，在用户的情况下，所有的项共享相同的键，所以为了简化它的映射，我们可能需要创建一个专用的用户类，将键封装为字段:

```java
public class ApplicationProps {

    // ...

    private List<Map<String, Object>> props;
    private List<User> users;

    // getters and setters

    public static class User {

        private String username;
        private String password;
        private List<String> roles;

        // getters and setters

    }
}
```

现在我们验证嵌套的YAML列表被正确映射:

```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(initializers = ConfigFileApplicationContextInitializer.class)
@EnableConfigurationProperties(value = ApplicationProps.class)
class YamlComplexListsUnitTest {

    @Autowired
    private ApplicationProps applicationProps;

    @Test
    public void whenYamlNestedLists_thenLoadComplexLists() {
        assertThat(applicationProps.getUsers().get(0).getPassword()).isEqualTo("admin@10@");
        assertThat(applicationProps.getProps().get(0).get("name")).isEqualTo("YamlList");
        assertThat(applicationProps.getProps().get(1).get("port").getClass()).isEqualTo(Integer.class);
    }

}
```

## 5. 结论
在本教程中，我们学习了如何将YAML列表映射到Java列表。我们还检查了如何将复杂列表绑定到定制pojo。
