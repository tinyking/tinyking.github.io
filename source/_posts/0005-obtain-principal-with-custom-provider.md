---
title: Security自定义Provider如何获取更多用户信息
date: 2018-10-30 10:24:30
tags:
    - Java
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

在使用Spring Security集成Oauth2.0做Auth server时，使用自定义的UserDetailsService实现时，在Controller层通过自动注入，可以获取详细的用户信息。

<!--more-->

```java
@GetMapping("/user")
public Principal user(Principal user) {
  return user;
}
```

但是，使用自定义的Provider去做账户校验时，获取的Principal就只含有用户名信息。

分析原码发现

```java
// org.springframework.security.oauth2.provider.token.DefaultUserAuthenticationConverter
public Authentication extractAuthentication(Map<String, ?> map) {
  if (map.containsKey(USERNAME)) {
    Object principal = map.get(USERNAME);
    Collection<? extends GrantedAuthority> authorities = getAuthorities(map);
    if (userDetailsService != null) {
      UserDetails user = userDetailsService.loadUserByUsername((String) map.get(USERNAME));
      authorities = user.getAuthorities();
      principal = user;
    }
    return new UsernamePasswordAuthenticationToken(principal, "N/A", authorities);
  }
  return null;
}
```
通过jwt方式进行认证的会执行`DefaultUserAuthenticationConverter`代码，其中的userDetailsService是null，所以返回的principal就只有用户名。

可以通过在创建`DefaultUserAuthenticationConverter`时，给他set上userDetailsService，这样就获取更多的信息了。

如下：

```java
@Bean
public JwtAccessTokenConverter jwtAccessTokenConverter() {
    JwtAccessTokenConverter jwtAccessTokenConverter = new JwtAccessTokenConverter();
    jwtAccessTokenConverter.setSigningKey("demo");
    final AccessTokenConverter accessTokenConverter = jwtAccessTokenConverter.getAccessTokenConverter();
    if (accessTokenConverter instanceof DefaultAccessTokenConverter) {
        ((DefaultAccessTokenConverter) accessTokenConverter).setUserTokenConverter(userAuthenticationConverter());
    }
    return jwtAccessTokenConverter;
}

@Bean
public UserAuthenticationConverter userAuthenticationConverter() {
    DefaultUserAuthenticationConverter defaultUserAuthenticationConverter = new DefaultUserAuthenticationConverter();
    defaultUserAuthenticationConverter.setUserDetailsService(userDetailsService);
    return defaultUserAuthenticationConverter;
}
```
