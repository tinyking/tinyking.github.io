---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Logback配置文件
date: 2017-04-21 13:10:50
tags:
    - Java
    - Log
---

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
	<!-- 定义变量 -->
	<property name="LOG_HOME" value="/mnt/raid5/log/web" />
	<property name="LOG_DEBUG_HOME" value="${LOG_HOME}/debug" />
	<property name="LOG_INFO_HOME" value="${LOG_HOME}/info" />
	<property name="LOG_WARN_HOME" value="${LOG_HOME}/warn" />
	<property name="LOG_ERROR_HOME" value="${LOG_HOME}/error" />


	<!-- 控制台输出 -->
	<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
		<!-- 日志输出编码 -->
		<Encoding>UTF-8</Encoding>
		<layout class="ch.qos.logback.classic.PatternLayout">
			<!-- 格式化输出: %d表示日期, %thread表示线程名, %-5level:级别从左显示5个字符宽度, %msg:日志消息, %n换行符 -->
			<pattern>[%d{yyyy-MM-dd HH:mm:ss.SSS}] %level [%thread] %logger{36} %X{medic.eventCode} %msg %ex%n</pattern>
		</layout>
	</appender>

	<!-- DEBUG输出 -->
	<appender name="FILE_DEBUG"
		class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${LOG_DEBUG_HOME}/debug.log</file>
		<Encoding>UTF-8</Encoding>
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- 日志文件输出的文件名 -->
			<FileNamePattern>${LOG_DEBUG_HOME}/debug.%d{yyyy-MM-dd}.log</FileNamePattern>
			<MaxHistory>30</MaxHistory>
		</rollingPolicy>

		<layout class="ch.qos.logback.classic.PatternLayout">
			<!-- 格式化输出: %d表示日期, %thread表示线程名, %-5level:级别从左显示5个字符宽度, %msg:日志消息, %n换行符 -->
			<pattern>[%d{yyyy-MM-dd HH:mm:ss.SSS}] %level [%thread] %logger{36} %X{medic.eventCode} %msg %ex%n</pattern>
		</layout>

		<!--日志文件最大的大小 -->
		<triggeringPolicy
			class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
			<MaxFileSize>100MB</MaxFileSize>
		</triggeringPolicy>

		<!-- <filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>DEBUG</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter> -->
	</appender>

	<!-- INFO输出 -->
	<appender name="FILE_INFO"
		class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${LOG_INFO_HOME}/info.log</file>
		<Encoding>UTF-8</Encoding>
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- 日志文件输出的文件名 -->
			<FileNamePattern>${LOG_INFO_HOME}/info.%d{yyyy-MM-dd}.log</FileNamePattern>
			<MaxHistory>30</MaxHistory>
		</rollingPolicy>

		<layout class="ch.qos.logback.classic.PatternLayout">
			<!-- 格式化输出: %d表示日期, %thread表示线程名, %-5level:级别从左显示5个字符宽度, %msg:日志消息, %n换行符 -->
			<pattern>[%d{yyyy-MM-dd HH:mm:ss.SSS}] %level [%thread] %logger{36} %X{medic.eventCode} %msg %ex%n</pattern>
		</layout>

		<!--日志文件最大的大小 -->
		<triggeringPolicy
			class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
			<MaxFileSize>100MB</MaxFileSize>
		</triggeringPolicy>

		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>INFO</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>
	</appender>

	<!-- WARN输出 -->
	<appender name="FILE_WARN"
		class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${LOG_WARN_HOME}/warn.log</file>
		<Encoding>UTF-8</Encoding>
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- 日志文件输出的文件名 -->
			<FileNamePattern>${LOG_WARN_HOME}/warn.%d{yyyy-MM-dd}.log</FileNamePattern>
			<MaxHistory>30</MaxHistory>
		</rollingPolicy>

		<layout class="ch.qos.logback.classic.PatternLayout">
			<!-- 格式化输出: %d表示日期, %thread表示线程名, %-5level:级别从左显示5个字符宽度, %msg:日志消息, %n换行符 -->
			<pattern>[%d{yyyy-MM-dd HH:mm:ss.SSS}] %level [%thread] %logger{36} %X{medic.eventCode} %msg %ex%n</pattern>
		</layout>

		<!--日志文件最大的大小 -->
		<triggeringPolicy
			class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
			<MaxFileSize>100MB</MaxFileSize>
		</triggeringPolicy>

		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>WARN</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>
	</appender>

	<!-- ERROR输出 -->
	<appender name="FILE_ERROR"
		class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${LOG_ERROR_HOME}/error.log</file>
		<Encoding>UTF-8</Encoding>
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- 日志文件输出的文件名 -->
			<FileNamePattern>${LOG_ERROR_HOME}/error.%d{yyyy-MM-dd}.log</FileNamePattern>
			<MaxHistory>30</MaxHistory>
		</rollingPolicy>

		<layout class="ch.qos.logback.classic.PatternLayout">
			<!-- 格式化输出: %d表示日期, %thread表示线程名, %-5level:级别从左显示5个字符宽度, %msg:日志消息, %n换行符 -->
			<pattern>[%d{yyyy-MM-dd HH:mm:ss.SSS}] %level [%thread] %logger{36} %X{medic.eventCode} %msg %ex%n</pattern>
		</layout>

		<!--日志文件最大的大小 -->
		<triggeringPolicy
			class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
			<MaxFileSize>100MB</MaxFileSize>
		</triggeringPolicy>

		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>ERROR</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>
	</appender>


	<root level="DEBUG">
		<appender-ref ref="STDOUT" />
		<appender-ref ref="FILE_DEBUG" />
		<appender-ref ref="FILE_INFO" />
		<appender-ref ref="FILE_WARN" />
		<appender-ref ref="FILE_ERROR" />
	</root>

</configuration>
```
